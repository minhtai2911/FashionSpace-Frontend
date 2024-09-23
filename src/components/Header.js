import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="bg-white px-40 py-4 shadow-md min-w-full">
      <div className="mx-auto flex justify-between items-center">
        <div className="brand flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-4">
            <svg
              width="40"
              height="40"
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

            <span className="font-bold text-xl tracking-wide">
              FASHION SPACE
            </span>
          </Link>
        </div>
        <nav className="flex justify-between items-center align-middle w-[38%]">
          <Link
            to="/"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            Contact Us
          </Link>
        </nav>
        <div className="flex items-center space-x-4 justify-between w-40">
          <a className="hover:text-gray-600 cursor-pointer">
            <svg
              class="nav-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21.0004 20.9999L16.6504 16.6499"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
          <Link to="/cart" className="hover:text-gray-600 relative">
            <svg
              class="nav-icon"
              width="20"
              height="20"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.8337 20.9999C20.4525 20.9999 21.046 21.2458 21.4836 21.6833C21.9212 22.1209 22.167 22.7144 22.167 23.3333C22.167 23.9521 21.9212 24.5456 21.4836 24.9832C21.046 25.4208 20.4525 25.6666 19.8337 25.6666C19.2148 25.6666 18.6213 25.4208 18.1837 24.9832C17.7462 24.5456 17.5003 23.9521 17.5003 23.3333C17.5003 22.0383 18.5387 20.9999 19.8337 20.9999ZM1.16699 2.33325H4.98199L6.07866 4.66659H23.3337C23.6431 4.66659 23.9398 4.7895 24.1586 5.00829C24.3774 5.22709 24.5003 5.52383 24.5003 5.83325C24.5003 6.03159 24.442 6.22992 24.3603 6.41659L20.1837 13.9649C19.787 14.6766 19.017 15.1666 18.142 15.1666H9.45033L8.40033 17.0683L8.36533 17.2083C8.36533 17.2856 8.39605 17.3598 8.45075 17.4145C8.50545 17.4692 8.57964 17.4999 8.65699 17.4999H22.167V19.8333H8.16699C7.54815 19.8333 6.95466 19.5874 6.51708 19.1498C6.07949 18.7122 5.83366 18.1188 5.83366 17.4999C5.83366 17.0916 5.93866 16.7066 6.11366 16.3799L7.70033 13.5216L3.50033 4.66659H1.16699V2.33325ZM8.16699 20.9999C8.78583 20.9999 9.37932 21.2458 9.81691 21.6833C10.2545 22.1209 10.5003 22.7144 10.5003 23.3333C10.5003 23.9521 10.2545 24.5456 9.81691 24.9832C9.37932 25.4208 8.78583 25.6666 8.16699 25.6666C7.54815 25.6666 6.95466 25.4208 6.51708 24.9832C6.07949 24.5456 5.83366 23.9521 5.83366 23.3333C5.83366 22.0383 6.87199 20.9999 8.16699 20.9999ZM18.667 12.8333L21.9103 6.99992H7.16366L9.91699 12.8333H18.667Z"
                fill="#0A0A0A"
              />
            </svg>
            <span className="absolute left-1/2 bottom-1/2 inline-block w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full text-center leading-5">
              {0}
            </span>
          </Link>

          <Link to="/login " className="hover:text-gray-600">
            <svg
              class="nav-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
