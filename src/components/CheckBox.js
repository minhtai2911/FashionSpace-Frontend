import { useState } from "react";

import Checked from "../assets/icons/checked_checkbox.svg";
import Unchecked from "../assets/icons/unchecked_checkbox.svg";

function CheckBox() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      className="cursor-pointer inline-block w-4 h-4"
      onClick={() => setIsChecked((prev) => !prev)}
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
