import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  const exampleOrders = [
    {
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
          quantity: 4,
          imageUrl: "https://picsum.photos/200/300?random=1",
        },
        {
          productId: "product2",
          name: "Mini Skirt",
          color: "Black",
          size: "XL",
          quantity: 1,
          imageUrl: "https://picsum.photos/200/300?random=2",
        },
        {
          productId: "product3",
          name: "Mini Skirt",
          color: "Black",
          size: "XL",
          quantity: 2,
          imageUrl: "https://picsum.photos/200/300?random=3",
        },
        {
          productId: "product4",
          name: "Mini Skirt",
          color: "Black",
          size: "XL",
          quantity: 3,
          imageUrl: "https://picsum.photos/200/300?random=4",
        },
      ],
    },
    {
      _id: "order2",
      orderId: "AFS1240",
      paymentMethod: "Credit Card",
      totalPayment: 500.0,
      deliveryDate: "15 Sep 2024",
      status: "Shipped",
      items: [
        {
          productId: "product5",
          name: "Leather Jacket",
          color: "Brown",
          size: "M",
          quantity: 1,
          imageUrl: "https://picsum.photos/200/300?random=5",
        },
      ],
    },
  ];

  useEffect(() => {
    // const fetchOrders = async () => {
    //   try {
    //     const response = await api.get(`/orders/user/${user._id}`);
    //     setOrders(response.data);
    //   } catch (error) {
    //     console.error("Error fetching orders:", error);
    //   }
    // };

    // fetchOrders();
    setOrders(exampleOrders);
  }, [user]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-green-100 text-green-600 border border-green-500";
      case "Accepted":
        return "bg-blue-100 text-blue-600 border border-blue-500";
      case "Pending":
        return "bg-yellow-100 text-yellow-600 border border-yellow-500";
      case "In Progress":
        return "bg-orange-100 text-orange-600 border border-orange-500";
      case "Placed":
        return "bg-gray-100 text-gray-600 border border-gray-500";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-500";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orders: {orders.length}</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <table key={order._id} className="mb-4 w-full">
            <tr className="bg-[#0A0A0A]">
              <td className="py-2 px-4 text-white rounded-tl-lg w-[25%]">
                Order ID
                <br />
                {order.orderId}
              </td>
              <td className="p-2 text-white w-[25%]">
                Payment Method
                <br />
                {order.paymentMethod}
              </td>
              <td className="p-2 text-white w-[25%]">
                Total Payment
                <br />${order.totalPayment.toFixed(2)}
              </td>
              <td className="py-2 px-4 text-white rounded-tr-lg w-[25%]">
                Estimated Delivery Date
                <br />
                {order.deliveryDate}
              </td>
            </tr>
            <tbody className="border-l border-r border-b">
              <tr className="space-y-4 border-b p-4 mb-4">
                <td colSpan={4}>
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="px-4 py-2 flex items-center"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 mr-4"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="font-light">
                          Color: {item.color} | Size: {item.size} | Quantity:{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </td>
              </tr>

              <tr className="font-medium">
                <div className="p-2">
                  Order Status:{" "}
                  <p
                    className={`inline-block px-4 py-2 rounded ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </p>
                </div>
              </tr>

              <tr className="w-full">
                <td className="space-x-2 p-2 w-full" colSpan={4}>
                  {order.status === "Shipped" ? (
                    <button className="bg-black text-white px-4 py-2 rounded-md">
                      Add Review
                    </button>
                  ) : (
                    <>
                      <button className="bg-black text-white px-4 py-2 rounded-md">
                        Track Order
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                        Cancel Order
                      </button>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
