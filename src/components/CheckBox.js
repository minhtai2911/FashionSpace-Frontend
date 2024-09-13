import React, { useState } from "react";
import Checked from "../assets/icons/checked_checkbox.svg";
import Unchecked from "../assets/icons/unchecked_checkbox.svg";

function CheckBox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div
      className="cursor-pointer inline-block w-6 h-6"
      onClick={handleCheckboxChange}
    >
      {isChecked ? (
        <img src={Checked} alt="Checked" />
      ) : (
        <img src={Unchecked} alt="Unchecked" />
      )}
    </div>
  );
}

export default CheckBox;
