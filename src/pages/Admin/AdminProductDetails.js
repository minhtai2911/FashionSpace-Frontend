import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../data/products";
import { getCategoryById } from "../../data/categories";
import { getColorById } from "../../data/colors";
import { getProductVariantsByProductId } from "../../data/productVariant";
import { getSizeById } from "../../data/sizes";
import { getAllImagesByProductId } from "../../data/productImages";
import { formatURL } from "../../utils/format";

export default function AdminProductDetails() {
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(id);
      setProductName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      const fetchedCategory = await getCategoryById(product.categoryId);
      setCategory(fetchedCategory.name);
      const fetchedImages = await getAllImagesByProductId(id);
      setPhotos(fetchedImages);
    };

    const fetchVariants = async () => {
      const fetchedVariants = await getProductVariantsByProductId(id);
      const variantsData = await Promise.all(
        fetchedVariants.map(async (variant) => {
          const color = await getColorById(variant.colorId);
          const size = await getSizeById(variant.sizeId);
          return { size, color, quantity: variant.quantity };
        })
      );
      setVariants(variantsData);
    };

    fetchProduct();
    fetchVariants();
  }, [id]);

  return (
    <div className="p-10 w-full">
      <p className="font-extrabold text-xl">Products / Details</p>
      <div className="bg-white rounded-lg mt-10 p-6 shadow-md flex flex-col gap-y-5">
        <p className="font-extrabold text-base">Product details</p>
        <div className="flex flex-row gap-x-10 px-10 justify-between ">
          <div className="flex flex-1 gap-2 pt-4 flex-wrap overflow-scroll rounded-lg h-fit max-h-80 justify-center items-center border-dashed border-2">
            {photos.map((photo, index) => (
              <img
                key={index}
                src={formatURL(photo.imagePath)}
                alt={`Uploaded ${index}`}
                className="object-cover w-24 rounded-lg"
              />
            ))}
          </div>
          <div className="flex-[2] flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-2">
              <p className="font-manrope font-semibold">Product name</p>
              <input
                id="productName"
                value={productName}
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                disabled
              />
            </div>
            <div className="flex flex-row gap-x-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold">Category</p>
                <input
                  id="category"
                  value={category}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                ></input>
              </div>
              <div className="flex flex-col flex-1 gap-y-2">
                <p className="font-manrope font-semibold">Price</p>
                <input
                  id="price"
                  value={price}
                  disabled
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-manrope font-semibold">Description</p>
              <textarea
                rows="4"
                placeholder="Write a brief description about product..."
                id="description"
                value={description}
                disabled
                className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm resize-none"
              />
            </div>
          </div>
        </div>
        <p className="font-extrabold text-base">Variants</p>
        {variants.map((variant, index) => (
          <main key={index} className="relative mb-2">
            <div className="flex gap-x-10 px-10">
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="font-manrope font-semibold">Size</p>
                <input
                  id="size"
                  value={variant?.size?.size}
                  className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                  disabled
                />
              </div>
              <div className="flex-[2] flex flex-row gap-x-10">
                <div className="flex flex-col gap-y-2 flex-1">
                  <p className="font-manrope font-semibold">Color</p>
                  <input
                    id="color"
                    value={variant?.color?.color}
                    className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                    disabled
                  />
                </div>
                <div className="flex flex-col flex-1 gap-y-2">
                  <p className="font-manrope font-semibold">Quantity</p>
                  <input
                    id="quantity"
                    value={variant?.quantity}
                    className="w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#808191] text-sm"
                    disabled
                  />
                </div>
              </div>
            </div>
          </main>
        ))}
      </div>
    </div>
  );
}
