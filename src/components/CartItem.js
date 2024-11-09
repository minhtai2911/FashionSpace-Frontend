import { useState, useEffect } from "react";
import { products } from "../data/products";
import { useDispatch } from "react-redux";
import { changeQuantity } from "../stores/cart";

function CartItem(props) {
  const { productId, name, price, quantity, color, size, image } = props.data;
  const [detail, setDetail] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const findDetail = products.filter(
      (product) =>
        product.id === productId &&
        product.color === color &&
        product.size === size
    )[0];
    setDetail(findDetail);
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

  console.log(detail);

  return (
    <>
      <td className="flex items-center space-x-4 py-2">
        <img
          src={detail.image ? detail.image : ""}
          alt="Product"
          className="h-24 w-24 object-cover"
        />
        <div>
          <h2 className="font-medium text-lg">{detail.name}</h2>
          <p className="font-light">
            Color: {color} | Size: {size}
          </p>
        </div>
      </td>
      <td className="px-2 py-2">${detail.price}</td>
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
        ${(detail.price * quantity).toFixed(2)}
      </td>
    </>
  );
}
export default CartItem;
