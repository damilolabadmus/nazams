import React from "react";
import { View, Text, TextInput } from "react-native";

export const InputLabel = ({ ...props }) => {
  return (
    <View
      style={{
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#848484",
        flexDirection: "row",
        padding: 25,
      }}
    >
      <View style={{ justifyContent: "center", width: "30%" }}>
        <Text style={{ color: "#fff" }}>{props.labelInput}</Text>
      </View>
      <View style={{ justifyContent: "center", width: "70%" }}>
        <TextInput
          {...props}
          numberOfLines={1}
          keyboardType={props.keyboardtype ?? "default"}
          placeholder={props.placeholder}
          style={{ color: "#fff" }}
          placeholderTextColor={"#848484"}
        />
      </View>
    </View>
  );
};
