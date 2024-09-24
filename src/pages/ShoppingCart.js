import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";

function ShoppingCart() {
  const initialProducts = [
    {
      id: 1,
      name: "Mini Skirt",
      color: "Black",
      size: "XL",
      price: 75,
      image: "https://picsum.photos/120",
    },
    {
      id: 2,
      name: "Maxi Dress",
      color: "Red",
      size: "M",
      price: 120,
      image: "https://picsum.photos/120",
    },
  ];

  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [quantities, setQuantities] = useState(
    initialProducts.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (productId, change) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, prevQuantities[productId] + change),
    }));
  };

  const handleRemoveProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[productId];
    setQuantities(updatedQuantities);
  };

  const handleClearCart = () => {
    setProducts([]);
    setQuantities({});
  };

  const totalItems = products.reduce(
    (acc, product) => acc + quantities[product.id],
    0
  );
  const subTotal = products.reduce(
    (acc, product) => acc + product.price * quantities[product.id],
    0
  );
  const shipping = 0;
  const taxes = subTotal * 0.1;
  const totalPrice = subTotal + taxes;

  const orderSummary = {
    items: products,
    totalItems,
    subTotal,
    shipping,
    taxes,
    totalPrice,
  };

  const handleCheckout = () => {
    navigate("/cart/checkout", { state: { orderSummary } });
  };

  return (
    <div>
      <Banner title={"Shopping Cart"} route={"Home / Shopping Cart"} />
      <div className="flex flex-row gap-x-20 px-40 py-20">
        {/* Product List */}
        <div className="h-fit w-[800px]">
          <table className="border-collapse overflow-hidden w-full">
            <thead>
              <tr className="bg-[#0A0A0A] text-white rounded-lg">
                <td className="rounded-tl-lg">&nbsp;</td>
                <td className="px-4 py-4 font-medium text-left text-white">
                  Product
                </td>
                <td className="px-4 py-4 font-medium text-left text-white">
                  Price
                </td>
                <td className="px-4 py-4 font-medium text-left text-white">
                  Quantity
                </td>
                <td className="px-4 py-4 font-medium text-left text-white rounded-tr-lg">
                  Sub Total
                </td>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="border-b border-[#818181]" key={product.id}>
                  <td align="center" className="w-12">
                    <button onClick={() => handleRemoveProduct(product.id)}>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.0841 12L18.3841 7.71C18.5724 7.5217 18.6782 7.2663 18.6782 7C18.6782 6.7337 18.5724 6.47831 18.3841 6.29C18.1958 6.1017 17.9404 5.99591 17.6741 5.99591C17.4078 5.99591 17.1524 6.1017 16.9641 6.29L12.6741 10.59L8.3841 6.29C8.1958 6.1017 7.9404 5.99591 7.6741 5.99591C7.4078 5.99591 7.15241 6.1017 6.9641 6.29C6.7758 6.47831 6.67001 6.7337 6.67001 7C6.67001 7.2663 6.7758 7.5217 6.9641 7.71L11.2641 12L6.9641 16.29C6.87037 16.383 6.79598 16.4936 6.74521 16.6154C6.69444 16.7373 6.6683 16.868 6.6683 17C6.6683 17.132 6.69444 17.2627 6.74521 17.3846C6.79598 17.5064 6.87037 17.617 6.9641 17.71C7.05707 17.8037 7.16767 17.8781 7.28953 17.9289C7.41139 17.9797 7.54209 18.0058 7.6741 18.0058C7.80611 18.0058 7.93682 17.9797 8.05868 17.9289C8.18054 17.8781 8.29114 17.8037 8.3841 17.71L12.6741 13.41L16.9641 17.71C17.0571 17.8037 17.1677 17.8781 17.2895 17.9289C17.4114 17.9797 17.5421 18.0058 17.6741 18.0058C17.8061 18.0058 17.9368 17.9797 18.0587 17.9289C18.1805 17.8781 18.2911 17.8037 18.3841 17.71C18.4778 17.617 18.5522 17.5064 18.603 17.3846C18.6538 17.2627 18.6799 17.132 18.6799 17C18.6799 16.868 18.6538 16.7373 18.603 16.6154C18.5522 16.4936 18.4778 16.383 18.3841 16.29L14.0841 12Z"
                          fill="#0A0A0A"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="flex items-center space-x-4 pr-5 py-2">
                    <img
                      src={product.image}
                      alt="Product"
                      className="h-28 w-28 object-cover"
                    />
                    <div>
                      <h2 className="font-medium text-lg">{product.name}</h2>
                      <p className="font-light">
                        Color: {product.color} | Size: {product.size}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-between border border-[#818181] rounded-lg w-40 py-1">
                      <button
                        className="px-3 py-2 text-[#0A0A0A] flex-1 flex justify-center items-center"
                        onClick={() => handleQuantityChange(product.id, -1)}
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
                      <span className="px-3 py-2 text-center flex-1">
                        {quantities[product.id]}
                      </span>
                      <div className="w-px h-8 bg-[#818181]"></div>
                      <button
                        className="px-3 py-2 text-[#0A0A0A] flex-1 flex justify-center items-center"
                        onClick={() => handleQuantityChange(product.id, 1)}
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
                  <td className="px-4 py-2 font-medium">
                    ${(product.price * quantities[product.id]).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p
            className="underline font-medium text-right mt-10 cursor-pointer"
            onClick={handleClearCart}
          >
            Clear Shopping Cart
          </p>
        </div>

        {/* Order Summary */}
        <div className="flex-1 border border-[#818181] rounded-lg p-5 flex flex-col gap-y-4 h-fit">
          <p className="font-bold text-xl">Order Summary</p>
          <hr className="border-[#818181]" />
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row justify-between">
              <p className="text-[#4A4A4A]">Items</p>
              <p className="font-semibold">{totalItems}</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-[#4A4A4A]">Sub Total</p>
              <p className="font-semibold">${subTotal.toFixed(2)}</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-[#4A4A4A]">Shipping</p>
              <p className="font-semibold">${shipping.toFixed(2)}</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-[#4A4A4A]">Taxes</p>
              <p className="font-semibold">${taxes.toFixed(2)}</p>
            </div>
          </div>
          <hr className="border-[#818181]" />
          <div className="flex flex-row justify-between">
            <p className="text-[#4A4A4A]">Total</p>
            <p className="font-semibold">${totalPrice.toFixed(2)}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="px-10 py-3 text-white font-medium bg-black rounded-lg w-full disabled:bg-[#4A4A4A] disabled:cursor-not-allowed"
            disabled={products.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
