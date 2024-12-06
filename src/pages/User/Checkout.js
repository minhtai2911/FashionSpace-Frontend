import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import Banner from "../../components/Banner";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../../utils/Constants";
import instance from "../../services/axiosConfig";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { getProductVariantByProductIdColorIdSizeId } from "../../data/productVariant";
import { createPaymentDetail } from "../../data/paymentDetail";
import { createOrder } from "../../data/orders";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../stores/cart";

const apiUrl = "https://api.mysupership.vn";
const apiEndpointProvince = apiUrl + "/v1/partner/areas/province";
const apiEndpointDistrict = apiUrl + "/v1/partner/areas/district?province=";
const apiEndpointCommune = apiUrl + "/v1/partner/areas/commune?district=";

function Checkout() {
  const location = useLocation();
  const { orderSummary } = location.state;
  const { user, createCart } = useContext(AuthContext);
  const carts = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [phone, setPhone] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("0");
  const [selectedDistrict, setSelectedDistrict] = useState("0");
  const [selectedCommune, setSelectedCommune] = useState("0");
  const [street, setStreet] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [updatedCarts, setUpdatedCarts] = useState(carts);
  const [isOrderCreated, setIsOrderCreated] = useState(false);

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

  useEffect(() => {
    updateProvince();
  }, []);

  async function fetchData(url) {
    try {
      const response = await axios.get(url);
      return response.data.results || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async function updateProvince() {
    const provinceList = await fetchData(apiEndpointProvince);
    setProvinces(provinceList);
  }

  async function updateDistricts(idProvince) {
    const districtList = await fetchData(apiEndpointDistrict + idProvince);
    setDistricts(districtList);
  }

  async function updateCommunes(idDistrict) {
    const communeList = await fetchData(apiEndpointCommune + idDistrict);
    setCommunes(communeList);
  }

  const handleCreateOrderAddress = async () => {
    const selectedCityName = provinces.find(
      (p) => p.code === selectedProvince
    )?.name;
    const selectedDistrictName = districts.find(
      (d) => d.code === selectedDistrict
    )?.name;
    const selectedCommuneName = communes.find(
      (c) => c.code === selectedCommune
    )?.name;

    try {
      const refreshToken = Cookies.get("refreshToken");
      const response = await instance.post(
        "/auth/refreshToken",
        {
          refreshToken: refreshToken,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const accessToken = response.data.accessToken;
      const orderAddressResponse = await instance.post(
        "/orderAddress",
        {
          city: selectedCityName,
          district: selectedDistrictName,
          commune: selectedCommuneName,
          phone: phone,
          street: street,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return orderAddressResponse;
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred", {
        duration: 2000,
      });
      return error;
    }
  };

  const handleCreateOrderDetails = async (orderId) => {
    const details = orderSummary.items;
    try {
      const refreshToken = Cookies.get("refreshToken");
      const response = await instance.post(
        "/auth/refreshToken",
        {
          refreshToken: refreshToken,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const accessToken = response.data.accessToken;
      const orderDetailResponse = await Promise.all(
        details.map(async (item) => {
          const variantResponse =
            await getProductVariantByProductIdColorIdSizeId(
              item.productId,
              item.colorId,
              item.sizeId
            );
          const itemResponse = await instance.post(
            "/orderDetail",
            {
              productVariantId: variantResponse._id,
              quantity: item.quantity,
              orderId: orderId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          return itemResponse;
        })
      );
      return orderDetailResponse;
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred", {
        duration: 2000,
      });
    }
  };

  const handleCreateOrder = async (
    status,
    total,
    paymentDetailId,
    orderAddressId,
    userId
  ) => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const tokenResponse = await instance.post(
        "/auth/refreshToken",
        {
          refreshToken: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const accessToken = tokenResponse.data.accessToken;
      const response = await instance.post(
        "/order",
        {
          status,
          total,
          paymentDetailId,
          orderAddressId,
          id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred", {
        duration: 2000,
      });
      return error;
    }
  };

  const handleCreatePaymentDetail = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const tokenResponse = await instance.post(
        "/auth/refreshToken",
        {
          refreshToken: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const accessToken = tokenResponse.data.accessToken;
      const response = await instance.post(
        "/paymentDetail",
        {
          paymentMethod: paymentMethod,
          status: PAYMENT_STATUS.UNPAID,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred", {
        duration: 2000,
      });
      return error;
    }
  };

  const handleSubmit = async () => {
    if (paymentMethod === "COD") {
      try {
        const orderAddress = await handleCreateOrderAddress();
        if (orderAddress.status === 201) {
          const paymentDetail = await handleCreatePaymentDetail();
          if (paymentDetail.status === 201) {
            const order = await handleCreateOrder(
              ORDER_STATUS.PENDING,
              orderSummary.totalPrice,
              paymentDetail.data._id,
              orderAddress.data._id,
              user.id
            );
            if (order.status === 201) {
              const orderDetail = await handleCreateOrderDetails(
                order.data._id
              );
              if (orderDetail.every((response) => response.status === 201)) {
                orderSummary.items.forEach((item) => {
                  dispatch(
                    removeItem({
                      productId: item.productId,
                      colorId: item.colorId,
                      sizeId: item.sizeId,
                    })
                  );
                });

                const orderData = {
                  order: order.data,
                  paymentDetail: paymentDetail.data,
                };

                toast.success("Create order successfully", {
                  duration: 2000,
                });
                navigate("/orderCompleted", {
                  state: { orderSummary, orderData },
                });
              }
            }
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred", {
          duration: 2000,
        });
      }
    } else {
    }
  };

  useEffect(() => {
    if (isOrderCreated) {
      setUpdatedCarts(carts);
      createCart(updatedCarts);
    }
  }, [isOrderCreated]);

  return (
    <div>
      <Banner title="Checkout" route="Home / Shopping Cart / Checkout" />
      <div className="flex flex-row gap-x-20 px-40 py-20">
        <div className="flex flex-col gap-y-6 w-[800px]">
          <p className="font-medium text-2xl">Billing Details</p>
          <div>
            <p className="text-base">
              Phone <b className="text-red-500">*</b>
            </p>
            <input
              className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            ></input>
          </div>
          <div>
            <p className="text-base">
              City/Province <b className="text-red-500">*</b>
            </p>
            <select
              id="city-province"
              class="w-[100%] border rounded-lg px-3 py-2.5 mt-2 text-sm"
              name="city"
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setDistricts([]);
                setCommunes([]);
              }}
            >
              <option value="0">Select City</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-base">
              District <b className="text-red-500">*</b>
            </p>
            <select
              id="district-town"
              class="w-full border rounded-lg px-3 py-2.5 mt-2 text-sm disabled:cursor-not-allowed"
              name="district"
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={districts.length === 0}
            >
              <option value="0">Select District</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-base">
              Commune <b className="text-red-500">*</b>
            </p>
            <select
              id="ward-commune"
              class="w-full border rounded-lg px-3 py-2.5 text-sm mt-2 disabled:cursor-not-allowed"
              name="ward"
              disabled={communes.length === 0}
              onChange={(e) => setSelectedCommune(e.target.value)}
            >
              <option value="0">Select Commune</option>
              {communes.map((commune) => (
                <option key={commune.code} value={commune.code}>
                  {commune.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-base">
              Street <b className="text-red-500">*</b>
            </p>
            <input
              type="text"
              className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
              placeholder="Enter street address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            ></input>
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
                <div className="flex flex-row ml-2 items-center" key={index}>
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
            <button
              className="px-10 py-3 text-white font-medium bg-black rounded-lg w-full"
              onClick={handleSubmit}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
