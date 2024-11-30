import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ORDER_STATUS } from "../../utils/Constants";
import { getOrderByUserId } from "../../data/orders";
import { getOrderById } from "../../data/orders";
import { getOrderDetailsByOrderId } from "../../data/orderDetail";
import { getPaymentDetailById } from "../../data/paymentDetail";
import { getUserById } from "../../data/users";
import { getProductVariantById } from "../../data/productVariant";
import { getProductById } from "../../data/products";
import { getSizeById } from "../../data/sizes";
import { getColorById } from "../../data/colors";
import { getCategoryById } from "../../data/categories";
import { formatDate, formatURL } from "../../utils/format";
import { getAllImagesByProductId } from "../../data/productImages";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  async function fetchOrders() {
    try {
      const orders = await getOrderByUserId(user.id);
      const fetchedOrders = await Promise.all(
        orders.map(async (order) => {
          const user = await getUserById(order.userId);
          const paymentDetails = await getPaymentDetailById(
            order.paymentDetailId
          );
          const details = await getOrderDetailsByOrderId(order._id);

          const orderDetails = {
            ...order,
            user,
            paymentDetails,
            details,
          };

          const detailedItems = await Promise.all(
            orderDetails.details.map(async (item) => {
              const productVariant = await getProductVariantById(
                item.productVariantId
              );
              const product = await getProductById(productVariant.productId);
              const images = await getAllImagesByProductId(product._id);
              const size = await getSizeById(productVariant.sizeId);
              const color = await getColorById(productVariant.colorId);
              const category = await getCategoryById(product.categoryId);

              return {
                product: product,
                images: images,
                size: size,
                color: color,
                category: category,
                quantity: item.quantity,
              };
            })
          );
          return {
            ...orderDetails,
            detailedItems,
          };
        })
      );
      console.log(fetchedOrders);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case ORDER_STATUS.SHIPPED:
        return "bg-green-100 text-green-600 border border-green-500";
      case ORDER_STATUS.ACCEPTED:
        return "bg-blue-100 text-blue-600 border border-blue-500";
      case ORDER_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-600 border border-yellow-500";
      case ORDER_STATUS.IN_DELIVERY:
        return "bg-orange-100 text-orange-600 border border-orange-500";
      case ORDER_STATUS.PROCESSING:
        return "bg-purple-100 text-purple-600 border border-purple-500";
      case ORDER_STATUS.CANCELLED:
        return "bg-red-100 text-red-600 border border-red-500";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-500";
    }
  };

  const handleTrackOrder = async () => {};

  const handleCancelOrder = async () => {};

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orders: {orders.length}</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <table key={order._id} className="mb-5 w-full">
            <tr className="bg-[#0A0A0A]">
              <td className="py-2 px-4 text-white rounded-tl-lg w-[25%]">
                Order ID
                <br />
                {order._id}
              </td>
              <td className="p-2 text-white w-[25%]">
                Payment Method
                <br />
                {order.paymentDetails.paymentMethod}
              </td>
              <td className="p-2 text-white w-[25%]">
                Total Payment
                <br />${order.total.toFixed(2)}
              </td>
              <td className="py-2 px-4 text-white rounded-tr-lg w-[25%]">
                Estimated Delivery Date
                <br />
                {formatDate(order.deliveryDate)}
              </td>
            </tr>
            <tbody className="border-l border-r border-b">
              <tr className="space-y-4 border-b mb-4">
                <td colSpan={4} className="p-2">
                  {order.detailedItems.map((item, index) => (
                    <div className="flex flex-row justify-between items-center">
                      <div
                        key={item.product._id}
                        className="px-4 py-2 flex items-center"
                      >
                        <img
                          src={formatURL(item.images[0].imagePath)}
                          alt={item.name}
                          className="w-16 h-16 mr-4"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="font-light">
                            Color: {item.color.color} | Size: {item.size.size} |
                            Quantity: {order.details[index].quantity}
                          </p>
                        </div>
                      </div>
                      {order.status === ORDER_STATUS.SHIPPED && (
                        <button className="bg-black h-fit text-white px-4 py-2 rounded-md">
                          Add Review
                        </button>
                      )}
                    </div>
                  ))}
                </td>
              </tr>

              <tr className="font-medium">
                <td colSpan={4} className="p-2">
                  <div className="p-2 flex items-center gap-x-2">
                    Order Status:{" "}
                    <p
                      className={`inline-block px-4 py-2 rounded ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </td>
              </tr>

              {order.status !== "Shipped" && (
                <tr>
                  <td className="px-4 pb-4 pt-2" colSpan={4}>
                    <div className="flex gap-x-2">
                      <Link
                        to={`/trackOrder/${order._id}`}
                        className="bg-black text-white px-4 py-2 rounded-md"
                      >
                        Track Order
                      </Link>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={handleCancelOrder}
                      >
                        Cancel Order
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
