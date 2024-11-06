import { useContext, useState, useRef, useEffect } from "react";
import useAxios from "../../services/useAxios";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

import Banner from "../../components/Banner";

function PersonalInformation({ user }) {
  let api = useAxios();
  const [data, setData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
    try {
      const response = await api.put(
        `/user/${user._id}`,
        {
          fullName: data.fullName,
          email: data.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("User data updated successfully");
        const updatedUser = {
          ...user,
          fullName: data.fullName,
          email: data.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setData(updatedUser);
      }
    } catch (error) {
      console.error(
        "Error updating user data:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    if (user) {
      setData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  return (
    <div className="w-[600px]">
      <div className="mb-6 relative w-24 h-24">
        <img
          src={data.avatar}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
        <button
          type="button"
          onClick={handleImageClick}
          className="p-1 rounded-full absolute -bottom-1 -right-2"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="20"
              cy="20"
              r="19"
              fill="#0A0A0A"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M28.1574 11.2336L28.6491 11.7252C29.3266 12.4036 29.2241 13.6061 28.4183 14.4111L18.2791 24.5502L14.9941 25.7519C14.5816 25.9036 14.1799 25.7069 14.0983 25.3144C14.0707 25.172 14.0837 25.0248 14.1358 24.8894L15.3608 21.5761L25.4716 11.4644C26.2774 10.6594 27.4799 10.5552 28.1574 11.2336ZM17.8366 12.2419C17.946 12.2419 18.0544 12.2634 18.1555 12.3053C18.2566 12.3472 18.3485 12.4086 18.4258 12.486C18.5032 12.5634 18.5646 12.6552 18.6065 12.7563C18.6484 12.8574 18.6699 12.9658 18.6699 13.0752C18.6699 13.1847 18.6484 13.293 18.6065 13.3941C18.5646 13.4952 18.5032 13.5871 18.4258 13.6645C18.3485 13.7419 18.2566 13.8032 18.1555 13.8451C18.0544 13.887 17.946 13.9086 17.8366 13.9086H14.5033C14.0612 13.9086 13.6373 14.0842 13.3247 14.3967C13.0122 14.7093 12.8366 15.1332 12.8366 15.5752V25.5752C12.8366 26.0173 13.0122 26.4412 13.3247 26.7537C13.6373 27.0663 14.0612 27.2419 14.5033 27.2419H24.5033C24.9453 27.2419 25.3692 27.0663 25.6818 26.7537C25.9943 26.4412 26.1699 26.0173 26.1699 25.5752V22.2419C26.1699 22.0209 26.2577 21.8089 26.414 21.6526C26.5703 21.4964 26.7822 21.4086 27.0033 21.4086C27.2243 21.4086 27.4362 21.4964 27.5925 21.6526C27.7488 21.8089 27.8366 22.0209 27.8366 22.2419V25.5752C27.8366 26.4593 27.4854 27.3071 26.8603 27.9322C26.2352 28.5574 25.3873 28.9086 24.5033 28.9086H14.5033C13.6192 28.9086 12.7714 28.5574 12.1462 27.9322C11.5211 27.3071 11.1699 26.4593 11.1699 25.5752V15.5752C11.1699 14.6912 11.5211 13.8433 12.1462 13.2182C12.7714 12.5931 13.6192 12.2419 14.5033 12.2419H17.8366Z"
              fill="white"
            />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-base font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-base font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="phoneNumber"
            className="block text-base font-medium mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Update Changes
        </button>
      </form>
    </div>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const api = useAxios();

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

function PasswordManager() {
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const response = await api.put(`/user/${user._id}/update-password`, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        setSuccess("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="w-[600px]">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-base font-medium mb-1">Password *</label>
          <input
            type="password"
            className="px-5 py-3 border rounded-lg w-full"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-base font-medium mb-1">
            New Password *
          </label>
          <input
            type="password"
            className="px-5 py-3 border rounded-lg w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-base font-medium mb-1">
            Confirm New Password *
          </label>
          <input
            type="password"
            className="px-5 py-3 border rounded-lg w-full"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

function Account() {
  const { user, setUser, getUserData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "orders", label: "My Orders" },
    { id: "password", label: "Password Manager" },
  ];

  return (
    <div>
      <Banner title="My Account" route="Home / Account" />
      <div className="px-40 justify-center flex">
        <div className="flex flex-row gap-x-20 mt-10">
          <div className="flex flex-col gap-y-5 ">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`rounded-lg py-3 px-6 text-left ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100 outline outline-1 outline-[#4A4A4A]/40"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="w-[800px]">
            {activeTab === "personal" && <PersonalInformation user={user} />}
            {activeTab === "orders" && <MyOrders />}
            {activeTab === "password" && <PasswordManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
