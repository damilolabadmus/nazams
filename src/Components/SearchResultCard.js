import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

export default function SearchResultCard({ ...props }) {
  return (
    <TouchableOpacity
      style={{
        marginTop: 10,
        width: "95%",
        padding: 20,
        alignSelf: "center",
        backgroundColor: "#fff",
        elevation: 10,
        shadowColor: "#191919",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderRadius: 10,
        flexDirection: "row",
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 80, height: 60 }}
      />
      <View style={{ justifyContent: "center", marginLeft: 10 }}>
        <Text
          numberOfLines={2}
          style={{ color: "#292726", fontSize: 17, width: "80%" }}
        >
          Searched Restaurants
        </Text>
      </View>
    </TouchableOpacity>
  );
}
