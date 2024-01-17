import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./auth";

// import * as SecureStore from "expo-secure-store";
// import storage from "redux-persist/lib/storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import {
//   persistReducer,
//   persistStore,
//   autoRehydrate,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import createSecureStore from "redux-persist-expo-securestore";
// const storage = createSecureStore();

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };
const rootReducer = combineReducers({
  auth: authReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: rootReducer,
  // devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/setUser"],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "payload.values.date",
          "payload.values",
          "payload.date",
        ],
        // Ignore these paths in the state
        ignoredPaths: ["auth.date"],
      },
    }),
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

// export const persistor = persistStore(store);

export default store;
