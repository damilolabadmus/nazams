import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  TouchableOpacity,
  TextInput,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Formik } from "formik";
import * as yup from "yup";
import { InputLabel } from "./InputLabel";
import { fireDB, auth } from "../config";
import { doc, getDoc } from "firebase/firestore";
// import * as SecureStore from "expo-secure-store";
import { Context } from "../store";
import FullButton from "./FullButton";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setGuestUser } from "../store/auth";

import { Button } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

function LogBottomSheet() {
  const refRBSheet = useRef();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const value = useMemo(() => {
  //   return refRBSheet.current.open();
  // }, [loading]);
  // useLayoutEffect(() => {
  //   (async () => {
  //     setTimeout(() => {
  //       refRBSheet.current.open();
  //     }, 0);
  //   })();
  // });
  // useEffect(() => {
  //   setLoading(true);
  // }, [loading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2D2D2D",
      }}
    >
      <View style={{ width: "80%" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn");

            // handleSnapPress(2);
            // props?.handleCheck();
          }}
          style={styles.login}
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={styles.signup}
        >
          <Text style={[styles.textSignup, { color: "#154525" }]}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.guest}
          onPress={() => {
            Alert.alert(
              "Guest Mode",
              "Are you sure you want to continue as a guest? Choosing guest mode will allow you to explore our app without registering an account.",

              [
                {
                  text: "No",
                  onPress: () => {},
                },
                {
                  text: "Yes",
                  onPress: () => {
                    dispatch(setGuestUser(true));
                    // dispatch({ type: "GUEST_USER" });
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.textSignup}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>

      {/* <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={false}
        // height={350}
        customStyles={{
          wrapper: {
            backgroundColor: "#fff",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            backgroundColor: "#fff",
            flex: 1,
            zIndex: 9999,
          },
        }}
      ></RBSheet> */}
    </View>
  );
}
// function YourOwnComponent() {
//   return (
//     <View>
//       <Text>Love is enabled</Text>
//     </View>
//   );
// }

// export default App;

const YourOwnComponent = ({ ...props }) => {
  // hooks
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { state, dispatch } = useContext(Context);
  const dispatch = useDispatch();
  // variables
  const snapPoints = useMemo(() => ["70%", "80%", "100%"], []);

  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
    setShow(false);
  }, []);

  const handleSnapPress2 = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(2);
    setShow(true);
  }, []);

  const loginNow = async () => {
    try {
      if (email !== "" && password !== "") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;
        const docRef = doc(fireDB, "users", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // await SecureStore.setItemAsync("userId", JSON.stringify(user.uid));
          // await SecureStore.setItemAsync(
          //   "userData",
          //   JSON.stringify(docSnap.data())
          // );
          // dispatch({
          //   type: "CREATE",
          //   payload: {
          //     id: user.uid,
          //     values: docSnap.data(),
          //   },
          // });
          Alert.alert("Greetings", "Good to see you Again!");
        } else {
          Alert.alert(
            "Something went wrong",
            "You provided incorrect credentials. Please try again."
          );
        }
      } else {
        Alert.alert(
          "Please try again",
          "Please provide your credentials to log in"
        );
      }
    } catch (err) {
      Alert.alert(
        "Oops! Something went wrong",
        "The credentials you provided are incorrect. Please check and try again."
      );
    }
  };
  // renders
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {show === true ? (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignIn");

                // handleSnapPress(2);
                // props?.handleCheck();
              }}
              style={styles.login}
            >
              <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              style={styles.signup}
            >
              <Text style={[styles.textSignup, { color: "#154525" }]}>
                Signup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.guest}
              onPress={() => {
                Alert.alert(
                  "Guest Mode",
                  "Are you sure you want to continue as a guest?",
                  [
                    {
                      text: "No, I'd like to register",
                      onPress: () => {},
                    },
                    {
                      text: "Yes, continue as a guest",
                      onPress: () => {
                        dispatch(setGuestUser(true));
                        // dispatch({ type: "GUEST_USER" });
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.textSignup}>Continue as Guest</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={styles.guest}
                    onPress={() => {
                      handleSnapPress2(0);
                      props?.handleCheck();
                    }}
                  >
                    <Text style={styles.textSignup}>Cancel</Text>
                  </TouchableOpacity>
                  <BottomSheetView>
                    <TextInput
                      placeholder="Enter Your Email Or Phone Number"
                      autoCompleteType="off"
                      placeholderTextColor={"grey"}
                      onChangeText={(e) => setEmail(e)}
                      style={{
                        padding: 10,

                        borderBottomWidth: 1,
                        borderColor: "white",
                        alignSelf: "center",

                        color: "white",
                        width: "90%",
                      }}
                    />

                    <TextInput
                      placeholder="Password"
                      autoCompleteType="off"
                      onChangeText={(e) => setPassword(e)}
                      secureTextEntry={true}
                      placeholderTextColor={"grey"}
                      style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderColor: "white",
                        color: "white",
                        alignSelf: "center",
                        width: "90%",
                      }}
                    />
                    <View style={{ marginTop: 80 }}>
                      <FullButton
                        title={"Login"}
                        onPress={() => {
                          loginNow();
                          props?.handleCheck();
                        }}
                      />
                    </View>
                  </BottomSheetView>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
  },
  login: {
    alignItems: "stretch",
    backgroundColor: "#154525",
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  signup: {
    alignItems: "stretch",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,

    marginVertical: 4,
  },
  guest: {
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
  textSignup: {
    color: "#fff",
    textAlign: "center",
  },
  social: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    padding: 40,
  },
});

function LoginInput({ ...props }) {
  const [handlePassword, sethandlePassword] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "#2F2F2F" }}>
      <SafeAreaView>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={yup.object().shape({
            email: yup.string().required("Please Enter A Valid Email"),
            password: yup
              .string()
              .min(6, "Min Character should be 6")
              .required("Password is Required"),
          })}
          onSubmit={(values) => {
            // console.log(values), handleLogin(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            errors,
            setFieldTouched,
            touched,
            handleSubmit,
            values,
          }) => (
            <View style={{ height: "100%" }}>
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
                  <Text style={{ color: "#fff" }}>Password</Text>
                </View>
                <View style={{ justifyContent: "center", width: "60%" }}>
                  <TextInput
                    secureTextEntry={handlePassword}
                    onChangeText={handleChange("password")}
                    value={values.password}
                    numberOfLines={1}
                    placeholder="Enter Your Password"
                    style={{ color: "#fff" }}
                    placeholderTextColor={"#848484"}
                  />
                </View>
                <View style={{ justifyContent: "center", width: "15%" }}>
                  <TouchableOpacity>
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
              <View style={{ justifyContent: "center", padding: 15 }}>
                <TouchableOpacity>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: "#E4780E",
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: "100%", alignSelf: "baseline" }}>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={{
                    width: "90%",
                    backgroundColor: "#154525",
                    padding: 10,
                    alignSelf: "center",
                    marginTop: 20,
                    borderRadius: 25,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 22,
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </View>
  );
}
export { LogBottomSheet, LoginInput };
