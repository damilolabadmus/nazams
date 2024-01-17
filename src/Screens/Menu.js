import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Header } from "../Components/Header";

import CarouselCards from "../Components/CarouselCards";
import EditLocation from "../Components/EditLocation";
import { Feather } from "@expo/vector-icons";
import { getCategories } from "../config";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import TextTicker from "react-native-text-ticker";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config";
export function Menu({ ...props }) {
  const [data, setData] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });
  const handlePress = () => {
    setExpanded(!expanded);

    if (expanded) {
      offset.value = withSpring(0);
    } else {
      offset.value = withSpring(120);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setrefresh(true);
    getCategories()
      .then((data) => {
        data.sort((a, b) => a.position - b.position);
        setData(data);
        setrefresh(false);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#2D2D2D" }}>
      <Header
        title={`Nizam's Kathi Kabab`}
        rightIcon={true}
        rightIconName={"shopping-bag"}
        rightonPress={() => props.navigation.navigate("Cart")}
      />

      <EditLocation handlePress={handlePress} expanded={expanded} />

      <ScrollView style={{ flex: 1 }}>
        <Animated.View style={animatedStyles}>
          <CarouselCards />
          <View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "30%", padding: 15 }}>
                <Text
                  style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}
                >
                  Menu
                </Text>
              </View>

              <View style={{ width: "40%", padding: 15 }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("MenuCategories")}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 11,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    See Full Menu
                  </Text>
                  <Feather name="chevrons-right" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginLeft: 5 }}>
              <FlatList
                nestedScrollEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={(item, index) => index}
                renderItem={(item, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate("FullMenu", {
                        cat_id: item.item.cat_id,
                      })
                    }
                  >
                    <View
                      style={{
                        width: 150,
                        borderRadius: 10,
                        padding: item.item.cat_img == "" ? 10 : 0,
                        backgroundColor: "#1B1B1D",
                        height: 150,
                        marginRight: 5,
                      }}
                    >
                      <Image
                        source={
                          item.item.cat_img == ""
                            ? require("../assets/logo.png")
                            : { uri: item.item.cat_img }
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 10,
                          padding: item.item.cat_img == "" ? 10 : 0,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 5,
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 12,
                        textAlign: "center",
                      }}
                    >
                      {item.item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          {data?.length > 0 && (
            <View
              style={{
                flex: 1,
                height: expanded ? 150 : 50,
                marginVertical: 14,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Become a Franchise",
                    "This action will exit the app",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () =>
                          Linking.openURL(
                            "https://nizamkathikabab.com/become-a-franchisee/"
                          ),
                      },
                    ]
                  );
                }}
              >
                <TextTicker
                  style={{
                    fontSize: 22,
                    color: "#fff",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    // textAlign:"center"
                  }}
                  duration={25000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={3000}
                  animationType="auto"
                >
                  {/* <Avatar.Image
                    size={20}
                    source={require("../assets/logo.png")}
                    style={{
                      backgroundColor: "#fff",
                      // width: 28,
                      // height: 28,
                      // resizeMode: "contain",
                      // marginHorizontal: 1,
                    }}
                  /> */}
                  <Image
                    source={require("../assets/logo.png")}
                    style={{
                      width: 24,
                      height: 22,
                      resizeMode: "contain",
                      // marginHorizontal: 8,
                      // top:7,
                      marginTop: -1,
                    }}
                  />
                  If you want to Become a Franchise with Nizam's Kathi Kabab
                  click here
                </TextTicker>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
