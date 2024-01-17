import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { Header } from "../Components/Header";
import EditLocation from "../Components/EditLocation";
import MenuItem from "../Components/MenuItem";
import { getCategories, getProductsByCategories } from "../config";

import { ScrollView } from "react-native-gesture-handler";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../config";
export const FullMenu = ({ ...props }) => {
  const { cat_id } = props.route.params;
  const [click, setClick] = useState(cat_id);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFav, setisFav] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [refresh, setrefresh] = useState(false);
  const handlePress = () => setExpanded(!expanded);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setrefresh(true);
        const productForMenu = collection(fireDB, "categories");
        const docOfMenuCategories = await getDocs(productForMenu);
        let catege = docOfMenuCategories.map((doc) => {
          let tempData = doc.data();
          return {
            cat_id: doc.id,
            title: tempData.title,
            cat_img: tempData.category_img,
            position: tempData.position,
          };
        });
        setData(catege.sort((a, b) => a.position - b.position));
        setrefresh(false);
      } catch (err) {
        setrefresh(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getProductsByCategories(click)
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  }, [click]);

  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title={"Menu"}
        onPress={() => props.navigation.goBack()}
        nameicons={"close"}
        rightIcon={true}
        rightIconName={"shopping-bag"}
        rightonPress={() => props.navigation.navigate("Cart")}
      />

      <EditLocation handlePress={handlePress} expanded={expanded} />

      <View
        style={{
          flexDirection: "row",
          marginBottom: 5,
          backgroundColor: "#191919",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "#191919" }}
          contentContainerStyle={{ height: 40, backgroundColor: "#191919" }}
        >
          {data.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  padding: 5,
                  flexDirection: "row",
                  backgroundColor: "#191919",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      item.cat_id == click ? "#154525" : "#191919",
                    paddingHorizontal: 10,
                    padding: 5,
                    borderRadius: 25,
                  }}
                  onPress={() => setClick(item.cat_id)}
                >
                  <Text style={{ fontSize: 14, color: "#fff" }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        data={products}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => (
          <MenuItem
            imageUrl={item.productImg}
            productName={item.productName}
            productCalories={item.productCalories}
            productPrice={item.productPrice}
            favYes={isFav}
            addtoFave={() => {
              setisFav(!isFav);
            }}
            onPressProduct={() =>
              props.navigation.navigate("OrderDetails", {
                productId: item.productId,
              })
            }
            // customizeOnpress={() => props.navigation.navigate('CustomizeProduct')}
          />
        )}
      />
    </View>
  );
};
