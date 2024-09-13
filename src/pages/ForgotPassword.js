function ForgotPassword() {
  return (
    <div className="px-40 items-center h-screen flex gap-x-10">
      <div className="flex-1">
        <p className="font-semibold text-3xl">Forgot Password?</p>
        <p className="mt-2">Don't worry. We'll sent you reset instructions.</p>
        <div className="mt-8">
          <p className="font-medium text-base">Email *</p>
          <input
            className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
            placeholder="Enter your email"
          ></input>
        </div>
        <button className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-8 text-white font-semibold text-lg">
          Submit
        </button>
        <p className="mt-6 text-center">
          Remember password?{" "}
          <a href="#">
            <u>Sign In</u>
          </a>
        </p>
      </div>
      <div className="flex-1">
        <img
          className="object-contain w-full h-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
          src={require("../assets/images/products/women/jackets/baddie_jacket_1.jpg")}
        ></img>
      </div>
    </div>
  );
}

export default ForgotPassword;
