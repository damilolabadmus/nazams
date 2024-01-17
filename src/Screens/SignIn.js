import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Header } from "../Components/Header";
import * as yup from "yup";
import { Formik } from "formik";
import { fireDB, auth } from "../config";
import FullButton from "../Components/FullButton";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/auth";

export function SignIn({ ...props }) {
  const dispatch = useDispatch();

  const [handlePassword, sethandlePassword] = useState(true);
  const handleSignIn = async (values) => {
    try {
      if (values.email !== "" && values.password !== "") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        const user = userCredential.user;
        const docRef = doc(fireDB, "users", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          dispatch(
            setUser({
              id: user.uid,
              values: docSnap.data(),
            })
          );
          Alert.alert("Greetings", "Good to see you Again!");
        } else {
          Alert.alert(
            "Something went wrong",
            "You provide the wrong credentials"
          );
        }
      } else {
        Alert.alert("Please once more", "Provide your credentials for login");
      }
    } catch (err) {
      Alert.alert(
        "Something went wrong",
        "You provide the wrong credentials for the login"
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title="Sign In"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />

      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            // Submit
            onSubmit={(values) => {
              handleSignIn(values);
            }}
            validationSchema={yup.object().shape({
              email: yup.string().required("Email is Required"),
              password: yup
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
                    <Text style={{ color: "white" }}>Email</Text>
                  </View>
                  <View style={{ justifyContent: "center", width: "60%" }}>
                    <TextInput
                      onChangeText={handleChange("email")}
                      value={values.email}
                      style={{ color: "white" }}
                      numberOfLines={1}
                      placeholder="Enter your Email"
                      placeholderTextColor={"#848484"}
                    />
                  </View>
                </View>
                {touched.email && errors.email && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.email}
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
                    justifyContent: "center",
                    padding: 15,
                    marginBottom: 50,
                  }}
                ></View>

                <View
                  style={{ width: "100%", position: "absolute", bottom: 0 }}
                >
                  <FullButton onPress={handleSubmit} title={"Login"} />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
