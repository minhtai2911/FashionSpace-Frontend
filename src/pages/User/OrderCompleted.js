import Banner from "../../components/Banner";

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
};

function OrderCompleted() {
  return (
    <div>
      <Banner
        title={"Order Completed"}
        route={"Home / Checkout / Order Completed"}
      />
      <div className="flex flex-col px-40 py-20 justify-center gap-y-10">
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
        <table className="mb-4 w-full">
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderCompleted;
