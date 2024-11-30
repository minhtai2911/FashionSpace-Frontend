import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "flowbite-react";
import { getOrderById } from "../../data/orders";
import { getOrderDetailsByOrderId } from "../../data/orderDetail";
import { getPaymentDetailById } from "../../data/paymentDetail";
import { getUserById } from "../../data/users";
import { formatDate } from "../../utils/format";
import { getProductVariantById } from "../../data/productVariant";
import { getProductById } from "../../data/products";
import { getSizeById } from "../../data/sizes";
import { getColorById } from "../../data/colors";
import { getCategoryById } from "../../data/categories";

export default function OrderDetails() {
  const { id } = useParams();
  const [orderWithDetails, setOrderWithDetails] = useState({});
  const [itemDetails, setItemDetails] = useState([]);

  async function fetchOrders() {
    try {
      const order = await getOrderById(id);
      const user = await getUserById(order.userId);
      const paymentDetails = await getPaymentDetailById(order.paymentDetailId);
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
          const size = await getSizeById(productVariant.sizeId);
          const color = await getColorById(productVariant.colorId);
          const category = await getCategoryById(product.categoryId);

          return {
            product: product,
            size: size,
            color: color,
            category: category,
            quantity: item.quantity,
          };
        })
      );

      setOrderWithDetails(orderDetails);
      setItemDetails(detailedItems);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [id]);

  return (
    <div className="p-10 w-full">
      <p className="font-extrabold text-xl">Orders / Details</p>
      <div className="bg-white rounded-lg mt-10 p-6 shadow-md flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-5">
          <p className="font-extrabold">Order Information</p>
          <div className="px-6 flex flex-col gap-y-5">
            <div className="flex flex-row justify-between gap-x-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">Order ID</p>
                <input
                  value={orderWithDetails._id || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Customer Name
                </p>
                <input
                  value={orderWithDetails?.user?.fullName || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">Status</p>
                <input
                  value={orderWithDetails.status || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-row justify-between gap-x-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Payment Method
                </p>
                <input
                  value={orderWithDetails?.paymentDetails?.paymentMethod || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Payment Status
                </p>
                <input
                  value={orderWithDetails?.paymentDetails?.status || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">Amount</p>
                <input
                  value={`$ ${orderWithDetails.total}` || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-row justify-between gap-x-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Creation Date
                </p>
                <input
                  value={formatDate(orderWithDetails.createdDate) || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Delivery Date
                </p>
                <input
                  value={formatDate(orderWithDetails.deliveryDate) || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold text-sm">
                  Current Address
                </p>
                <input
                  value={orderWithDetails.currentAddress || ""}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <p className="font-extrabold">Order Details</p>
          <div className="px-6">
            <Table hoverable>
              <Table.Head className="normal-case text-base">
                <Table.HeadCell>Product Name</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Size</Table.HeadCell>
                <Table.HeadCell>Color</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Quantity</Table.HeadCell>
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
                    <Table.Cell>{item.product.price}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
