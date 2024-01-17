import React, { useEffect, useState } from "react";
import {
  Favorites,
  Login,
  More,
  Orders,
  Menu,
  SignUp,
  Coupons,
  OrderSetup,
  FullMenu,
  CustomizeProduct,
  MyAccount,
  MenuCategories,
  OrderDetails,
  Cart,
  PaymentDetails,
  Pickup,
  UpdatePassword,
  UpdateAccount,
  Payment,
  SignIn,
} from "../Screens";
import { Alert } from "react-native";
import { fireDB, auth } from "../config";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
// import * as SecureStore from "expo-secure-store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  setDoc,
  doc,
  query,
  collection,
  Timestamp,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Context } from "../store";
import usePushNotifications from "../hook/usePushNotification";
import usePosition from "../hook/usePosition";
import * as Notifications from "expo-notifications";
import { getDistance } from "geolib";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotification,
  setPermission,
  setPushToken,
  setLocation,
  setUser,
} from "../store/auth";

const data = [
  {
    label: "1 Eva Rd #108, Etobicoke, ON M9C 4Z5, Canada",
    coords: {
      latitude: "31.639478",
      longitude: "73.563069",
    },
    // coords: {
    //   latitude: "43.639478",
    //   longitude: "-79.563069",
    // },
  },
  {
    label: "3390 S Service Rd, Burlington, ON L7N 3J5, Canada",
    coords: {
      latitude: "43.361472",
      longitude: "-79.791369",
    },
  },
  {
    label: "1225 Kennedy Rd, Scarborough, ON M1P 4Y1, Canada",
    coords: {
      latitude: "43.756078",
      longitude: "-79.275739",
    },
  },
];
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
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuScreen" component={Menu} />
      <Stack.Screen name="MenuCategories" component={MenuCategories} />
      <Stack.Screen name="FullMenu" component={FullMenu} />
    </Stack.Navigator>
  );
}

function FavoriteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesScreen" component={Favorites} />
    </Stack.Navigator>
  );
}
function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersScreen" component={Orders} />
    </Stack.Navigator>
  );
}
function CouponsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CouponsScreen" component={Coupons} />
    </Stack.Navigator>
  );
}
function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreScreen" component={More} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Menu"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#154525",
        headerShown: false,
        keyboardHidesTabBar: true,
        tabBarLabelStyle: { fontSize: 13, marginBottom: 3 },
        tabBarStyle: {
          height: 60,
          padding: 10,
          backgroundColor: "#191919",
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Menu: "restaurant-menu",
            Coupons: "tag",
            Favorites: "star",
            Orders: "list-alt",
            More: "more-horiz",
          };
          return (
            <>
              {(route.name == "Coupons" && (
                <AntDesign name={icons[route.name]} color={color} size={27} />
              )) || (
                <MaterialIcons
                  name={icons[route.name]}
                  color={color}
                  size={27}
                />
              )}
            </>
          );
        },
      })}
    >
      <Tab.Screen name="Menu" component={MenuStack} />
      <Tab.Screen name="Coupons" component={CouponsStack} />
      <Tab.Screen name="Favorites" component={FavoriteStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}

// This is the MAin Stack That will Handle the functionality(Or Whatever You want to call it)

export default function MainStack() {
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [notificationSent, setNotificationSent] = useState(false);

  const { notification, expoPushToken, handlerNotification } =
    usePushNotifications();
  const {
    position,
    startBackgroundUpdate,
    startForegroundUpdate,
    requestPermissions,
    stopBackgroundUpdate,
    stopForegroundUpdate,
  } = usePosition();
  // //location effect
  useEffect(() => {
    (async () => {
      if (state?.permission === false) {
        dispatch(setPermission(false));
        stopForegroundUpdate();
        stopBackgroundUpdate();
        // Alert.alert(
        //   "Access your location in background when app is in use or closed",
        //   "This app collects location data to enable, the app will notify their about a special discounted offer even when the app is closed or not in use",
        //   [
        //     {
        //       text: "Cancel",
        //       onPress: async () => {
        //         stopForegroundUpdate();
        //         stopBackgroundUpdate();
        //         setPermission(false);
        //       },
        //     },
        //     {
        //       text: "Continue",
        //       onPress: async () => {
        //         requestPermissions();
        //         startForegroundUpdate();
        //         startBackgroundUpdate();
        //         dispatch(setPermission(true));
        //         setTimeout(async () => {
        //           if (position) {
        //             dispatch(
        //               setLocation({
        //                 latitude: position?.latitude,
        //                 longitude: position?.longitude,
        //               })
        //             );
        //           }
        //         }, 1000);
        //       },
        //     },
        //   ]
        // );
      }
      if (state?.permission === null) {
        requestPermissions();
        if (position) {
          dispatch(setPermission(true));
        }
      }

      if (state?.permission) {
        startForegroundUpdate();
        startBackgroundUpdate();
        if (position) {
          dispatch(
            setLocation({
              latitude: position?.latitude,
              longitude: position?.longitude,
            })
          );
        }
      }
    })();
  }, []);
  /** get User Id and update expopushtoken */
  useEffect(() => {
    let user = true;
    (async () => {
      if (state?.userId && user) {
        handlerNotification();
        if (expoPushToken) {
          dispatch(setNotification(true));
          dispatch(setPushToken(expoPushToken));
          await setDoc(
            doc(fireDB, "users", state?.userId),
            {
              expoPushToken,
            },
            { merge: true }
          );
        } else {
          dispatch(setNotification(false));
        }
        handleCoupons();
      }
    })();
    return () => (user = false);
  }, []);

  const handleCoupons = async () => {
    let startdate = Timestamp.fromDate(new Date());

    const q = query(
      collection(fireDB, "coupons"),
      where("validity", ">=", startdate)
    );
    let products = [];
    const querySnaphot = await getDocs(q);
    querySnaphot.forEach(async (doc) => {
      let newItem = { id: doc.id, ...doc.data() };

      newItem.productData = [];
      newItem.productId?.forEach(async (item, index) => {
        let productData = await getDoc(item);
        if (productData.exists()) {
          newItem.productData[index] = {
            prodId: productData.id,
            ...productData.data(),
          };
        }
      });
      products.push(newItem);
    });
    setTimeout(() => {
      let prod = products.filter(
        (item) =>
          item.status === true &&
          item?.limit >= (item?.users?.length || 0) &&
          item
      );

      if (state?.userId && prod?.length > 0) {
        let userProd = prod.filter(
          (item) => !item?.users?.includes(state.userId) && item
        );

        handleNotification(userProd);
      }
    }, 500);
  };
  const handleNotification = async (userProd) => {
    // let distance = data?.map((item) =>
    //   getLocation(
    //     item.coords.latitude,
    //     item.coords.longitude,
    //     position?.latitude,
    //     position?.longitude
    //   )
    // );

    // const distanceMeasure = (element) =>
    //   parseInt(element) >= (userProd[0]?.range || userProd[1]?.range);
    // let checkdistance = distance.some(distanceMeasure);
    // console.log(checkdistance, distance, "distance", position);

    const docRef = doc(fireDB, "users", state?.userId);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data().expoPushToken);
    // console.log(checkdistance);
    if (
      state?.notification &&
      (state?.expoPushToken || docSnap?.data()?.expoPushToken)
    ) {
      sendPushNotification(
        state?.expoPushToken || docSnap.data()?.expoPushToken,
        "Nizam's kathi kabab",
        "Nizam's kathi kabab give you a deal. check out that in coupon section."
      );
    }
  };
  useEffect(() => {
    if (state.permission && !notificationSent) {
      startLocationUpdates();
    }
  }, []);

  async function checkLocation(userCoords) {
    try {
      let distance = data?.map((item) => ({
        label: item.label,
        distance: getLocation(
          item.coords.latitude,
          item.coords.longitude,
          userCoords?.latitude,
          userCoords?.longitude
        ),
      }));

      let checkdistance = distance.find(
        (element) => parseInt(element.distance) < 1000
      );
      if (checkdistance) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Indulge in Delicious Eats at Keventers Cafe & Wraps!",
            body: `We offer a bunch of wraps, burgers, and other mouth-watering dishes. Don't miss out  this opportunity to treat yourself to a delicious meal! write a perfect summary at ${checkdistance.label}`,
          },
          trigger: null,
        });
        setNotificationSent(true);
        handleCoupons();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const startLocationUpdates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied.");
      return;
    }

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update interval in milliseconds
        distanceInterval: 0, // Distance interval in meters (0 means continuous)
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        const userCoords = { latitude, longitude };
        checkLocation(userCoords);
      }
    );
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state?.userId || state?.guestUser ? (
        <>
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="OrderSetup" component={OrderSetup} />
          <Stack.Screen name="CustomizeProduct" component={CustomizeProduct} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="MyAccount" component={MyAccount} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
          <Stack.Screen name="Pickup" component={Pickup} />
          <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
          <Stack.Screen name="UpdateAccount" component={UpdateAccount} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      )}
    </Stack.Navigator>
  );
}
async function sendPushNotification(expoPushToken, title, body) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { someData: "Go to Deal Section" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
