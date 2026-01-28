import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import subCategoryReducer from "./slices/subCategorySlice";
import materialReducer from "./slices/materialSlice";
import vendorReducer from "./slices/vendorSlice";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    subCategories: subCategoryReducer,
    materials: materialReducer,
    vendors: vendorReducer,
    users: userReducer,
    bookings: bookingReducer,
    transactions: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
