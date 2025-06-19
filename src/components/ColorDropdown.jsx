import GenericDropdown from "./GenericDropdown";

export default function ColorDropdown({ value, onChange, colors = [] }) {
  const COLORS = colors.length > 0 ? colors : ["red", "blue", "green"];

  // Transform colors array into options format
  const colorOptions = COLORS.map((color) => ({
    value: color,
    name: color,
    color: color,
  }));

  const renderColorOption = (option) => (
    <div className="flex items-center gap-2">
      <span
        className="h-4 w-4 rounded-full border border-gray-300"
        style={{ backgroundColor: option.color }}
      ></span>
      <span className="font-medium font-manrope text-sm capitalize">
        {option.name}
      </span>
    </div>
  );

  const renderSelectedColor = (option) => (
    <div className="flex items-center gap-2">
      <span
        className="h-4 w-4 rounded-full border border-gray-300"
        style={{ backgroundColor: option.color }}
      ></span>
      <span className="capitalize">{option.name}</span>
    </div>
  );

  return (
    <GenericDropdown
      value={value}
      onChange={(colorValue, option) => onChange && onChange(colorValue)}
      options={colorOptions}
      placeholder="Chọn màu sắc"
      displayKey="name"
      valueKey="value"
      renderOption={renderColorOption}
      renderSelected={renderSelectedColor}
      emptyMessage="Không có màu sắc nào"
    />
  );
}
