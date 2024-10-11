import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import ProductItem from "../components/ProductItem";
import CheckBox from "../components/CheckBox";
import FilterItem from "../components/FilterItem";
import Pagination from "../components/Pagination";
import { PRODUCTS_PER_PAGE } from "../utils/Constants";

const products = [
  {
    id: 1,
    name: "Classy Leather Jacket",
    category: "Jacket",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 2,
    name: "Basic Necktie",
    category: "Accessories",
    price: "70.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 3,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 4,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 5,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 6,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 7,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 8,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 9,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 10,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 11,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 12,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 13,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 14,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 15,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
  {
    id: 16,
    name: "Mini Skirt",
    category: "Skirt",
    price: "75.00",
    rating: 4.8,
    image: "https://picsum.photos/200",
  },
];

const categories = [
  "Men",
  "Women",
  "Handbags",
  "T-Shirts",
  "Coats",
  "Watches",
  "Hats",
  "Shoes",
  "Bags",
];

function Shop() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const priceGap = 100;

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (maxPrice - value >= priceGap) {
      setMinPrice(value);
    } else {
      setMinPrice(maxPrice - priceGap);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (value - minPrice >= priceGap) {
      setMaxPrice(value);
    } else {
      setMaxPrice(minPrice + priceGap);
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
      const minPercentage = (minPrice / 1000) * 100;
      const maxPercentage = (maxPrice / 1000) * 100;

      progress.style.left = minPercentage + "%";
      progress.style.right = 100 - maxPercentage + "%";
    };

    updateProgress();
  }, [minPrice, maxPrice]);

  const currentProducts = products.slice(
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
                <span>${minPrice}</span>
                <div className="ml-1 mr-1">-</div>
                <span>${maxPrice}</span>
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
                value={minPrice}
                onChange={handleMinPriceChange}
              />
              <input
                type="range"
                id="range-max"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-20 gap-y-10 w-full">
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center">
              <div>
                Showing <span id="start-result"></span>-
                <span id="end-result"></span> of{" "}
                <span id="total-results"></span> results
              </div>
              <div>
                Sort by:
                <select
                  name=""
                  id="sorting"
                  className="border-[#0A0A0A] border-[1px] p-2 ml-2"
                >
                  <option value="price">Price</option>
                  <option value="name">Name</option>
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
            {currentProducts.map((product) => (
              <ProductItem
                key={product.id}
                name={product.name}
                rating={product.rating}
                category={product.category}
                image={product.image}
                price={product.price}
                id={product.id}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(products.length / PRODUCTS_PER_PAGE)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Shop;
