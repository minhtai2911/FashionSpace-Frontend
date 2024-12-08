export const formatURL = (url) => {
  if (!url) return "";
  return url.replace(/\\/g, "//");
};

export const formatDate = (date) => {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }

  return date.toLocaleDateString("en-ES");
};

export const getTime = (dateTime) => {
  const date = new Date(dateTime);
  const localTime = date.toLocaleTimeString("vi-VN");

  return localTime;
};
