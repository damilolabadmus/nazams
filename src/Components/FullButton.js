import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function FullButton({ ...props }) {
  return (
    <View
      style={{ position: "absolute", bottom: 0, width: "100%", padding: 15 }}
    >
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 10,
          backgroundColor: "#154525",
          borderRadius: 10,
        }}
      >
        <Text
          style={{ textAlign: "center", fontWeight: "bold", color: "white" }}
        >
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
