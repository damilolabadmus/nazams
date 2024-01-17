import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Header } from "../Components/Header";
import EditLocation from "../Components/EditLocation";
import { Fontisto } from "@expo/vector-icons";
import CategoriesComp from "../Components/CategoriesComp";
import { getCategories } from "../config";
// import { useFocusEffect } from '@react-navigation/native';

export const MenuCategories = ({ ...props }) => {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);
  // useFocusEffect(
  //     React.useCallback(() => {
  //         console.log("HELLo")
  //     }, []))

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        data.sort((a, b) => a.position - b.position);
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title="Menu"
        rightIcon={true}
        rightIconName={"shopping-bag"}
        rightonPress={() => props.navigation.navigate("Cart")}
      />

      <EditLocation handlePress={handlePress} expanded={expanded} />

      <View
        style={{
          width: "95%",
          alignSelf: "center",
          flexDirection: "row",
          padding: 10,
        }}
      >
        <View
          style={{
            padding: 10,
            justifyContent: "center",
            backgroundColor: "#2D2D2D",
            borderRadius: 10,
            width: "100%",
          }}
        >
          <TouchableOpacity onPress={() => {}} style={{ flexDirection: "row" }}>
            <Fontisto name="search" size={18} color="#fff" />
            <Text style={{ paddingLeft: 10, color: "#fff" }}>Search Now</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{ width: '85%', backgroundColor: '#154525', borderRadius: 10, marginLeft: 10, justifyContent: 'center' }} >
                    <TouchableOpacity>
                        <Text style={{ textAlign: 'center', color: '#fff', }} >
                            + Add Coupon Code
                        </Text>
                    </TouchableOpacity>
                </View> */}
      </View>

      <FlatList
        data={data}
        refreshing={false}
        onRefresh={() => getCategories}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        renderItem={(item, index) => (
          <CategoriesComp
            key={index}
            uri={item.item.cat_img}
            title={item.item.title}
            onPress={() =>
              props.navigation.navigate("FullMenu", {
                cat_id: item.item.cat_id,
              })
            }
          />
        )}
      />
    </View>
  );
};
