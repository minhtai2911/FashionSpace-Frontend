import { useState, useEffect } from "react";
import { getProductById } from "../data/products";
import { getCategoryById } from "../data/categories";
import { useDispatch } from "react-redux";
import { changeQuantity } from "../stores/cart";
import { formatToVND, formatURL } from "../utils/format";

function CartItem(props) {
  const { productId, quantity, color, size } = props.data;
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState([]);
  const [image, setImage] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const product = await getProductById(productId);
        console.log(product);
        const images = product.images;
        setProductName(product.name);
        setPrice(product.price);
        setImage(images[0].url);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductData();
  }, [productId, color, size]);

  const handleMinusQuantity = () => {
    dispatch(
      changeQuantity({
        productId,
        color,
        size,
        quantity: quantity - 1,
      })
    );
  };

  const handlePlusQuantity = () => {
    dispatch(
      changeQuantity({
        productId,
        color,
        size,
        quantity: quantity + 1,
      })
    );
  };

  return (
    <>
      <td className="flex items-center space-x-4 py-2">
        <img src={image} alt="Product" className="h-24 w-24 object-cover" />
        <div>
          <h2 className="font-medium text-lg">{productName}</h2>
          <p className="font-light">
            Màu sắc: {color} | Kích cỡ: {size}
          </p>
        </div>
      </td>
      <td className="px-2 py-2">{formatToVND(price)}</td>
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
      <td className="px-2 py-2 font-medium">{formatToVND(price * quantity)}</td>
    </>
  );
}
export default CartItem;
