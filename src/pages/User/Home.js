import { useEffect, useState } from "react";
import FeatureBanner from "../../components/FeatureBanner";
import BannerClothes from "../../assets/images/banner_clothes.jpg";
import ProductItem from "../../components/ProductItem";
import Slider from "../../components/Slider";
import {
  getBestSellerProducts,
  getNewArrivalProducts,
} from "../../data/products";

function Home() {
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    const fetchNewArrivalProducts = async () => {
      const products = await getNewArrivalProducts();
      setNewArrivalProducts(products);
    };
    const fetchBestSellerProducts = async () => {
      const products = await getBestSellerProducts();
      setBestSellerProducts(products);
    };
    fetchNewArrivalProducts();
    fetchBestSellerProducts();
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
          <svg
            width="140"
            height="140"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-2"
          >
            <path d="M50 0L93.3013 75H6.69873L50 0Z" fill="white" />
            <path
              d="M50 100L6.78568 75L6.69872 25L50 -2.38419e-06L93.3013 25L93.2143 75L50 100Z"
              fill="white"
            />
            <path
              d="M50 96.4285L10.0803 73.3928L10 27.3213L50 4.28561L90 27.3213L89.9196 73.3928L50 96.4285Z"
              fill="#0A0A0A"
            />
            <path
              d="M50 92.8572L12.9317 71.4286L12.8571 28.5715L49.9999 7.14289L87.1428 28.5715L87.0682 71.4286L50 92.8572Z"
              fill="white"
            />
            <path
              d="M25.3785 65V61.7773L28.7057 61.1496V38.4026L25.3785 37.7748V34.5312H49.0671V42.4414H44.9655L44.6307 38.6119H33.9792V47.9032H44.8399V51.9838H33.9792V61.1496L37.3065 61.7773V65H25.3785ZM63.6109 65.4395C61.5322 65.4395 59.6 65.1814 57.8143 64.6652C56.0286 64.149 54.2917 63.291 52.6036 62.0912V55.0809H56.6843L57.3539 59.6219C58.0933 60.1521 59.0001 60.5776 60.0743 60.8984C61.1625 61.2193 62.3413 61.3797 63.6109 61.3797C64.8525 61.3797 65.8918 61.2054 66.7289 60.8566C67.5799 60.4939 68.2286 59.9916 68.675 59.3499C69.1215 58.7081 69.3447 57.9478 69.3447 57.0689C69.3447 56.2598 69.1494 55.5413 68.7588 54.9135C68.3681 54.2857 67.7194 53.7277 66.8126 53.2394C65.9058 52.7372 64.6781 52.2768 63.1296 51.8583C60.8556 51.2444 58.9513 50.519 57.4167 49.6819C55.896 48.8449 54.7451 47.8404 53.9638 46.6685C53.1965 45.4967 52.8129 44.1155 52.8129 42.5251C52.8129 40.8929 53.2523 39.4489 54.1312 38.1934C55.0241 36.9378 56.2588 35.9473 57.8352 35.2218C59.4117 34.4964 61.2322 34.1267 63.297 34.1127C65.557 34.0848 67.552 34.3778 69.2819 34.9916C71.0258 35.6055 72.4976 36.4076 73.6974 37.3982V43.9481H69.7004L68.9471 39.6791C68.3751 39.2746 67.6287 38.9328 66.708 38.6537C65.8012 38.3608 64.7269 38.2143 63.4853 38.2143C62.425 38.2143 61.4903 38.3887 60.6812 38.7374C59.872 39.0862 59.2373 39.5815 58.7769 40.2232C58.3165 40.851 58.0863 41.6044 58.0863 42.4833C58.0863 43.2506 58.2886 43.9202 58.6932 44.4922C59.0978 45.0642 59.7744 45.5873 60.723 46.0617C61.6717 46.522 62.9552 46.9894 64.5735 47.4637C67.8798 48.3426 70.384 49.5564 72.086 51.1049C73.7881 52.6535 74.6391 54.6275 74.6391 57.0271C74.6391 58.7151 74.1787 60.1939 73.2579 61.4634C72.3511 62.719 71.0676 63.6956 69.4075 64.3931C67.7613 65.0907 65.8291 65.4395 63.6109 65.4395Z"
              fill="#0A0A0A"
            />
          </svg>
          <h1 className="text-4xl font-bold text-white mb-5">Fashion Space</h1>
          <h1 className="text-2xl font-bold text-white">
            Dress To Express - Your Style, Your Statement
          </h1>
          <p className="text-lg mt-2 text-white">
            The intersection where classic style meets modern flair
          </p>
        </div>
      </div>
      <div className="px-40">
        <FeatureBanner />
        <div className="mx-auto py-10">
          <div className="flex text-center justify-center items-center pb-2">
            <h1 className="font-medium px-24 text-3xl">New Arrival</h1>
          </div>
          <Slider products={newArrivalProducts} usage={"new-arrival"} />
        </div>
        <div className="mx-auto py-10">
          <div className="flex text-center justify-center items-center pb-2">
            <h1 className="font-medium px-24 text-3xl">Our Best Seller</h1>
          </div>
          <Slider products={bestSellerProducts} usage={"best-seller"} />
        </div>
        <div className="mt-10"></div>
      </div>
    </div>
  );
}

export default Home;
