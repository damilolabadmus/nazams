import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function FavoritesComp({ ...props }) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={props.couponPress}
        style={{
          width: "90%",
          alignSelf: "center",
          borderRadius: 10,
          backgroundColor: "#3C3C3C",
          // paddingHorizontal: 10,
          height: 120,
          flexDirection: "row",
          marginTop: 10,
          elevation: 30,
          marginBottom: 10,
          shadowColor: "#191919",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
        }}
      >
        <Image
          source={
            props.image ? { uri: props.image } : require("../assets/logo.png")
          }
          style={{
            width: "30%",
            height: "100%",
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            resizeMode: "contain",
          }}
        />
        <View
          style={{
            width: "70%",
            height: "100%",
            marginLeft: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#fff",

                fontWeight: "700",

                width: "80%",
              }}
            >
              {props.title}
            </Text>
            <TouchableOpacity onPress={() => props.addFavourite(props?.prodId)}>
              <MaterialIcons name="favorite" size={24} color="#154525" />
            </TouchableOpacity>
          </View>
          <Text
            numberOfLines={2}
            style={{
              color: "#fff",

              marginTop: 5,
              width: "90%",
            }}
          >
            {props?.description?.length < 30
              ? props?.description
              : `${props?.description?.slice(0, 30)}...`}
          </Text>
          <View
            style={{
              flexDirection: "row",
              bottom: 10,
              flexWrap: "wrap",
              position: "absolute",
              alignItems: "flex-end",

              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                width: "50%",
              }}
            >
              ${props.price}
            </Text>
            <TouchableOpacity
              onPress={() =>
                props.addFavouriteCart({
                  id: props?.prodId,
                  name: props?.title,
                  image: props?.image,
                  price: props?.price,
                })
              }
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                + add to Cart
                {/* {props?.cals ? `${props?.cals} Cals` : ""} */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
