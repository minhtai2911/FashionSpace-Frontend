import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Modal } from "flowbite-react";

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
import { getOrderTrackingByOrderId } from "../../data/orderTracking";
import Rating from "../../components/Rating";
import { createReview } from "../../data/reviews";
import toast from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const [openAddReviewModal, setOpenAddReviewModal] = useState(false);
  const [review, setReview] = useState({
    productId: "",
    rating: 0,
    content: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

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
          const trackingData = await getOrderTrackingByOrderId(order._id);
          const tracking = trackingData.length
            ? trackingData[trackingData.length - 1]
            : {};

          const orderDetails = {
            ...order,
            user,
            paymentDetails,
            details,
            tracking,
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

  const handleAddReview = async () => {
    const response = await createReview(
      review.productId,
      review.rating,
      review.content
    );
    if (response) {
      setOpenAddReviewModal(false);
      toast.success("Send review successfully", { duration: 2000 });
    } else {
      toast.error("Failed to send review", { duration: 2000 });
    }
  };

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
    <>
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
                  {formatDate(order.tracking.expectedDeliveryDate)}
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
                              Color: {item.color.color} | Size: {item.size.size}{" "}
                              | Quantity: {order.details[index].quantity}
                            </p>
                          </div>
                        </div>
                        {order.tracking.status === ORDER_STATUS.SHIPPED && (
                          <button
                            className="bg-black h-fit text-white px-4 py-2 rounded-md"
                            onClick={() => {
                              setReview({
                                ...review,
                                productId: item.product._id,
                              });
                              setOpenAddReviewModal(true);
                            }}
                          >
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
                          order.tracking.status
                        )}`}
                      >
                        {order.tracking.status}
                      </p>
                    </div>
                  </td>
                </tr>

                {order.tracking.status !== "Shipped" && (
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
      <Modal
        show={openAddReviewModal}
        size="lg"
        onClose={() => {
          setOpenAddReviewModal(false);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body className="px-10 pb-10">
          <div className="space-y-4">
            <h3 className="text-xl text-center text-gray-900 dark:text-white font-manrope font-extrabold">
              Add Review
            </h3>
            <div className="flex flex-row gap-x-4 items-center">
              <p className="font-manrope font-semibold text-sm">
                Rating <b className="text-[#EF0606]">*</b>
              </p>
              <div className="flex flex-row gap-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    width="24"
                    height="24"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onMouseEnter={() => setHoveredRating(index + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setReview({ ...review, rating: index + 1 })}
                  >
                    <path
                      d="M20.0001 28.7833L26.9168 32.9667C28.1835 33.7333 29.7335 32.6 29.4001 31.1666L27.5668 23.3L33.6835 18C34.8001 17.0333 34.2001 15.2 32.7335 15.0833L24.6835 14.4L21.5335 6.96665C20.9668 5.61665 19.0335 5.61665 18.4668 6.96665L15.3168 14.3833L7.26679 15.0666C5.80012 15.1833 5.20012 17.0166 6.31679 17.9833L12.4335 23.2833L10.6001 31.15C10.2668 32.5833 11.8168 33.7167 13.0835 32.95L20.0001 28.7833Z"
                      fill={
                        index < (hoveredRating || review.rating)
                          ? "#FFE066"
                          : "#DCDCDC"
                      }
                      className="cursor-pointer"
                    />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="font-manrope font-semibold text-sm">
                Content <b className="text-[#EF0606]">*</b>
              </p>
              <textarea
                value={review.content}
                rows={5}
                className="w-full resize-none font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm"
                onChange={(e) =>
                  setReview({ ...review, content: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              className="px-6 py-2 rounded bg-[#0A0A0A] text-white font-extrabold mt-6 font-manrope"
              onClick={handleAddReview}
            >
              Review
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
