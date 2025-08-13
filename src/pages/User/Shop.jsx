import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";

import { getAllProducts } from "../../data/products";
import Banner from "../../components/Banner";
import ProductItem from "../../components/ProductItem";
import CheckBox from "../../components/CheckBox";
import FilterItem from "../../components/FilterItem";
import Pagination from "../../components/Pagination";
import {
  MAX_PRICE,
  MIN_PRICE,
  PRICE_GAP,
  PRODUCTS_PER_PAGE,
} from "../../utils/Constants";
import { SORT_BY } from "../../utils/Constants";
import { getAllCategories, getCategoryById } from "../../data/categories";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatToVND, formatURL } from "../../utils/format";
import Cookies from "js-cookie";
import AuthContext from "../../context/AuthContext";
import Error from "../Error";
import SkeletonItem from "../../components/Skeleton";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [tempMinPrice, setTempMinPrice] = useState(MIN_PRICE);
  const [tempMaxPrice, setTempMaxPrice] = useState(MAX_PRICE);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(SORT_BY[0].value);
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [searchQuery, setSearchQuery] = useState(() => {
    const qParam = searchParams.get("q");
    return qParam && qParam.trim() ? decodeURIComponent(qParam).trim() : "";
  });
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [isLoadingMoreCategories, setIsLoadingMoreCategories] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const { auth, setHasError } = useContext(AuthContext);
  const permission = Cookies.get("permission") ?? null;
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newSearchParams.delete("page");
    } else {
      newSearchParams.set("page", page.toString());
    }
    setSearchParams(newSearchParams);
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (maxPrice - value >= PRICE_GAP) {
      setTempMinPrice(value);
    } else {
      setTempMinPrice(maxPrice - PRICE_GAP);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (value - minPrice >= PRICE_GAP) {
      setTempMaxPrice(value);
    } else {
      setTempMaxPrice(minPrice + PRICE_GAP);
    }
  };

  const handleCategoryChange = (category) => {
    const categoryId = `${category._id}`;
    setSelectedCategoryIds((prevCategories) => {
      if (prevCategories.includes(categoryId)) {
        return prevCategories.filter((cat) => cat !== categoryId);
      } else {
        return [...prevCategories, categoryId];
      }
    });
    setSelectedCategoryNames((prevNames) => {
      if (prevNames.includes(`${category.name} [${category.gender}]`)) {
        return prevNames.filter(
          (name) => name !== `${category.name} [${category.gender}]`
        );
      } else {
        return [...prevNames, `${category.name} [${category.gender}]`];
      }
    });
  };

  const handleRemoveCategory = (categoryIdToRemove) => {
    setSelectedCategoryIds((prevCategories) =>
      prevCategories.filter((category) => category !== categoryIdToRemove)
    );
    setSelectedCategoryNames((prevNames) =>
      prevNames.filter((name) => name !== categoryIdToRemove.replace(/_/g, " "))
    );
  };

  const resetPrice = () => {
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setTempMinPrice(MIN_PRICE);
    setTempMaxPrice(MAX_PRICE);
  };

  const clearAllFilters = () => {
    resetPrice();
    setSelectedCategoryIds([]);
    setSelectedCategoryNames([]);
    clearSearchQuery();
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("q");
    setSearchParams(newSearchParams);
  };

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
    const newSearchParams = new URLSearchParams(searchParams);
    if (query && query.trim()) {
      newSearchParams.set("q", encodeURIComponent(query.trim()));
    } else {
      newSearchParams.delete("q");
    }
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    const progress = document.querySelector("#slider #progress");

    if (!progress) {
      return;
    }

    const updateProgress = () => {
      const minPercentage = (tempMinPrice / MAX_PRICE) * 100;
      const maxPercentage = (tempMaxPrice / MAX_PRICE) * 100;

      progress.style.left = minPercentage + "%";
      progress.style.right = 100 - maxPercentage + "%";
    };

    updateProgress();
  }, [tempMinPrice, tempMaxPrice]);

  const applyFilters = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  const currentProducts = productData;

  const fetchData = async () => {
    setIsLoading(true);

    try {
      let categoryIds = undefined;
      if (selectedCategoryIds.length > 0) {
        categoryIds = selectedCategoryIds.join(",");
      }

      let sortBy = "name";
      let sortOrder = "asc";
      if (sortCriteria) {
        const [field, order] = sortCriteria.split("_");
        sortBy = field;
        sortOrder = order;
      }

      const result = await getAllProducts(
        currentPage,
        PRODUCTS_PER_PAGE,
        searchQuery || null,
        true,
        categoryIds,
        debouncedMinPrice !== MIN_PRICE ? debouncedMinPrice : undefined,
        debouncedMaxPrice !== MAX_PRICE ? debouncedMaxPrice : undefined,
        sortBy,
        sortOrder
      );

      const fetchedProducts = result.data || result;
      const fetchedMetadata = result.meta || {
        totalCount: 0,
        currentPage: 1,
        totalPages: 1,
      };

      if (!Array.isArray(fetchedProducts)) {
        console.error("Invalid products data:", fetchedProducts);
        setProductData([]);
        setMetadata({ totalCount: 0, currentPage: 1, totalPages: 1 });
        return;
      }

      const updatedProducts = await Promise.all(
        fetchedProducts.map(async (product) => {
          const images = product.images;
          let category = {};
          if (product.categoryId) {
            try {
              const categoryData = await getCategoryById(
                product.categoryId._id
              );
              category = categoryData;
            } catch (error) {
              console.error("Error fetching category:", error);
              category = { name: "Unknown", gender: "Unknown" };
            }
          }
          return {
            ...product,
            images: images || [],
            category: category.name,
            gender: category.gender,
          };
        })
      );

      setProductData(updatedProducts);
      setMetadata(fetchedMetadata);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProductData([]);
      setMetadata({ totalCount: 0, currentPage: 1, totalPages: 1 });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async (isInitial = true) => {
    try {
      const page = isInitial ? 1 : Math.floor(categoryOffset / 10) + 1;
      const categoriesResult = await getAllCategories(
        page,
        undefined,
        undefined,
        true
      );
      const fetchedCategories = categoriesResult.data || categoriesResult;

      if (Array.isArray(fetchedCategories)) {
        if (isInitial) {
          setCategories(fetchedCategories);
          setCategoryOffset(10);
        } else {
          setCategories((prevCategories) => {
            const combinedCategories = [
              ...prevCategories,
              ...fetchedCategories,
            ];
            const uniqueCategories = combinedCategories.filter(
              (category, index, self) =>
                index === self.findIndex((c) => c._id === category._id)
            );
            return uniqueCategories;
          });
          setCategoryOffset((prev) => prev + 10);
        }

        setHasMoreCategories(fetchedCategories.length === 10);
      } else {
        console.error("Invalid categories data:", fetchedCategories);
        if (isInitial) {
          setCategories([]);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (isInitial) {
        setCategories([]);
      }
    }
  };

  const loadMoreCategories = async () => {
    if (isLoadingMoreCategories || !hasMoreCategories) return;

    setIsLoadingMoreCategories(true);
    try {
      await fetchCategories(false);
    } finally {
      setIsLoadingMoreCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle URL query parameter changes
  useEffect(() => {
    const qParam = searchParams.get("q");
    const currentQuery =
      qParam && qParam.trim() ? decodeURIComponent(qParam).trim() : "";

    if (currentQuery !== searchQuery) {
      setSearchQuery(currentQuery);
    }

    // Clean up empty q parameter from URL
    if (qParam !== null && !qParam.trim()) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("q");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, searchQuery]);

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized && currentPage !== 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("page");
      setSearchParams(newSearchParams);
    }
  }, [
    selectedCategoryIds,
    debouncedMinPrice,
    debouncedMaxPrice,
    sortCriteria,
    searchQuery,
  ]);

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    selectedCategoryIds,
    debouncedMinPrice,
    debouncedMaxPrice,
    sortCriteria,
    searchQuery,
  ]);

  if (user && (!permission || !permission.includes("SHOP"))) {
    setHasError(true);
    return (
      <Error
        errorCode={403}
        title={"Forbidden"}
        content={"Bạn không có quyền truy cập trang này."}
      />
    );
  }

  return (
    <div className="mb-20">
      <Banner title={"Cửa hàng"} route={"Trang chủ / Cửa hàng"} />
      <div className="flex gap-x-10 py-10 px-28">
        <div className="flex flex-col w-[260px] gap-y-4 text-[20px] font-bold">
          <div className="">Tùy chọn lọc</div>
          <div className="h-[1.5px] bg-[#C9C9C9] opacity-60"></div>
          <div className="flex flex-col gap-y-3">
            <div>Danh mục</div>
            <div className="flex flex-col gap-y-2 font-normal text-[16px] max-h-[200px] overflow-y-auto">
              {categories.map((category, index) => (
                <div
                  className="flex gap-x-2 items-center caret-transparent"
                  key={index}
                >
                  <CheckBox
                    isChecked={selectedCategoryIds.includes(`${category._id}`)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label className="">{`${category.name} [${category.gender}]`}</label>
                </div>
              ))}
              {hasMoreCategories && (
                <div
                  onClick={loadMoreCategories}
                  disabled={isLoadingMoreCategories}
                  className="font-medium flex items-center gap-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMoreCategories ? "Đang tải..." : "Thêm"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="h-[1.5px] bg-[#C9C9C9] opacity-60"></div>
          <div>
            <div className="flex flex-col gap-y-3 mb-3">
              <div>Giá</div>
              <div
                id="price"
                className="flex font-normal text-[#4A4A4A] text-base"
              >
                <span>{formatToVND(tempMinPrice)}</span>
                <div className="ml-1 mr-1">-</div>
                <span>{formatToVND(tempMaxPrice)}</span>
              </div>
            </div>
            <div id="slider" className="relative h-[5px] bg-[#C9C9C9] rounded">
              <div
                id="progress"
                className="h-full left-0 right-0 absolute rounded bg-[#0A0A0A]"
              ></div>
            </div>
            <div id="range-input" className="relative">
              <input
                type="range"
                id="range-min"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_GAP}
                value={tempMinPrice}
                onChange={handleMinPriceChange}
              />
              <input
                type="range"
                id="range-max"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_GAP}
                value={tempMaxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
            <button
              onClick={applyFilters}
              className="px-10 py-2 text-white font-medium text-base bg-black rounded-lg w-full mt-6"
            >
              Áp dụng
            </button>
          </div>
        </div>
        <div className="flex flex-col ml-20 gap-y-10 w-full">
          {isLoading ? (
            <div className="flex flex-wrap gap-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonItem key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    {metadata.totalCount > 0 ? (
                      <div>
                        Hiển thị{" "}
                        {(metadata.currentPage - 1) * PRODUCTS_PER_PAGE + 1} -{" "}
                        {Math.min(
                          metadata.currentPage * PRODUCTS_PER_PAGE,
                          metadata.totalCount
                        )}{" "}
                        của {metadata.totalCount} kết quả
                      </div>
                    ) : (
                      <div>Hiển thị 0 - 0 của 0 kết quả</div>
                    )}
                  </div>
                  <div>
                    Sắp xếp theo:
                    <select
                      value={sortCriteria}
                      onChange={(e) => setSortCriteria(e.target.value)}
                      className="border-[#0A0A0A] border-[1px] p-2 ml-2"
                    >
                      {SORT_BY.map((criteria) => (
                        <option key={criteria.value} value={criteria.value}>
                          {criteria.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div
                  className="flex flex-wrap items-center gap-2 max-w-full"
                  id="filter-container"
                >
                  <span className="mr-2">Bộ lọc hiện tại:</span>
                  <div className="flex gap-3 flex-wrap">
                    {searchQuery && (
                      <FilterItem
                        key="search-query"
                        name={`${searchQuery}`}
                        onRemove={clearSearchQuery}
                      />
                    )}
                    {selectedCategoryNames.map((category, index) => (
                      <FilterItem
                        key={index}
                        name={category}
                        onRemove={() => handleRemoveCategory(category)}
                      />
                    ))}
                    {(minPrice !== MIN_PRICE || maxPrice !== MAX_PRICE) && (
                      <FilterItem
                        key="price-range"
                        name={`Giá: ${formatToVND(minPrice)} - ${formatToVND(
                          maxPrice
                        )}`}
                        onRemove={resetPrice}
                      />
                    )}
                  </div>
                  {(searchQuery ||
                    selectedCategoryIds.length > 0 ||
                    minPrice !== MIN_PRICE ||
                    maxPrice !== MAX_PRICE) && (
                    <div
                      className="underline ml-2 cursor-pointer whitespace-nowrap"
                      onClick={clearAllFilters}
                    >
                      Xóa tất cả
                    </div>
                  )}
                </div>
              </div>
              <div
                className="flex gap-x-5 gap-y-5 flex-wrap min-h-60"
                id="product-container"
              >
                {!isLoading ? (
                  currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <ProductItem
                        key={product._id}
                        soldQuantity={product.soldQuantity}
                        productName={product.name}
                        rating={product.rating}
                        image={
                          product.images.length > 0 ? product.images[0].url : ""
                        }
                        category={product.category}
                        price={product.price}
                        id={product._id}
                      />
                    ))
                  ) : (
                    <div className="text-center w-full">
                      {searchQuery ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-3xl font-bold">
                            <p>
                              Không tìm thấy sản phẩm cho từ khóa "{searchQuery}
                              ".
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold">
                          <p>Không có sản phẩm tương ứng với bộ lọc của bạn.</p>
                        </div>
                      )}
                    </div>
                  )
                ) : null}
              </div>
              {metadata.totalPages > 1 && (
                <div className="mt-5">
                  <Pagination
                    currentPage={metadata.currentPage}
                    totalPages={metadata.totalPages}
                    onPageChange={handlePageChange}
                    svgClassName={"w-6 h-6"}
                    textClassName={"text-xl px-4 py-2"}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
