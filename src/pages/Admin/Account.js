import { useState, useContext } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import PersonalInformation from "../PersonalInformation";
import PasswordManager from "../PasswordManager";

export default function AdminAccount() {
  const user = JSON.parse(Cookies.get("user"));
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Thông tin cá nhân" },
    { id: "password", label: "Quản lý mật khẩu" },
  ];

  return (
    <div className="p-10 w-full">
      <p className="font-extrabold text-xl">Tài khoản</p>
      <div className="bg-white rounded-lg mt-10 p-6 shadow-md flex flex-col gap-y-5">
        <div className="flex flex-row gap-x-20 mt-10">
          <div className="flex flex-col gap-y-5 ">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`rounded-lg py-3 px-6 font-bold text-left ${
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
            {activeTab === "password" && <PasswordManager />}
          </div>
        </div>
      </div>
    </div>
  );
}
