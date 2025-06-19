import GenericDropdown from "./GenericDropdown";

export default function CategoryDropdown({ value, onChange, categories = [] }) {
  const renderCategoryOption = (option) => (
    <div className="flex flex-col">
      <span className="font-medium font-manrope text-sm">{option.name}</span>
      <span className="text-xs text-gray-500">[{option.gender}]</span>
    </div>
  );

  const renderSelectedCategory = (option) => (
    <span>
      {option.name} [{option.gender}]
    </span>
  );

  return (
    <GenericDropdown
      value={value}
      onChange={(categoryId, option) => onChange && onChange(categoryId)}
      options={categories}
      placeholder="Chọn danh mục"
      displayKey="name"
      valueKey="_id"
      renderOption={renderCategoryOption}
      renderSelected={renderSelectedCategory}
      emptyMessage="Không có danh mục nào"
    />
  );
}
