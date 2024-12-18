export const REVIEWS_PER_PAGE = 4;
export const PRODUCTS_PER_PAGE = 12;
export const SORT_BY = [
  {
    value: "price_asc",
    title: "Giá (Thấp đến Cao)",
  },
  {
    value: "price_desc",
    title: "Giá (Cao đến Thấp)",
  },
  {
    value: "rating_asc",
    title: "Số sao (Thấp đến Cao)",
  },
  {
    value: "rating_desc",
    title: "Số sao (Cao đến Thấp)",
  },
  {
    value: "name",
    title: "Tên",
  },
];
export const PAYMENT_METHOD = [
  {
    value: "COD",
    title: "Thanh toán khi nhận hàng",
  },
  {
    value: "MOMO",
    title: "Thanh toán với Momo",
  },
];
export const ORDER_STATUS = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã nhận đơn",
  PROCESSING: "Đang xử lý",
  IN_DELIVERY: "Đang giao",
  SHIPPED: "Đã giao",
  CANCELLED: "Đã hủy",
};
export const REVIEW_STATUS = {
  REPLIED: "Đã trả lời",
  NOT_REPLIED: "Chưa trả lời",
};
export const PAYMENT_STATUS = {
  PAID: "Đã thanh toán",
  UNPAID: "Chưa thanh toán",
  REFUNDED: "Đã hoàn tiền",
};
export const FREE_SHIPPING = 1000000;
export const SHIPPING_RATE = 0.05;
export const GENDER = [
  {
    key: "Men",
    value: "Nam",
  },
  {
    key: "Women",
    value: "Nữ",
  },
  {
    key: "Unisex",
    value: "Unisex",
  },
];
export const TAX_RATE = 0.1;
export const ROLE_NAME = [
  {
    key: "Quản trị viên",
    value: "Admin",
  },
  {
    key: "Nhân viên",
    value: "Employee",
  },
  {
    key: "Khách hàng",
    value: "Customer",
  },
];
export const REVIEW_RATING = [
  {
    key: "5 sao",
    value: 5,
  },
  {
    key: "4 sao",
    value: 4,
  },
  {
    key: "3 sao",
    value: 3,
  },
  {
    key: "2 sao",
    value: 2,
  },
  {
    key: "1 sao",
    value: 1,
  },
];
export const ADMIN_PERMISSIONS = [
  "DASHBOARD",
  "PRODUCTS",
  "COLORS",
  "SIZES",
  "CATEGORIES",
  "USERS",
  "REPORT",
  "ACCOUNT",
];
export const EMPLOYEE_PERMISSIONS = ["REVIEWS", "ORDERS", "ACCOUNT"];
export const MIN_PRICE = 0;
export const MAX_PRICE = 10000000;
export const PRICE_GAP = 100000;
