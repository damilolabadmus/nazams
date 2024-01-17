// import { View, Text } from "react-native";
// import React, { useContext, useState } from "react";
// import { Header } from "../Components/Header";

// import RadioButtonRN from "radio-buttons-react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Context } from "../store";
// import FullButton from "../Components/FullButton";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Button } from "react-native-paper";
// import { Searchbar } from "react-native-paper";
// import { ScrollView, Alert } from "react-native";
// import { doc, setDoc, Timestamp } from "firebase/firestore";
// import { fireDB } from "../config";
// import * as SecureStore from "expo-secure-store";

// import { ToggleButton } from "react-native-paper";
// const data = [
//   {
//     label: "1 Eva Rd #108, Etobicoke, ON M9C 4Z5, Canada",
//     coords: {
//       latitude: "43.639478",
//       longitude: "-79.563069",
//     },
//   },
//   {
//     label: "3390 S Service Rd, Burlington, ON L7N 3J5, Canada",
//     coords: {
//       latitude: "43.361472",
//       longitude: "-79.791369",
//     },
//   },
//   {
//     label: "1225 Kennedy Rd, Scarborough, ON M1P 4Y1, Canada",
//     coords: {
//       latitude: "43.756078",
//       longitude: "-79.275739",
//     },
//   },
// ];
// export const Pickup = ({ ...props }) => {
//   const { params } = props.route;
//   const { state, dispatch } = useContext(Context);

//   const [value, setValue] = React.useState("now");
//   const [location, setLocation] = React.useState("");
//   const [date, setDate] = useState(new Date(Date.now()));
//   const [mode, setMode] = useState("date");
//   const [show, setShow] = useState(false);
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const todayDate = new Date(); //Today Date.

//   const onChangeSearch = (query) => setSearchQuery(query);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate;
//     setShow(false);

//     if (todayDate > currentDate && mode == "time") {
//       Alert.alert("Your are select a wrong date. Please Select Future Date");
//     } else {
//       setDate(currentDate);
//     }
//   };

//   const showMode = (currentMode) => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   const showDatepicker = () => {
//     showMode("date");
//   };

//   const showTimepicker = () => {
//     showMode("time");
//   };
//   function addMinutes(numOfMinutes, date = new Date()) {
//     date.setMinutes(date.getMinutes() + numOfMinutes);

//     return date;
//   }
//   const confirmPickup = async () => {
//     const userData = await SecureStore.getItemAsync("userData");

//     if (value === "later") {
//       if (location && date && todayDate < date) {
//         if (state.userId) {
//           await setDoc(
//             doc(fireDB, "users", state.userId),
//             {
//               location,
//               date: Timestamp.fromDate(new Date(date.toLocaleString())),
//             },
//             { merge: true }
//           );
//         }
//         let values = JSON.parse(userData);
//         values.location = location;
//         values.date = Timestamp.fromDate(new Date(date.toLocaleString()));
//         await SecureStore.setItemAsync("userData", JSON.stringify(values));
//         dispatch({ type: "CREATE", payload: { id: state.userId, values } });

//         Alert.alert("Your Order is Setup to Now");
//         props.navigation.goBack();
//       } else {
//         Alert.alert("Please Select a Location and Future date and time");
//       }
//     } else {
//       if (location) {
//         await setDoc(
//           doc(fireDB, "users", state.userId),
//           {
//             location,
//             // date: date.toJSON(),
//             date: Timestamp.fromDate(addMinutes(20)),
//           },
//           { merge: true }
//         );
//         let values = JSON.parse(userData);
//         values.location = location;
//         values.date = Timestamp.fromDate(addMinutes(20));
//         await SecureStore.setItemAsync("userData", JSON.stringify(values));
//         dispatch({ type: "CREATE", payload: { id: state.userId, values } });
//         Alert.alert("Your Pick-up location is set");
//         props.navigation.goBack();
//       } else {
//         Alert.alert("Please Select a future date and location");
//       }
//     }
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: "#2D2D2D" }}>
//       <Header
//         title="Pickup Location"
//         nameicons={"left"}
//         onPress={() => props.navigation.goBack()}
//       />
//       <ScrollView
//         style={{ flex: 1, marginBottom: 40 }}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         {/* <View
//           style={{
//             width: "90%",
//             backgroundColor: "#154525",
//             elevation: 10,
//             shadowColor: "#fff",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.5,
//             borderRadius: 8,

//             paddingVertical: 10,
//             marginVertical: 5,
//             alignSelf: "center",
//           }}
//         >
//           <Text
//             style={{ fontWeight: "bold", color: "#fff", textAlign: "center" }}
//           >
//             Pick-Up
//           </Text>
//         </View> */}
//         <View
//           style={{
//             width: "100%",
//             backgroundColor: "#191919",
//             elevation: 10,
//             shadowColor: "#fff",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.5,
//             shadowRadius: 2,
//             marginVertical: 5,
//             padding: 10,
//             paddingVertical: 20,
//           }}
//         >
//           <Searchbar
//             placeholder="Search"
//             onChangeText={onChangeSearch}
//             value={searchQuery}
//           />
//         </View>
//         <View
//           style={{
//             width: "100%",
//             backgroundColor: "#191919",
//             elevation: 10,
//             shadowColor: "#fff",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.5,
//             shadowRadius: 2,
//             marginBottom: 10,
//             padding: 10,
//           }}
//         >
//           <RadioButtonRN
//             data={data}
//             selectedBtn={(e) => setLocation(e.label)}
//             icon={<Ionicons name="checkmark" size={24} color="#fff" />}
//             textStyle={{ color: "#fff" }}
//             activeColor="#fff"
//             boxActiveBgColor="#154525"
//             boxDeactiveBgColor="#191919"
//             // value={"1 Eva Road, Suite 108, Etobicoke, ON, M9C 4Z5"}
//             // initial={"1 Eva Road, Suite 108, Etobicoke, ON, M9C 4Z5"}
//           />
//         </View>

//         <View style={{ alignSelf: "center" }}>
//           <ToggleButton.Row
//             onValueChange={(value) => setValue(value)}
//             value={value}
//             style={{
//               borderColor: "#154525",
//               borderWidth: 2,
//               borderRadius: 10,
//               width: 220,
//               alignSelf: "center",
//             }}
//           >
//             <ToggleButton
//               style={{
//                 width: 110,
//                 backgroundColor: value === "now" ? "#fff" : "#303030",
//                 borderRadius: 10,
//               }}
//               icon={() => (
//                 <View>
//                   <Text
//                     style={{ color: value === "later" ? "#2d2d2d" : "#191919" }}
//                   >
//                     Now
//                   </Text>
//                 </View>
//               )}
//               value="now"
//             />
//             <ToggleButton
//               style={{
//                 width: 105,
//                 backgroundColor: value === "later" ? "#fff" : "#303030",
//                 borderRadius: 10,
//               }}
//               icon={() => (
//                 <View>
//                   <Text style={{ color: value === "now" ? "#2d2d2d" : "#191919" }}>
//                     Later
//                   </Text>
//                 </View>
//               )}
//               value="later"
//             />
//           </ToggleButton.Row>
//         </View>
//         {value === "later" ? (
//           <View
//             style={{
//               width: "100%",
//               alignSelf: "center",
//               marginVertical: 10,
//               backgroundColor: "#191919",
//               elevation: 10,
//               shadowColor: "#fff",
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.5,
//               shadowRadius: 2,
//               marginBottom: 10,
//               padding: 10,
//             }}
//           >
//             <View>
//               <Button
//                 onPress={showDatepicker}
//                 mode="contained"
//                 dark={true}
//                 icon="timeline-clock"
//                 style={{
//                   backgroundColor: "#303030",
//                   color: "#154525",
//                   borderBottomColor: "#191919",
//                   borderWidth: 2,
//                 }}
//               >
//                 Select Date
//               </Button>
//             </View>
//             <View style={{ marginVertical: 10 }}>
//               <Button
//                 mode="contained"
//                 dark={true}
//                 icon="av-timer"
//                 onPress={showTimepicker}
//                 style={{ backgroundColor: "#303030" }}
//               >
//                 Select Time
//               </Button>
//             </View>
//             {date && (
//               <View>
//                 <Text style={{ color: "#e7e7e7" }}>
//                   Your selected Date and Time
//                 </Text>
//                 <Text style={{ color: "#fff", fontWeight: "bold" }}>
//                   {date.toLocaleString()}
//                 </Text>
//               </View>
//             )}
//           </View>
//         ) : (
//           <View
//             style={{ width: "90%", alignSelf: "center", marginVertical: 10 }}
//           >
//             <Text style={{ fontWeight: "bold", color: "#e7e7e7" }}>
//               Heads Up! Your order will be ready 20 minutes after it h as been
//               placed.
//             </Text>
//           </View>
//         )}
//         {show && (
//           <DateTimePicker
//             testID="dateTimePicker"
//             value={date}
//             mode={mode}
//             is24Hour={true}
//             onChange={onChange}
//           />
//         )}
//       </ScrollView>
//       <FullButton
//         title={"Confirm Pickup Location"}
//         onPress={() => {
//           if (state.guestUser) {
//             Alert.alert("Please Login to Continue");
//           } else {
//             confirmPickup();
//           }
//         }}
//       />
//     </View>
//   );
// };
import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { Header } from "../Components/Header";

import RadioButtonRN from "radio-buttons-react-native";
import { Ionicons } from "@expo/vector-icons";
import { Context } from "../store";
import FullButton from "../Components/FullButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-paper";
import { Searchbar } from "react-native-paper";
import { ScrollView, Alert } from "react-native";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { fireDB } from "../config";
// import * as SecureStore from "expo-secure-store";

import { ToggleButton } from "react-native-paper";
const data = [
  {
    label: "1 Eva Rd #108, Etobicoke, ON M9C 4Z5, Canada",
  },
  {
    label: "3390 S Service Rd, Burlington, ON L7N 3J5, Canada",
  },
  {
    label: "1225 Kennedy Rd, Scarborough, ON M1P 4Y1, Canada",
  },
];
export const Pickup = ({ ...props }) => {
  const { params } = props.route;
  const { state, dispatch } = useContext(Context);

  const [value, setValue] = React.useState("now");
  const [location, setLocation] = React.useState("");
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const todayDate = new Date(); //Today Date.

  const onChangeSearch = (query) => setSearchQuery(query);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);

    if (todayDate > currentDate && mode == "time") {
      Alert.alert(
        "Invalid Date Selection",
        "You have selected an invalid date. Please choose a future date."
      );
    } else {
      setDate(currentDate);
    }
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
    // const userData = await SecureStore.getItemAsync("userData");

    if (value === "later") {
      if (location && date && todayDate < date) {
        if (state.userId) {
          await setDoc(
            doc(fireDB, "users", state.userId),
            {
              location,
              date: Timestamp.fromDate(new Date(date.toLocaleString())),
            },
            { merge: true }
          );
        }
        // let values = JSON.parse(userData);
        // values.location = location;
        // values.date = Timestamp.fromDate(new Date(date.toLocaleString()));
        // await SecureStore.setItemAsync("userData", JSON.stringify(values));
        // dispatch({ type: "CREATE", payload: { id: state.userId, values } });

        Alert.alert("Order Setup", "Your order is now set up!");
        props.navigation.goBack();
      } else {
        Alert.alert(
          "Attention Required",
          "Please select a location and future date and time."
        );
      }
    } else {
      if (location) {
        await setDoc(
          doc(fireDB, "users", state.userId),
          {
            location,
            // date: date.toJSON(),
            date: Timestamp.fromDate(addMinutes(20)),
          },
          { merge: true }
        );
        let values = JSON.parse(userData);
        values.location = location;
        values.date = Timestamp.fromDate(addMinutes(20));
        // await SecureStore.setItemAsync("userData", JSON.stringify(values));
        dispatch({ type: "CREATE", payload: { id: state.userId, values } });
        Alert.alert(
          "Pick-up Location Set",
          "Your pick-up location has been set!"
        );
        props.navigation.goBack();
      } else {
        Alert.alert(
          "Attention Required",
          "Please select a future date and location."
        );
      }
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#2D2D2D" }}>
      <Header
        title="Pickup Location"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView
        style={{ flex: 1, marginBottom: 40 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* <View
          style={{
            width: "90%",
            backgroundColor: "#154525",
            elevation: 10,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            borderRadius: 8,

            paddingVertical: 10,
            marginVertical: 5,
            alignSelf: "center",
          }}
        >
          <Text
            style={{ fontWeight: "bold", color: "#fff", textAlign: "center" }}
          >
            Pick-Up
          </Text>
        </View> */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#191919",
            elevation: 10,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            marginVertical: 5,
            padding: 10,
            paddingVertical: 20,
          }}
        >
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
        </View>
        <View
          style={{
            width: "100%",
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
          <RadioButtonRN
            data={data}
            selectedBtn={(e) => setLocation(e.label)}
            icon={<Ionicons name="checkmark" size={24} color="#fff" />}
            textStyle={{ color: "#fff" }}
            activeColor="#fff"
            boxActiveBgColor="#154525"
            boxDeactiveBgColor="#191919"
            // value={"1 Eva Rd #108, Etobicoke, ON M9C 4Z5, Canada"}
            // initial={"1 Eva Rd #108, Etobicoke, ON M9C 4Z5, Canada"}
          />
        </View>

        <View style={{ alignSelf: "center" }}>
          <ToggleButton.Row
            onValueChange={(value) => setValue(value)}
            value={value}
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
                backgroundColor: value === "now" ? "#fff" : "#303030",
                borderRadius: 10,
              }}
              icon={() => (
                <View>
                  <Text
                    style={{ color: value === "later" ? "#9D9D9D" : "#191919" }}
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
                backgroundColor: value === "later" ? "#fff" : "#303030",
                borderRadius: 10,
              }}
              icon={() => (
                <View>
                  <Text
                    style={{ color: value === "now" ? "#9D9D9D" : "#191919" }}
                  >
                    Later
                  </Text>
                </View>
              )}
              value="later"
            />
          </ToggleButton.Row>
        </View>
        {value === "later" ? (
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
            <View style={{ marginVertical: 10 }}>
              <Button
                mode="contained"
                dark={true}
                icon="av-timer"
                onPress={showTimepicker}
                style={{ backgroundColor: "#303030" }}
              >
                Select Time
              </Button>
            </View>
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
              Heads Up! Your order will be ready 20 minutes after it h as been
              placed.
            </Text>
          </View>
        )}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </ScrollView>
      <FullButton
        title={"Confirm Pickup Location"}
        onPress={() => {
          if (state.guestUser) {
            Alert.alert("Login Required", "Please login to continue.");
          } else {
            confirmPickup();
          }
        }}
      />
    </View>
  );
};
