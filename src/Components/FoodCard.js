import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

export default function FoodCard({ ...props }) {
  return (
    <View
      style={{
        width: "90%",
        alignSelf: "center",
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#191919",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10,
      }}
      {...props}
    >
      <TouchableOpacity
        onPress={props.onPressCard}
        style={{ backgroundColor: "#fff", borderRadius: 10 }}
      >
        <ImageBackground
          {...props}
          style={{ width: "100%", height: 200 }}
          imageStyle={{ borderRadius: 10 }}
          resizeMode="cover"
          source={{ uri: props.uriImage }}
        >
          <View
            style={{
              width: "100%",
              padding: 10,
              position: "absolute",
              bottom: 0,
              backgroundColor: "#154525",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <Text
              numberOfLines={1}
              {...props}
              style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
            >
              {props.itemName}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}
