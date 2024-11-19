import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Banner from "../../components/Banner";
import { FREE_SHIPPING, SHIPPING_RATE, TAX_RATE } from "../../utils/Constants";
import { getProductById } from "../../data/products";
import { getSizeById } from "../../data/sizes";
import { getColorById } from "../../data/colors";
import { getAllImagesByProductId } from "../../data/productImages";
import { formatURL } from "../../utils/formatURL";

function OrderCompleted() {
  const location = useLocation();
  const { orderSummary } = location.state;
  const items = orderSummary.items;
  console.log(items);
  const subTotal = orderSummary.subTotal;
  const shipping = orderSummary.shipping;
  const taxes = orderSummary.taxes;
  const total = orderSummary.totalPrice;

  const [detailedItems, setDetailedItems] = useState([]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const fetchedItems = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          const size = await getSizeById(item.sizeId);
          const color = await getColorById(item.colorId);
          const images = await getAllImagesByProductId(item.productId);
          return {
            ...item,
            product,
            size,
            color,
            images,
          };
        })
      );
      setDetailedItems(fetchedItems);
    };

    fetchItemDetails();
  }, [items]);

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
            {detailedItems.map((item) => (
              <tr key={item.product.productId}>
                <td className="px-10 pt-4">
                  <div className="flex items-center">
                    <img
                      src={formatURL(item.images[0].imagePath)}
                      alt={item.product.name}
                      className="w-16 h-16 mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="font-light">
                        Color: {item.color.color} | Size: {item.size.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="pt-4">
                  ${parseFloat(item.product.price).toFixed(2)}
                </td>
                <td className="pt-4 text-center">{item.quantity}</td>
                <td className="pt-4 px-10 text-right">
                  ${parseFloat(item.product.price * item.quantity).toFixed(2)}
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
