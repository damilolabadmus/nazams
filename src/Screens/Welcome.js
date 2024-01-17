import React from "react";
// import * as Facebook from "expo-facebook";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { w, h } from "react-native-responsiveness";
import { FontAwesome } from "@expo/vector-icons";

export function Welcome({ ...props }) {
  // const LoginFacebook = async () => {
  //   try {
  //     await Facebook.initializeAsync({
  //       appId: "529705884829074",
  //     });
  //     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
  //       permissions: ["public_profile", "email"],
  //     });
  //     if (type === "success") {
  //       const response = await fetch(
  //         `https://graph.facebook.com/me?access_token=${token}`
  //       );
  //       // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
  //       // props.navigation.reset({ index: 0, routes: [{ name: 'HomeComp', }] });
  //       props.navigation.navigate("");
  //     } else {

  //     }
  //   } catch (message) {

  //   }
  // };

  return (
    <ImageBackground
      style={{ flex: 1 }}
      resizeMode="cover"
      source={{
        uri: "https://media.istockphoto.com/photos/appetizing-cheeseburger-on-wooden-table-picture-id928803394?s=612x612",
      }}
    >
      <View
        style={{
          width: "100%",
          height: h("7%"),
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            props.navigation.reset({ index: 0, routes: [{ name: "HomeComp" }] })
          }
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: "#fff" }}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "100%",
          height: h("93%"),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{ height: 150, width: 150, marginBottom: 30 }}
        />
        <TouchableOpacity
          // onPress={() => LoginFacebook()}
          style={{
            width: "70%",
            flexDirection: "row",
            alignSelf: "center",
            backgroundColor: "#395393",
            padding: 15,
            justifyContent: "space-evenly",
            marginBottom: 20,
          }}
        >
          <FontAwesome name="facebook-f" size={23} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Sign In With Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate("SignUp")}
          style={{
            width: "70%",
            flexDirection: "row",
            alignSelf: "center",
            backgroundColor: "#DFA52A",
            padding: 15,
            justifyContent: "space-evenly",
            marginBottom: 20,
          }}
        >
          <FontAwesome name="envelope" size={23} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Sign Up Using Your Email
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Have An Account
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Login")}
            style={{ marginLeft: 5 }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                textDecorationLine: "underline",
              }}
            >
              Login?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
