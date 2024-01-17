import { View, Text, TouchableOpacity, Image } from "react-native";

import React from "react";

import { AntDesign } from "@expo/vector-icons";

export default function RecommendedFood({ ...props }) {
  return (
    <View style={{ width: "100%", flex: 1 }}>
      <View style={{ marginTop: 10, width: "22%", padding: 5 }}>
        <View
          style={{
            width: 120,
            height: 140,
            marginTop: 5,
            borderRadius: 10,
            backgroundColor: "#2D2D2D",
            elevation: 20,
            shadowColor: "#191919",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "50%",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
            source={
              props.recommended.item.image === "" ||
              props.recommended.item.image === undefined
                ? require("../assets/logo.png")
                : { uri: props.recommended.item.image }
            }
          />
          <TouchableOpacity
            onPress={() => props.addproductCart()}
            style={{ position: "absolute", right: -10, top: -10 }}
          >
            <AntDesign name="pluscircle" size={22} color="#154525" />
          </TouchableOpacity>
          <View style={{ padding: 5, flex: 1 }}>
            <Text style={{ color: "white", fontSize: 12 }}>
              {props?.recommended?.item?.name}
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: 5,
                left: 5,
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: 10, color: "#fff" }}>
                {props?.recommended?.item?.cals
                  ? `Cals (${props?.recommended?.item?.cals})`
                  : ""}{" "}
              </Text>
              <Text style={{ fontSize: 10, right: 0, color: "#fff" }}>
                $ {props?.recommended?.item?.price}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
