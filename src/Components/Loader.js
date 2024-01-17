import { View, ActivityIndicator } from "react-native";
import React from "react";

export default function Loader() {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#154525" />
    </View>
  );
}
