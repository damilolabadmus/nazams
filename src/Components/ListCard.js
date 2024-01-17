import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function ListCard() {
  return (
    <View
      style={{
        width: "90%",
        padding: 15,
        backgroundColor: "#fff",
        elevation: 10,
        shadowColor: "#191919",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View style={{ width: "70%", padding: 4 }}>
        <Text numberOfLines={2} style={{ color: "black", fontSize: 16 }}>
          Angus Burger with cheese & Bacon
        </Text>
      </View>
      <View style={{ width: "30%" }}>
        <TouchableOpacity
          style={{
            width: "100%",
            backgroundColor: "#154525",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Customize</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
