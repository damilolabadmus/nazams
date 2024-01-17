import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Header } from "../Components/Header";
import { useFocusEffect } from "@react-navigation/native";
import EditLocation from "../Components/EditLocation";
import moment from "moment";
import { fireDB } from "../config";
import { Context } from "../store";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { ToggleButton } from "react-native-paper";
import { setGuestUser } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
export function Orders({ ...props }) {
  // const { state, dispatch } = useContext(Context);
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState("queue");
  const handlePress = () => setExpanded(!expanded);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          let tempData = [];
          const colRef = collection(fireDB, "orders");
          const q = query(
            colRef,
            where("userId", "==", state.userId),
            orderBy("pickUptimeandDate", "desc")
          );
          const qurey = await onSnapshot(q, (orders) => {
            orders.forEach((doc) => {
              tempData.push({ id: doc.id, ...doc.data() });
            });
            if (isActive) {
              setOrders(tempData);
            }
          });
        } catch (err) {
          console.log(err);
        }
      })();

      return () => {
        isActive = false;
      };
    }, [])
  );
  // useEffect(() => {
  //   let isMounted = true;
  //   (async () => {
  //     try {
  //       let tempData = [];
  //       const colRef = collection(fireDB, "orders");
  //       const q = query(colRef, where("userId", "==", state.userId));
  //       const qurey = await onSnapshot(q, (orders) => {
  //         orders.forEach((doc) => {
  //           tempData.push(doc.data());
  //         });
  //         if (isMounted) {
  //           setOrders(tempData);
  //         }
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   })();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const getOrders = async () => {
    try {
      let tempData = [];
      const colRef = collection(fireDB, "orders");
      const q = query(colRef, where("userId", "==", state.userId));
      const qurey = await onSnapshot(q, (orders) => {
        orders.forEach((doc) => {
          tempData.push(doc.data());
        });
        setOrders(tempData);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const convertUnix = (val) => {
    return moment(val).format("ll");
  };

  if (state.guestUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#191919" }}>
        <Header
          rightIcon={true}
          rightIconName={"shopping-bag"}
          title="Orders"
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
                borderRadius: 10,
              }}
            >
              Please Login to Place Orders
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
        title="Orders"
        rightonPress={() => props.navigation.navigate("Cart")}
      />

      <EditLocation handlePress={handlePress} expanded={expanded} />
      <View style={{ alignSelf: "center", marginTop: 10 }}>
        <ToggleButton.Row
          onValueChange={(value) => setValue(value)}
          value={value}
          style={{
            borderColor: "#154525",
            borderWidth: 2,
            borderRadius: 10,
            width: 220,
            alignSelf: "center",
          }}
        >
          <ToggleButton
            style={{
              width: 110,
              backgroundColor: value === "queue" ? "#fff" : "#2d2d2d",
              borderRadius: 10,
            }}
            icon={() => (
              <View>
                <Text
                  style={{
                    color: value === "queue" ? "#2d2d2d" : "#fff",
                  }}
                >
                  In Queue
                </Text>
              </View>
            )}
            value="queue"
          />
          <ToggleButton
            style={{
              width: 105,
              backgroundColor: value === "pickuped" ? "#fff" : "#303030",
              borderRadius: 10,
            }}
            icon={() => (
              <View>
                <Text
                  style={{ color: value === "pickuped" ? "#2d2d2d" : "#fff" }}
                >
                  Pickuped
                </Text>
              </View>
            )}
            value="pickuped"
          />
        </ToggleButton.Row>
      </View>

      {orders && orders.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={orders}
            renderItem={(item, index) => {
              return !item?.item?.status && value === "queue" ? (
                <OrdersComp
                  image={item?.item?.image}
                  title={item?.item?.name}
                  price={item?.item?.price}
                  productsToBuy={item?.item?.productsToBuy}
                  pickUptimeandDate={item?.item?.pickUptimeandDate}
                  total={item?.item?.total}
                  id={item?.item?.id}
                />
              ) : item?.item?.status && value === "pickuped" ? (
                <OrdersComp
                  image={item?.item?.image}
                  title={item?.item?.name}
                  price={item?.item?.price}
                  productsToBuy={item?.item?.productsToBuy}
                  pickUptimeandDate={item?.item?.pickUptimeandDate}
                  total={item?.item?.total}
                  id={item?.item?.id}
                />
              ) : (
                <View>
                  <Text>No Order Found</Text>
                </View>
              );
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#191919",
            alignItems: "center",
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "#fff" }}>
              No Orders Yet!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("MenuCategories");
            }}
            style={{
              backgroundColor: "#154525",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              Order Now!
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function OrdersComp({ ...props }) {
  const getDate = (data) => {
    return (
      new Date(data?.seconds * 1000).toLocaleTimeString() +
      " " +
      new Date(data?.seconds * 1000).toLocaleDateString()
    );
  };
  return (
    <View
      style={{
        width: "90%",
        marginBottom: 10,
        marginTop: 10,
        alignSelf: "center",
        padding: 10,
        backgroundColor: "#3C3C3C",
        elevation: 30,
        shadowColor: "#191919",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderRadius: 10,
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={
            props.image
              ? { uri: props.image }
              : require("../assets/nizamslogo.png")
          }
          style={{
            width: 90,
            height: 100,
            resizeMode: "contain",
          }}
        />

        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              height: "100%",
              width: "90%",
            }}
          >
            {props?.productsToBuy?.map((i, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "75%",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      width: "60%",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {i.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ fontWeight: "bold", color: "white" }}
                  >
                    x{i.quantity}
                  </Text>
                </View>
              );
            })}
            <View style={{ marginVertical: 5 }}>
              <Text style={{ fontWeight: "bold", color: "white" }}>
                Dated: {getDate(props.pickUptimeandDate)}
              </Text>
              <Text style={{ color: "white" }}>
                Total: ${props?.total && parseFloat(props?.total)?.toFixed(2)}
              </Text>
              <Text style={{ color: "white" }}>
                OrderId: NKK- {props?.id?.match(/\d+/g).join("")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
