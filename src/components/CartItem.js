import { useState, useEffect } from "react";
import { getAllProducts, getProductById } from "../data/products";
import { getAllImagesByProductId } from "../data/productImages";
import { getCategoryById } from "../data/categories";
import { useDispatch } from "react-redux";
import { changeQuantity } from "../stores/cart";
import { formatURL } from "../utils/format";
import { getColorById } from "../data/colors";
import { getSizeById } from "../data/sizes";

function CartItem(props) {
  const { productId, quantity, colorId, sizeId } = props.data;
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchProductData = async () => {
  //     const updatedProducts = await Promise.all(
  //       products.map(async (product) => {
  //         const images = await getAllImagesByProductId(product._id);
  //         const category = await getCategoryById(product.categoryId);
  //         return {
  //           ...product,
  //           images: images || [],
  //           category: category.name,
  //         };
  //       })
  //     );
  //     setProductData(updatedProducts);
  //   };

  //   fetchProductData();
  // }, []);

  // useEffect(() => {
  //   const findDetail = products.filter(
  //     (product) =>
  //       product.id === productId &&
  //       product.color === color &&
  //       product.size === size
  //   )[0];
  //   setDetail(findDetail);
  // }, [productId, color, size]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const product = await getProductById(productId);
        const images = await getAllImagesByProductId(productId);
        setProductName(product.name);
        setPrice(product.price);
        setImage(images[0].imagePath);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchColor = async () => {
      try {
        const color = await getColorById(colorId);
        setColor(color.color);
      } catch (error) {
        console.error("Failed to fetch color:", error);
        setColor("Unknown Color");
      }
    };

    const fetchSize = async () => {
      try {
        const size = await getSizeById(sizeId);
        setSize(size.size);
      } catch (error) {
        console.error("Failed to fetch size:", error);
        setSize("Unknown Size");
      }
    };

    fetchProductData();
    fetchColor();
    fetchSize();
  }, [productId, colorId, sizeId]);

  const handleMinusQuantity = () => {
    dispatch(
      changeQuantity({
        productId,
        colorId,
        sizeId,
        quantity: quantity - 1,
      })
    );
  };

  const handlePlusQuantity = () => {
    dispatch(
      changeQuantity({
        productId,
        colorId,
        sizeId,
        quantity: quantity + 1,
      })
    );
  };

  return (
    <>
      <td className="flex items-center space-x-4 py-2">
        <img
          src={formatURL(image)}
          alt="Product"
          className="h-24 w-24 object-cover"
        />
        <div>
          <h2 className="font-medium text-lg">{productName}</h2>
          <p className="font-light">
            Color: {color} | Size: {size}
          </p>
        </div>
      </td>
      <td className="px-2 py-2">${price}</td>
      <td className="px-2 py-2">
        <div className="flex items-center justify-between border border-[#818181] rounded-lg w-40 py-1">
          <button
            className="px-3 py-2 text-[#0A0A0A] flex-1 flex justify-center items-center"
            onClick={handleMinusQuantity}
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-8 bg-[#818181]"></div>
          <span className="px-3 py-2 text-center flex-1">{quantity}</span>
          <div className="w-px h-8 bg-[#818181]"></div>
          <button
            className="px-3 py-2 text-[#0A0A0A] flex-1 flex justify-center items-center"
            onClick={handlePlusQuantity}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="#0A0A0A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </td>
      <td className="px-2 py-2 font-medium">
        ${(price * quantity).toFixed(2)}
      </td>
    </>
  );
}
export default CartItem;
