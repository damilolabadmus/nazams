import "react-native-gesture-handler";
import React, { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
// import * as Device from "expo-device";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./src/Navigation/StackNavigation";
import { Provider, useDispatch } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDocs, collection, getDoc } from "firebase/firestore";
import Loader from "./src/Components/Loader";
import { MainProvider } from "./src/store/index";
import store from "./src/store/toolkit";

import { fireDB, auth } from "./src/config/index";
import { setUser } from "./src/store/auth";
// import { usePosition } from "./src/hook/usePosition";
const getLocation = (lat1, long1, lat2, long2) => {
  var dis = getDistance(
    {
      latitude: lat1,
      longitude: long1,
    },
    {
      latitude: lat2,
      longitude: long2,
    }
  );
  return dis / 1000;
};
// const LOCATION_TASK_NAME = "background-location-task";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
function App() {
  // const {
  //   position,
  //   stopBackgroundUpdate,
  //   stopForegroundUpdate,
  //   startBackgroundUpdate,
  //   startForegroundUpdate,
  //   requestPermissions,
  // } = usePosition();
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const [location, setLocation] = useState();
  // const [coordinates, setCoordinates] = useState([
  //   {
  //     latitude: "43.639478",
  //     longitude: "-79.563069",
  //   },
  //   {
  //     latitude: "43.361472",
  //     longitude: "-79.791369",
  //   },
  //   {
  //     latitude: "43.756078",
  //     longitude: "-79.275739",
  //   },
  // ]);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  // const user = auth.currentUser;
  // console.log(token, user?.uid, "this is possible or not");
  // handleNotifi(token, user.uid);
  // // token.replace("ExponentPushToken[", "");
  // // token.slice(0, -1);
  // if (!user?.uid) {
  //   alert("Please Login for Notification");
  // } else {
  //   const checktoken = await setDoc(
  //     doc(fireDB, "users", user.uid),
  //     {
  //       expoPushToken: token,
  //     },
  //     { merge: true }
  //   );
  //   console.log(checktoken, user.uid, "hello");
  // }
  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     console.log(location, "new permission here");
  //     setLocation(location);
  //   })();
  // }, []);

  // TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  //   if (error) {
  //     // Error occurred - check `error.message` for more details.
  //     console.log("there is now erro");
  //     console.log(error);
  //     return;
  //   }
  //   if (data) {
  //     const { locations } = data;
  //     setLocation(locations);
  //     const {
  //       coords: { latitude, longitude },
  //     } = locations;

  //     var dis1 = getLocation(
  //       latitude,
  //       longitude,
  //       coordinates[0].latitude,
  //       coordinates[0].longitude
  //     );
  //     var dis2 = getLocation(
  //       latitude,
  //       longitude,
  //       coordinates[1].latitude,
  //       coordinates[1].longitude
  //     );
  //     var dis3 = getLocation(
  //       latitude,
  //       longitude,
  //       coordinates[2].latitude,
  //       coordinates[2].longitude
  //     );

  //     console.log(locations, "data location from background");
  //     // do something with the locations captured in the background
  //   }
  // });
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.useBackgroundPermissions();
  //     if (status === "granted") {
  //       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //         accuracy: Location.Accuracy.High,
  //         distanceInterval: 10,
  //       });
  //     } else {
  //       alert("there is no permission");
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     const user = auth.currentUser;
  //     const {
  //       coords: { latitude, longitude },
  //     } = location;
  //     console.log(latitude, longitude, "this is latitude, and logni");
  //     if (latitude && longitude) {
  //       await setDoc(
  //         doc(fireDB, "users", user.uid),
  //         {
  //           coords: {
  //             latitude,
  //             longitude,
  //           },
  //         },
  //         { merge: true }
  //       );
  //     }
  //   })();
  // }, [location]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await requestTrackingPermissionsAsync();
        if (status === "granted") {
          console.log("Yay! I have user permission to track data");
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
function Main() {
  const dispatch = useDispatch();
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(fireDB, "users", user.uid));
          if (docSnap.exists()) {
            dispatch(
              setUser({
                id: user.uid,
                values: docSnap.data(),
              })
            );
          }
        } catch (error) {
          console.error("Error getting document:", error);
        }
      }
      setUserLoaded(true);
    });
    return unsubscribe;
  }, [auth, dispatch, fireDB]);

  return (
    <MainProvider>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer>
              {/* change statusbar background color #2D2D2D */}
              {Platform.OS === "ios" ? null : (
                <StatusBar
                  backgroundColor="#2D2D2D"
                  style="light"
                  translucent={false}
                />
              )}
              <KeyboardAvoidingView style={{ flex: 1 }}>
                <StripeProvider
                  publishableKey={
                    "pk_test_51LjSx7K8eVl1BeLsHxLD4vMWpFMarNdybJsDzsi2ndCvPU5xK858FN0Mcfuo6ADqnJeyyhXmMdzEHfC6wDlI4cbR00ssEcsyoR"
                  }
                >
                  <SafeAreaView style={{ flex: 1 }}>
                    <MainStack />
                  </SafeAreaView>
                </StripeProvider>
              </KeyboardAvoidingView>
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </MainProvider>
  );
}
export default App;
