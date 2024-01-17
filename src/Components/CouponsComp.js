import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";

const data = [
  {
    label: "1 Eva Rd #108, Etobicoke, ON M9C 4Z5, Canada",
    coords: {
      latitude: "43.639478",
      longitude: "-79.563069",
    },
  },
  {
    label: "3390 S Service Rd, Burlington, ON L7N 3J5, Canada",
    coords: {
      latitude: "43.361472",
      longitude: "-79.791369",
    },
  },
  {
    label: "1225 Kennedy Rd, Scarborough, ON M1P 4Y1, Canada",
    coords: {
      latitude: "43.756078",
      longitude: "-79.275739",
    },
  },
];
export default function CouponsComp({ ...props }) {
  const getDate = (data) => {
    return (
      new Date(data?.seconds * 1000).toLocaleDateString() +
      " " +
      new Date(data?.seconds * 1000).toLocaleTimeString()
    );
  };
  let handleCoordinate = (coords) => {
    let coordinate = data?.find(
      (item) => item.coords?.latitude == coords?.latitude
    );
    if (coordinate?.label) {
      return coordinate?.label;
    } else {
      return "No place ";
    }
  };
  function total(arr) {
    if (!Array.isArray(arr)) return;
    let sum = 0;
    arr.forEach((each) => {
      sum += parseFloat(each.price);
    });
    return sum.toFixed(2);
  }
  return (
    <View>
      <View
        style={{
          borderRadius: 20,
          width: "95%",
          alignSelf: "center",

          alignItems: "center",
          backgroundColor: "#2D2D2D",
          elevation: 20,
          shadowColor: "#191919",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          paddingHorizontal: 5,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 200,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}
        >
          <FlatList
            data={props?.productData}
            horizontal
            keyExtractor={(item, index) => index}
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={(item, index) => <ProductFood {...item} />}
          />
        </View>
        <View
          style={{
            width: "100%",
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 12, color: "white" }}>
            {/* Premium 2 can Dine */}
            {props?.productData?.length} Items
          </Text>
          <Text
            style={{
              color: "#eee",
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
              fontSize: 12,
            }}
          >
            ${total(props?.productData)}
          </Text>
          {/* <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{}}
          >
            <AntDesign name="closesquare" size={24} color="#154525" />
          </TouchableOpacity> */}
        </View>

        <View style={{ width: "90%", padding: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Total: ${total(props?.productData) - props?.discount}{" "}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: "green",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Valid Until: {props?.validity && getDate(props?.validity)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              marginTop: 10,
              color: "black",
              color: "white",
            }}
          >
            Pick-Up Location: {handleCoordinate(props.coords)}
          </Text>

          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#989898",
              marginVertical: 10,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#154525",
              padding: 10,
              borderRadius: 10,
              width: "90%",
              alignSelf: "center",
            }}
            onPress={() => props.couponPress(props)}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 17,
              }}
            >
              Done Deal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {props?.productData?.map((row, index) => (
        <View style={{ flex: 1 }} key={index}>
          {/* <TouchableOpacity
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: "#2D2D2D",

              height: 120,
              flexDirection: "row",
              marginTop: 10,
              elevation: 10,
              marginBottom: 10,
              shadowColor: "#191919",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
            }}
          >
            <Image
              source={{
                uri: row?.image,
              }}
              style={{
                width: "30%",
                height: "100%",
                resizeMode: "contain",
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            />
            <View
              style={{
                width: "70%",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: "white",
                  paddingLeft: 10,
                  fontWeight: "700",
                }}
              >
                {row?.name}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  color: "white",
                  paddingLeft: 10,
                }}
              >
                ${row?.price}
              </Text>
              {props?.validity && (
                <Text
                  numberOfLines={1}
                  style={{
                    color: "grey",
                    paddingLeft: 10,
                    fontWeight: "700",
                  }}
                >
                  {getDate(props?.validity)}
                </Text>
              )}
            </View>
          </TouchableOpacity> */}
        </View>
      ))}
      {/* <TouchableOpacity
        style={{
          backgroundColor: "#154525",
          padding: 10,
          borderRadius: 10,
          width: "90%",
          alignSelf: "center",
        }}
        onPress={() => props.couponPress(props)}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          Place Order
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}
function ProductFood({ ...props }) {
  return (
    <>
      <View style={{ width: "100%", flex: 1 }}>
        <View style={{ marginTop: 10, width: "22%", padding: 5 }}>
          <View
            style={{
              width: 120,
              height: 140,
              marginTop: 5,
              borderRadius: 10,
              backgroundColor: "#2D2D2D",
              elevation: 20,
              shadowColor: "#191919",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "50%",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                resizeMode: "stretch",
              }}
              source={
                !props?.item?.image
                  ? require("../assets/logo.png")
                  : { uri: props?.item?.image }
              }
            />

            <View style={{ padding: 5, flex: 1 }}>
              <Text style={{ color: "white", fontSize: 12 }}>
                {props?.item?.name}
              </Text>
              <View
                style={{
                  position: "absolute",
                  bottom: 5,
                  left: 5,
                  width: "100%",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 10, color: "#fff" }}>
                  {!props?.item?.cals ? "" : `${props?.item?.cals} Cals`}
                </Text>
                <Text style={{ fontSize: 10, right: 0, color: "#fff" }}>
                  $ {props?.item?.price}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
