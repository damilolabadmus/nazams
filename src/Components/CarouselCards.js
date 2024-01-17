import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import ImageCarousel from "./ImageCarousel";

const data = [
  {
    id: 0,
    uri: require("../assets/logo.png"),
    title: "kathi",
  },
  {
    id: 1,
    uri: require("../assets/pic6.jpg"),
    title: "BBQ",
  },
  {
    id: 2,
    uri: require("../assets/14.jpg"),
    title: "Wrap",
  },
  {
    id: 4,
    uri: require("../assets/13.jpg"),
    title: "Roti Wrap",
  },
  {
    id: 3,
    uri: require("../assets/12.jpg"),
    title: "Combos",
  },
  {
    id: 5,
    uri: require("../assets/11.jpg"),
    title: "Desert",
  },
];

const CarouselCards = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" />
    <ImageCarousel data={data} />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -90,
  },
});

export default CarouselCards;
