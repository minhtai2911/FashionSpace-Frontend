import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import { getAllProducts } from "../data/products";
import { formatToVND, formatURL } from "../utils/format";
import { getUserById } from "../data/users";
import { getCategoryById } from "../data/categories";

import useSpeechToText from "react-hook-speech-to-text";

function Header() {
  const { auth, logout, user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const carts = useSelector((store) => store.cart.items);
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isSpeechPopupOpen, setIsSpeechPopupOpen] = useState(false);
  const [speechTimeout, setSpeechTimeout] = useState(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    timeout: 3000,
    speechRecognitionProperties: {
      lang: "vi-VN",
      interimResults: true,
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProducts(1, 1000); // Get first 1000 products for search
        // Handle both old format (direct array) and new format (object with data property)
        const fetchedProducts = result.data || result;

        if (Array.isArray(fetchedProducts)) {
          const updatedProducts = await Promise.all(
            fetchedProducts.map(async (product) => {
              const images = product.images;
              const category = product.categoryId;
              return {
                ...product,
                imagePath: images[0].url,
                category: category.name,
              };
            })
          );
          setProducts(updatedProducts);
        } else {
          console.error("Invalid products data:", fetchedProducts);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products for search:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userData = await getUserById(user.id);
        setUserData(userData);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    let total = 0;
    carts.forEach((cart) => (total += cart.quantity));
    setTotalQuantity(total);
  }, [carts]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeSearchModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeSearchModal();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchModalOpen]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (results.length > 0) {
      // Use the most recent result
      const lastResult = results[results.length - 1];
      setSearchQuery(lastResult.transcript);
    }
  }, [results]);

  const handleSpeech = () => {
    setIsSpeechPopupOpen(true);
    setSearchQuery("");
    stopSpeechToText();
    startSpeechToText();
  };

  useEffect(() => {
    if (isRecording) {
      const handleStopSpeaking = () => {
        setIsSpeechPopupOpen(false);
        stopSpeechToText();
      };

      if (speechTimeout) {
        clearTimeout(speechTimeout);
      }

      const timeout = setTimeout(() => {
        handleStopSpeaking();
      }, 2000);

      setSpeechTimeout(timeout);

      window.addEventListener("speechend", handleStopSpeaking);
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("speechend", handleStopSpeaking);
      };
    }
  }, [isRecording, results]);

  return (
    <>
      <header className="bg-white px-40 py-4 shadow-md min-w-full z-[50]">
        <div className="mx-auto flex justify-between items-center">
          <div className="brand flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 outline-none">
              <svg
                width="40"
                height="40"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M50 0L93.3013 75H6.69873L50 0Z" fill="#0A0A0A" />
                <path
                  d="M50 100L6.78568 75L6.69872 25L50 -2.38419e-06L93.3013 25L93.2143 75L50 100Z"
                  fill="#0A0A0A"
                />
                <path
                  d="M50 96.4285L10.0803 73.3928L10 27.3213L50 4.28561L90 27.3213L89.9196 73.3928L50 96.4285Z"
                  fill="white"
                />
                <path
                  d="M50 92.8572L12.9317 71.4286L12.8571 28.5715L49.9999 7.14289L87.1428 28.5715L87.0682 71.4286L50 92.8572Z"
                  fill="#0A0A0A"
                />
                <path
                  d="M25.3785 65V61.7773L28.7057 61.1496V38.4026L25.3785 37.7748V34.5312H49.0671V42.4414H44.9655L44.6307 38.6119H33.9792V47.9032H44.8399V51.9838H33.9792V61.1496L37.3065 61.7773V65H25.3785ZM63.6109 65.4395C61.5322 65.4395 59.6 65.1814 57.8143 64.6652C56.0286 64.149 54.2917 63.291 52.6036 62.0912V55.0809H56.6843L57.3539 59.6219C58.0933 60.1521 59.0001 60.5776 60.0743 60.8984C61.1625 61.2193 62.3413 61.3797 63.6109 61.3797C64.8525 61.3797 65.8918 61.2054 66.7289 60.8566C67.5799 60.4939 68.2286 59.9916 68.675 59.3499C69.1215 58.7081 69.3447 57.9478 69.3447 57.0689C69.3447 56.2598 69.1494 55.5413 68.7588 54.9135C68.3681 54.2857 67.7194 53.7277 66.8126 53.2394C65.9058 52.7372 64.6781 52.2768 63.1296 51.8583C60.8556 51.2444 58.9513 50.519 57.4167 49.6819C55.896 48.8449 54.7451 47.8404 53.9638 46.6685C53.1965 45.4967 52.8129 44.1155 52.8129 42.5251C52.8129 40.8929 53.2523 39.4489 54.1312 38.1934C55.0241 36.9378 56.2588 35.9473 57.8352 35.2218C59.4117 34.4964 61.2322 34.1267 63.297 34.1127C65.557 34.0848 67.552 34.3778 69.2819 34.9916C71.0258 35.6055 72.4976 36.4076 73.6974 37.3982V43.9481H69.7004L68.9471 39.6791C68.3751 39.2746 67.6287 38.9328 66.708 38.6537C65.8012 38.3608 64.7269 38.2143 63.4853 38.2143C62.425 38.2143 61.4903 38.3887 60.6812 38.7374C59.872 39.0862 59.2373 39.5815 58.7769 40.2232C58.3165 40.851 58.0863 41.6044 58.0863 42.4833C58.0863 43.2506 58.2886 43.9202 58.6932 44.4922C59.0978 45.0642 59.7744 45.5873 60.723 46.0617C61.6717 46.522 62.9552 46.9894 64.5735 47.4637C67.8798 48.3426 70.384 49.5564 72.086 51.1049C73.7881 52.6535 74.6391 54.6275 74.6391 57.0271C74.6391 58.7151 74.1787 60.1939 73.2579 61.4634C72.3511 62.719 71.0676 63.6956 69.4075 64.3931C67.7613 65.0907 65.8291 65.4395 63.6109 65.4395Z"
                  fill="white"
                />
              </svg>

              <span className="font-bold text-xl tracking-wide">
                FASHION SPACE
              </span>
            </Link>
          </div>
          <nav className="flex justify-between items-center align-middle w-[38%]">
            <Link
              to="/"
              className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
            >
              Cửa hàng
            </Link>
            <Link
              to="/aboutUs"
              className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
            >
              Giới thiệu
            </Link>
            <Link
              to="/contactUs"
              className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
            >
              Liên hệ
            </Link>
          </nav>
          <div className="flex items-center space-x-4 justify-between w-40">
            <a
              className="hover:text-gray-600 cursor-pointer"
              onClick={openSearchModal}
            >
              <svg
                class="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21.0004 20.9999L16.6504 16.6499"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <Link to="/cart" className="hover:text-gray-600 relative">
              <svg
                class="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.8337 20.9999C20.4525 20.9999 21.046 21.2458 21.4836 21.6833C21.9212 22.1209 22.167 22.7144 22.167 23.3333C22.167 23.9521 21.9212 24.5456 21.4836 24.9832C21.046 25.4208 20.4525 25.6666 19.8337 25.6666C19.2148 25.6666 18.6213 25.4208 18.1837 24.9832C17.7462 24.5456 17.5003 23.9521 17.5003 23.3333C17.5003 22.0383 18.5387 20.9999 19.8337 20.9999ZM1.16699 2.33325H4.98199L6.07866 4.66659H23.3337C23.6431 4.66659 23.9398 4.7895 24.1586 5.00829C24.3774 5.22709 24.5003 5.52383 24.5003 5.83325C24.5003 6.03159 24.442 6.22992 24.3603 6.41659L20.1837 13.9649C19.787 14.6766 19.017 15.1666 18.142 15.1666H9.45033L8.40033 17.0683L8.36533 17.2083C8.36533 17.2856 8.39605 17.3598 8.45075 17.4145C8.50545 17.4692 8.57964 17.4999 8.65699 17.4999H22.167V19.8333H8.16699C7.54815 19.8333 6.95466 19.5874 6.51708 19.1498C6.07949 18.7122 5.83366 18.1188 5.83366 17.4999C5.83366 17.0916 5.93866 16.7066 6.11366 16.3799L7.70033 13.5216L3.50033 4.66659H1.16699V2.33325ZM8.16699 20.9999C8.78583 20.9999 9.37932 21.2458 9.81691 21.6833C10.2545 22.1209 10.5003 22.7144 10.5003 23.3333C10.5003 23.9521 10.2545 24.5456 9.81691 24.9832C9.37932 25.4208 8.78583 25.6666 8.16699 25.6666C7.54815 25.6666 6.95466 25.4208 6.51708 24.9832C6.07949 24.5456 5.83366 23.9521 5.83366 23.3333C5.83366 22.0383 6.87199 20.9999 8.16699 20.9999ZM18.667 12.8333L21.9103 6.99992H7.16366L9.91699 12.8333H18.667Z"
                  fill="#0A0A0A"
                />
              </svg>
              {totalQuantity !== 0 && (
                <span className="absolute left-1/2 bottom-1/2 inline-block w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full text-center leading-5">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {auth.isAuth ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex text-sm rounded-full md:me-0 focus:ring-gray-600"
                  type="button"
                  onClick={toggleDropdown}
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={formatURL(userData?.avatarPath)}
                    alt="userData photo"
                  />
                </button>
                <div
                  className={`absolute left-4 -translate-x-1/2 mt-3 z-20 ${
                    isDropdownOpen ? "block" : "hidden"
                  } bg-white rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.3)] w-32`}
                >
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Xin chào, {userData?.fullName?.split(" ").pop()}
                  </div>
                  <hr className="mx-4" />
                  <ul className="pt-2 text-sm text-gray-700 text-gray-200">
                    <li>
                      <Link
                        to="/account"
                        className="block px-4 py-2 hover:bg-[#f3f4f6] flex flex-row gap-x-2"
                        onClick={() => {
                          toggleDropdown();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                        <span>Tài khoản</span>
                      </Link>
                    </li>
                  </ul>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        toggleDropdown();
                      }}
                      className="block w-full flex flex-row gap-x-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#f3f4f6]"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.5 24.5H5.83333C5.21449 24.5 4.621 24.2542 4.18342 23.8166C3.74583 23.379 3.5 22.7855 3.5 22.1667V5.83333C3.5 5.21449 3.74583 4.621 4.18342 4.18342C4.621 3.74583 5.21449 3.5 5.83333 3.5H10.5"
                          stroke="#dc2626"
                          stroke-width="2.33333"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M18.6667 19.8337L24.5001 14.0003L18.6667 8.16699"
                          stroke="#dc2626"
                          stroke-width="2.33333"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M24.5 14H10.5"
                          stroke="#dc2626"
                          stroke-width="2.33333"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-[#dc2626]">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login " className="hover:text-gray-600">
                <svg
                  class="nav-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>
      {isSearchModalOpen && (
        <div
          id="search-modal"
          className="h-[100vh] w-[100vw] fixed top-0 flex justify-center items-start pt-[10rem] z-[100]"
          style={{ backdropFilter: "blur(6px)" }}
        >
          <div
            ref={modalRef}
            className="w-[60%] flex items-center p-[1rem] bg-white rounded"
            style={{ boxShadow: "0 1rem 1rem rgba(0, 0, 0, .2)" }}
          >
            <div className="relative w-full flex justify-center items-center">
              <div className="flex rounded overflow-hidden w-full">
                <label htmlFor="search-input" className="flex items-center">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                      stroke="#64748b"
                      fill="none"
                      stroke-width="2"
                      fill-rule="evenodd"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </label>
                <input
                  id="search-input"
                  className="flex-1 border-none focus:ring-0 focus:outline-none ml-[.75rem] mr-[1rem]"
                  type="text"
                  value={searchQuery}
                  placeholder="Tìm kiếm sản phẩm..."
                  onChange={handleSearchChange}
                  autoComplete="off"
                />
              </div>
              <div
                className="absolute top-16 w-[80%] overflow-y-auto max-h-[300px] rounded-md bg-white"
                style={{ boxShadow: "0 1rem 1rem rgba(0, 0, 0, .2)" }}
              >
                {filteredProducts.map((product) => (
                  <div key={product._id}>
                    <Link
                      to={`/products/details/${product._id}`}
                      onClick={closeSearchModal}
                    >
                      <div className="flex items-center px-3 py-2 hover:bg-gray-100">
                        <img
                          src={formatURL(product.imagePath)}
                          alt={product.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-semibold">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatToVND(product.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {filteredProducts.length <= 0 && searchQuery != "" && (
                  <p className="p-3">Không có sản phẩm phù hợp</p>
                )}
              </div>
              <button
                className="mr-6 rounded-full disabled:cursor-not-allowed microphone-button"
                disabled={isRecording}
                onClick={handleSpeech}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`size-6 hover:fill-red-500 fill-current`}
                >
                  <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                  <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
                {isRecording && <div className="microphone-animation" />}
              </button>
              {/* {isSpeechPopupOpen && (
                <div className="whitespace-nowrap mr-4">
                  <p>Đang nghe...</p>
                </div>
              )} */}
              <button
                onClick={closeSearchModal}
                id="close-search"
                class="w-[1.75rem] h-[1.5rem] rounded-[.375rem] flex items-center border-[#f1f5f9]"
                style={{
                  backgroundPosition: "50%",
                  padding: ".25rem .375rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="7"
                  fill="none"
                >
                  <path
                    d="M.506 6h3.931V4.986H1.736v-1.39h2.488V2.583H1.736V1.196h2.69V.182H.506V6ZM8.56 1.855h1.18C9.721.818 8.87.102 7.574.102c-1.276 0-2.21.705-2.205 1.762-.003.858.602 1.35 1.585 1.585l.634.159c.633.153.986.335.988.727-.002.426-.406.716-1.03.716-.64 0-1.1-.295-1.14-.878h-1.19c.03 1.259.931 1.91 2.343 1.91 1.42 0 2.256-.68 2.259-1.745-.003-.969-.733-1.483-1.744-1.71l-.523-.125c-.506-.117-.93-.304-.92-.722 0-.375.332-.65.934-.65.588 0 .949.267.994.724ZM15.78 2.219C15.618.875 14.6.102 13.254.102c-1.537 0-2.71 1.086-2.71 2.989 0 1.898 1.153 2.989 2.71 2.989 1.492 0 2.392-.992 2.526-2.063l-1.244-.006c-.117.623-.606.98-1.262.98-.883 0-1.483-.656-1.483-1.9 0-1.21.591-1.9 1.492-1.9.673 0 1.159.389 1.253 1.028h1.244Z"
                    fill="#334155"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
