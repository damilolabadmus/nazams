import React from "react";

const Payment = () => {
  return <div>Payment</div>;
};

export { Payment };
// import { StyleSheet, View } from "react-native";
// import React from "react";
// import { CreditCardInput } from "react-native-credit-card-input";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Header } from "../Components/Header";
// import Checkout from "../Components/Checkout";
// import { StripeProvider } from "@stripe/stripe-react-native";

// export const Payment = (props) => {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#191919" }}>
//       <Header
//         title="Payment Method"
//         nameicons={"left"}
//         onPress={() => props.navigation.goBack()}
//         rightIcon={true}
//         rightIconName="shopping-bag"
//         rightonPress={() => {
//           props.navigation.navigate("Cart");
//         }}
//       />
//       {/* <View style={{ flex: 1 }}> */}
//       <StripeProvider publishableKey={process.env.publishableKey}>
//         <Checkout />
//       </StripeProvider>
//       {/* </View> */}
//     </SafeAreaView>
//   );
// };
