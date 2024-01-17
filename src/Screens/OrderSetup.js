import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Header } from "../Components/Header";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { Context } from "../store";
// import * as SecureStore from "expo-secure-store";
import { RadioButton, ToggleButton } from "react-native-paper";
import { getDistance } from "geolib";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-paper";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { fireDB } from "../config";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { setGuestUser, setLocation, setPosition } from "../store/auth";

const getLocation = (lat1, long1, lat2, long2, label) => {
  var dis = getDistance(
    {
      latitude: lat1,
      longitude: long1,
    },
    {
      latitude: lat2,
      longitude: long2,
    }
  );

  return { dis: dis / 1000, label };
};
const data = [
  {
    label: "1 Eva Rd #108, Etobicoke, ON M9C 4Z5,    Canada",
    coords: {
      latitude: "43.639478",
      longitude: "-79.563069",
    },
  },
  {
    label: "3390 S Service Rd, Burlington, ON L7N 3J5, Canada",
    coords: {
      latitude: "43.361472",
      longitude: "-79.791369",
    },
  },
  {
    label: "1225 Kennedy Rd, Scarborough, ON M1P 4Y1, Canada",
    coords: {
      latitude: "43.756078",
      longitude: "-79.275739",
    },
  },
];
export function OrderSetup({ ...props }) {
  // const { state, dispatch } = useContext(Context);
  const dispatch = useDispatch();
  const state = useSelector(({ auth }) => auth);
  const [value, setValue] = React.useState(data[0].label);
  const [pickup, setPickup] = React.useState([]);
  const [address, setAddress] = useState(null);
  const [town, setTown] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [timeValue, setTimeValue] = React.useState("now");
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const getDate = (data) => {
    return (
      new Date(data?.seconds * 1000).toLocaleDateString() +
      " " +
      new Date(data?.seconds * 1000).toLocaleTimeString()
    );
  };
  useEffect(() => {
    let isMounted = true;
    // console.log(
    //   new Date(getDate(state?.date)),
    //   "this new",
    //   state?.date
    // );
    if (isMounted) {
      setTimeValue("later");
      if (state?.position) setValue(state?.position);
      if (!!state?.date) setDate(new Date(getDate(state?.date)));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirm = (selectDate) => {
    setShow(false);
    setDate(selectDate);

    // console.log(
    //   selectDate.getTime() < currentDate.getTime(),
    //   selectDate < currentDate,
    //   selectDate > currentDate
    // );
    // if (selectDate < currentDate && mode == "time") {
    //   // ulti condition
    //   Alert.alert("Your are select a wrong date. Please Select Future Date");
    // } else {
    // }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  function addMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
  }
  const confirmPickup = async () => {
    let duedate = new Date(Date.now() + 3600 * 322);
    if (timeValue === "later") {
      if (value && date >= duedate) {
        if (state.userId) {
          await setDoc(
            doc(fireDB, "users", state.userId),
            {
              position: value,
              date: Timestamp.fromDate(new Date(date.toLocaleString())),
            },
            { merge: true }
          );
        }
        dispatch(
          setPosition({
            position: value,
            date: Timestamp.fromDate(new Date(date.toLocaleString())),
          })
        );
        // console.log("this");
        // let values = JSON.parse(userData);
        // values.position = value;
        // values.date = Timestamp.fromDate(new Date(date.toLocaleString()));
        // await SecureStore.setItemAsync("userData", JSON.stringify(values));
        // dispatch({ type: "CREATE", payload: { id: state.userId, values } });

        Alert.alert(
          "Pickup Set",
          "Your pickup location and date have been successfully set. Thank you!"
        );
        props.navigation.goBack();
      } else {
        Alert.alert(
          "Incomplete Selection",
          "Please select a pickup location and choose a future date and time for your order."
        );
      }
    } else {
      if (value) {
        // console.log("that");
        await setDoc(
          doc(fireDB, "users", state.userId),
          {
            position: value,
            date: Timestamp.fromDate(addMinutes(20)),
          },
          { merge: true }
        );
        dispatch(
          setPosition({
            position: value,
            date: Timestamp.fromDate(addMinutes(20)),
          })
        );
        // let values = JSON.parse(userData);
        // values.position = value;
        // values.date = Timestamp.fromDate(addMinutes(20));
        // await SecureStore.setItemAsync("userData", JSON.stringify(values));
        // dispatch({ type: "CREATE", payload: { id: state.userId, values } });
        Alert.alert("Pickup Setup", "Your pickup is now set up!");
        props.navigation.goBack();
      }
    }
  };
  const addressAccess = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let address = await Location.getCurrentPositionAsync({});

    setAddress(address);
    alert("Location Provided Thanks!");
  };
  useEffect(() => {
    let isMounted = true;

    if (address?.coords?.latitude && address?.coords?.longitude) {
      // console.log(address.coords, data[0]?.coords);
      let pickup = data
        ?.map((item) =>
          getLocation(
            item.coords.latitude,
            item.coords.longitude,
            address.coords.latitude,
            address.coords.longitude,
            item.label
          )
        )
        .sort((itemA, itemB) => itemA.dis - itemB.dis);
      if (isMounted) {
        setValue(pickup[0]?.label);
        setPickup(pickup);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [address]);

  useEffect(() => {
    let isMounted = true;
    if (address) {
      Geocoder.init("AIzaSyCrc0QhxcdXDcPm5f5lmJhSrgbk_s5kgF8");

      Geocoder.from({
        latitude: address.coords.latitude,
        longitude: address.coords.longitude,
      }).then(async (res) => {
        setTown(res.results[0].formatted_address);
        // dispatch(setLocation(res.results[0].formatted_address));
        // await SecureStore.setItemAsync(
        //   "SET_LOCATION",
        //   res.results[0].formatted_address
        // );
        // dispatch({
        //   type: "SET_LOCATION",
        //   payload: res.results[0].formatted_address,
        // });
      });
    }
    return () => {
      isMounted = false;
    };
  }, [address]);

  if (state.guestUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#191919" }}>
        <Header
          nameicons="close"
          title={"Order Setup"}
          onPress={() => props.navigation.goBack()}
        />

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            style={{ width: "60%" }}
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
                textAlign: "center",
                backgroundColor: "#154525",
                padding: 10,
                color: "#fff",
                borderRadius: 10,
              }}
            >
              Please Login to See to Orders or Edit Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        nameicons="close"
        title={"Pickup Setup"}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView
        style={{ flex: 1, marginBottom: 40 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ width: "100%", padding: 10 }}>
          <TouchableOpacity onPress={() => addressAccess()}>
            <TextInput
              placeholder={
                town ||
                "Enter your location and let Nizam's Kathi Kabab help you select the nearest outlet"
              }
              multiline
              numberOfLines={1}
              placeholderTextColor={"grey"}
              value={town}
              style={{
                borderBottomWidth: 1,
                padding: 15,
                borderColor: "grey",
                color: "#fff",
                flexShrink: 1,
                flexWrap: "wrap",
              }}
              // onChange={(e) => setAddress(e)}
              selectTextOnFocus={false}
              editable={false}
            />
          </TouchableOpacity>
        </View>

        {address == "" || address == null ? (
          <View
            style={{
              width: "100%",
              padding: 20,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "grey",
              backgroundColor: "#191919",
            }}
          >
            <MaterialIcons
              name="location-on"
              size={35}
              color="#154525"
              style={{ textAlign: "center" }}
            />
            <TouchableOpacity onPress={() => addressAccess()}>
              <Text
                style={{
                  color: "#154525",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Click Here to turn on location services
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", color: "#fff" }}>
              and find a Nizam's Kathi Kabab near you
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              padding: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "grey",
              backgroundColor: "#191919",
            }}
          >
            <View style={{ width: "95%", alignSelf: "center" }}>
              <Text
                style={{
                  color: "#154525",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginVertical: 5,
                }}
              >
                Your Nearest Pickup Point:
              </Text>
              {pickup?.map((item, key) => (
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-around",
                    backgroundColor: "#191919",
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    marginVertical: 2,
                  }}
                  key={key}
                >
                  <MaterialIcons
                    name="location-on"
                    size={30}
                    color="#154525"
                    style={{ textAlign: "center" }}
                  />
                  <Text
                    numberOfLines={3}
                    style={{ color: "#fff", flexWrap: "wrap", width: "60%" }}
                  >
                    {item.label}
                  </Text>
                  <Text style={{ color: "#fff" }}>
                    {item.dis.toFixed(2)} Km
                  </Text>
                </View>
              ))}
            </View>
            {errorMsg && (
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {errorMsg}
              </Text>
            )}
          </View>
        )}
        <View
          style={{
            width: "100%",
            backgroundColor: "#000",
            elevation: 10,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            marginBottom: 10,
          }}
        >
          <RadioButton.Group
            onValueChange={(newValue) => setValue(newValue)}
            value={value}
          >
            {data?.map((item, index) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                key={index}
              >
                <RadioButton.Item
                  label={item.label}
                  value={item.label}
                  labelStyle={{
                    color: "#fff",
                    flexWrap: "wrap",
                    flexShrink: 1,
                  }}
                  color="#fff"
                  uncheckedColor="red"
                  style={{
                    flexShrink: 1,
                    flexWrap: "wrap",
                    backgroundColor: value !== item.label ? "#000" : "#154525",
                    borderColor: value !== item.label ? "#000" : "#154525",
                  }}
                />
              </View>
            ))}
          </RadioButton.Group>
        </View>
        <View style={{ alignSelf: "center" }}>
          <ToggleButton.Row
            onValueChange={(value) => setTimeValue(value)}
            value={timeValue}
            style={{
              borderColor: "#154525",
              borderWidth: 2,
              borderRadius: 10,
              width: 220,
              alignSelf: "center",
            }}
          >
            <ToggleButton
              style={{
                width: 110,
                backgroundColor: timeValue === "now" ? "#fff" : "#2d2d2d",
                borderRadius: 10,
              }}
              icon={() => (
                <View>
                  <Text
                    style={{
                      color: timeValue === "now" ? "#9d9d9d" : "#fff",
                    }}
                  >
                    Now
                  </Text>
                </View>
              )}
              value="now"
            />
            <ToggleButton
              style={{
                width: 105,
                backgroundColor: timeValue === "later" ? "#fff" : "#9d9d9d",
                borderRadius: 10,
              }}
              icon={() => (
                <View>
                  <Text
                    style={{
                      color: timeValue === "later" ? "#9D9D9D" : "#fff",
                    }}
                  >
                    Later
                  </Text>
                </View>
              )}
              value="later"
            />
          </ToggleButton.Row>
        </View>
        {timeValue === "later" ? (
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              marginVertical: 10,
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
            <View>
              <Button
                onPress={showDatepicker}
                mode="contained"
                dark={true}
                icon="timeline-clock"
                style={{
                  backgroundColor: "#303030",
                  color: "#154525",
                  borderBottomColor: "#191919",
                  borderWidth: 2,
                }}
              >
                Select Date
              </Button>
            </View>
            {/* <View style={{ marginVertical: 10 }}>
              <Button
                mode="contained"
                dark={true}
                icon="av-timer"
                onPress={showTimepicker}
                style={{ backgroundColor: "#303030" }}
              >
                Select Time
              </Button>
            </View> */}
            {date && (
              <View>
                <Text style={{ color: "#e7e7e7" }}>
                  Your selected Date and Time
                </Text>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {date.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{ width: "90%", alignSelf: "center", marginVertical: 10 }}
          >
            <Text style={{ fontWeight: "bold", color: "#e7e7e7" }}>
              Heads Up! Your order will be ready in 20 minutes.
            </Text>
          </View>
        )}
        {/* {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={handleConfirm}
          />
        )} */}
        {/* <DateTimePickerModal
          isVisible={show}
          mode={mode}
          onConfirm={handleConfirm}
          onCancel={() => setShow(false)}
          locale="en-US"
          style={{
            width: 300,
            opacity: 1,
          }}
          display={mode === "time" ? "block" : "inline"}
        /> */}
        {show && (
          <DateTimePickerModal
            isVisible={show}
            mode={"datetime"}
            onConfirm={handleConfirm}
            locale="en-US"
            minimumDate={new Date(Date.now() + 3600 * 322)}
            onCancel={() => setShow(false)}
            style={{
              width: 300,
              opacity: 1,
            }}
            display={Platform.OS === "ios" && "inline"}
          />
        )}
      </ScrollView>
      <View
        style={{ width: "100%", padding: 10, address: "absolute", bottom: 0 }}
      >
        <TouchableOpacity
          onPress={confirmPickup}
          style={{
            width: "90%",
            padding: 10,
            borderRadius: 10,
            backgroundColor: "#154525",
            alignSelf: "center",
          }}
        >
          <Text
            style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
