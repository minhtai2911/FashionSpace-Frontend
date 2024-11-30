import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  items: Cookies.get("carts") ? JSON.parse(Cookies.get("carts")) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, quantity, sizeId, colorId } = action.payload;
      const indexProductId = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.sizeId === sizeId &&
          item.colorId === colorId
      );
      if (indexProductId >= 0) {
        state.items[indexProductId].quantity += quantity;
      } else {
        state.items.push({
          productId,
          quantity,
          sizeId,
          colorId,
        });
      }
      Cookies.set("carts", JSON.stringify(state.items));
    },
    mergeCart(state, action) {
      const guestCart = action.payload;
      guestCart.forEach((item) => {
        const indexProductId = state.items.findIndex(
          (cartItem) =>
            cartItem.productId === item.productId &&
            cartItem.sizeId === item.sizeId &&
            cartItem.colorId === item.colorId
        );
        if (indexProductId >= 0) {
          state.items[indexProductId].quantity += item.quantity;
        } else {
          state.items.push(item);
        }
      });
      Cookies.set("carts", JSON.stringify(state.items));
    },
    changeQuantity(state, action) {
      const { productId, quantity, sizeId, colorId } = action.payload;
      const indexProductId = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.sizeId === sizeId &&
          item.colorId === colorId
      );
      if (quantity > 0) {
        state.items[indexProductId].quantity = quantity;
      }
      Cookies.set("carts", JSON.stringify(state.items));
    },
    removeItem(state, action) {
      const { productId, sizeId, colorId } = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.productId !== productId ||
          item.sizeId !== sizeId ||
          item.colorId !== colorId
      );
      Cookies.set("carts", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      Cookies.set("carts", JSON.stringify(state.items));
    },
  },
});

export const { addToCart, mergeCart, changeQuantity, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
