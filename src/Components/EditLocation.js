import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Modal, StyleSheet, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { Context } from "../store";
import { useSelector } from "react-redux";

export default function EditLocation({ ...props }) {
  // const { state } = useContext(Context);
  const state = useSelector(({ auth }) => auth);

  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <>
      <List.Section
        style={{
          marginVertical: 0,
          zIndex: 10,
          // marginBottom: props?.expanded ? 50 : 0,
        }}
      >
        <List.Accordion
          title="Pickup Order"
          expanded={props?.expanded}
          onPress={() => {
            props?.handlePress();
          }}
          theme={{
            colors: {
              primary: "#fff",
              background: "#2D2D2D",
              disabled: "#fff",
              borderWidth: 1,
              text: "#fff",
            },
          }}
          titleStyle={{
            color: "#fff",
            textAlign: "left",
            marginLeft: 120,
          }}
          style={{
            top: 0,
            marginVertical: 0,
            zIndex: 10,
          }}
        >
          <View
            style={{
              elevation: 10,
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              position: "absolute",
              zIndex: 1,
              top: 50,
              backgroundColor: "#191919",
              width: "100%",
            }}
          >
            <View style={{ padding: 10 }}>
              <Text style={{ color: "#ACACAC" }}>
                {state?.guestUser ? "Dear User" : state?.user?.firstName} !
                Select your pickup location
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                elevation: 10,
                shadowColor: "#191919",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                marginBottom: 5,
                padding: 10,
                flexDirection: "row",
                backgroundColor: "#191919",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  width: "75%",
                  paddingVertical: 10,
                  backgroundColor: "#fff",
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("OrderSetup")}
                >
                  {state?.position ? (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#191919",
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      {state?.position}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#191919",
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      Pick-up Location
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "25%",
                  justifyContent: "center",
                  paddingVertical: 10,
                  backgroundColor: "#154525",
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={[styles.textStyle, { color: "#fff" }]}>
                    Delivery
                  </Text>
                </TouchableOpacity>
              </View>
              <Model
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />
            </View>
          </View>
        </List.Accordion>
      </List.Section>
    </>
  );
}

const Model = ({ modalVisible, setModalVisible }) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontWeight: "bold", padding: 10, fontSize: 15 }}>
              Choose your delivery option
            </Text>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                {
                  borderColor: "#06BB67",
                  backgroundColor: "#fff",
                  borderWidth: 2,
                },
              ]}
              onPress={() =>
                Linking.openURL(
                  "https://www.ubereats.com/ca/near-me/canadian?utm_source=GooglePMAX&utm_campaign=CM2156521-googlepmax-googlepmax_32_-99_CA-National_e_all_acq_cpc_en_Pmax______c&campaign_id=16568135215&adg_id=&fi_id=&match=&net=x&dev=c&dev_m=&ad_id=&cre=&kwid=&kw=&placement=&tar=&gclsrc=aw.ds&gclid=Cj0KCQjw-JyUBhCuARIsANUqQ_KFf2yLZ7H-ECEsjFytLUPwX-HeqpHBH02ThP6Zum7l5Z3iM01jiQcaApzGEALw_wcB"
                )
              }
            >
              <Text style={[styles.textStyle, { color: "#06BB67" }]}>
                Uber Eats
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                {
                  borderColor: "#FB6100",
                  backgroundColor: "#fff",
                  borderWidth: 2,
                },
              ]}
              onPress={() =>
                Linking.openURL(
                  "https://www.skipthedishes.com/ca/near-me/canadian?utm_source=GooglePMAX&utm_campaign=CM2156521-googlepmax-googlepmax_32_-99_CA-National_e_all_acq_cpc_en_Pmax______c&campaign_id=16568135215&adg_id=&fi_id=&match=&net=x&dev=c&dev_m=&ad_id=&cre=&kwid=&kw=&placement=&tar=&gclsrc=aw.ds&gclid=Cj0KCQjw-JyUBhCuARIsANUqQ_KFf2yLZ7H-ECEsjFytLUPwX-HeqpHBH02ThP6Zum7l5Z3iM01jiQcaApzGEALw_wcB"
                )
              }
            >
              <Text style={[styles.textStyle, { color: "#FB6100" }]}>
                SkipTheDishes
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                {
                  borderColor: "#A51E26",
                  backgroundColor: "#fff",
                  borderWidth: 2,
                },
              ]}
              onPress={() =>
                Linking.openURL(
                  "https://www.doordash.com/ca/near-me/canadian?utm_source=GooglePMAX&utm_campaign=CM2156521-googlepmax-googlepmax_32_-99_CA-National_e_all_acq_cpc_en_Pmax______c&campaign_id=16568135215&adg_id=&fi_id=&match=&net=x&dev=c&dev_m=&ad_id=&cre=&kwid=&kw=&placement=&tar=&gclsrc=aw.ds&gclid=Cj0KCQjw-JyUBhCuARIsANUqQ_KFf2yLZ7H-ECEsjFytLUPwX-HeqpHBH02ThP6Zum7l5Z3iM01jiQcaApzGEALw_wcB"
                )
              }
            >
              <Text style={[styles.textStyle, { color: "#A51E26" }]}>
                DoorDash
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                { backgroundColor: "#191919" },
              ]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#191919",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#fff",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginVertical: 2,
    width: 175,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
/**
 * 
import { StyleSheet, Button } from "react-native";
export default function App() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value * 255 }],
    };
  });

  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button
        onPress={() => (offset.value = withSpring(Math.random()))}
        title="Move"
      />
    </>
  );
}
const styles = StyleSheet.create({
  box: {
    // flexGrow: 1,
    marginTop: 50,
    height: 50,
    color: "blue",
    backgroundColor: "blue",
    width: 50,
  },
});
 */
