const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");

const hostname = "https://fashion-space.vercel.app";

const routes = [
  "/",
  "/products",
  "/login",
  "/signup",
  "/cart",
  "/checkout",
  "/orderCompleted",
  "/forgotPassword",
  "/verifyCode",
  "/account",
  "/aboutUs",
  "/contactUs",
  "/setPassword",
  "/trackOrder/:id",
  "/verify/:id",

  // --- Admin routes ---
  "/admin/dashboard",
  "/admin/products",
  "/admin/products/create",
  "/admin/products/details/:id",
  "/admin/products/update/:id",
  "/admin/categories",
  "/admin/report",
  "/admin/users",
  "/admin/orders",
  "/admin/orders/details/:id",
  "/admin/orders/update/:id",
  "/admin/reviews",
  "/admin/account",
];

function normalizeUrl(path) {
  return path.replace(/:id/g, "1");
}

(async () => {
  try {
    const sitemap = new SitemapStream({ hostname });
    const writeStream = createWriteStream("./public/sitemap.xml");
    sitemap.pipe(writeStream);

    routes.forEach((path) => {
      sitemap.write({
        url: normalizeUrl(path),
        changefreq: "weekly",
        priority: path === "/" ? 1.0 : 0.8,
      });
    });

    sitemap.end();
    await streamToPromise(sitemap);
    console.log("Sitemap generated successfully at /public/sitemap.xml");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
})();
