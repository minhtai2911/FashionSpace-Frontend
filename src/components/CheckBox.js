import React, { useState } from "react";
import Checked from "../assets/icons/checked_checkbox.svg";
import Unchecked from "../assets/icons/unchecked_checkbox.svg";
import "../styles/CheckBox.css";

function CheckBox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="checkbox-container" onClick={handleCheckboxChange}>
      {isChecked ? (
        <img src={Checked} alt="Checked" className="checkbox-image" />
      ) : (
        <img src={Unchecked} alt="Unchecked" className="checkbox-image" />
      )}
    </div>
  );
}

export default CheckBox;
