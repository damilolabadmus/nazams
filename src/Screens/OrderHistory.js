import { View, FlatList } from "react-native";
import CouponsComp from "../Components/CouponsComp";
import { Header } from "../Components/Header";
const data = [
  {
    id: "1",
    title: "New title",
    description:
      "lorem ipsum dolor sit amet, consectetur adipadipadipadipadipadipadip",
    expDate: "August 22,2022",
  },
  {
    id: "2",
    title: "Family Bundle",
    description:
      "lorem ipsum dolor sit amet, consectetur adipadipadipadipadipadipadip",
    expDate: "August 22,2022",
  },
  {
    id: "3",
    title: "Family Bundle",
    description:
      "lorem ipsum dolor sit amet, consectetur adipadipadipadipadipadipadip",
    expDate: "December 22,2022",
  },
  {
    id: "4",
    title: "Family Bundle",
    description:
      "lorem ipsum dolor sit amet, consectetur adipadipadipadipadipadipadip",
    expDate: "September 22,2022",
  },
];
export function OrderHistory({ ...props }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#f2efef" }}>
      <Header
        nameicons="left"
        onPress={() => props.navigation.goBack()}
        title="Order History"
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={(item, index) => {
          return (
            <CouponsComp
              title={item.item.title}
              description={item.item.description}
              expDate={item.item.expDate}
            />
          );
        }}
      />
    </View>
  );
}
