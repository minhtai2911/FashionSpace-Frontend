import { useEffect } from "react";
import ProductItem from "./ProductItem";
import Swiper from "swiper/bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Slider({ products }) {
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

  return (
    <div className="swiper">
      <div className="swiper-wrapper px-9 py-10">
        {products.map((product) => (
          <div className="swiper-slide" key={product.id}>
            <ProductItem
              name={product.name}
              rating={product.rating}
              category={product.category}
              image={product.image}
              price={product.price}
              id={product.id}
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
