import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table, Datepicker } from "flowbite-react";
import { getOrderById, updateOrderById } from "../../data/orders";
import { getOrderDetailsByOrderId } from "../../data/orderDetail";
import {
  getPaymentDetailById,
  updatePaymentDetailById,
} from "../../data/paymentDetail";
import { getUserById } from "../../data/users";
import { formatDate, formatToVND } from "../../utils/format";
import { getProductVariantById } from "../../data/productVariant";
import { getProductById } from "../../data/products";
import { getSizeById } from "../../data/sizes";
import { getColorById } from "../../data/colors";
import { getCategoryById } from "../../data/categories";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../utils/Constants";
import toast from "react-hot-toast";
import {
  createOrderTracking,
  getOrderTrackingByOrderId,
} from "../../data/orderTracking";
import Error from "../Error";
import AuthContext from "../../context/AuthContext";
import Cookies from "js-cookie";

export default function UpdateOrder() {
  const { id } = useParams();
  const [orderWithDetails, setOrderWithDetails] = useState({});
  const [itemDetails, setItemDetails] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [status, setStatus] = useState("");
  const [newDeliveryDate, setNewDeliveryDate] = useState("");
  const [newCurrentAddress, setNewCurrentAddress] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const navigate = useNavigate();

  const orderStatusValues = Object.values(ORDER_STATUS);

  const { auth, setHasError } = useContext(AuthContext);
  const permission = Cookies.get("permission") ?? null;

  const formatToDateInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  async function fetchOrders() {
    try {
      const order = await getOrderById(id);
      const user = await getUserById(order.userId);
      const paymentDetails = await getPaymentDetailById(order.paymentDetailId);
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
          const size = await getSizeById(productVariant.sizeId);
          const color = await getColorById(productVariant.colorId);
          const category = await getCategoryById(product.categoryId);

          return {
            product,
            size,
            color,
            category,
            quantity: item.quantity,
          };
        })
      );

      setOrderWithDetails(orderDetails);
      setItemDetails(detailedItems);
      setDeliveryDate(
        formatToDateInput(orderDetails.tracking.expectedDeliveryDate) || ""
      );
      setPaymentStatus(orderDetails.paymentDetails.status || "");
      setNewPaymentStatus(orderDetails.paymentDetails.status || "");
      setCurrentAddress(orderDetails.tracking.currentAddress || "");
      setStatus(orderDetails.tracking.status || "");
      setNewDeliveryDate(
        formatToDateInput(orderDetails.tracking.expectedDeliveryDate) || ""
      );
      setNewCurrentAddress(orderDetails.tracking.currentAddress || "");
      setNewStatus(orderDetails.tracking.status || "");
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const handleUpdateOrder = async () => {
    try {
      await updatePaymentDetailById(
        orderWithDetails.paymentDetails._id,
        newPaymentStatus
      );
      await createOrderTracking(id, newStatus, currentAddress, deliveryDate);
      toast.success("Cập nhật đơn hàng thành công", { duration: 2000 });
      navigate("/admin/orders");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const isChanged = () => {
    return (
      deliveryDate !== newDeliveryDate ||
      status !== newStatus ||
      currentAddress !== newCurrentAddress ||
      paymentStatus !== newPaymentStatus
    );
  };

  const isCanCancel = () => {
    return (
      orderWithDetails?.paymentDetails?.paymentMethod === "MOMO" &&
      paymentStatus === PAYMENT_STATUS.PAID
    );
  };

  const getCurrentStatus = (status) => {
    return orderStatusValues.indexOf(status);
  };

  if (!permission || !permission.includes("ORDERS")) {
    setHasError(true);
    return (
      <Error
        errorCode={403}
        title={"Forbidden"}
        content={"Bạn không có quyền truy cập trang này."}
      />
    );
  }

  return (
    <div className="p-10 w-full">
      <p className="font-extrabold text-xl">Đơn hàng / Cập nhật</p>
      <div className="bg-white rounded-lg mt-10 p-6 shadow-md flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-5">
          <p className="font-extrabold">Thông tin đơn hàng</p>
          <div className="px-6 flex flex-col gap-y-5">
            <div className="flex flex-row justify-between gap-x-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Mã đơn hàng
                </p>
                <input
                  value={orderWithDetails._id || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm disabled:cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Tên khách hàng
                </p>
                <input
                  value={orderWithDetails?.user?.fullName || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm disabled:cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">Trạng thái</p>
                {status !== ORDER_STATUS.SHIPPED &&
                status !== ORDER_STATUS.CANCELLED ? (
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0A0A0A] text-sm"
                  >
                    {orderStatusValues.map((value, index) => (
                      <option
                        key={index}
                        value={value}
                        disabled={
                          index < getCurrentStatus(status) ||
                          (isCanCancel() && value === ORDER_STATUS.CANCELLED)
                        }
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={status}
                    className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm disabled:cursor-not-allowed"
                    disabled
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row justify-between gap-x-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Phương thức thanh toán
                </p>
                <input
                  value={orderWithDetails?.paymentDetails?.paymentMethod || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm disabled:cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Trạng thái thanh toán
                </p>
                {orderWithDetails?.paymentDetails?.paymentMethod === "MOMO" ? (
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0A0A0A] text-sm"
                    disabled={
                      (status !== ORDER_STATUS.CANCELLED &&
                        paymentStatus === PAYMENT_STATUS.PAID) ||
                      status === ORDER_STATUS.CANCELLED
                    }
                  >
                    {Object.values(PAYMENT_STATUS).map((value, index) => (
                      <option
                        key={index}
                        value={value}
                        disabled={
                          status === ORDER_STATUS.CANCELLED
                            ? value !== PAYMENT_STATUS.REFUNDED
                            : false
                        }
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0A0A0A] text-sm"
                    disabled={
                      // (status !== ORDER_STATUS.CANCELLED &&
                      //   orderWithDetails?.paymentDetails?.paymentMethod ===
                      //     "COD") ||
                      status !== ORDER_STATUS.SHIPPED
                    }
                  >
                    {Object.values(PAYMENT_STATUS).map((value, index) => (
                      <option
                        key={index}
                        value={value}
                        disabled={
                          status === ORDER_STATUS.SHIPPED
                            ? value !== PAYMENT_STATUS.PAID
                            : status === ORDER_STATUS.CANCELLED
                            ? value !== PAYMENT_STATUS.UNPAID
                            : false
                        }
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">Tổng tiền</p>
                <input
                  value={`${formatToVND(orderWithDetails.total)}` || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm disabled:cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-row justify-between gap-x-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">Ngày tạo</p>
                <input
                  value={formatDate(orderWithDetails.createdDate) || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm disabled:cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Ngày giao hàng dự kiến
                </p>
                <input
                  type="date"
                  value={newDeliveryDate}
                  onChange={(e) => {
                    setNewDeliveryDate(e.target.value);
                  }}
                  disabled={
                    status === ORDER_STATUS.SHIPPED ||
                    status === ORDER_STATUS.CANCELLED
                  }
                  className={`w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent ${
                    status === ORDER_STATUS.SHIPPED ||
                    status === ORDER_STATUS.CANCELLED
                      ? "text-[#808191]"
                      : "text-[#0A0A0A]"
                  } text-sm`}
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Địa chỉ hiện tại
                </p>
                <input
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  disabled={
                    status === ORDER_STATUS.SHIPPED ||
                    status === ORDER_STATUS.CANCELLED
                  }
                  className={`w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent ${
                    status === ORDER_STATUS.SHIPPED ||
                    status === ORDER_STATUS.CANCELLED
                      ? "text-[#808191]"
                      : "text-[#0A0A0A]"
                  } text-sm`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <p className="font-extrabold">Chi tiết đơn hàng</p>
          <div className="px-6">
            <Table hoverable>
              <Table.Head className="normal-case text-base">
                <Table.HeadCell>Tên sản phẩm</Table.HeadCell>
                <Table.HeadCell>Danh mục</Table.HeadCell>
                <Table.HeadCell>Kích cỡ</Table.HeadCell>
                <Table.HeadCell>Màu sắc</Table.HeadCell>
                <Table.HeadCell>Đơn giá</Table.HeadCell>
                <Table.HeadCell>Số lượng</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {itemDetails.map((item) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item.product._id}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {item.product.name}
                    </Table.Cell>
                    <Table.Cell>{item.category.name}</Table.Cell>
                    <Table.Cell>{item.size.size}</Table.Cell>
                    <Table.Cell>{item.color.color}</Table.Cell>
                    <Table.Cell>{formatToVND(item.product.price)}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex gap-x-5 mt-10 items-center">
        <Link to={"/admin/orders"}>
          <button className="px-6 py-2 rounded-lg bg-[#0A0A0A] text-white font-extrabold">
            Quay về
          </button>
        </Link>
        <button
          className="px-6 py-2 rounded-lg bg-[#0A0A0A] disabled:bg-[#4A4A4A] disabled:cursor-not-allowed text-white font-extrabold"
          onClick={handleUpdateOrder}
          disabled={
            // status === ORDER_STATUS.SHIPPED ||
            // status === ORDER_STATUS.CANCELLED ||
            !isChanged()
          }
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
