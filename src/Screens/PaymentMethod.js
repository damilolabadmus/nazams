import { View, Text } from "react-native";
import React from "react";
import { Header } from "../Components/Header";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export const PaymentMethod = ({ ...props }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title="Order"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />
      <Text>PaymentMethod</Text>
    </View>
  );
};
