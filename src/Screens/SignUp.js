import React, { useState, useContext } from "react";
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
import { InputLabel } from "../Components/InputLabel";
import * as yup from "yup";
import { Formik } from "formik";
import { fireDB, auth } from "../config";
import FullButton from "../Components/FullButton";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Context } from "../store";
// import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setUser } from "../store/auth";
export function SignUp({ ...props }) {
  // const { dispatch } = useContext(Context);
  const dispatch = useDispatch();
  const [handlePassword, sethandlePassword] = useState(true);
  const handleSignUp = async (values) => {
    try {
      const usercredentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const { user } = usercredentials;
      if (user.uid) {
        // await setDoc(doc(db, "users", user.uid), values);
        await setDoc(doc(fireDB, "users", user.uid), values);
        // await SecureStore.setItemAsync("userId", JSON.stringify(user.uid));
        // await SecureStore.setItemAsync("userData", JSON.stringify(values));
        // dispatch({ type: "CREATE", payload: { id: user.uid, values } });
        dispatch(setUser({ id: user.uid, values }));

        Alert.alert(
          "Welcome to Nizam's Kathi Kabab",
          "Thank you for joining us!"
        );
        // props.navigation.navigate("SignIn");
      }
    } catch (error) {
      // alert(error);
      Alert.alert(
        "Something went wrong",
        "This email is already in use. Please try another one"
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title="Sign Up"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />

      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView>
          <Formik
            initialValues={{
              email: "",
              password: "",
              phone: "",
              title: "",
              firstName: "",
              lastName: "",
              extension: "",
            }}
            // Submit
            onSubmit={(values) => {
              handleSignUp(values);
            }}
            validationSchema={yup.object().shape({
              email: yup.string().required("Email is Required"),
              password: yup
                .string()
                .min(6, "Password can not be less than 6 characters.")
                .required(),
              title: yup.string().required("Title is Required"),
              firstName: yup.string().required("First Name is Required"),
              lastName: yup.string().required("Last Name is Required"),
              phone: yup.string().required("Phone Number is Required"),
            })}
          >
            {({ handleChange, errors, touched, handleSubmit, values }) => (
              <View style={{ flex: 1 }}>
                <InputLabel
                  onChangeText={handleChange("email")}
                  value={values.email}
                  labelInput="Email"
                  placeholder={"Enter Your Email"}
                />
                {touched.email && errors.email && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.email}
                  </Text>
                )}

                <InputLabel
                  onChangeText={handleChange("title")}
                  value={values.title}
                  labelInput="Title"
                  placeholder={"Mr / Mrs / Miss"}
                />

                {touched.title && errors.title && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.title}
                  </Text>
                )}

                <InputLabel
                  onChangeText={handleChange("firstName")}
                  value={values.firstName}
                  labelInput="*First Name"
                  placeholder={"First Name"}
                />

                {touched.firstName && errors.firstName && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.firstName}
                  </Text>
                )}

                <InputLabel
                  onChangeText={handleChange("lastName")}
                  value={values.lastName}
                  labelInput="*Last Name"
                  placeholder={"Last Name"}
                />

                {touched.lastName && errors.lastName && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.lastName}
                  </Text>
                )}

                <InputLabel
                  onChangeText={handleChange("phone")}
                  value={values.phone}
                  labelInput="Phone"
                  keyboardtype={"phone-pad"}
                  placeholder={"Phone"}
                />

                {touched.phone && errors.phone && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.phone}
                  </Text>
                )}

                <InputLabel
                  onChangeText={handleChange("extension")}
                  value={values.extension}
                  labelInput="Extension"
                  placeholder={"Extension (Optional)"}
                />
                {touched.extension && errors.extension && (
                  <Text
                    style={{ fontSize: 13, color: "red", textAlign: "center" }}
                  >
                    {errors.extension}
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
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    Password must contain between 7 and 15 characters and
                    include number and and a letter
                  </Text>
                </View>

                <View
                  style={{ width: "100%", position: "absolute", bottom: 0 }}
                >
                  <FullButton onPress={handleSubmit} title={"Sign Up"} />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
