import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Banner from "../../components/Banner";
import { PAYMENT_METHOD } from "../../utils/Constants";

const apiUrl =
  "https://vietnam-administrative-division-json-server-swart.vercel.app";
const apiEndpointDistrict = apiUrl + "/district/?idProvince=";
const apiEndpointCommune = apiUrl + "/commune/?idDistrict=";

function Checkout() {
  const location = useLocation();
  const { orderSummary } = location.state;

  console.log(orderSummary);

  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("0");
  const [selectedDistrict, setSelectedDistrict] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("MOMO");

  useEffect(() => {
    if (selectedProvince !== "0") {
      updateDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict !== "0") {
      updateCommunes(selectedDistrict);
    }
  }, [selectedDistrict]);

  async function fetchData(url) {
    try {
      const response = await axios.get(url);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async function updateDistricts(idProvince) {
    const districtList = await fetchData(apiEndpointDistrict + idProvince);
    setDistricts(districtList);
  }

  async function updateCommunes(idDistrict) {
    const communeList = await fetchData(apiEndpointCommune + idDistrict);
    setCommunes(communeList);
  }

  return (
    <div>
      <Banner title="Checkout" route="Home / Shopping Cart / Checkout" />
      <div className="flex flex-row gap-x-20 px-40 py-20">
        <div className="flex flex-col gap-y-6 w-[800px]">
          <p className="font-medium text-2xl">Billing Details</p>
          <div>
            <p className="text-base">
              Full Name <b className="text-red-500">*</b>
            </p>
            <input
              className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
              placeholder="Taylor Swift"
            ></input>
          </div>
          <div>
            <p className="text-base">
              Email <b className="text-red-500">*</b>
            </p>
            <input
              type="email"
              className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
              placeholder="Enter email address"
            ></input>
          </div>
          <div>
            <p className="text-base">
              Phone <b className="text-red-500">*</b>
            </p>
            <input
              className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
              type="number"
              placeholder="Enter phone number"
            ></input>
          </div>
          <div>
            <p className="text-base">
              City/Province <b className="text-red-500">*</b>
            </p>
            <select
              id="city-province"
              class="w-[100%] border rounded px-3 py-2.5 mt-2 text-sm"
              name="city"
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setDistricts([]);
                setCommunes([]);
              }}
            >
              <option value="0">Select City</option>
              <option value="01">Thành phố Hà Nội</option>
              <option value="79">Thành phố Hồ Chí Minh</option>
              <option value="31">Thành phố Hải Phòng</option>
              <option value="48">Thành phố Đà Nẵng</option>
              <option value="92">Thành phố Cần Thơ</option>
              <option value="02">Tỉnh Hà Giang</option>
              <option value="04">Tỉnh Cao Bằng</option>
              <option value="06">Tỉnh Bắc Kạn</option>
              <option value="08">Tỉnh Tuyên Quang</option>
              <option value="10">Tỉnh Lào Cai</option>
              <option value="11">Tỉnh Điện Biên</option>
              <option value="12">Tỉnh Lai Châu</option>
              <option value="14">Tỉnh Sơn La</option>
              <option value="15">Tỉnh Yên Bái</option>
              <option value="17">Tỉnh Hoà Bình</option>
              <option value="19">Tỉnh Thái Nguyên</option>
              <option value="20">Tỉnh Lạng Sơn</option>
              <option value="22">Tỉnh Quảng Ninh</option>
              <option value="24">Tỉnh Bắc Giang</option>
              <option value="25">Tỉnh Phú Thọ</option>
              <option value="26">Tỉnh Vĩnh Phúc</option>
              <option value="27">Tỉnh Bắc Ninh</option>
              <option value="30">Tỉnh Hải Dương</option>
              <option value="33">Tỉnh Hưng Yên</option>
              <option value="34">Tỉnh Thái Bình</option>
              <option value="35">Tỉnh Hà Nam</option>
              <option value="36">Tỉnh Nam Định</option>
              <option value="37">Tỉnh Ninh Bình</option>
              <option value="38">Tỉnh Thanh Hóa</option>
              <option value="40">Tỉnh Nghệ An</option>
              <option value="42">Tỉnh Hà Tĩnh</option>
              <option value="44">Tỉnh Quảng Bình</option>
              <option value="45">Tỉnh Quảng Trị</option>
              <option value="46">Tỉnh Thừa Thiên Huế</option>
              <option value="49">Tỉnh Quảng Nam</option>
              <option value="51">Tỉnh Quảng Ngãi</option>
              <option value="52">Tỉnh Bình Định</option>
              <option value="54">Tỉnh Phú Yên</option>
              <option value="56">Tỉnh Khánh Hòa</option>
              <option value="58">Tỉnh Ninh Thuận</option>
              <option value="60">Tỉnh Bình Thuận</option>
              <option value="62">Tỉnh Kon Tum</option>
              <option value="64">Tỉnh Gia Lai</option>
              <option value="66">Tỉnh Đắk Lắk</option>
              <option value="67">Tỉnh Đắk Nông</option>
              <option value="68">Tỉnh Lâm Đồng</option>
              <option value="70">Tỉnh Bình Phước</option>
              <option value="72">Tỉnh Tây Ninh</option>
              <option value="74">Tỉnh Bình Dương</option>
              <option value="75">Tỉnh Đồng Nai</option>
              <option value="77">Tỉnh Bà Rịa - Vũng Tàu</option>
              <option value="80">Tỉnh Long An</option>
              <option value="82">Tỉnh Tiền Giang</option>
              <option value="83">Tỉnh Bến Tre</option>
              <option value="84">Tỉnh Trà Vinh</option>
              <option value="86">Tỉnh Vĩnh Long</option>
              <option value="87">Tỉnh Đồng Tháp</option>
              <option value="89">Tỉnh An Giang</option>
              <option value="91">Tỉnh Kiên Giang</option>
              <option value="93">Tỉnh Hậu Giang</option>
              <option value="94">Tỉnh Sóc Trăng</option>
              <option value="95">Tỉnh Bạc Liêu</option>
              <option value="96">Tỉnh Cà Mau</option>
            </select>
          </div>
          <div>
            <p className="text-base">District *</p>
            <select
              id="district-town"
              class="w-full border border-gray-300 rounded px-3 py-2.5 mt-2 text-sm"
              name="district"
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={districts.length === 0}
            >
              <option value="0">Select District</option>
              {districts.map((district) => (
                <option key={district.idDistrict} value={district.idDistrict}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-base">Commune *</p>
            <select
              id="ward-commune"
              class="w-full border border-gray-300 rounded px-3 py-2.5 text-sm mt-2"
              name="ward"
              disabled={communes.length === 0}
            >
              <option value="0">Select Commune</option>
              {communes.map((commune) => (
                <option key={commune.idCommune} value={commune.idCommune}>
                  {commune.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col h-fit gap-y-10">
          <div className="flex-1 border border-[#818181] rounded-lg p-5 flex flex-col gap-y-4">
            <p className="font-bold text-xl">Order Summary</p>
            <hr className="border-[#818181]" />
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row justify-between">
                <p className="text-[#4A4A4A]">Items</p>
                <p className="font-semibold">{orderSummary.totalItems}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-[#4A4A4A]">Sub Total</p>
                <p className="font-semibold">
                  ${orderSummary.subTotal.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-[#4A4A4A]">Shipping</p>
                <p className="font-semibold">
                  ${orderSummary.shipping.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-[#4A4A4A]">Taxes</p>
                <p className="font-semibold">
                  ${orderSummary.taxes.toFixed(2)}
                </p>
              </div>
            </div>
            <hr className="border-[#818181]" />
            <div className="flex flex-row justify-between">
              <p className="text-[#4A4A4A]">Total</p>
              <p className="font-semibold">
                ${orderSummary.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex-1 border border-[#818181] rounded-lg p-5 flex flex-col gap-y-4">
            <p className="font-bold text-xl">Payment Method</p>
            <hr className="border-[#818181]" />
            <div className="flex flex-col gap-y-2">
              {PAYMENT_METHOD.map((method, index) => (
                <div className="flex flex-row ml-2" key={index}>
                  <input
                    type="radio"
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    value={method.value}
                  />
                  <label className="ml-2">{method.title}</label>
                </div>
              ))}
            </div>
            <hr className="border-[#818181]" />
            <Link to="/order-completed">
              <button className="px-10 py-3 text-white font-medium bg-black rounded-lg w-full">
                Continue to Payment
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
