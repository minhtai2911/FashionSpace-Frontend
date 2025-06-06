import React, { useState } from "react";

const Size = ({ size, isSelected, onClick }) => {
  return (
    <button
      className={`inline-block px-4 py-2 border rounded-md 
                        ${
                          isSelected
                            ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                            : "bg-white text-black border-gray-300"
                        } 
                        cursor-pointer transition-all duration-300`}
      onClick={onClick}
    >
      {size}
    </button>
  );
};

export default Size;
