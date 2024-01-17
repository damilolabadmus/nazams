import { View, FlatList } from "react-native";
import React from "react";
import { Header } from "../Components/Header";
import FoodCard from "../Components/FoodCard";
import ListCard from "../Components/ListCard";

export function MenuList({ ...props }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title="Menu"
        nameicons="close"
        onPress={() => props.navigation.goBack()}
        rightIconName={"search"}
        rightIcon={true}
      />

      <FoodCard
        style={{ marginTop: -1 }}
        // onPressCard={() => alert('New')}
        itemName="2 for 7$"
        uriImage={
          "https://media.istockphoto.com/photos/craft-beef-burgers-with-vegetables-picture-id643038834?s=612x612"
        }
      />

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={[1, 2, 4, 5, 6, 3, 7]}
        keyExtractor={(item, index) => index}
        renderItem={(item, index) => <ListCard />}
      />
    </View>
  );
}
