import { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/AuthContext";

import { getProductById } from "../../data/products";
import { getAllImagesByProductId } from "../../data/productImages";
import { getCategoryById } from "../../data/categories";
import { getProductVariantsByProductId } from "../../data/productVariant";
import { getColorById } from "../../data/colors";
import { getSizeById } from "../../data/sizes";
import { createShoppingCart } from "../../data/shoppingCart";

import Banner from "../../components/Banner";
import Color from "../../components/Color";
import Rating from "../../components/Rating";
import Size from "../../components/Size";
import Review from "../../components/Review";
import Pagination from "../../components/Pagination";
import Slider from "../../components/Slider";
import FeatureBanner from "../../components/FeatureBanner";
import { REVIEWS_PER_PAGE } from "../../utils/Constants";
import { addToCart } from "../../stores/cart";
import { formatURL } from "../../utils/format";

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

  useEffect(() => {
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

    fetchProduct();
    fetchVariants();
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
  }, []);

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
    // if (!isAuthenticated) dispatch(addToCart(product));
    // else {
    //   const response = await createShoppingCart();
    // }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const currentReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const percentage = Math.round((rating / 5) * 100);

  return (
    <div>
      <Banner
        title="Product Details"
        route={`Home / Shop / Product Details / ${productName}`}
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
                  {rating ? rating : "No rating yet"}
                </p>
              </div>
              <p className="font-semibold text-xl">${price}</p>
            </div>
            <p>{description}</p>

            <div>
              <p className="font-medium text-xl mb-1">Color:</p>
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
              <p className="font-medium text-xl mb-1">Size:</p>
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
                      <Review {...review} />
                    </div>
                  ))}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                  />
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
