import React, { useContext } from "react";
import { Context } from "../store";
import { View, Text, TouchableOpacity } from "react-native";
import { Header } from "../Components/Header";
import { FontAwesome } from "@expo/vector-icons";
import { Alert, Linking } from "react-native";
import TextTicker from "react-native-text-ticker";
import { setGuestUser } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
export function More({ ...props }) {
  // const { state, dispatch } = useContext(Context);
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  if (state.guestUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#191919" }}>
        <Header
          rightIcon={true}
          rightIconName={"shopping-bag"}
          title="More"
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
              Please Login See Account Details
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
        title="More"
        rightonPress={() => props.navigation.navigate("Cart")}
      />

      <View style={{ width: "100%", padding: 10, backgroundColor: "#191919" }}>
        <Text style={{ color: "#fff", fontSize: 17 }}>
          Hello, {state.user.firstName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("MyAccount")}
        style={{ width: "100%" }}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            justifyContent: "center",
            marginTop: 4,
            borderBottomWidth: 1,
          }}
        >
          <FontAwesome
            name="user-circle"
            style={{ width: "10%" }}
            size={20}
            color="#154525"
          />
          <Text style={{ color: "black", width: "80%", color: "#fff" }}>
            My Account
          </Text>
          <FontAwesome
            name="chevron-right"
            style={{ width: "10%", color: "#154525" }}
            size={18}
            color="#154525"
          />
        </View>
      </TouchableOpacity>

      {/* IF NOT LOGGED IN */}
      {/* <TouchableOpacity
                onPress={() => props.navigation.navigate('MyAccount')}
                style={{ width: '100%', padding: 20, borderBottomWidth: 1, borderColor: '#154525' }}
            >
                <View style={{ width: '100%', flexDirection: 'row', }} >
                    <View style={{ width: '15%', justifyContent: 'center' }}>
                        <FontAwesome name="user-circle" size={26} color="#154525" />
                    </View>
                    <View style={{ width: '75%' }}>
                        <Text numberOfLines={1} style={{ fontSize: 15 }} >
                            Log in / Sign Up
                        </Text>
                    </View>
                    <View style={{ width: '10%' }}>
                        <FontAwesome name="chevron-right" size={22} color="#154525" />
                    </View>
                </View>
            </TouchableOpacity> */}

      <View
        style={{
          position: "absolute",
          width: "90%",
          alignSelf: "center",
          bottom: 30,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Terms of Use", "This action will exit this app", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () =>
                  Linking.openURL(
                    "https://www.freeprivacypolicy.com/live/d901396b-b5c9-43d2-8bd9-5946a941ff98"
                  ),
              },
            ])
          }
        >
          <TextTicker
            style={{ textAlign: "center", color: "#fff", fontSize: 13 }}
            duration={20000}
            loop
            bounce
            repeatSpacer={100}
            marqueeDelay={5000}
          >
            There is a terms and conditions for using Nizam's kathi kabab
          </TextTicker>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Privacy Policy", "This action will  exit this app", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () =>
                  Linking.openURL(
                    "https://www.freeprivacypolicy.com/live/d901396b-b5c9-43d2-8bd9-5946a941ff98"
                  ),
              },
            ])
          }
        >
          <Text
            style={{
              textAlign: "center",
              color: "#154525",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {"\n"}
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <Text style={{ textAlign: "center", color: "#fff", fontSize: 13 }}>
          {"\n"}
          {"\u00A9"}
          Trade Mark Unlimited Corporation
        </Text>
      </View>
    </View>
  );
}
