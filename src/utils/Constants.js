export const REVIEWS_PER_PAGE = 4;
export const PRODUCTS_PER_PAGE = 12;
export const SORT_BY = [
  {
    value: "price_asc",
    title: "Price (Low to High)",
  },
  {
    value: "price_desc",
    title: "Price (High to Low)",
  },
  {
    value: "rating_asc",
    title: "Rating (Low to High)",
  },
  {
    value: "rating_desc",
    title: "Rating (High to Low)",
  },
  {
    value: "name",
    title: "Name",
  },
];
export const PAYMENT_METHOD = [
  {
    value: "COD",
    title: "Cash on Delivery",
  },
  {
    value: "MOMO",
    title: "Checkout with Momo",
  },
];
export const ORDER_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  PROCESSING: "Processing",
  IN_DELIVERY: "In Delivery",
  SHIPPED: "Shipped",
  CANCELLED: "Cancelled",
};
export const REVIEW_STATUS = {
  REPLIED: "Replied",
  NOT_REPLIED: "Not Replied",
};
export const PAYMENT_STATUS = {
  PAID: "Paid",
  UNPAID: "Unpaid",
  REFUNDED: "Refunded",
};
export const FREE_SHIPPING = 300;
export const SHIPPING_RATE = 0.05;
export const GENDER = [
  {
    key: "Men",
    value: "Men",
  },
  {
    key: "Women",
    value: "Women",
  },
  {
    key: "Unisex",
    value: "Unisex",
  },
];
export const TAX_RATE = 0.1;
export const ROLE_NAME = {
  EMPLOYEE: "Employee",
  ADMIN: "Admin",
  USER: "User",
};
export const ADMIN_PERMISSIONS = [
  "DASHBOARD",
  "PRODUCTS",
  "COLORS",
  "SIZES",
  "CATEGORIES",
  "USERS",
  "ANALYSIS",
  "ACCOUNT",
];
export const EMPLOYEE_PERMISSIONS = ["REVIEWS", "ORDERS", "ACCOUNT"];
