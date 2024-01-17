import React, { useRef, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
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
import { setDoc, doc, getDoc } from "firebase/firestore";

import { Context } from "../store";
// import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setUser } from "../store/auth";

export function UpdateAccount({ ...props }) {
  // const { dispatch } = useContext(Context);
  const dispatch = useDispatch();
  const formikRef = useRef();

  const handler = async () => {
    const user = auth.currentUser;
    const docRef = doc(fireDB, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (formikRef.current) {
        formikRef.current.setFieldValue("title", docSnap.data().title);
        formikRef.current.setFieldValue("phone", docSnap.data().phone);
        formikRef.current.setFieldValue("firstName", docSnap.data().firstName);
        formikRef.current.setFieldValue("lastName", docSnap.data().lastName);
        formikRef.current.setFieldValue("extension", docSnap.data().extension);
      }
    } else {
      console.log("No such document!");
    }
  };
  useEffect(() => {
    handler();
  }, []);
  const handleSignUp = async (data) => {
    try {
      // const userData = await SecureStore.getItemAsync("userData");
      const user = auth.currentUser;
      if (user.uid) {
        const docRef = doc(fireDB, "users", user.uid);
        await setDoc(docRef, data);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(
            setUser({
              id: user.uid,
              values: docSnap.data(),
            })
          );

          Alert.alert(
            "Account Update",
            "Your account details have been updated."
          );
        } else {
          Alert.alert(
            "Something went wrong",
            "You provided incorrect credentials. Please try again."
          );
        }

        props.navigation.navigate("MyAccount");
        // const values = JSON.parse(userData);
        // values.title = data.title;
        // values.phone = data.phone;
        // values.firstName = data.firstName;
        // values.lastName = data.lastName;
        // await SecureStore.setItemAsync("userData", JSON.stringify(values));
        // dispatch({ type: "CREATE", payload: { id: user.uid, values } });
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title="Update Account Details"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1, marginBottom: 40 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <KeyboardAvoidingView>
          <Formik
            initialValues={{
              phone: "",
              title: "",
              firstName: "",
              lastName: "",
              extension: "",
            }}
            innerRef={formikRef}
            enableReinitialize={true}
            // Submit
            onSubmit={(values) => {
              handleSignUp(values);
            }}
            validationSchema={yup.object().shape({
              title: yup.string().required("Title is Required"),
              firstName: yup.string().required("First Name is Required"),
              lastName: yup.string().required("Last Name is Required"),
              phone: yup.string().required("Phone Number is Required"),
            })}
          >
            {({
              handleChange,
              errors,
              touched,
              handleSubmit,
              values,
              setFieldValue,
            }) => {
              return (
                <View style={{ flex: 1 }}>
                  <InputLabel
                    onChangeText={handleChange("title")}
                    value={values.title}
                    labelInput="Title"
                    placeholder={"Mr / Mrs / Miss"}
                  />
                  {touched.title && errors.title && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: "red",
                        textAlign: "center",
                      }}
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
                      style={{
                        fontSize: 13,
                        color: "red",
                        textAlign: "center",
                      }}
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
                      style={{
                        fontSize: 13,
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      {errors.lastName}
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
                      style={{
                        fontSize: 13,
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      {errors.extension}
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
                      style={{
                        fontSize: 13,
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      {errors.phone}
                    </Text>
                  )}

                  <View
                    style={{
                      width: "100%",

                      //   position: "absolute",
                      marginTop: 100,
                    }}
                  >
                    <FullButton onPress={handleSubmit} title={"Save"} />
                  </View>
                </View>
              );
            }}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
