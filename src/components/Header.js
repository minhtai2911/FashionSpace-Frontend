function Header() {
  return (
    <header className="bg-white px-12 py-5 shadow-md min-w-full">
      <div className="mx-auto flex justify-between items-center">
        <div className="brand flex items-center space-x-4">
          <a href="/" className="flex items-center space-x-4">
            <img
              src="{{ asset('storage/black-logo.png') }}"
              alt="Logo"
              className="h-10"
            />
            <span className="font-bold text-xl tracking-wide">
              FASHION SPACE
            </span>
          </a>
        </div>
        <nav className="flex justify-between items-center align-middle mb-2 w-[38%]">
          <a
            href="/home"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            Home
          </a>
          <a
            href="/products"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            Shop
          </a>
          <a
            href="/about"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-[#413e3e] hover:text-red-600 font-semibold relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-red-600 before:transition-all before:duration-300 before:-bottom-1 before:left-1/2 before:transform before:translate-x-[-50%] hover:before:w-full"
          >
            Contact Us
          </a>
        </nav>
        <div className="flex items-center space-x-4 justify-between w-40">
          <a id="search" className="hover:text-gray-600 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g data-name="Layer 2">
                <g data-name="search">
                  <rect width="24" height="24" opacity="0" />
                  <path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" />
                </g>
              </g>
            </svg>
          </a>
          <a href="/cart" className="hover:text-gray-600 relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g data-name="Layer 2">
                <g data-name="shopping-cart">
                  <rect width="24" height="24" opacity="0" />
                  <path d="M21.08 7a2 2 0 0 0-1.7-1H6.58L6 3.74A1 1 0 0 0 5 3H3a1 1 0 0 0 0 2h1.24L7 15.26A1 1 0 0 0 8 16h9a1 1 0 0 0 .89-.55l3.28-6.56A2 2 0 0 0 21.08 7zm-4.7 7H8.76L7.13 8h12.25z" />
                  <circle cx="7.5" cy="19.5" r="1.5" />
                  <circle cx="17.5" cy="19.5" r="1.5" />
                </g>
              </g>
            </svg>
            <span
              className="absolute top-[-10px] right-[-10px] inline-block w-[1.17rem] h-[1.18rem] bg-red-600 text-white text-[0.55em] font-bold rounded-full text-center"
              id="cart-count"
            >
              {0}
            </span>
          </a>

          <a href="/login " className="hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g data-name="Layer 2">
                <g data-name="person">
                  <rect width="24" height="24" opacity="0" />
                  <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
                  <path d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z" />
                </g>
              </g>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
