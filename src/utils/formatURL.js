export const formatURL = (url) => {
  if (!url) return "";
  return url.replace(/\\/g, "//");
};
