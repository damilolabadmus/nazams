import { createContext, useReducer } from "react";

export const Context = createContext();
const initState = {
  user: {},
  userId: null,
  address: null,
  guestUser: false,
  coupons: null,
  notification: true,
  location: {},
  expoPushToken: "",
  track: "first",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE": {
      return {
        ...state,
        user: action.payload.values,
        userId: action.payload.id,
      };
    }

    case "expoPushToken": {
      return { ...state, expoPushToken: action.payload };
    }
    case "TRACK_DATA": {
      return { ...state, track: action.payload };
    }
    case "LOCATION_START": {
      return { ...state, location: action.payload };
    }
    case "LOCATION_END": {
      return { ...state, location: {} };
    }
    case "DELETE_USER": {
      return { ...state, user: {}, userId: null };
    }
    case "SET_LOCATION": {
      return { ...state, address: action.payload };
    }
    case "SET_NOTIFY": {
      return { ...state, notification: action.payload };
    }
    case "GUEST_USER": {
      return { ...state, guestUser: true };
    }
    case "REMOVE_GUEST_USER": {
      return { ...state, guestUser: false };
    }
    case "COUPON_CODE": {
      return { ...state, coupons: action.payload };
    }
  }
};

export const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
