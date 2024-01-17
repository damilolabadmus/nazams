import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Header } from "../Components/Header";

import * as yup from "yup";
import { Formik } from "formik";
import { auth } from "../config";
import FullButton from "../Components/FullButton";

import { updatePassword } from "firebase/auth";
import { Context } from "../store";
// import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setSignOut } from "../store/auth";

export function UpdatePassword({ ...props }) {
  // const { dispatch } = useContext(Context);
  const dispatch = useDispatch();

  const [handlePassword, sethandlePassword] = useState(true);
  const handleUpdatePassword = async (values) => {
    try {
      if (values.password !== values.confirm) {
        alert("Password must be matched!");
      } else {
        const user = auth.currentUser;
        const usercredentials = await updatePassword(user, values.password);
        dispatch(setSignOut());
        alert("Your password has been updated");
        props.navigation.navigate("Login");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title="Update Password"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />

      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView>
          <Formik
            initialValues={{
              password: "",
              confirm: "",
            }}
            // Submit
            onSubmit={(values) => {
              handleUpdatePassword(values);
            }}
            validationSchema={yup.object().shape({
              password: yup
                .string()
                .min(6, "Password can not be less than 6 characters.")
                .required(),
              confirm: yup
                .string()
                .min(6, "Password can not be less than 6 characters.")
                .required(),
            })}
          >
            {({ handleChange, errors, touched, handleSubmit, values }) => (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    width: "100%",
                    borderBottomWidth: 1,
                    borderColor: "#848484",
                    flexDirection: "row",
                    padding: 25,
                  }}
                >
                  <View style={{ justifyContent: "center", width: "25%" }}>
                    <Text style={{ color: "white" }}>Password</Text>
                  </View>
                  <View style={{ justifyContent: "center", width: "60%" }}>
                    <TextInput
                      secureTextEntry={handlePassword}
                      onChangeText={handleChange("password")}
                      value={values.password}
                      style={{ color: "white" }}
                      numberOfLines={1}
                      placeholder="Enter Your Password"
                      placeholderTextColor={"#848484"}
                    />
                  </View>
                  <View style={{ justifyContent: "center", width: "15%" }}>
                    <TouchableOpacity
                      onPress={() => sethandlePassword(!handlePassword)}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          color: "#E4780E",
                        }}
                      >
                        Show
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {touched.password && errors.password && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.password}
                  </Text>
                )}
                <View
                  style={{
                    width: "100%",
                    borderBottomWidth: 1,
                    borderColor: "#848484",
                    flexDirection: "row",
                    padding: 25,
                  }}
                >
                  <View style={{ justifyContent: "center", width: "25%" }}>
                    <Text style={{ color: "white" }}>Confirm</Text>
                  </View>
                  <View style={{ justifyContent: "center", width: "60%" }}>
                    <TextInput
                      secureTextEntry={handlePassword}
                      onChangeText={handleChange("confirm")}
                      value={values.confirm}
                      style={{ color: "white" }}
                      numberOfLines={1}
                      placeholder="Confirm Your Password"
                      placeholderTextColor={"#848484"}
                    />
                  </View>
                  {/* <View style={{ justifyContent: "center", width: "15%" }}>
                    <TouchableOpacity
                      onPress={() => sethandlePassword(!handlePassword)}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          color: "#E4780E",
                        }}
                      >
                        Show
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                </View>
                {touched.password && errors.password && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.password}
                  </Text>
                )}
                <View
                  style={{
                    justifyContent: "center",
                    padding: 15,
                    marginBottom: 50,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    Password must match &amp; contain between 6 and 15
                    characters and include number and and a letter
                  </Text>
                </View>

                <View
                  style={{ width: "100%", position: "absolute", bottom: 0 }}
                >
                  <FullButton onPress={handleSubmit} title={"Save"} />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
