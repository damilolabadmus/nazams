import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";

export default function CategoriesComp({ ...props }) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ marginTop: 1, backgroundColor: "#fff" }}
    >
      <ImageBackground
        // imageStyle={{ borderRadius: 15 }}
        source={
          props.uri == "" ? require("../assets/logo.png") : { uri: props.uri }
        }
        style={{
          width: "100%",
          height: 160,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
            width: "100%",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {props.title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
