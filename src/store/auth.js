import { createSlice } from "@reduxjs/toolkit";
function convertDate(createdAt) {
  const { seconds, nanoseconds } = createdAt;
  // Calculate the number of milliseconds since the Unix epoch
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  // Create a new Date object from the milliseconds
  return createdAt ? new Date(milliseconds) : new Date();
}
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    message: "",
    permission: null,
    notification: true,
    location: {},
    position: "",
    date: null,
    user: {},
    userId: null,
    guestUser: false,
    expoPushToken: null,
  },

  reducers: {
    setUser(state, action) {
      let {
        email,
        expoPushToken,
        extension,
        firstName,
        lastName,
        password,
        phone,
        position,
        title,
        date,
      } = action?.payload?.values;
      console.log(date);
      state.userId = action.payload.id;

      state.user = {
        email,
        expoPushToken,
        firstName,
        lastName,
        phone,
        extension,
        position,
        title,
      };
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    setPushToken(state, action) {
      state.expoPushToken = action.payload;
    },
    setPermission(state, action) {
      state.permission = action.payload;
    },
    setPosition(state, action) {
      state.position = action.payload.position;
      state.date = action.payload.date;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setGuestUser(state, action) {
      state.guestUser = action.payload;
    },
    setSignOut(state, action) {
      state.loading = false;
      state.message = "";
      state.location = {};
      state.position = "";
      // state.date = new Date(Date.now());
      state.user = {};
      state.userId = null;
      state.guestUser = false;
      state.expoPushToken = null;
    },
  },
});
export const {
  setUser,
  setNotification,
  setPermission,
  setPosition,
  setLocation,
  setGuestUser,
  setSignOut,
  setPushToken,
} = authSlice.actions;

export default authSlice.reducer;
