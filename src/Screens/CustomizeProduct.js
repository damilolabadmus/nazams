import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Header } from "../Components/Header";
import { List } from "react-native-paper";

import { Text, View, StyleSheet, FlatList, ScrollView } from "react-native";
import Constants from "expo-constants";
import { Card } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { AntDesign } from "@expo/vector-icons";
import FullButton from "../Components/FullButton";

const docs = [
  {
    name: "Premium Tropping",
    data: [
      {
        id: 1,
        txt: "Cheese",
        txt1: "Single",
        txt2: "Double",
        txt3: "Triple",
        isChecked: false,
        cals: 60,
        max: 3,
        value: 1,
      },
      {
        id: 2,
        txt: "Bacon",
        isChecked: false,
        cals: 70,
        value: 1,
        txt1: "Small",
        txt2: "Medium",
        txt3: "Extra",
        max: 3,
      },
      {
        id: 3,
        txt: "Veggie Patty",
        isChecked: false,
        cals: 50,
        value: 1,
        txt1: "Small",
        txt2: "Medium",
        txt3: "Extra",
        max: 3,
      },
      {
        id: 4,
        isChecked: false,
        txt: "Onion Rings",
        cals: 33,
        value: 1,
        max: 4,
      },
    ],
  },
];

const data = [
  {
    id: 1,
    txt: "Cheese",
    txt1: "Single",
    txt2: "Double",
    txt3: "Triple",
    isChecked: false,
    cals: 60,
    max: 3,
    value: 1,
  },
  {
    id: 2,
    txt: "Bacon",
    isChecked: false,
    cals: 70,
    value: 1,
    txt1: "Small",
    txt2: "Medium",
    txt3: "Extra",
    max: 3,
  },
  {
    id: 3,
    txt: "Veggie Patty",
    isChecked: false,
    cals: 50,
    value: 1,
    txt1: "Small",
    txt2: "Medium",
    txt3: "Extra",
    max: 3,
  },
  {
    id: 4,
    isChecked: false,
    txt: "Onion Rings",
    cals: 33,
    value: 1,
    max: 4,
  },
  { id: 5, txt: "Shredded Lettuce", isChecked: false, cals: 2, value: 1 },
  { id: 6, txt: "Tomatoes", isChecked: false, cals: 4, value: 1 },
  { id: 7, txt: "Onion", isChecked: false, cals: 2, value: 1 },
  { id: 8, txt: "Ketchup", isChecked: false, value: 1, cals: 1 },
  { id: 9, txt: "Mustard", isChecked: false, value: 1, cals: 1 },
  { id: 10, txt: "Mayo", isChecked: false, cals: 40, value: 1 },
  { id: 11, txt: "BBQ Sauce", isChecked: false, cals: 35, value: 1 },
  { id: 12, txt: "Ghost Pepper Mayo", isChecked: false, cals: 7, value: 1 },
  { id: 13, txt: "Mayo", isChecked: false, cals: 40, value: 1 },
  { id: 14, txt: "Chipotle", isChecked: false, cals: 70, value: 1 },
  { id: 15, txt: "Harv Sauce", isChecked: false, cals: 40, value: 1 },
  { id: 16, txt: "Hot Sauce", isChecked: false, cals: 20, value: 1 },
  { id: 17, txt: "Garlic Mayo", isChecked: false, cals: 35, value: 1 },
  { id: 18, txt: "Ranch", isChecked: false, cals: 50, value: 1 },
  { id: 19, txt: "#fff Bun", isChecked: false, value: 1 },
  { id: 20, txt: "Multigrain Bun", isChecked: false, value: 1 },
  { id: 21, txt: "No Bun", isChecked: false, value: 1 },
  { id: 22, txt: "Relish", isChecked: false, value: 1 },
  { id: 23, txt: "Hot Peppers", isChecked: false, cals: 20, value: 1 },
  { id: 24, txt: "Jalapenos", isChecked: false, cals: 1, value: 1 },
  { id: 25, txt: "Black Olives", isChecked: false, cals: 17, value: 1 },
  { id: 26, txt: "Cucumbers", isChecked: false, cals: 1, value: 1 },
  { id: 27, txt: "Tzatziki", isChecked: false, cals: 20, value: 1 },
  { id: 28, txt: "Salt & Pepper", isChecked: false, cals: 0, value: 1 },
  { id: 29, txt: "Pickles", isChecked: false, cals: 4, value: 1 },
];

export function CustomizeProduct({ ...props }) {
  const [expanded, setExpanded] = React.useState(true);
  const [checked, setChecked] = React.useState("first");

  const handlePress = () => setExpanded(!expanded);
  const [products, setProducts] = useState(data);

  const handleChange = (id) => {
    let temp = products.map((product) => {
      if (id === product.id) {
        return { ...product, isChecked: !product.isChecked };
      }
      return product;
    });
    setProducts(temp);
  };

  let selected = products.filter((product) => product.isChecked);
  const handlePlus = (id) => {
    let temp = products.map((product) => {
      if (id === product.id) {
        if (product.value < product.max) {
          return { ...product, value: product.value + 1 };
        }
      }
      return product;
    });
    setProducts(temp);
  };
  const handleMinus = (id) => {
    let temp = products.map((product) => {
      if (id === product.id) {
        if (product.value <= product.max && product.value > 1) {
          return { ...product, value: product.value - 1 };
        }
      }
      return product;
    });
    setProducts(temp);
  };
  const renderFlatList = (renderData) => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={renderData}
        nestedScrollEnabled
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => {
          return (
            <Card
              style={{
                padding: 15,
                elevation: 10,
                marginBottom: 10,
                marginTop: 5,
                shadowColor: "#191919",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
              }}
              key={item.id}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <BouncyCheckbox
                  isChecked={item.isChecked}
                  onPress={() => {
                    handleChange(item.id);
                  }}
                  text={item.txt}
                  size={25}
                  fillColor="#154525"
                  unfillColor="#FFFFFF"
                  iconStyle={{ borderColor: "#154525" }}
                  textStyle={{
                    textDecorationLine: "none",
                  }}
                />
                <View>
                  <Text style={{ color: "#191919" }}>
                    {item.cals * item.value}
                  </Text>
                </View>
              </View>
              {item.isChecked && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                    padding: 5,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleMinus(item.id)}
                    disabled={item.value <= 1 ? true : false}
                  >
                    <AntDesign name="minussquareo" size={24} color="#154525" />
                  </TouchableOpacity>
                  <Text style={{ color: "#191919", paddingHorizontal: 10 }}>
                    {item.value === 1
                      ? item.txt1
                      : item.value === 2
                      ? item.txt2
                      : item.value === 3
                      ? item.txt3
                      : ``}
                    {!item.txt1 && item.value}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handlePlus(item.id)}
                    disabled={item.value >= item.max ? true : false}
                  >
                    <AntDesign name="plussquareo" size={24} color="#154525" />
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          );
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title={"Product Name"}
        onPress={() => props.navigation.goBack()}
        nameicons={"close"}
      />
      <ScrollView>
        <List.Section>
          <List.Accordion
            title="Extras"
            theme={{
              colors: {
                primary: "#154525",
                background: "#fff",
                borderWidth: 1,
              },
            }}
            style={{ width: "50%" }}
          >
            <List.Item
              title={
                <View
                  style={{
                    flex: 1,
                    width: "60%",
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                  }}
                >
                  {renderFlatList(products)}
                </View>
              }
            />
          </List.Accordion>
        </List.Section>
      </ScrollView>
      <FullButton
        title={"Continue"}
        onPress={() => props.navigation.navigate("OrderDetails")}
      />
      {/* <View style={{ width: '100%', padding: 10, }} >
        <TouchableOpacity
          onPress={() => props.navigation.navigate('OrderDetails')}
          style={{ backgroundColor: '#154525', padding: 10, borderRadius: 10 }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 17 }} >
            Continue
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
    // </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  card: {
    margin: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#191919",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
