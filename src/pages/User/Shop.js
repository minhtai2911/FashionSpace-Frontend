import React, { useState, useEffect } from "react";

import { products } from "../../data/products";
import Banner from "../../components/Banner";
import ProductItem from "../../components/ProductItem";
import CheckBox from "../../components/CheckBox";
import FilterItem from "../../components/FilterItem";
import Pagination from "../../components/Pagination";
import { PRODUCTS_PER_PAGE } from "../../utils/Constants";
import { SORT_BY } from "../../utils/Constants";
import { categories } from "../../data/categories";

function Shop() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(SORT_BY[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const priceGap = 100;

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (maxPrice - value >= priceGap) {
      setTempMinPrice(value);
    } else {
      setTempMinPrice(maxPrice - priceGap);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (value - minPrice >= priceGap) {
      setTempMaxPrice(value);
    } else {
      setTempMaxPrice(minPrice + priceGap);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((category) => category !== categoryToRemove)
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
  };

  useEffect(() => {
    const progress = document.querySelector("#slider #progress");

    const updateProgress = () => {
      const minPercentage = (tempMinPrice / 1000) * 100;
      const maxPercentage = (tempMaxPrice / 1000) * 100;

      progress.style.left = minPercentage + "%";
      progress.style.right = 100 - maxPercentage + "%";
    };

    updateProgress();
  }, [tempMinPrice, tempMaxPrice]);

  const applyFilters = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  const filteredProducts = products.filter((product) => {
    const isInPriceRange =
      product.price >= minPrice && product.price <= maxPrice;
    const isInSelectedCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    return isInPriceRange && isInSelectedCategories;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortCriteria) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating_asc":
        return a.rating - b.rating;
      case "rating_desc":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div>
      <Banner title={"Shop"} route={"Home / Shop"} />
      <div className="flex gap-x-10 py-10 px-28">
        <div className="flex flex-col w-[200px] gap-y-4 text-[20px] font-bold">
          <div className="">Filter Options</div>
          <div className="h-[1.5px] bg-[#C9C9C9] opacity-60"></div>
          <div className="flex flex-col gap-y-3">
            <div>Category</div>
            <div className="flex flex-col gap-y-2 font-normal text-[16px] max-h-[200px] overflow-y-auto">
              {categories.map((category, index) => (
                <div
                  className="flex gap-x-2 items-center caret-transparent"
                  key={index}
                >
                  <CheckBox
                    isChecked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label className="">{category}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[1.5px] bg-[#C9C9C9] opacity-60"></div>
          <div>
            <div className="flex flex-col gap-y-3 mb-3">
              <div>Price</div>
              <div
                id="price"
                className="flex font-normal text-[#4A4A4A] text-base"
              >
                <span>${tempMinPrice}</span>
                <div className="ml-1 mr-1">-</div>
                <span>${tempMaxPrice}</span>
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
                min="0"
                max="1000"
                step="10"
                value={tempMinPrice}
                onChange={handleMinPriceChange}
              />
              <input
                type="range"
                id="range-max"
                min="0"
                max="1000"
                step="10"
                value={tempMaxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
            <button
              onClick={applyFilters}
              className="px-10 py-2 text-white font-medium text-base bg-black rounded-lg w-full mt-6"
            >
              Apply
            </button>
          </div>
        </div>
        <div className="flex flex-col ml-20 gap-y-10 w-full">
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center">
              <div>
                {filteredProducts.length > 0 ? (
                  <div>
                    Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1} -{" "}
                    {Math.min(
                      currentPage * PRODUCTS_PER_PAGE,
                      filteredProducts.length
                    )}{" "}
                    of {filteredProducts.length} results
                  </div>
                ) : (
                  <div>Showing 0 - 0 of 0 result</div>
                )}
              </div>
              <div>
                Sort by:
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
              <span className="mr-2">Active Filter:</span>
              <div className="flex gap-3 flex-wrap">
                {selectedCategories.map((category, index) => (
                  <FilterItem
                    key={index}
                    name={category}
                    onRemove={() => handleRemoveCategory(category)}
                  />
                ))}
                <FilterItem
                  key="price-range"
                  name={`Price: $${minPrice} - $${maxPrice}`}
                  onRemove={() => {
                    setMinPrice(0);
                    setMaxPrice(1000);
                  }}
                />
              </div>
              {selectedCategories.length > 0 && (
                <div
                  className="underline ml-2 cursor-pointer whitespace-nowrap"
                  onClick={clearAllFilters}
                >
                  Clear All
                </div>
              )}
            </div>
          </div>
          <div
            className="flex gap-x-5 gap-y-5 flex-wrap min-h-60"
            id="product-container"
          >
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  name={product.name}
                  rating={product.rating}
                  category={product.category}
                  image={product.image}
                  price={product.price}
                  id={product.id}
                />
              ))
            ) : (
              <div className="text-center w-full text-3xl font-bold">
                <p>No products found matching your filters.</p>
              </div>
            )}
          </div>
          {currentProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                filteredProducts.length / PRODUCTS_PER_PAGE
              )}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
