import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";

export default function MenuItem(props) {
  return (
    <View>
      <View
        style={{ width: "100%", borderBottomWidth: 3, borderColor: "#154525" }}
      >
        <TouchableOpacity
          onPress={props.onPressProduct}
          style={{ backgroundColor: "#fff" }}
        >
          <ImageBackground
            source={
              props.imageUrl == "" || props.imageUrl == undefined
                ? require("../assets/logo.png")
                : { uri: props.imageUrl }
            }
            style={{ width: "100%", height: 230, resizeMode: "contain" }}
          >
            <>
              {/* <TouchableOpacity
                                onPress={props.addtoFave}
                                style={{ position: 'absolute', right: 10, padding: 10, }} >
                                <AntDesign
                                    name={props.favYes ? "heart" : "hearto"}
                                    size={24}
                                    color={props.favYes ? "#FF0707" : "black"}
                                />
                            </TouchableOpacity> */}
              <View
                style={{
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,.75)",
                  padding: 10,
                  position: "absolute",
                  bottom: 0,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 17 }}>
                  {props.productName}
                </Text>
              </View>
            </>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", padding: 10, backgroundColor: "#2D2D2D" }}>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={{ color: "#fff" }}>{props.productName}</Text>
          <Text style={{ color: "#fff" }}>$ {props.productPrice}</Text>
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={{ color: "#fff" }}>
            {/* {props.productCalories} cals */}
          </Text>
          {/* <TouchableOpacity onPress={props.customizeOnpress} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}  >
                        <Text style={{ color: '#154525', fontWeight: 'bold', marginRight: 5, }}>
                            Customize
                        </Text>
                        <AntDesign name="doubleright" size={14} color="#154525" />
                    </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}
