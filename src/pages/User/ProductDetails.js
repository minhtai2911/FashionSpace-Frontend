import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/AuthContext";

import Banner from "../../components/Banner";
import Color from "../../components/Color";
import Rating from "../../components/Rating";
import Size from "../../components/Size";
import Review from "../../components/Review";
import Pagination from "../../components/Pagination";
import Slider from "../../components/Slider";
import FeatureBanner from "../../components/FeatureBanner";
import { REVIEWS_PER_PAGE } from "../../utils/Constants";
import { colors } from "../../data/colors";
import { sizes } from "../../data/sizes";
import { addToCart } from "../../stores/cart";

// Example data
const reviews = [
  {
    id: 1,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Doe",
    },
    rating: 4.5,
    content: "This is a great product. I love it.",
    createdDate: "20/10/2024",
  },
  {
    id: 2,
    user: {
      avatar: "https://picsum.photos/100",
      name: "Jane Doe",
    },
    rating: 3.5,
    content: "This is a good product. I like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 3,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 4,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 5,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 6,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 7,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 8,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 9,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
  {
    id: 10,
    user: {
      avatar: "https://picsum.photos/100",
      name: "John Smith",
    },
    rating: 2.5,
    content: "This is a bad product. I don't like it.",
    createdDate: "20/10/2024",
  },
];
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
  const carts = useSelector((store) => store.cart.items);
  const [replies, setReplies] = useState({});
  const [submittedReplies, setSubmittedReplies] = useState({});
  const [showInput, setShowInput] = useState({});
  const [showAllReplies, setShowAllReplies] = useState({});

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("S");
  const [mainImage, setMainImage] = useState("https://picsum.photos/500");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const fetchProductById = (productId) => {
    return {
      id: 1,
      name: "Classy Leather Jacket",
      category: "Jacket",
      price: "75.00",
      rating: 4.8,
      color: "black",
      size: "S",
      image: "https://picsum.photos/200",
      description:
        "The Baddie Jacket is a stylish and edgy outerwear piece designed for bold, confident individuals. Crafted with premium materials, it features a sleek, modern fit that elevates any outfit. Perfect for making a statement, the Baddie Jacket combines comfort and fashion, offering a versatile look for day or night.",
    };
  };

  const handleReplySubmit = (reviewId) => {
    const replyContent = replies[reviewId] || "";
    if (replyContent) {
      setSubmittedReplies((prev) => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), replyContent],
      }));
      setReplies((prev) => ({ ...prev, [reviewId]: "" }));
      setShowInput((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleReply = (reviewId) => {
    setShowInput((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleAddToCart = () => {
    const productData = {
      productId: parseInt(id),
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: mainImage,
    };

    if (isAuthenticated) {
      dispatch(addToCart(productData));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCarts")) || [];
      const existingProductIndex = guestCart.findIndex(
        (item) =>
          item.productId === productData.productId &&
          item.size === productData.size &&
          item.color === productData.color
      );

      if (existingProductIndex >= 0) {
        guestCart[existingProductIndex].quantity += productData.quantity;
      } else {
        guestCart.push(productData);
      }
      localStorage.setItem("guestCarts", JSON.stringify(guestCart));
    }
  };

  useEffect(() => {
    const productDetails = fetchProductById(id);
    setProduct(productDetails);

    if (productDetails && productDetails.name) {
      document.title = productDetails.name;
    }
  }, [id]);

  // Pagination for reviews
  const [currentPage, setCurrentPage] = useState(1);

  const currentReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  if (!product) {
    return <p>Loading...</p>;
  }

  // Submit review
  const handleSubmit = () => {};
  const percentage = Math.round((product.rating / 5) * 100);

  return (
    <div>
      <Banner
        title="Product Details"
        route={`Home / Shop / Product Details / ${product.name}`}
      />
      <div className="px-40">
        <div className="flex flex-row mt-10 gap-x-20">
          <div className="flex flex-col gap-y-2">
            {/* Main Image */}
            <img src={mainImage} alt={product.name} />

            <div className="flex flex-row gap-x-[6.66px]">
              {/* Small Images */}
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <img
                    key={index}
                    src={`https://picsum.photos/120?random=${index}`}
                    alt={`Thumbnail ${index}`}
                    onClick={() => {
                      setMainImage(`https://picsum.photos/120?random=${index}`);
                      setSelectedImageIndex(index);
                    }}
                    className={`cursor-pointer border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  />
                ))}
            </div>
          </div>
          <div className="flex-1 gap-y-4 flex flex-col">
            <p>{product.category}</p>
            <div className="flex flex-col gap-y-1">
              <p className="font-semibold text-2xl">{product.name}</p>
              <div className="flex flex-row items-center">
                <Rating percentage={percentage} />
                <p className="ml-2 text-lg">{product.rating}</p>
              </div>
              <p className="font-semibold text-xl">${product.price}</p>
            </div>
            <p>{product.description}</p>

            {/* Colors */}
            <div>
              <p className="font-medium text-xl mb-1">Color:</p>
              <div className="flex flex-row gap-x-2">
                {colors.map((color) => (
                  <Color
                    key={color}
                    color={color}
                    isSelected={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="font-medium text-xl mb-1">Size:</p>
              <div className="flex flex-row gap-x-2">
                {sizes.map((size) => (
                  <Size
                    key={size}
                    size={size}
                    isSelected={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
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
                <span className="px-3 py-2 text-center flex-1">{quantity}</span>
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
                Add to Cart
              </button>
              <button className="px-10 py-3 text-white font-medium bg-black rounded-lg">
                Buy Now
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
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`border-b-2 py-4 px-1 text-2xl font-medium ${
                    activeTab === "review"
                      ? "border-black text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Review
                </button>
              </nav>
            </div>
            <div className="mt-4">
              {activeTab === "description" && (
                <>
                  <p className="text-sm">
                    The Baddie Jacket is the ultimate fusion of style and
                    attitude, designed to make you stand out wherever you go.
                    Made from high-quality materials, this jacket boasts a
                    sleek, tailored fit that hugs the body while providing
                    comfort and durability. The design includes edgy accents
                    like metallic zippers, bold stitching, and a modern collar,
                    giving it a fierce, fashion-forward vibe. Whether you're
                    dressing up for a night out or layering it over your casual
                    outfit, the Baddie Jacket ensures you'll always look
                    effortlessly cool.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="mr-2">•</span>
                      Outer shell: High-quality faux leather for a sleek,
                      polished look
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="mr-2">•</span>
                      Lining: Soft polyester for warmth and comfort
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="mr-2">•</span>
                      Material properties: Breathable, durable, and lightweight
                      for everyday wear
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="mr-2">•</span>
                      Eco-friendly: Cruelty-free and sustainable materials
                    </li>
                  </ul>
                </>
              )}
              {activeTab === "review" && (
                <div className="flex flex-col gap-y-4">
                  {currentReviews.map((review) => (
                    <div key={review.id} className="mt-5">
                      <Review
                        {...review}
                        onReply={() => handleReply(review.id)}
                        showInput={showInput[review.id]}
                      />

                      {showInput[review.id] && (
                        <div className="flex flex-row mt-5 items-center gap-x-2 ml-14">
                          <input
                            className="rounded-lg px-5 py-2 text-sm border-[2px] border-[#0A0A0A]"
                            placeholder="Write your reply..."
                            value={replies[review.id] || ""}
                            onChange={(e) =>
                              setReplies({
                                ...replies,
                                [review.id]: e.target.value,
                              })
                            }
                          />
                          <button
                            className="rounded-lg bg-[#0A0A0A] px-5 py-2 text-white disabled:bg-[#4A4A4A] disabled:cursor-not-allowed"
                            disabled={replies[review.id] === ""}
                            onClick={() => handleReplySubmit(review.id)}
                          >
                            Reply
                          </button>
                        </div>
                      )}
                      {submittedReplies[review.id] && (
                        <div className="mt-10">
                          {showAllReplies[review.id]
                            ? submittedReplies[review.id].map((reply) => (
                                <div
                                  key={reply.id}
                                  className="ml-14 mt-2 text-gray-600"
                                >
                                  <Review
                                    user={reply.user}
                                    rating={reply.rating}
                                    content={reply}
                                  />
                                </div>
                              ))
                            : submittedReplies[review.id]
                                .slice(0, 1)
                                .map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="ml-14 mt-2 text-gray-600"
                                  >
                                    <Review
                                      user={reply.user}
                                      rating={reply.rating}
                                      content={reply}
                                    />
                                  </div>
                                ))}
                          {submittedReplies[review.id].length > 1 &&
                            !showAllReplies[review.id] && (
                              <button
                                className="ml-14 mt-5 text-[#4A4A4A] text-sm"
                                onClick={() =>
                                  setShowAllReplies((prev) => ({
                                    ...prev,
                                    [review.id]: true,
                                  }))
                                }
                              >
                                View more{" "}
                                {submittedReplies[review.id].length - 1} replies
                              </button>
                            )}
                          {showAllReplies[review.id] && (
                            <button
                              className="ml-14 mt-5 text-[#4A4A4A] text-sm"
                              onClick={() =>
                                setShowAllReplies((prev) => ({
                                  ...prev,
                                  [review.id]: false,
                                }))
                              }
                            >
                              Hide replies
                            </button>
                          )}
                        </div>
                      )}
                      {/* Reply input field */}
                    </div>
                  ))}
                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                  />
                  <div className="mt-5 rounded-lg py-5 px-10 border-[2px] border-[#0A0A0A] w-1/2 self-center flex flex-col gap-y-5">
                    <h1 className="text-center text-lg font-medium">
                      Add Your Review
                    </h1>
                    <div>
                      <p className="text-lg mb-2">
                        Rating <b className="text-red-500">*</b>
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-lg mb-2">
                        Review <b className="text-red-500">*</b>
                      </p>
                      <textarea
                        className="rounded-lg px-5 py-3 w-full border-[2px] border-[#0A0A0A] resize-none"
                        placeholder="Write here..."
                      ></textarea>
                    </div>
                    <button className="rounded-lg bg-[#0A0A0A] px-5 py-3 w-fit self-center text-white">
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
            <hr className="mt-10 border-gray-300" />
            <div className="mx-auto py-10">
              <div className="flex text-center justify-center items-center pb-2">
                <h1 className="font-medium px-24 text-3xl">
                  Explore Related Products
                </h1>
              </div>
              <Slider products={relatedProducts} />
            </div>
            <FeatureBanner />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
