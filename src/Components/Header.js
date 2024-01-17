import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { w, h } from "react-native-responsiveness";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

export function Header({ ...props }) {
  return (
    <View
      style={{
        width: w("100%"),
        height: h("7%"),
        backgroundColor: "#2D2D2D",
        elevation: 15,
        shadowColor: "#191919",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ width: "20%" }}>
        <TouchableOpacity style={{ marginLeft: 15 }} onPress={props.onPress}>
          <AntDesign name={props.nameicons} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{ width: "60%", height: "100%", justifyContent: "center" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            color: "#fff",
            fontWeight: "700",
          }}
        >
          {props.title}
        </Text>
      </View>
      {/* Right Side Icon */}
      <View style={{ width: "20%", right: 0 }}>
        {props.rightIcon == true ? (
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginRight: 20 }}
            onPress={props.rightonPress}
          >
            <Fontisto name={props.rightIconName} size={24} color="#154525" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
