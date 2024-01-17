import { View, Text, TouchableOpacity, Image } from "react-native";
import { w, h } from "react-native-responsiveness";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function CustomDrawer({ ...props }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#154525" }}>
      <View
        style={{
          width: "100%",
          height: h("35%"),
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 120, height: 100, alignSelf: "center" }}
        />
        <View style={{ width: "100%", marginTop: 10, flexDirection: "row" }}>
          <View>
            <Text
              style={{
                color: "black",
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 15,
              }}
            >
              Welcome, talha
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 15,
                marginLeft: 15,
                marginTop: 5,
              }}
            >
              My Account
            </Text>
          </View>
          <TouchableOpacity
            style={{
              color: "#fff",
              position: "absolute",
              right: 25,
              marginTop: 20,
            }}
          >
            <AntDesign name="right" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={{ width: "100%", padding: 20, flexDirection: "row" }}
      >
        <Ionicons
          name="location"
          size={24}
          color="#fff"
          style={{ paddingRight: 10 }}
        />
        <Text style={{ color: "#fff", fontSize: 16 }}>Find a Location</Text>
        <AntDesign
          name="right"
          size={18}
          color="#fff"
          style={{ position: "absolute", right: 10, marginTop: 20 }}
        />
      </TouchableOpacity>
      <View
        style={{
          position: "absolute",
          width: "90%",
          alignSelf: "center",
          bottom: 30,
        }}
      >
        <Text style={{ textAlign: "center", color: "#fff", fontSize: 12 }}>
          Terms of Use . Privacy Policy
          {"\n"}
          {"\u00A9"}2022 Recipe Unlimited Corporation
        </Text>
      </View>
    </View>
  );
}
