import Banner from "../components/Banner";

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
        <table className="border-collapse overflow-hidden w-full table-fixed">
          <thead>
            <tr className="bg-[#0A0A0A] text-white rounded-lg">
              <td className="px-4 py-4 font-medium text-center text-white rounded-tl-lg">
                Order ID: <br /> AFS1239
              </td>
              <td className="px-4 py-4 font-medium text-center text-white">
                Payment Method: <br /> COD
              </td>
              <td className="px-4 py-4 font-medium text-center text-white rounded-tr-lg">
                Estimated Delivery Date: <br /> 12 Sep, 2024
              </td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}

export default OrderCompleted;
