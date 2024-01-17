import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

import { Header } from "../Components/Header";
import EditLocation from "../Components/EditLocation";
import CouponsComp from "../Components/CouponsComp";
import React, { useState, useContext, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { fireDB, auth } from "../config";
import { Context } from "../store";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  getDoc,
  addDoc,
  Timestamp,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { setGuestUser } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
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
export function Coupons({ ...props }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);
  // const { state, dispatch } = useContext(Context);
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [couponData, setCouponData] = useState([]);
  const [orders, setOrders] = useState();
  const [coordinate, setCoordinate] = useState();
  const getDate = (data) => {
    return (
      new Date(data?.seconds * 1000).toDateString() +
      " " +
      new Date(data?.seconds * 1000).toLocaleTimeString()
    );
  };

  useEffect(() => {
    (async () => {
      let startdate = Timestamp.fromDate(new Date());

      const q = query(
        collection(fireDB, "coupons"),
        where("validity", ">=", startdate)
      );
      let products = [];
      const querySnaphot = await getDocs(q);
      querySnaphot.forEach(async (doc) => {
        let newItem = { id: doc.id, ...doc.data() };

        newItem.productData = [];
        newItem.productId?.forEach(async (item, index) => {
          let productData = await getDoc(item);
          if (productData.exists()) {
            newItem.productData[index] = {
              prodId: productData.id,
              ...productData.data(),
            };
          }
        });

        products.push(newItem);
      });

      setTimeout(() => {
        let prod = products.filter(
          (item) =>
            item.status === true &&
            item?.limit >= (item?.users?.length || 0) &&
            item
        );

        let userProd = prod.filter(
          (item) => !item?.users?.includes(state.userId) && item
        );

        setCouponData(userProd);
      }, 1000);
    })();
  }, []);
  function total(arr) {
    if (!Array.isArray(arr)) return;
    let sum = 0;
    arr.forEach((each) => {
      sum += parseFloat(each.price);
    });
    return sum.toFixed(2);
  }
  const orderAPI = async (order) => {
    const orderCol = collection(fireDB, "orders");
    const couponRef = doc(fireDB, "coupons", order?.id);
    const user = auth.currentUser;

    const body = {
      userId: user.uid,
      customerDetail: {
        email: state?.user?.email,
        name: state?.user?.firstName + " " + state?.user?.lastName,
        phoneNumber: state?.user?.phone,
      },
      pickUptimeandDate: state?.date,
      pickUpLocation: state?.position,
      productsToBuy: order.productData,
      total: total(order.productData) - order?.discount,
      status: false,
    };

    await updateDoc(couponRef, {
      users: arrayUnion(user.uid),
    });
    const orderSnap = addDoc(orderCol, body)
      .then((response) => {
        if (response) {
          // deleteCart(docid);
          props.navigation.navigate("Orders");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const placeOrder = (row) => {
    Alert.alert("Confirm Order", "Placing your order now!", [
      {
        text: "Yes, proceed",
        onPress: () => orderAPI(row),
      },
      {
        text: "No, cancel",
        onPress: () => {},
      },
    ]);
  };

  if (state.guestUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#191919" }}>
        <Header
          rightIcon={true}
          rightIconName={"shopping-bag"}
          title="Coupons"
          rightonPress={() => props.navigation.navigate("Cart")}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(setGuestUser(false));
              setTimeout(() => {
                props?.navigation.navigate("Login");
              }, 500);
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                backgroundColor: "#154525",
                padding: 10,
                color: "#fff",
              }}
            >
              Please Login to Use Coupons
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        rightIcon={true}
        rightIconName={"shopping-bag"}
        title="Coupons"
        rightonPress={() => props.navigation.navigate("Cart")}
      />
      <EditLocation handlePress={handlePress} expanded={expanded} />
      {/* If there are  Coupons */}
      {couponData?.length ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={couponData}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => {
            return (
              <CouponsComp
                couponPress={(prop) => {
                  // setModalVisible(!modalVisible);
                  // handleCoordinate();
                  // setOrders(prop);
                  placeOrder(prop);
                }}
                {...item}
              />
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("CouponsScreen")}
          >
            <Text
              style={{
                fontWeight: "bold",
                backgroundColor: "#154525",
                padding: 10,
                color: "#fff",
              }}
            >
              No Deal Found
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#191919",
              borderRadius: 20,
              width: "90%",
              alignItems: "center",
              shadowColor: "#191919",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Image
              source={{
                uri: "https://media.istockphoto.com/photos/hamburgers-cooking-on-the-bbq-picture-id1313615865?s=612x612",
              }}
              style={{
                width: "100%",
                height: 200,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
            />
            <View
              style={{
                width: "100%",
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 12, color: "white" }}
              >
                {/* Premium 2 can Dine */}
                {orders?.productData?.length} Items
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{}}
              >
                <AntDesign name="closesquare" size={24} color="#154525" />
              </TouchableOpacity>
            </View>

            <View style={{ width: "90%", padding: 10 }}>
              <Text style={{ color: "white" }}>
                Total: ${total(orders?.productData) - orders?.discount}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "green",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Valid Until {orders?.validity && getDate(orders?.validity)}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 10,
                  color: "black",
                  color: "white",
                }}
              >
                Pick-Up Location: {coordinate}
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
                onPress={orderAPI}
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
        </TouchableOpacity>
      </Modal>

      {/* If there are No Coupons */}
    </View>
  );
}
