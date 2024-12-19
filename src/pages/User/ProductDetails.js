import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import { Modal } from "flowbite-react";

import { getProductById } from "../../data/products";
import { getAllImagesByProductId } from "../../data/productImages";
import { getCategoryById } from "../../data/categories";
import { getProductVariantsByProductId } from "../../data/productVariant";
import { getColorById } from "../../data/colors";
import { getSizeById } from "../../data/sizes";
import { createShoppingCart } from "../../data/shoppingCart";
import { getAllReviews, getReviewsByProductId } from "../../data/reviews";
import { getReviewResponseByReviewId } from "../../data/reviewResponse";
import { getUserById } from "../../data/users";

import Banner from "../../components/Banner";
import Color from "../../components/Color";
import Rating from "../../components/Rating";
import SellerFeedback from "../../components/SellerFeedback";
import Size from "../../components/Size";
import Review from "../../components/Review";
import Pagination from "../../components/Pagination";
import Slider from "../../components/Slider";
import FeatureBanner from "../../components/FeatureBanner";
import {
  FREE_SHIPPING,
  REVIEWS_PER_PAGE,
  SHIPPING_RATE,
} from "../../utils/Constants";
import { addToCart } from "../../stores/cart";
import { formatToVND, formatURL } from "../../utils/format";
import toast from "react-hot-toast";

const relatedProducts = [
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

function ProductDetails() {
  const { isAuthenticated } = useContext(AuthContext);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const carts = useSelector((store) => store.cart.items);

  const [productName, setProductName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [variants, setVariants] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState();
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState();
  const [mainImage, setMainImage] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [openModal, setOpenModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchProduct = async () => {
    const product = await getProductById(id);
    setProductName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setRating(product.rating);
    const fetchedCategory = await getCategoryById(product.categoryId);
    setCategory(fetchedCategory.name);
    const fetchedImages = await getAllImagesByProductId(id);
    setMainImage(fetchedImages[0].imagePath);
    setPhotos(fetchedImages);
  };

  const fetchVariants = async () => {
    const fetchedVariants = await getProductVariantsByProductId(id);
    const variantsData = await Promise.all(
      fetchedVariants.map(async (variant) => {
        const color = await getColorById(variant.colorId);
        const size = await getSizeById(variant.sizeId);
        return { size, color, quantity: variant.quantity };
      })
    );
    setSelectedColor(variantsData[0].color._id);
    setSelectedSize(variantsData[0].size._id);
    setVariants(variantsData);
  };

  const fetchReviews = async () => {
    const fetchedReviews = await getAllReviews(
      undefined,
      undefined,
      id,
      undefined,
      undefined
    );
    const data = await Promise.all(
      fetchedReviews.map(async (review) => {
        const user = await getUserById(review.userId);
        const response = review.reviewResponses;
        let userResponse = null;
        let reviewResponse = null;
        if (response.length > 0) {
          userResponse = await getUserById(response[0].userId);
          reviewResponse = response[0];
        }
        return { ...review, user, userResponse, reviewResponse };
      })
    );
    setReviews(data);
  };

  useEffect(() => {
    fetchProduct();
    fetchVariants();
    fetchReviews();
  }, [id]);

  const uniqueColors = useMemo(() => {
    const colorSet = new Set();
    variants.forEach((variant) => {
      colorSet.add(variant.color._id);
    });
    const colorList = Array.from(colorSet).map((colorId) => {
      return variants.find((variant) => variant.color._id === colorId).color;
    });
    setColors(colorList);
  }, [variants]);

  useEffect(() => {
    if (selectedColor) {
      const filteredSizes = variants
        .filter((variant) => variant.color._id === selectedColor)
        .map((variant) => variant.size);
      setAvailableSizes(filteredSizes);
    }
  }, [selectedColor, variants]);

  useEffect(() => {
    if (productName) {
      document.title = productName;
    }
  }, [productName]);

  const handleAddToCart = async () => {
    const product = {
      productId: id,
      name: productName,
      categoryId: category,
      price: price,
      quantity: quantity,
      sizeId: selectedSize,
      colorId: selectedColor,
      image: mainImage,
    };
    dispatch(addToCart(product));
    toast.success("Thêm vào giỏ hàng thành công", { duration: 2000 });
  };

  const [currentPage, setCurrentPage] = useState(1);

  const currentReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const percentage = Math.round((rating / 5) * 100);

  const handleCheckout = () => {
    const subTotal = quantity * price;
    const shipping =
      subTotal > FREE_SHIPPING || subTotal === 0 ? 0 : subTotal * SHIPPING_RATE;
    const totalPrice = subTotal + shipping;
    const selectedCartItems = [
      {
        productId: id,
        sizeId: selectedSize,
        colorId: selectedColor,
        quantity: quantity,
      },
    ];

    const orderSummary = {
      items: selectedCartItems,
      totalItems: quantity,
      subTotal: quantity * price,
      shipping: shipping,
      totalPrice: totalPrice,
    };

    if (selectedCartItems.length > 0) {
      if (!isAuthenticated) {
        navigate("/login", { state: { orderSummary, type: "Buy Now" } });
      } else {
        navigate("/checkout", { state: { orderSummary, type: "Buy Now" } });
      }
    }
  };

  return (
    <>
      <div>
        <Banner
          title="Chi tiết sản phẩm"
          route={`Trang chủ / Cửa hàng / Chi tiết sản phẩm / ${productName}`}
        />
        <div className="px-40">
          <div className="flex flex-row mt-10 gap-x-20">
            <div className="flex flex-col gap-y-2 w-[40%]">
              <img src={formatURL(mainImage)} alt={productName} />

              <div className="flex flex-row gap-x-[6.66px] overflow-y-scroll">
                {photos.map((image, index) => (
                  <img
                    loading="lazy"
                    key={index}
                    src={formatURL(image.imagePath)}
                    alt={`Thumbnail ${index}`}
                    onClick={() => {
                      setMainImage(image.imagePath);
                      setSelectedImageIndex(index);
                    }}
                    className={`cursor-pointer border-2 w-28 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 gap-y-4 flex flex-col">
              <p>{category}</p>
              <div className="flex flex-col gap-y-1">
                <p className="font-semibold text-2xl">{productName}</p>
                <div className="flex flex-row items-center">
                  <Rating percentage={percentage} />
                  <p className="ml-2 text-lg">
                    {rating ? rating.toFixed(1) : "Chưa có đánh giá"}
                  </p>
                </div>
                <p className="font-semibold text-xl">{formatToVND(price)}</p>
              </div>
              <p>{description}</p>

              <div>
                <p className="font-medium text-xl mb-1">Màu sắc:</p>
                <div className="flex flex-row gap-x-2">
                  {colors.map((color) => (
                    <Color
                      key={color._id}
                      color={color.color}
                      isSelected={selectedColor === color._id}
                      onClick={() => setSelectedColor(color._id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-xl mb-1">Kích cỡ:</p>
                <div className="flex flex-row gap-x-2">
                  {availableSizes.map((size) => (
                    <Size
                      key={size._id}
                      size={size.size}
                      isSelected={selectedSize === size._id}
                      onClick={() => setSelectedSize(size._id)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-row gap-x-5 mt-2">
                <div className="flex items-center justify-between border border-[#818181] rounded-lg w-40">
                  <button
                    className="px-3 py-2 text-gray-600 flex-1 flex items-center justify-center"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19"
                        stroke="#0A0A0A"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="w-px h-8 bg-[#818181]"></div>
                  <span className="px-3 py-2 text-center flex-1">
                    {quantity}
                  </span>
                  <div className="w-px h-8 bg-[#818181]"></div>
                  <button
                    className="px-3 py-2 text-gray-600 flex-1 flex items-center justify-center"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V19"
                        stroke="#0A0A0A"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5 12H19"
                        stroke="#0A0A0A"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  className="px-10 py-3 text-white font-medium bg-black rounded-lg"
                  onClick={handleAddToCart}
                >
                  Giỏ hàng
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-10 py-3 text-white font-medium bg-black rounded-lg"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <div className="border-b border-gray-200">
                <nav
                  className="-mb-px flex justify-center gap-x-10"
                  aria-label="Tabs"
                >
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`border-b-2 py-4 px-1 text-2xl font-medium ${
                      activeTab === "description"
                        ? "border-black text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Mô tả
                  </button>
                  <button
                    onClick={() => setActiveTab("review")}
                    className={`border-b-2 py-4 px-1 text-2xl font-medium ${
                      activeTab === "review"
                        ? "border-black text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Đánh giá
                  </button>
                </nav>
              </div>
              <div className="mt-4">
                {activeTab === "description" && (
                  <p className="text-sm">{description}</p>
                )}
                {activeTab === "review" && (
                  <div className="flex flex-col gap-y-4">
                    {reviews.length > 0 ? (
                      <>
                        {currentReviews.map((review) => (
                          <div key={review.id} className="mt-5">
                            <div className="flex flex-col gap-y-5">
                              <Review {...review} />
                              {review.userResponse && review.reviewResponse && (
                                <SellerFeedback
                                  user={review.userResponse}
                                  content={review.reviewResponse.content}
                                  createdDate={
                                    review.reviewResponse.createdDate
                                  }
                                />
                              )}
                            </div>
                          </div>
                        ))}
                        <Pagination
                          currentPage={currentPage}
                          totalPages={Math.ceil(
                            reviews.length / REVIEWS_PER_PAGE
                          )}
                          onPageChange={setCurrentPage}
                        />
                      </>
                    ) : (
                      <div className="text-center font-bold text-2xl">
                        Chưa có đánh giá nào
                      </div>
                    )}
                  </div>
                )}
              </div>
              <hr className="mt-10 border-gray-300" />
              <div className="mx-auto py-10">
                <div className="flex text-center justify-center items-center pb-2">
                  <h1 className="font-medium px-24 text-3xl">
                    Khám phá sản phẩm liên quan
                  </h1>
                </div>
                {/* <Slider products={relatedProducts} /> */}
              </div>
              <FeatureBanner />
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={openModal}
        size="lg"
        onClose={() => {
          setOpenModal(false);
          setQuantity(1);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body className="py-5 shadow-sm border-t border-b flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-row gap-x-5">
              <img
                src={formatURL(mainImage)}
                alt={productName}
                className="w-40 rounded-lg"
              />
              <div className="flex flex-col justify-between flex-1">
                <p className="text-sm">{category}</p>
                <div className="flex flex-col gap-y-1">
                  <p className="font-medium text-base">{productName}</p>
                  <div className="flex flex-row items-center">
                    <Rating percentage={(rating / 5) * 100} />
                    <p className="ml-2 text-lg">
                      {rating ? rating : "Chưa có đánh giá"}
                    </p>
                  </div>
                  <p className="font-semibold text-base">
                    {formatToVND(price)}
                  </p>
                </div>
                <div className="flex flex-row gap-x-5 items-center">
                  <p className="font-medium">Số lượng: </p>
                  <div className="flex w-32 items-center justify-between border border-[#818181] rounded-lg">
                    <button
                      className="py-1 text-gray-600 flex-1 flex items-center justify-center"
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19"
                          stroke="#0A0A0A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="w-px h-6 bg-[#818181]"></div>
                    <span className="py-1 text-center flex-1">{quantity}</span>
                    <div className="w-px h-6 bg-[#818181]"></div>
                    <button
                      className="py-1 text-gray-600 flex-1 flex items-center justify-center"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5V19"
                          stroke="#0A0A0A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M5 12H19"
                          stroke="#0A0A0A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-5">
              <p className="font-medium text-base mb-1">Màu sắc:</p>
              <div className="flex flex-row gap-x-2">
                {colors.map((color) => (
                  <button
                    key={color._id}
                    onClick={() => setSelectedColor(color._id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2
      ${
        selectedColor === color._id
          ? `border-${color.color}`
          : "border-gray-300"
      } transition-all duration-200`}
                    style={{
                      borderColor:
                        selectedColor === color._id ? color.color : "#D9D9D9",
                    }}
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div
                        className={`w-5 h-5 rounded-full`}
                        style={{ backgroundColor: color.color }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-5">
              <p className="font-medium text-base mb-1">Kích cỡ:</p>
              <div className="flex flex-row gap-x-2">
                {availableSizes.map((size) => (
                  <button
                    key={size._id}
                    className={`inline-block px-3 py-1 border rounded-md 
                                      ${
                                        selectedSize === size._id
                                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                                          : "bg-white text-black border-gray-300"
                                      } 
                                      cursor-pointer transition-all duration-300`}
                    onClick={() => setSelectedSize(size._id)}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg py-3 px-5 flex flex-row justify-between bg-[#F8F9FA] font-medium text-xl mt-2">
              <p>Tổng:</p>
              <p>{formatToVND(price * quantity)}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full flex justify-center">
            <button
              onClick={handleCheckout}
              className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-medium"
            >
              Mua ngay
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductDetails;
