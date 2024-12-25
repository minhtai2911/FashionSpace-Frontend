import { useState, useEffect, useRef } from "react";
import instance from "../services/axiosConfig";
import ProductItem from "./ProductItem";
import { ORDER_STATUS } from "../utils/Constants";

const status = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.6673 2.66699H8.00065C7.29341 2.66699 6.61513 2.94794 6.11503 3.44804C5.61494 3.94814 5.33398 4.62641 5.33398 5.33366V26.667C5.33398 27.3742 5.61494 28.0525 6.11503 28.5526C6.61513 29.0527 7.29341 29.3337 8.00065 29.3337H24.0006C24.7079 29.3337 25.3862 29.0527 25.8863 28.5526C26.3864 28.0525 26.6673 27.3742 26.6673 26.667V10.667L18.6673 2.66699Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.666 2.66699V10.667H26.666"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21.3327 17.333H10.666"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21.3327 22.667H10.666"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.3327 12H11.9993H10.666"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    status: ORDER_STATUS.PENDING,
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.333 5.33301H23.9997C24.7069 5.33301 25.3852 5.61396 25.8853 6.11406C26.3854 6.61415 26.6663 7.29243 26.6663 7.99967V26.6663C26.6663 27.3736 26.3854 28.0519 25.8853 28.552C25.3852 29.0521 24.7069 29.333 23.9997 29.333H7.99967C7.29243 29.333 6.61415 29.0521 6.11406 28.552C5.61396 28.0519 5.33301 27.3736 5.33301 26.6663V7.99967C5.33301 7.29243 5.61396 6.61415 6.11406 6.11406C6.61415 5.61396 7.29243 5.33301 7.99967 5.33301H10.6663"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20.0003 2.66699H12.0003C11.2639 2.66699 10.667 3.26395 10.667 4.00033V6.66699C10.667 7.40337 11.2639 8.00033 12.0003 8.00033H20.0003C20.7367 8.00033 21.3337 7.40337 21.3337 6.66699V4.00033C21.3337 3.26395 20.7367 2.66699 20.0003 2.66699Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20 16L14.5 21.5L12 19"
          stroke="#0A0A0A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    status: ORDER_STATUS.ACCEPTED,
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.2809 21.1868C27.4326 23.1927 26.1059 24.9604 24.4167 26.3352C22.7275 27.71 20.7272 28.65 18.5908 29.0731C16.4543 29.4963 14.2468 29.3896 12.1611 28.7625C10.0754 28.1354 8.17503 27.0069 6.62622 25.4756C5.07741 23.9444 3.92728 22.0571 3.27638 19.9787C2.62547 17.9003 2.49361 15.6941 2.89233 13.5529C3.29104 11.4118 4.20819 9.40094 5.56359 7.69614C6.91899 5.99135 8.67137 4.64453 10.6675 3.77344"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M29.3333 16.0003C29.3333 14.2494 28.9885 12.5156 28.3184 10.8979C27.6483 9.2802 26.6662 7.81035 25.4281 6.57223C24.19 5.33412 22.7201 4.35199 21.1024 3.68193C19.4848 3.01187 17.751 2.66699 16 2.66699V16.0003H29.3333Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    status: ORDER_STATUS.PROCESSING,
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.333 4H1.33301V21.3333H21.333V4Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21.333 10.667H26.6663L30.6663 14.667V21.3337H21.333V10.667Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.33333 27.9997C9.17428 27.9997 10.6667 26.5073 10.6667 24.6663C10.6667 22.8254 9.17428 21.333 7.33333 21.333C5.49238 21.333 4 22.8254 4 24.6663C4 26.5073 5.49238 27.9997 7.33333 27.9997Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M24.6663 27.9997C26.5073 27.9997 27.9997 26.5073 27.9997 24.6663C27.9997 22.8254 26.5073 21.333 24.6663 21.333C22.8254 21.333 21.333 22.8254 21.333 24.6663C21.333 26.5073 22.8254 27.9997 24.6663 27.9997Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    status: ORDER_STATUS.IN_DELIVERY,
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 12.5333L10 5.61328"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M28 21.3329V10.6662C27.9995 10.1986 27.8761 9.73929 27.6421 9.33443C27.408 8.92956 27.0717 8.59336 26.6667 8.35954L17.3333 3.02621C16.9279 2.79216 16.4681 2.66895 16 2.66895C15.5319 2.66895 15.0721 2.79216 14.6667 3.02621L5.33333 8.35954C4.92835 8.59336 4.59197 8.92956 4.35795 9.33443C4.12392 9.73929 4.00048 10.1986 4 10.6662V21.3329C4.00048 21.8005 4.12392 22.2598 4.35795 22.6647C4.59197 23.0695 4.92835 23.4057 5.33333 23.6395L14.6667 28.9729C15.0721 29.2069 15.5319 29.3301 16 29.3301C16.4681 29.3301 16.9279 29.2069 17.3333 28.9729L26.6667 23.6395C27.0717 23.4057 27.408 23.0695 27.6421 22.6647C27.8761 22.2598 27.9995 21.8005 28 21.3329Z"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.35938 9.28027L15.9994 16.0136L27.6394 9.28027"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16 29.44V16"
          stroke="#0A0A0A"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    status: ORDER_STATUS.SHIPPED,
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào, tôi là trợ lí ảo FashionBot. Tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [content, setContent] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (content.trim() === "") return;

    const userMessage = { sender: "user", text: content };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setContent("");

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    try {
      const response = await instance.post("/chatbot", { message: content });
      console.log(response);
      const botMessage = {
        sender: "bot",
        text: response.data.message,
        results: response.data.data,
        type: response.data.type,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Xin lỗi, tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại.",
        },
      ]);

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      <button
        onClick={toggleChat}
        style={{
          boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.5)",
        }}
        className="fixed bottom-5 z-20 right-5 bg-[#0A0A0A] text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 0L93.3013 75H6.69873L50 0Z" fill="white" />
          <path
            d="M50 100L6.78568 75L6.69872 25L50 -2.38419e-06L93.3013 25L93.2143 75L50 100Z"
            fill="white"
          />
          <path
            d="M50 96.4285L10.0803 73.3928L10 27.3213L50 4.28561L90 27.3213L89.9196 73.3928L50 96.4285Z"
            fill="#0A0A0A"
          />
          <path
            d="M50 92.8572L12.9317 71.4286L12.8571 28.5715L49.9999 7.14289L87.1428 28.5715L87.0682 71.4286L50 92.8572Z"
            fill="white"
          />
          <path
            d="M25.3785 65V61.7773L28.7057 61.1496V38.4026L25.3785 37.7748V34.5312H49.0671V42.4414H44.9655L44.6307 38.6119H33.9792V47.9032H44.8399V51.9838H33.9792V61.1496L37.3065 61.7773V65H25.3785ZM63.6109 65.4395C61.5322 65.4395 59.6 65.1814 57.8143 64.6652C56.0286 64.149 54.2917 63.291 52.6036 62.0912V55.0809H56.6843L57.3539 59.6219C58.0933 60.1521 59.0001 60.5776 60.0743 60.8984C61.1625 61.2193 62.3413 61.3797 63.6109 61.3797C64.8525 61.3797 65.8918 61.2054 66.7289 60.8566C67.5799 60.4939 68.2286 59.9916 68.675 59.3499C69.1215 58.7081 69.3447 57.9478 69.3447 57.0689C69.3447 56.2598 69.1494 55.5413 68.7588 54.9135C68.3681 54.2857 67.7194 53.7277 66.8126 53.2394C65.9058 52.7372 64.6781 52.2768 63.1296 51.8583C60.8556 51.2444 58.9513 50.519 57.4167 49.6819C55.896 48.8449 54.7451 47.8404 53.9638 46.6685C53.1965 45.4967 52.8129 44.1155 52.8129 42.5251C52.8129 40.8929 53.2523 39.4489 54.1312 38.1934C55.0241 36.9378 56.2588 35.9473 57.8352 35.2218C59.4117 34.4964 61.2322 34.1267 63.297 34.1127C65.557 34.0848 67.552 34.3778 69.2819 34.9916C71.0258 35.6055 72.4976 36.4076 73.6974 37.3982V43.9481H69.7004L68.9471 39.6791C68.3751 39.2746 67.6287 38.9328 66.708 38.6537C65.8012 38.3608 64.7269 38.2143 63.4853 38.2143C62.425 38.2143 61.4903 38.3887 60.6812 38.7374C59.872 39.0862 59.2373 39.5815 58.7769 40.2232C58.3165 40.851 58.0863 41.6044 58.0863 42.4833C58.0863 43.2506 58.2886 43.9202 58.6932 44.4922C59.0978 45.0642 59.7744 45.5873 60.723 46.0617C61.6717 46.522 62.9552 46.9894 64.5735 47.4637C67.8798 48.3426 70.384 49.5564 72.086 51.1049C73.7881 52.6535 74.6391 54.6275 74.6391 57.0271C74.6391 58.7151 74.1787 60.1939 73.2579 61.4634C72.3511 62.719 71.0676 63.6956 69.4075 64.3931C67.7613 65.0907 65.8291 65.4395 63.6109 65.4395Z"
            fill="#0A0A0A"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg flex flex-col z-20">
          <div className="flex justify-between items-center p-2 border-b border-gray-200">
            <div className="flex gap-x-1 items-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M50 0L93.3013 75H6.69873L50 0Z" fill="#0A0A0A" />
                <path
                  d="M50 100L6.78568 75L6.69872 25L50 -2.38419e-06L93.3013 25L93.2143 75L50 100Z"
                  fill="#0A0A0A"
                />
                <path
                  d="M50 96.4285L10.0803 73.3928L10 27.3213L50 4.28561L90 27.3213L89.9196 73.3928L50 96.4285Z"
                  fill="white"
                />
                <path
                  d="M50 92.8572L12.9317 71.4286L12.8571 28.5715L49.9999 7.14289L87.1428 28.5715L87.0682 71.4286L50 92.8572Z"
                  fill="#0A0A0A"
                />
                <path
                  d="M25.3785 65V61.7773L28.7057 61.1496V38.4026L25.3785 37.7748V34.5312H49.0671V42.4414H44.9655L44.6307 38.6119H33.9792V47.9032H44.8399V51.9838H33.9792V61.1496L37.3065 61.7773V65H25.3785ZM63.6109 65.4395C61.5322 65.4395 59.6 65.1814 57.8143 64.6652C56.0286 64.149 54.2917 63.291 52.6036 62.0912V55.0809H56.6843L57.3539 59.6219C58.0933 60.1521 59.0001 60.5776 60.0743 60.8984C61.1625 61.2193 62.3413 61.3797 63.6109 61.3797C64.8525 61.3797 65.8918 61.2054 66.7289 60.8566C67.5799 60.4939 68.2286 59.9916 68.675 59.3499C69.1215 58.7081 69.3447 57.9478 69.3447 57.0689C69.3447 56.2598 69.1494 55.5413 68.7588 54.9135C68.3681 54.2857 67.7194 53.7277 66.8126 53.2394C65.9058 52.7372 64.6781 52.2768 63.1296 51.8583C60.8556 51.2444 58.9513 50.519 57.4167 49.6819C55.896 48.8449 54.7451 47.8404 53.9638 46.6685C53.1965 45.4967 52.8129 44.1155 52.8129 42.5251C52.8129 40.8929 53.2523 39.4489 54.1312 38.1934C55.0241 36.9378 56.2588 35.9473 57.8352 35.2218C59.4117 34.4964 61.2322 34.1267 63.297 34.1127C65.557 34.0848 67.552 34.3778 69.2819 34.9916C71.0258 35.6055 72.4976 36.4076 73.6974 37.3982V43.9481H69.7004L68.9471 39.6791C68.3751 39.2746 67.6287 38.9328 66.708 38.6537C65.8012 38.3608 64.7269 38.2143 63.4853 38.2143C62.425 38.2143 61.4903 38.3887 60.6812 38.7374C59.872 39.0862 59.2373 39.5815 58.7769 40.2232C58.3165 40.851 58.0863 41.6044 58.0863 42.4833C58.0863 43.2506 58.2886 43.9202 58.6932 44.4922C59.0978 45.0642 59.7744 45.5873 60.723 46.0617C61.6717 46.522 62.9552 46.9894 64.5735 47.4637C67.8798 48.3426 70.384 49.5564 72.086 51.1049C73.7881 52.6535 74.6391 54.6275 74.6391 57.0271C74.6391 58.7151 74.1787 60.1939 73.2579 61.4634C72.3511 62.719 71.0676 63.6956 69.4075 64.3931C67.7613 65.0907 65.8291 65.4395 63.6109 65.4395Z"
                  fill="white"
                />
              </svg>
              <p className="text-sm">Chatbot</p>
            </div>
            <button
              onClick={toggleChat}
              className="text-sm text-gray-500 hover:text-gray-800 p-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-2 shadow-inner rounded-lg">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="mb-2 flex gap-x-1 items-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M50 0L93.3013 75H6.69873L50 0Z" fill="#0A0A0A" />
                      <path
                        d="M50 100L6.78568 75L6.69872 25L50 -2.38419e-06L93.3013 25L93.2143 75L50 100Z"
                        fill="#0A0A0A"
                      />
                      <path
                        d="M50 96.4285L10.0803 73.3928L10 27.3213L50 4.28561L90 27.3213L89.9196 73.3928L50 96.4285Z"
                        fill="white"
                      />
                      <path
                        d="M50 92.8572L12.9317 71.4286L12.8571 28.5715L49.9999 7.14289L87.1428 28.5715L87.0682 71.4286L50 92.8572Z"
                        fill="#0A0A0A"
                      />
                      <path
                        d="M25.3785 65V61.7773L28.7057 61.1496V38.4026L25.3785 37.7748V34.5312H49.0671V42.4414H44.9655L44.6307 38.6119H33.9792V47.9032H44.8399V51.9838H33.9792V61.1496L37.3065 61.7773V65H25.3785ZM63.6109 65.4395C61.5322 65.4395 59.6 65.1814 57.8143 64.6652C56.0286 64.149 54.2917 63.291 52.6036 62.0912V55.0809H56.6843L57.3539 59.6219C58.0933 60.1521 59.0001 60.5776 60.0743 60.8984C61.1625 61.2193 62.3413 61.3797 63.6109 61.3797C64.8525 61.3797 65.8918 61.2054 66.7289 60.8566C67.5799 60.4939 68.2286 59.9916 68.675 59.3499C69.1215 58.7081 69.3447 57.9478 69.3447 57.0689C69.3447 56.2598 69.1494 55.5413 68.7588 54.9135C68.3681 54.2857 67.7194 53.7277 66.8126 53.2394C65.9058 52.7372 64.6781 52.2768 63.1296 51.8583C60.8556 51.2444 58.9513 50.519 57.4167 49.6819C55.896 48.8449 54.7451 47.8404 53.9638 46.6685C53.1965 45.4967 52.8129 44.1155 52.8129 42.5251C52.8129 40.8929 53.2523 39.4489 54.1312 38.1934C55.0241 36.9378 56.2588 35.9473 57.8352 35.2218C59.4117 34.4964 61.2322 34.1267 63.297 34.1127C65.557 34.0848 67.552 34.3778 69.2819 34.9916C71.0258 35.6055 72.4976 36.4076 73.6974 37.3982V43.9481H69.7004L68.9471 39.6791C68.3751 39.2746 67.6287 38.9328 66.708 38.6537C65.8012 38.3608 64.7269 38.2143 63.4853 38.2143C62.425 38.2143 61.4903 38.3887 60.6812 38.7374C59.872 39.0862 59.2373 39.5815 58.7769 40.2232C58.3165 40.851 58.0863 41.6044 58.0863 42.4833C58.0863 43.2506 58.2886 43.9202 58.6932 44.4922C59.0978 45.0642 59.7744 45.5873 60.723 46.0617C61.6717 46.522 62.9552 46.9894 64.5735 47.4637C67.8798 48.3426 70.384 49.5564 72.086 51.1049C73.7881 52.6535 74.6391 54.6275 74.6391 57.0271C74.6391 58.7151 74.1787 60.1939 73.2579 61.4634C72.3511 62.719 71.0676 63.6956 69.4075 64.3931C67.7613 65.0907 65.8291 65.4395 63.6109 65.4395Z"
                        fill="white"
                      />
                    </svg>
                    <p className="text-sm">FashionBot</p>
                  </div>
                )}
                <p
                  className={`inline-block p-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-[#0A0A0A] text-white"
                      : "bg-gray-200 text-black ml-8 w-5/6"
                  } `}
                >
                  {msg.text}
                </p>
                {msg.sender === "bot" &&
                  msg.results &&
                  msg.type === "Product" && (
                    <div className="ml-8 mt-3 flex flex-col gap-y-3 w-11/12">
                      {msg.results.map((result) => (
                        <ProductItem key={result._id} id={result._id} />
                      ))}
                    </div>
                  )}
                {msg.sender === "bot" &&
                  msg.results &&
                  msg.type === "OrderTracking" && (
                    <div className="ml-8 mt-3 flex flex-col gap-y-3 w-11/12">
                      {msg.results.map((result) => (
                        <ProductItem key={result._id} id={result._id} />
                      ))}
                    </div>
                  )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex pb-4 border-t pt-2 pr-2">
            <input
              type="text"
              value={content}
              ref={inputRef}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow text-sm p-2 border-none focus:outline-none focus:ring-0"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="bg-[#0A0A0A] text-white p-2 rounded-full hover:bg-[#2e2e2e] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#fff"
                class="size-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
