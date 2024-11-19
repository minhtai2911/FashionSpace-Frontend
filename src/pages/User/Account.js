import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import Banner from "../../components/Banner";
import PersonalInformation from "../PersonalInformation";
import PasswordManager from "../PasswordManager";
import MyOrders from "./MyOrders";

function Account() {
  const { user, setUser } = useContext(AuthContext);
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
                className={`rounded-lg py-3 px-6 text-left font-bold ${
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
