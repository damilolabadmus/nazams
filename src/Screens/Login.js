import React, { useState, useContext } from "react";
import { View, Text, Image, SafeAreaView } from "react-native";

import AppIntroSlider from "react-native-app-intro-slider";
import { fireDB } from "../config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Avatar } from "react-native-paper";

// import * as SecureStore from "expo-secure-store";

import { LogBottomSheet } from "../Components/BottomSheet";
import { Context } from "../store";

const slides = [
  {
    key: 1,
    title: "Exclusive Offers",
    text: "Sign Up and get exclusive offers from the entire Menu right to your phone.",
    image: require("../assets/diet.png"),
    backgroundColor: "#59b2ab",
  },
  {
    key: 2,
    title: "Make your Own rules!",
    text: "Customize Your order as like and add it as a favorite to re-order later.",

    image: require("../assets/addtocart.png"),
    backgroundColor: "#febe29",
  },
  {
    key: 3,
    title: "No more Waiting",
    text: "With Nizam's Kathi Kabab, you can order online and pay even before the restaurant opens.",
    image: require("../assets/pay.png"),
    backgroundColor: "#22bcb5",
  },
];
export function Login({ ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const { state, dispatch } = useContext(Context);

  const _renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={item.image}
          style={{
            width: 80,
            height: 80,
            borderRadius: 80 / 2,
            resizeMode: "contain",
          }}
        />
        <Text
          style={{
            color: "white",
            textAlign: "center",
            width: "90%",
            color: "#fff",
            fontSize: 20,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            color: "#999",
            textAlign: "center",
            width: "90%",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  const loginNow = async () => {
    if (email && password) {
      const colRef = collection(fireDB, "users");
      const queryRef = query(
        colRef,
        where("email", "==", email),
        where("password", "==", password)
      );
      const res = await onSnapshot(queryRef, async (querySnapshot) => {
        if (querySnapshot.size > 0) {
          // await SecureStore.setItemAsync(
          //   "userId",
          //   JSON.stringify(querySnapshot.docs[0].id)
          // );
          // await SecureStore.setItemAsync(
          //   "userData",
          //   JSON.stringify(querySnapshot.docs[0].data())
          // );

          dispatch({
            type: "CREATE",
            payload: {
              id: querySnapshot.docs[0].id,
              values: querySnapshot.docs[0].data(),
            },
          });

          alert("Good to see you back!");
        } else {
          alert("Wrong Credentials");
        }
      });
    } else {
      alert("Enter Email And Password");
    }
  };
  const handleCheck = () => {
    setCheck(!check);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#191919" }}>
      <View style={{ flexGrow: 1, height: check ? 95 : 195 }}>
        <AppIntroSlider
          renderItem={_renderItem}
          data={slides}
          showDoneButton={false}
          showNextButton={false}
        />
      </View>
      <View style={{ flexGrow: check ? 5 : 2 }}>
        <LogBottomSheet handleCheck={handleCheck} />
      </View>
    </SafeAreaView>
  );
}
