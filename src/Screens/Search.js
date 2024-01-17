import { View, TouchableOpacity, FlatList, TextInput } from "react-native";
import { w, h } from "react-native-responsiveness";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import SearchResultCard from "../Components/SearchResultCard";
export function Search({ ...props }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#f2efef" }}>
      <View
        style={{
          width: w("100%"),
          height: h("9%"),
          elevation: 15,
          shadowColor: "#191919",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          padding: 10,
          backgroundColor: "#154525",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "30%",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={{ width: "50%", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <AntDesign name="arrowleft" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ width: "50%", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => alert("Start Searching!")}>
              <AntDesign name="search1" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: "50%", justifyContent: "center" }}>
          {/* <Text style={{ color: '#fff', fontSize: 18 }} >What Sounds Good?</Text> */}
          <TextInput
            placeholder="What Sounds Good?"
            style={{ fontSize: 16, color: "#fff" }}
            placeholderTextColor={"#fff"}
          />
        </View>
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity>
            <FontAwesome
              name="filter"
              size={24}
              color="#fff"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={[1, 2, 4, 5, 6, 73]}
        keyExtractor={(item, index) => index}
        renderItem={(item) => <SearchResultCard />}
      />
    </View>
  );
}
