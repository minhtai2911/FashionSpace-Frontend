import { useLocation } from "react-router-dom";

import Banner from "../../components/Banner";
import { FREE_SHIPPING, SHIPPING_RATE, TAX_RATE } from "../../utils/Constants";

const order = {
  _id: "order1",
  orderId: "AFS1239",
  paymentMethod: "COD",
  totalPayment: 1055.0,
  deliveryDate: "12 Sep 2024",
  status: "Accepted",
  items: [
    {
      productId: "product1",
      name: "Mini Skirt",
      color: "Black",
      size: "XL",
      price: 15,
      quantity: 4,
      imageUrl: "https://picsum.photos/200/300?random=1",
    },
    {
      productId: "product2",
      name: "Mini Skirt",
      color: "Black",
      size: "XL",
      price: 20,
      quantity: 1,
      imageUrl: "https://picsum.photos/200/300?random=2",
    },
    {
      productId: "product3",
      name: "Mini Skirt",
      color: "Black",
      size: "XL",
      price: 50,
      quantity: 2,
      imageUrl: "https://picsum.photos/200/300?random=3",
    },
    {
      productId: "product4",
      name: "Mini Skirt",
      color: "Black",
      size: "XL",
      price: 10,
      quantity: 3,
      imageUrl: "https://picsum.photos/200/300?random=4",
    },
  ],
};

function OrderCompleted() {
  const location = useLocation();
  const { orderSummary } = location.state;
  const calculateSubtotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
  const subTotal = calculateSubtotal(orderSummary.items);
  const shipping = subTotal >= FREE_SHIPPING ? 0 : subTotal * SHIPPING_RATE;
  const taxes = subTotal * TAX_RATE;
  const total = subTotal + taxes + shipping;
  return (
    <div>
      <Banner
        title={"Order Completed"}
        route={"Home / Checkout / Order Completed"}
      />
      <div className="flex flex-col px-40 py-20 justify-center gap-y-10 items-center">
        <div className="flex flex-col justify-center items-center">
          <svg
            width="60"
            height="60"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="40" fill="#0A0A0A" />
            <path
              d="M56 28L34 50L24 40"
              stroke="white"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="text-xl font-bold text-center mt-5">
            Your order is completed!
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Thank you. Your order has been received!
          </p>
        </div>
        <table className="mb-4 w-8/12">
          <tr>
            <td colSpan={4}>
              <div className="bg-[#0A0A0A] rounded-t-lg py-6 grid grid-cols-3 divide-x items-center">
                <p className="text-base text-white text-center">
                  Order ID: {orderSummary.orderId}
                </p>
                <p className="text-base text-white text-center">
                  Payment Method: {orderSummary.paymentMethod}
                </p>
                <p className="text-base text-white text-center">
                  Estimated Delivery Date: <br />
                  {orderSummary.deliveryDate}
                </p>
              </div>
            </td>
          </tr>
          <tbody className="space-y-4 border-b border-r border-l mb-4">
            <tr>
              <td className="px-10 pt-4 font-medium">Order Details</td>
            </tr>
            <tr>
              <td colSpan={4} className="px-10 pt-4">
                <hr />
              </td>
            </tr>
            <tr>
              <td className="px-10 pt-4 font-medium">Product</td>
              <td className="font-medium pt-4">Price</td>
              <td className="font-medium pt-4 text-center">Quantity</td>
              <td className="font-medium pt-4 pr-10 text-right">Sub Total</td>
            </tr>
            {orderSummary.items.map((item) => (
              <tr>
                <td className="px-10 pt-4">
                  <div key={item.productId} className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="font-light">
                        Color: {item.color} | Size: {item.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="pt-4">${parseFloat(item.price).toFixed(2)}</td>
                <td className="pt-4 text-center">{item.quantity}</td>
                <td className="pt-4 px-10 text-right">
                  ${parseFloat(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="px-10 pt-4">
                <hr />
              </td>
            </tr>
            <tr>
              <td className="px-10 pt-4 font-medium" colSpan={4}>
                <div className="flex justify-between">
                  <label>Shipping</label>
                  <label>${shipping.toFixed(2)}</label>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-10 pt-4 font-medium" colSpan={4}>
                <div className="flex justify-between">
                  <label>Taxes</label>
                  <label>${taxes.toFixed(2)}</label>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="px-10 pt-4">
                <hr />
              </td>
            </tr>
            <tr>
              <td className="px-10 py-4 font-medium" colSpan={4}>
                <div className="flex justify-between">
                  <label>Total</label>
                  <label>${total.toFixed(2)}</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderCompleted;
