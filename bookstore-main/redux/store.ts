// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import { PERSIST, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, cartReducer);
const store = configureStore({
  reducer: {
    cart: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
