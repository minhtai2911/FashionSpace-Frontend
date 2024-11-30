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
