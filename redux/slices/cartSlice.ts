// slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: string;
  imageUrl?: string;
  sku: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
          (item) => item.id === action.payload.id
      );

      // if (existingItem) {
      //   existingItem.quantity += 1;
      // } else {
      //   state.items.push({ ...action.payload, quantity: 1 });
      // }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(
          (item) => item.id === action.payload
      );

      // if (index !== -1) {
      //   const item = state.items[index];
      //   if (item.quantity > 1) {
      //     item.quantity -= 1;
      //   } else {
      //     state.items.splice(index, 1);
      //   }
      // }
    },

    // New action to delete entire item regardless of quantity
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Action to increment quantity
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      // if (item) {
      //   item.quantity += 1;
      // }
    },

    // Action to decrement quantity
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      // if (item && item.quantity > 1) {
      //   item.quantity -= 1;
      // }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  deleteItem,
  incrementQuantity,
  decrementQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;

// // slices/cartSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//
// interface CartItem {
//   id: number;
//   name: string;
//   price: string;
//   image?: string;
//   quantity: number;
//   sku:      string;
// }
//
//
// interface CartState {
//   items: CartItem[];
// }
//
// const initialState: CartState = {
//   items: [],
// };
//
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItem: (state, action: PayloadAction<CartItem>) => {
//       const existingItem = state.items.find(
//         (item) => item.id === action.payload.id
//       );
//
//       if (existingItem) {
//         existingItem.quantity += 1; // Increment quantity if item already exists
//       } else {
//         state.items.push({ ...action.payload, quantity: 1 });
//       }
//     },
//     removeItem: (state, action: PayloadAction<number>) => {
//       const index = state.items.findIndex(
//         (item) => item.id === action.payload
//       );
//
//       if (index !== -1) {
//         const item = state.items[index];
//
//         if (item.quantity > 1) {
//           item.quantity -= 1; // Decrement quantity if more than 1
//         } else {
//           state.items.splice(index, 1); // Remove the item if the quantity is 1
//         }
//       }
//     },
//     clearCart: (state) => {
//       state.items = [];
//     },
//   },
// });
//
// export const { addItem, removeItem, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;
