import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { List } from "react-native-paper";
import { Header } from "../Components/Header";
import { AntDesign } from "@expo/vector-icons";
import FullButton from "../Components/FullButton";
import { Context } from "../store";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Modal } from "react-native";
import { DataTable } from "react-native-paper";
import {
  useConfirmPayment,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import Loader from "../Components/Loader";
// Firebase Implementation

import { fireDB } from "../config";
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

import { useSelector } from "react-redux";
let API_URL = "https://keventerbackend.vercel.app";
// let API_URL = "http://192.168.0.104:5000";

const getDate = (data) => {
  return (
    new Date(data?.seconds * 1000).toLocaleTimeString() +
    " " +
    new Date(data?.seconds * 1000).toLocaleDateString()
  );
};
export const PaymentDetails = ({ ...props }) => {
  const { createPaymentMethod, handleCardAction } = useStripe();

  const state = useSelector(({ auth }) => auth);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [cartDetails, setcartDetails] = useState();
  const [name, setName] = useState("");
  const [card, setCard] = useState();
  const [docid, setdocid] = useState();
  const [total, setTotal] = useState({
    subtotal: 0,
    tax: 0,
    totalForproduct: 0,
  });

  // delete cart
  const deleteCart = (docscart) => {
    const delRef = doc(fireDB, "carts", docscart);
    deleteDoc(delRef)
      .then((res) => {})
      .catch((err) => {
        // console.log(err)
      });
  };
  // useEffect(() => {
  //   let isMounted = true;

  //   getCartDetailsForPlacingOrder();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);
  // useEffect(() => {
  //   let isMounted = true;
  //   const arr = [];
  //   newTotal();

  //   cartDetails?.map((item, index) => {
  //     arr.push(getProductDetails(item.productId));
  //   });
  //   Promise.all(arr).then((res) => {
  //     res?.forEach((item, index) => {
  //       cartDetails[index].name = item.name;
  //       setcartDetails(cartDetails);
  //     });
  //   });
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [cartDetails]);
  // For Prices and Taxes and Total
  const calculatePrices = useMemo(() => {
    if (cartDetails) {
      let sum = 0;
      cartDetails?.forEach(function (value) {
        sum += parseFloat(value.total);
      });
      return sum;
    } else {
      return 0;
    }
  }, [cartDetails]);
  const subTotal = useMemo(() => {
    const subtaxes = calculatePrices * 0.13;
    return calculatePrices + subtaxes;
  }, [calculatePrices]);

  const newTotal = () => {
    if (cartDetails) {
      var totalWithoutTax = 0;
      var taxes = 0;
      var totalWithTaxes = 0;
      for (var i = 0; i < cartDetails.length; i++) {
        totalWithoutTax += cartDetails[i].total;
      }

      taxes = totalWithoutTax * 0.13;
      totalWithTaxes = taxes + totalWithoutTax;
      setTotal({
        subtotal: totalWithoutTax,
        tax: taxes.toFixed(2),
        totalForproduct: totalWithTaxes.toFixed(2),
      });
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const colref = collection(fireDB, "carts");
          const userIdref = query(colref, where("userId", "==", state.userId));
          await onSnapshot(userIdref, (cartProducts) => {
            cartProducts.forEach((doc) => {
              setdocid(doc.id);
              setcartDetails(doc.data().productId);
            });
          });
        } catch (e) {
          console.log(e);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [loading])
  );

  // const getCartDetailsForPlacingOrder = async () => {
  //   const cartdeets = collection(fireDB, "carts");
  //   const userIdref = query(cartdeets, where("userId", "==", state.userId));
  //   const carts = await onSnapshot(userIdref, (querySnapshot) => {
  //     querySnapshot.forEach((item) => {
  //       setdocid(item.id);
  //       setcartDetails(item.data().productId);
  //     });
  //   });
  //   // console.log(docid);
  // };
  const { confirmPayment } = useConfirmPayment();

  const handlePayment = async () => {
    try {
      const finalAmount = parseFloat(subTotal);
      if (finalAmount < 1) return Alert.alert("You cannot Order below 1 CAD");
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            email: state?.user?.email,
            phone: state?.user?.phone,
            addressLine1: state?.position,
          },
        },
      });

      const response = await fetch(`${API_URL}/nizams/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: finalAmount,
        }),
      });
      const result = await response.json();

      const {
        error: paymentIntentError,
        requiresAction,
        clientSecret,
      } = result;
      if (paymentIntentError) {
        // Error creating or confirming PaymentIntent

        Alert.alert("Error", paymentIntentError);
        return;
      }

      if (clientSecret && !requiresAction) {
        // Payment succeeded
        orderAPI();
        Alert.alert(
          "Payment Confirmed",
          "Success! The payment was confirmed successfully!"
        );
      }

      if (clientSecret && requiresAction) {
        const { error, paymentIntent } = await handleCardAction(clientSecret);

        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else if (paymentIntent) {
          if (
            paymentIntent.status === paymentIntent.status.requiresConfirmation
          ) {
            // Confirm the PaymentIntent again on your server
            const response = await fetch(`${API_URL}/nizams/pay`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
            });
            const { error, success } = await response.json();
            if (error) {
              // Error during confirming Intent
              Alert.alert("Error", error);
            } else if (success) {
              orderAPI();
              Alert.alert(
                "Payment Confirmation",
                "Success! Your payment has been confirmed successfully!"
              );
            }
          } else {
            // Payment succedeed
            orderAPI();
            Alert.alert(
              "Payment Confirmation",
              "Your payment has been successfully confirmed!"
            );
          }
        }
      }

      // const response = await fetch(`${API_URL}/nizams/create-payment-intent`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ amount: finalAmount, name }),
      // });
      // const finalAmount = parseFloat(subTotal);
      // console.log(finalAmount);
      // if (finalAmount < 1) return Alert.alert("You cannot Order below 1 CAD");
      // setPayLoading(true);
      // const response = await fetch(`${API_URL}/nizams/create-payment-intent`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ amount: finalAmount, name }),
      // });
      // const data = await response.json();
      // console.log(data);
      // if (!response.ok) {
      //   return Alert.alert(data.message);
      // }
      // if (!card) {
      //   return Alert.alert("Add Card Details");
      // }
      // const { paymentIntent, error } = await confirmPayment(data.clientSecret, {
      //   paymentMethodType: "Card",
      //   paymentMethodData: {
      //     billingDetails: {
      //       email: state?.user?.email,
      //     },
      //   },
      // });
      // console.log(paymentIntent, error);
      // if (paymentIntent) {
      //   Alert.alert("Success from promise", "paymentIntent");
      //   orderAPI();
      //   setPayLoading(false);
      //   console.log(paymentIntent);
      // } else if (error) {
      //   if (error.message === "You must provide paymentMethodType") {
      //     // orderAPI();
      //     setPayLoading(false);
      //   } else {
      //     Alert.alert("Payment confirmation error", "error");
      //   }
      // }
    } catch (err) {
      console.error(err);
      Alert.alert("Payment Failed", "Oops! Your payment has failed.");
    }
  };
  const getProductDetails = async (productDocId) => {
    const prodColref = doc(fireDB, "products", productDocId);
    return new Promise(async (rsl, rej) => {
      const docSnap = await onSnapshot(prodColref, (results) => {
        if (results.exists()) {
          rsl(results.data());
        } else {
          rej("No Products Found");
        }
      });
    });
  };

  const orderAPI = () => {
    const orderCol = collection(fireDB, "orders");

    var tempArray = [];
    cartDetails.map((item, index) => {
      tempArray.push({ name: item?.name, quantity: item?.quantity });
    });

    const orderSnap = addDoc(orderCol, {
      userId: state?.userId,
      customerDetail: {
        email: state?.user?.email,
        name: state?.user?.firstName + " " + state?.user?.lastName,
        phoneNumber: state?.user?.phone,
      },
      pickUptimeandDate: state?.date,
      pickUpLocation: state?.position,
      subtotal: calculatePrices,
      taxes: calculatePrices * 0.13,
      total: subTotal,
      productsToBuy: tempArray,
      status: false,
    })
      .then((response) => {
        if (response) {
          deleteCart(docid);
          props.navigation.navigate("Orders");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const placeOrder = () => {
    Alert.alert("Confirm Order", "Placing your order now!", [
      {
        text: "Yes, proceed",
        onPress: () => setModalVisible(true),
      },
      {
        text: "No, cancel",
        onPress: () => {},
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#2D2D2D" }}>
      <Header
        title="Payment Details"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {payLoading ? <Loader /> : <Text></Text>}
        <View
          style={{
            width: "100%",
            backgroundColor: "#191919",
            elevation: 10,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            marginBottom: 10,
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#191919",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              Payment Method
            </Text>
            {/* <TouchableOpacity
              onPress={() => props.navigation.navigate("OrderSetup")}
            >
              <Text style={{ fontSize: 12, color: "#154525" }}>
                Add a New Card
              </Text>
            </TouchableOpacity> */}
          </View>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <AntDesign name="infocirlce" size={24} color="#154525" />
            <Text
              numberOfLines={2}
              style={{
                marginLeft: 10,
                width: "90%",
                color: "#fff",
                fontSize: 12,
                fontStyle: "italic",
                marginTop: 4,
              }}
            >
              Please complete Credit Detail before to order
            </Text>
          </View>

          <Text style={{ color: "#fff" }}>
            By default you will have to pay cash on pickup
          </Text>
        </View>
        {state?.position ? (
          <View
            style={{
              width: "100%",
              backgroundColor: "#191919",
              elevation: 10,
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              marginBottom: 10,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#191919",
              }}
            >
              <View>
                <Text style={{ color: "#ccc", fontSize: 12 }}>
                  Pickup Location
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("OrderSetup", {
                    pickup: "true",
                  })
                }
              >
                <Text style={{ fontSize: 12, color: "#154525" }}>
                  Edit Pickup Location
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {state?.position}
            </Text>

            <Text style={{ color: "#ccc", fontSize: 12 }}>
              Pickup Date and Time
            </Text>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {getDate(state?.date)}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("OrderSetup", {
                pickup: "true",
              })
            }
          >
            <View style={{ flexDirection: "row", padding: 10 }}>
              <FontAwesome5 name="location-arrow" size={24} color="#154525" />
              <Text
                numberOfLines={2}
                style={{
                  marginLeft: 10,
                  width: "90%",
                  color: "#fff",
                  fontSize: 12,
                  fontStyle: "italic",
                  marginTop: 4,
                }}
              >
                Please Add a Location and Time to proceed your order
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {state.guestUser ? (
          <>
            <View
              style={{
                padding: 12,
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#191919",
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#fff" }}>
                Your Details
              </Text>

              <Text
                style={{ fontWeight: "bold", color: "#fff", marginTop: 10 }}
              >
                Please Login to See Your Details
              </Text>
            </View>
          </>
        ) : (
          <View
            style={{
              padding: 15,
              width: "100%",
              alignSelf: "center",
              backgroundColor: "#191919",
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 10,
            }}
          >
            <Text style={{ color: "#ccc", fontSize: 12 }}>Your Details</Text>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {state.user.firstName} {state.user.lastName}
            </Text>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {state.user.email}
            </Text>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {state.user.phone}
            </Text>
          </View>
        )}

        <List.Accordion
          title="Order Details"
          theme={{
            colors: {
              primary: "#fff",
              background: "#2D2D2D",
              disabled: "#fff",
              borderWidth: 1,
              text: "#fff",
            },
          }}
          titleStyle={{
            color: "#fff",
          }}
        >
          <View
            style={{
              elevation: 10,
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              backgroundColor: "#191919",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "#fff",
                paddingTop: 15,
                paddingLeft: 15,
              }}
            >
              {cartDetails?.length} Items
            </Text>

            <DataTable
              style={{
                backgroundColor: "#191919",
                color: "#fff",
                paddingVertical: 25,
              }}
            >
              <DataTable.Header>
                <DataTable.Title
                  textStyle={{ color: "#154525", fontWeight: "bold" }}
                >
                  Image
                </DataTable.Title>
                <DataTable.Title
                  textStyle={{ color: "#154525", fontWeight: "bold" }}
                >
                  Name
                </DataTable.Title>
                <DataTable.Title
                  numeric
                  textStyle={{ color: "#154525", fontWeight: "bold" }}
                >
                  order
                </DataTable.Title>
                <DataTable.Title
                  numeric
                  textStyle={{ color: "#154525", fontWeight: "bold" }}
                >
                  Price
                </DataTable.Title>
              </DataTable.Header>
              {cartDetails?.map((item, index) => (
                <DataTable.Row
                  key={index}
                  style={{ color: "#fff", borderColor: "#fff" }}
                >
                  <DataTable.Cell>
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 10 }}
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../assets/logo.png")
                      }
                    />
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{ color: "#fff", fontWeight: "bold" }}
                  >
                    {item.name}
                  </DataTable.Cell>
                  <DataTable.Cell
                    numeric
                    textStyle={{
                      color: "#fff",
                      paddingHorizontal: 6,
                      backgroundColor: "#144525",
                      borderRadius: 4,
                      paddingVertical: 6,
                    }}
                  >
                    {item?.quantity}
                  </DataTable.Cell>
                  <DataTable.Cell numeric textStyle={{ color: "#fff" }}>
                    ${item?.total}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        </List.Accordion>
        <View
          style={{
            backgroundColor: "#191919",
            width: "100%",
            elevation: 10,
            padding: 10,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            alignSelf: "center",
            marginTop: 10,
            marginBottom: 100,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#fff" }}>Sub Total</Text>
            <Text style={{ color: "#fff" }}>${calculatePrices}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#fff" }}>Taxes</Text>
            <Text style={{ color: "#fff" }}>
              ${(calculatePrices * 0.13).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: "#EBEBEB",
              borderBottomWidth: 1,
              marginTop: 4,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Total</Text>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              ${subTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "#191919",
              // borderRadius: 20,
              padding: 10,
              width: 400,
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
            <View
              style={{
                width: "100%",
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
                Add Payment Detail
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{}}
              >
                <AntDesign name="closesquare" size={24} color="#154525" />
              </TouchableOpacity>
            </View>
            <View style={{ width: "95%", padding: 10 }}>
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                  backgroundColor: "#FFFFFF",
                  textColor: "#000000",
                }}
                style={{
                  width: "100%",
                  height: 50,
                  marginVertical: 20,
                }}
                onCardChange={(cardDetails) => {
                  setCard(cardDetails);
                }}
                // onFocus={(focusedField) => {
                //   console.log("focusField", focusedField);
                // }}
              />
            </View>
            <View style={{ width: "95%", paddingHorizontal: 10 }}>
              <TextInput
                onChangeText={setName}
                value={name}
                placeholder="Card Holder Name"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  padding: 15,
                  borderRadius: 5,
                }}
              />
            </View>
            <View style={{ width: "100%", padding: 10 }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 10,
                  margin: 10,
                  backgroundColor: "#154525",
                }}
                onPress={handlePayment}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Checkout Payment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FullButton
        title={"Place Order"}
        onPress={() => {
          if (state.guestUser) {
            Alert.alert("Login Required", "Please login to continue.");
          } else if (state?.position) {
            placeOrder();
          } else {
            Alert.alert(
              "Attention Required",
              "Please add a location and a date."
            );
          }
        }}
      />
    </View>
  );
};
