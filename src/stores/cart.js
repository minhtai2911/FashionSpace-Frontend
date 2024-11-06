import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: localStorage.getItem("carts")
    ? JSON.parse(localStorage.getItem("carts"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, name, price, quantity, size, color, image } =
        action.payload;
      const indexProductId = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
      );
      if (indexProductId >= 0) {
        state.items[indexProductId].quantity += quantity;
      } else {
        state.items.push({
          productId,
          name,
          price,
          quantity,
          size,
          color,
          image,
        });
      }
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
    changeQuantity(state, action) {
      const { productId, quantity, size, color } = action.payload;
      const indexProductId = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
      );
      if (quantity > 0) {
        state.items[indexProductId].quantity = quantity;
      }
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
    removeItem(state, action) {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.productId !== productId ||
          item.size !== size ||
          item.color !== color
      );
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
  },
});

export const { addToCart, changeQuantity, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
