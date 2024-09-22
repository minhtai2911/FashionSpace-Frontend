import { useEffect } from "react";
import Slider from "react-slick";
import FeatureBanner from "../components/FeatureBanner";
import Header from "../components/Header";
import BannerClothes from "../assets/images/banner_clothes.jpg";
import ProductItem from "../components/ProductItem";
import Swiper from "swiper/bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
];

function Home() {
  useEffect(() => {
    new Swiper(".swiper", {
      direction: "horizontal",
      loop: true,
      slidesPerView: 4,
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
    <div>
      <div className="relative">
        <img
          src={BannerClothes}
          alt="Fashion Banner"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-white">
            Dress To Express - Your Style, Your Statement
          </h1>
          <p className="text-lg mt-2 text-white">
            The intersection where classic style meets modern flair
          </p>
        </div>
      </div>
      <FeatureBanner />
      <div className="mx-auto px-36 py-10">
        <div className="flex text-center justify-center items-center pb-2">
          <h1 className="font-medium px-24 text-3xl">New Arrival</h1>
        </div>
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
      </div>
      <div className="mx-auto px-36 py-10">
        <div className="flex text-center justify-center items-center pb-2">
          <h1 className="font-medium px-24 text-3xl">Our Best Seller</h1>
        </div>
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
      </div>
      <div className="mt-10"></div>
    </div>
  );
}

export default Home;
