import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Switch } from "react-native";
import { Header } from "../Components/Header";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { deleteUser } from "firebase/auth";
import { fireDB, auth } from "../config";
import { Context } from "../store";
import { doc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import usePosition from "../hook/usePosition";
// import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setLocation,
  setNotification,
  setPermission,
  setSignOut,
} from "../store/auth";

export const MyAccount = ({ ...props }) => {
  // const { state } = useContext(Context);
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const message = useSelector(({ auth }) => auth);
  const { permission } = message;

  const {
    position,
    stopBackgroundUpdate,
    stopForegroundUpdate,
    startBackgroundUpdate,
    startForegroundUpdate,
    requestPermissions,
  } = usePosition();

  const toggleSwitch = async () => {
    Alert.alert(
      "Notification",
      "Are you sure you want to turn notifications?",
      [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: async () => {
            dispatch(setNotification(!message.notification));
          },
        },
      ]
    );
  };

  useEffect(() => {
    let user = true;
    (async () => {
      if (message.permission) {
        requestPermissions();
        startForegroundUpdate();
        startBackgroundUpdate();
      } else {
        stopForegroundUpdate();
        stopBackgroundUpdate();
      }
      setTimeout(async () => {
        if (user && position) {
          dispatch(
            setLocation({
              latitude: position?.latitude,
              longitude: position?.longitude,
            })
          );
        }
      }, 2000);
    })();
    return () => (user = false);
  }, [message.permission]);

  const toggleLocation = async () => {
    Alert.alert(
      "Location Tracking",
      "Are you sure you want to turn location tracking?",
      [
        {
          text: "Deny",
          onPress: async () => {},
        },
        {
          text: "Accept",
          onPress: async () => {
            dispatch(setPermission(!message.permission));
          },
        },
      ]
    );
  };
  const handleDelete = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: async () => {
            await deleteDoc(doc(fireDB, "users", state.userId));
            await deleteUser(state.user);
            dispatch(setSignOut());
            props.navigation.navigate("Login");
          },
        },
      ]
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        nameicons={"close"}
        title="My Account"
        onPress={() => props.navigation.goBack()}
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          padding: 10,
          borderBottomWidth: 1,
          borderColor: "#fff",
        }}
      >
        <View style={{ width: "80%" }}>
          <Text
            numberOfLines={1}
            style={{ color: "white", fontWeight: "bold" }}
          >
            {state?.user?.firstName} {state?.user?.lastName}
          </Text>
          <Text numberOfLines={1} style={{ color: "#fff" }}>
            {state?.user?.email}
          </Text>
          <Text numberOfLines={1} style={{ color: "#fff" }}>
            {state?.user?.phone}
          </Text>
        </View>
        <View style={{ width: "20%", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#154525",
              padding: 5,
              borderRadius: 10,
            }}
            onPress={() => props.navigation.navigate("UpdateAccount")}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: 10, width: "100%" }}>
        {/* First */}
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderColor: "#fff",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("UpdatePassword")}
            style={{ width: "100%" }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <MaterialIcons
                name="lock"
                style={{ width: "10%" }}
                size={20}
                color="#154525"
              />
              <Text numberOfLines={1} style={{ color: "white", width: "80%" }}>
                Change My Password
              </Text>

              <Feather
                name="chevron-right"
                style={{ width: "10%" }}
                size={18}
                color="#154525"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderColor: "#fff",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => handleDelete()}
            style={{ width: "100%" }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <MaterialCommunityIcons
                name="account-cancel"
                style={{ width: "10%" }}
                size={20}
                color="#154525"
              />
              <Text numberOfLines={1} style={{ color: "white", width: "80%" }}>
                Disable your account
              </Text>

              <Feather
                name="chevron-right"
                style={{ width: "10%" }}
                size={18}
                color="#154525"
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* 2nd */}
        {/* <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderColor: "#fff",
            padding: 20,
            flexDirection: "row",
          }}
        > */}
        {/* <TouchableOpacity onPress={toggleLocation} style={{ width: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <MaterialIcons
                name="my-location"
                style={{ width: "10%" }}
                size={20}
                color="#154525"
              />
              <View style={{ width: "80%" }}>
                <Text
                  numberOfLines={1}
                  style={{ color: "white", width: "100%" }}
                >
                  Location Services{" "}
                  {state?.location?.latitude ? "Enabled" : "Disabled"}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                style={{ width: "10%" }}
                size={18}
                color="#154525"
              />
            </View>
          </TouchableOpacity> */}
        {/* </View> */}
        {/* 3rd */}
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderColor: "#fff",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="my-location"
              style={{ width: "10%" }}
              size={20}
              color="#154525"
            />

            <View style={{ width: "75%" }}>
              <Text numberOfLines={1} style={{ color: "white", width: "100%" }}>
                Location
              </Text>
              <Text
                numberOfLines={1}
                style={{ color: "grey", fontSize: 11, width: "100%" }}
              >
                You can turn your Location
              </Text>
            </View>
            <Switch
              style={{ width: "15%" }}
              trackColor={{ false: "#767577", true: "#154525" }}
              thumbColor={message.permission ? "#fff" : "#fff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleLocation}
              value={message.permission}
            />
          </View>
        </View>
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderColor: "#fff",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo
              name="bell"
              style={{ width: "10%" }}
              size={20}
              color="#154525"
            />
            <View style={{ width: "75%" }}>
              <Text numberOfLines={1} style={{ color: "white", width: "100%" }}>
                Notifications
              </Text>
              <Text
                numberOfLines={1}
                style={{ color: "grey", fontSize: 11, width: "100%" }}
              >
                You can turn your Notifications from here
              </Text>
            </View>
            <Switch
              style={{ width: "15%" }}
              trackColor={{ false: "#767577", true: "#154525" }}
              thumbColor={message.notification ? "#fff" : "#fff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={message.notification}
            />
          </View>
        </View>
      </View>

      <View style={{ padding: 10, width: "100%" }}>
        {/* <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderColor: "#fff",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Payment")}
            style={{ width: "100%" }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Entypo
                name="credit-card"
                style={{ width: "10%" }}
                size={20}
                color="#154525"
              />
              <Text numberOfLines={1} style={{ color: "white", width: "80%" }}>
                Add Payment Method
              </Text>
              <AntDesign
                name="pluscircle"
                style={{ width: "10%" }}
                size={18}
                color="#154525"
              />
            </View>
          </TouchableOpacity>
        </View> */}
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderColor: "#fff",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Gift Card",
                "Comming Soon"
              )
            }
            style={{ width: "100%" }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="gift"
                style={{ width: "10%" }}
                size={20}
                color="#154525"
              />
              <View style={{ width: "80%" }}>
                <Text
                  numberOfLines={1}
                  style={{ color: "white", width: "80%" }}
                >
                  Gift Card
                </Text>
                <Text
                  numberOfLines={2}
                  style={{ color: "grey", fontSize: 11, width: "100%" }}
                >
                  On 100 orders in single a month
                </Text>
              </View>
              <Feather
                name="chevron-right"
                style={{ width: "10%" }}
                size={18}
                color="#154525"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          padding: 15,
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            // await SecureStore.deleteItemAsync("userId");
            // await SecureStore.deleteItemAsync("userData");
            // dispatch({ type: "DELETE_USER" });
            dispatch(setSignOut());
            signOut(auth);
            setTimeout(() => {
              props.navigation.navigate("Login");
            }, 2000);
          }}
          style={{
            width: "100%",
            backgroundColor: "#154525",
            padding: 15,
            borderRadius: 15,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
