export async function fetchAllShoppingCarts() {
  const response = await fetch("http://localhost:8000/api/v1/shoppingCart", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching all shopping cart"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const shoppingCart = resData.shoppingCart;
  return shoppingCart;
}

export async function getShoppingCartById(id) {
  const response = await fetch(
    `http://localhost:8000/api/v1/shoppingCart/${id}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const error = new Error(
      `An error occurred while fetching shopping cart with id ${id}`
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const resData = await response.json();
  const shoppingCart = resData.shoppingCart;
  return shoppingCart;
}

export async function createShoppingCart({
  userId,
  productVariantId,
  quantity,
}) {
  const response = await fetch("http://localhost:8000/api/v1/shoppingCart", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productVariantId, quantity }),
  });
  if (!response.ok) {
    const error = new Error(`An error occurred while creating shopping cart`);
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const resData = await response.json();
  const shoppingCart = resData.shoppingCart;
  return shoppingCart;
}
