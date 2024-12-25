import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import Banner from "../../components/Banner";
import { FREE_SHIPPING, SHIPPING_RATE, TAX_RATE } from "../../utils/Constants";
import { getProductById } from "../../data/products";
import { getSizeById } from "../../data/sizes";
import { getColorById } from "../../data/colors";
import { getAllImagesByProductId } from "../../data/productImages";
import { formatDate, formatToVND, formatURL } from "../../utils/format";
import { getOrderDetailsByOrderId } from "../../data/orderDetail";
import FeatureBanner from "../../components/FeatureBanner";
import { getOrderTrackingByOrderId } from "../../data/orderTracking";
import { getOrderById } from "../../data/orders";
import { getProductVariantById } from "../../data/productVariant";
import { getPaymentDetailById } from "../../data/paymentDetail";
import Error from "../Error";
import AuthContext from "../../context/AuthContext";
import Cookies from "js-cookie";

function OrderCompleted() {
  const url = window.location.href;
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const orderId = queryParams.get("orderId");

  const [orderData, setOrderData] = useState({});
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const { setHasError, auth } = useContext(AuthContext);
  const permission = Cookies.get("permission") ?? null;
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (orderId) {
        const orderData = await getOrderById(orderId);
        const items = await getOrderDetailsByOrderId(orderId);
        const fetchedItems = await Promise.all(
          items.map(async (item) => {
            const productVariant = await getProductVariantById(
              item.productVariantId
            );
            const product = await getProductById(productVariant.productId);
            const size = await getSizeById(productVariant.sizeId);
            const color = await getColorById(productVariant.colorId);
            const images = await getAllImagesByProductId(
              productVariant.productId
            );
            return {
              ...item,
              product,
              size,
              color,
              images,
            };
          })
        );

        const orderTracking = await getOrderTrackingByOrderId(orderId);
        setExpectedDeliveryDate(orderTracking[0].expectedDeliveryDate);

        const paymentDetails = await getPaymentDetailById(
          orderData.paymentDetailId
        );
        setPaymentMethod(paymentDetails.paymentMethod);

        setOrderData({ ...orderData, fetchedItems });
      } else {
        setHasError(true);
      }
    };

    fetchItemDetails();
  }, [orderId]);

  if (user && (!permission || !permission.includes("PRODUCT_DETAILS"))) {
    setHasError(true);
    return (
      <Error
        errorCode={403}
        title={"Forbidden"}
        content={"Bạn không có quyền truy cập trang này."}
      />
    );
  }

  if (!orderId) {
    return <Error />;
  }

  return (
    <div>
      <Banner
        title={"Hoàn tất đơn hàng"}
        route={"Trang chủ / Thanh toán / Hoàn tất đơn hàng"}
      />
      <div className="px-40">
        <div className="flex flex-col py-20 justify-center gap-y-10 items-center">
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
              Đơn hàng của bạn đã hoàn tất!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Cảm ơn. Đơn hàng của bạn đã được gửi về chúng tôi!
            </p>
          </div>
          <table className="mb-4 w-8/12">
            <tr>
              <td colSpan={4}>
                <div className="bg-[#0A0A0A] rounded-t-lg py-6 grid grid-cols-3 divide-x items-center">
                  <p className="text-base text-white text-center">
                    Mã đơn hàng: <br /> {orderId}
                  </p>
                  <p className="text-base text-white text-center">
                    Phương thức thanh toán <br />
                    {paymentMethod}
                  </p>
                  <p className="text-base text-white text-center">
                    Ngày giao hàng dự kiên: <br />
                    {formatDate(expectedDeliveryDate)}
                  </p>
                </div>
              </td>
            </tr>
            <tbody className="space-y-4 border-b border-r border-l mb-4">
              <tr>
                <td className="px-10 pt-4 font-medium">Chi tiết đơn hàng</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-10 pt-4">
                  <hr />
                </td>
              </tr>
              <tr>
                <td className="px-10 pt-4 font-medium">Sản phẩm</td>
                <td className="font-medium pt-4">Đơn giá</td>
                <td className="font-medium pt-4 text-center">Số lượng</td>
                <td className="font-medium pt-4 pr-10 text-right">
                  Tổng đơn giá
                </td>
              </tr>
              {orderData.fetchedItems &&
                orderData.fetchedItems.map((item) => (
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
                            Màu sắc: {item.color.color} | Kích cỡ:{" "}
                            {item.size.size}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="pt-4">{formatToVND(item.product.price)}</td>
                    <td className="pt-4 text-center">{item.quantity}</td>
                    <td className="pt-4 px-10 text-right">
                      {formatToVND(item.product.price * item.quantity)}
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
                    <label>Phí vận chuyển</label>
                    <label>{formatToVND(orderData.shippingFee)}</label>
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
                    <label>Tổng đơn hàng</label>
                    <label>{formatToVND(orderData.total)}</label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <FeatureBanner />
      </div>
    </div>
  );
}

export default OrderCompleted;
