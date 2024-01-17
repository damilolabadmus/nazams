import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Checkout = () => {
  return (
    <View>
      <Text>Checkout</Text>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({});
// import {
//   StyleSheet,
//   Text,
//   View,
//   Alert,
//   TextInput,
//   Button,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState, useEffect, useContext } from "react";
// import {
//   useStripe,
//   CardField,
//   useConfirmPayment,
//   useConfirmSetupIntent,
// } from "@stripe/stripe-react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { CreditCardInput } from "react-native-credit-card-input";
// import FullButton from "./FullButton";
// import { ScrollView } from "react-native-gesture-handler";
// import { Context } from "../store";
// let API_URL = "https://keventerbackend.vercel.app/";
// const Checkout = (props) => {
//   const [name, setName] = useState("");
//   const [card, setCard] = useState("");
//   const { state, dispatch } = useContext(Context);
//   const [amount, setAmount] = useState("1");
//   const stripe = useStripe();
//   const { confirmSetupIntent, loading: load } = useConfirmSetupIntent();
//   const { confirmPayment, loading } = useConfirmPayment();

//   const donate = async () => {
//     try {
//       const finalAmount = parseInt(amount);
//       console.log(finalAmount);
//       if (finalAmount < 1) return Alert.alert("You cannot donate below 1 USD");
//       const response = await fetch(`${API_URL}/nizams/create-payment-intent`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount: finalAmount, name }),
//       });
//       const data = await response.json();
//       console.log(data);
//       if (!response.ok) {
//         return Alert.alert(data.message);
//       }
//       if (!card) {
//         return Alert.alert("Add Card Details");
//       }
//       const { paymentIntent, error } = await confirmPayment(data.clientSecret, {
//         paymentMethodType: ["Card"],
//         paymentMethodData: {
//           billingDetails: {
//             email: state?.user?.email,
//           },
//         },
//       });

//       if (error) {
//         Alert.alert("Payment confirmation error", "error");
//         console.log(error);
//       } else if (paymentIntent) {
//         Alert.alert("Success from promise", "paymentIntent");
//         console.log(paymentIntent);
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Payment failed!");
//     }
//   };
//   // const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   // const [loading, setLoading] = useState(false);

//   // const fetchPaymentSheetParams = async () => {
//   //   const response = await fetch(`${API_URL}/nizams/create-payment-intent`, {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //   });
//   //   const { setupIntent, ephemeralKey, customer } = await response.json();

//   //   return {
//   //     setupIntent,
//   //     ephemeralKey,
//   //     customer,
//   //   };
//   // };

//   // const initializePaymentSheet = async () => {
//   //   const { setupIntent, ephemeralKey, customer } =
//   //     await fetchPaymentSheetParams();

//   //   const { error } = await initPaymentSheet({
//   //     customerId: customer,
//   //     customerEphemeralKeySecret: ephemeralKey,
//   //     setupIntentClientSecret: setupIntent,
//   //   });
//   //   if (!error) {
//   //     setLoading(true);
//   //   }
//   // };

//   // const openPaymentSheet = async () => {
//   //   const { error } = await presentPaymentSheet();

//   //   if (error) {
//   //     Alert.alert(`Error code: ${error.code}`, error.message);
//   //   } else {
//   //     Alert.alert(
//   //       "Success",
//   //       "Your payment method is successfully set up for future payments!"
//   //     );
//   //   }
//   // };

//   // useEffect(() => {
//   //   initializePaymentSheet();
//   // }, []);

//   // const initSheet = await stripe.initPaymentSheet({
//   //   paymentIntentClientSecret: data.clientSecret,
//   // });
//   // if (initSheet.error) {
//   //   console.error(initSheet.error);
//   //   return Alert.alert(initSheet.error.message);
//   // }
//   // const presentSheet = await stripe.presentPaymentSheet({
//   //   clientSecret: data.clientSecret,
//   // });
//   // if (presentSheet.error) {
//   //   console.error(presentSheet.error);
//   //   return Alert.alert(presentSheet.error.message);
//   // }
//   // Alert.alert("Donated successfully! Thank you for the donation.");

//   return (
//     <>
//       <ScrollView>
//         <View
//           style={{
//             borderWidth: 2,
//             borderRadius: 10,
//             padding: 10,
//             margin: 10,
//             borderColor: "#154525",
//             flex: 1,
//           }}
//         >
//           <Text
//             style={{
//               padding: 10,

//               borderRadius: 10,
//               margin: 10,
//               color: "#fff",
//               textAlign: "center",
//               fontWeight: "bold",
//               fontSize: 24,
//             }}
//           >
//             Add Credit Card
//           </Text>
//           <CardField
//             postalCodeEnabled={false}
//             placeholder={{
//               number: "4242 4242 4242 4242",
//             }}
//             cardStyle={{
//               backgroundColor: "#FFFFFF",
//               textColor: "#000000",
//             }}
//             style={{
//               width: "100%",
//               height: 50,
//               marginVertical: 30,
//             }}
//             onCardChange={(cardDetails) => {
//               console.log(cardDetails);
//               setCard(cardDetails);
//             }}
//             onFocus={(focusedField) => {
//               console.log("focusField", focusedField);
//             }}
//           />

//           {/* <CreditCardInput
//             onChange={_onChange}
//             inputStyle={{ color: "#fff" }}
//             labelStyle={{ color: "#fff" }}
//             allowScroll
//             requiresName
//             // requiresPostalCode
//             inputContainerStyle={{
//               borderBottomColor: "#fff",
//               borderBottomWidth: 1,
//             }}
//           /> */}
//           <View style={{ flexGrow: 1 }}>
//             <TextInput
//               onChangeText={setName}
//               value={name}
//               placeholder="Card Holder Name"
//               style={{
//                 backgroundColor: "#FFFFFF",
//                 color: "#000000",
//                 padding: 10,
//               }}
//             />
//           </View>
//         </View>
//       </ScrollView>
//       <TouchableOpacity
//         style={{
//           padding: 10,
//           borderColor: "black",
//           borderWidth: 1,
//           borderRadius: 10,
//           margin: 10,
//           backgroundColor: "#154525",
//         }}
//         onPress={donate}
//       >
//         <Text style={{ color: "#fff", textAlign: "center" }}>
//           Checkout Payment
//         </Text>
//       </TouchableOpacity>
//     </>
//   );
// };

// export default Checkout;

// const styles = StyleSheet.create({});
