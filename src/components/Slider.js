import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Swiper from "swiper/bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { formatURL } from "../utils/format";
import instance from "../services/axiosConfig";
import { getAllImagesByProductId } from "../data/productImages";
import { getCategoryById } from "../data/categories";

function Slider({ products, usage }) {
  const [productImages, setProductImages] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    new Swiper(".swiper", {
      direction: "horizontal",
      loop: true,
      slidesPerView: 4,
      spaceBetween: -10,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const images = {};
      const categories = {};
      for (const product of products) {
        const imagesForProduct = await getAllImagesByProductId(product._id);
        images[product._id] = imagesForProduct;

        const categoryForProduct = await getCategoryById(product.categoryId);
        categories[product._id] = categoryForProduct.name;
      }
      setProductImages(images);
      setCategories(categories);
    };

    fetchData();
  }, [products]);

  return (
    <div className="swiper">
      <div className="swiper-wrapper px-9 py-10">
        {products.map((product) => (
          <div className="swiper-slide" key={product._id}>
            <ProductItem
              usage={usage}
              name={product.name}
              rating={product.rating}
              category={categories[product._id]}
              image={
                productImages[product._id]?.[0]
                  ? formatURL(productImages[product._id][0].imagePath)
                  : ""
              }
              price={product.price}
              id={product._id}
            />
          </div>
        ))}
      </div>
      <div className="swiper-pagination"></div>
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
  );
}

export default Slider;
