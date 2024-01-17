import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Header } from "../Components/Header";
import { SafeAreaView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../Components/Loader";
import { Context } from "../store";
import { MaterialIcons } from "@expo/vector-icons";

// Firebase
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { fireDB } from "../config";
import { Checkbox } from "react-native-paper";
import { setGuestUser } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";

export const OrderDetails = ({ ...props }) => {
  // const { state, dispatch } = useContext(Context);
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  // Accepting Parameters
  const { productId } = props.route.params;
  // console.log(productId, U0gdn);

  const [isEnabled, setIsEnabled] = useState(false);
  const [quantity, setquantity] = useState(1);
  const [product, setProduct] = useState();
  const [subproduct, setSubproduct] = useState();
  const [loading, setLoading] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [checkboxtoggle, setCheckBoxToggle] = useState(false);

  const deleteExistingCart = (documentId) => {
    // DELETE A DOCUMENT
    const delRef = doc(fireDB, "carts", documentId);
    deleteDoc(delRef)
      .then((res) => {
        console.log("Already Existing Cart Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (product?.id) checkFavourite(product?.id);
  }, [product]);

  const checkFavourite = async (id) => {
    const docRef = doc(fireDB, "favourite", state?.userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data()?.productIds.some((item) => item === id)) {
        setFavourite(true);
      } else {
        setFavourite(false);
      }
    } else {
      setFavourite(false);
    }
  };
  const addFavourite = async (id) => {
    try {
      const docRef = doc(fireDB, "favourite", state?.userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data()?.productIds.some((item) => item === id)) {
          setFavourite(false);
          await updateDoc(doc(fireDB, "favourite", state?.userId), {
            productIds: arrayRemove(id),
          });
        } else {
          setFavourite(true);
          await updateDoc(doc(fireDB, "favourite", state?.userId), {
            productIds: arrayUnion(id),
          });
        }
      } else {
        setFavourite(true);
        await setDoc(doc(fireDB, "favourite", state?.userId), {
          productIds: [id],
        });
      }
    } catch (error) {
      console.log("Error adding/removing favorite:", error);
    }
  };
  const addcartToFirebase = () => {
    // For Adding in Cart
    const collectionRef = collection(fireDB, "carts");

    addDoc(collectionRef, {
      productId: [
        {
          productId: productId,
          quantity: quantity,
          total: product?.price * quantity,
          image: product?.image,
          productprice: product?.price,
          name: product?.name,
          image:
            product.image == undefined || product.image == ""
              ? ""
              : product?.image,
        },
      ],
      userId: state.userId,
    })
      .then((response) => {
        props.navigation.navigate("Cart");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Adding to Existing Cart
  const addToExistingCart = async (docId) => {
    const body = {
      productId: productId,
      quantity: quantity,
      total: product?.price * quantity,
      productprice: product?.price,
      image:
        product.image == undefined || product.image == "" ? "" : product?.image,
      name: product?.name,
    };
    const collectionRef = doc(fireDB, "carts", docId);
    const prodexits = await getDoc(collectionRef);
    if (prodexits.exists()) {
      if (
        prodexits
          .data()
          ?.productId.some((item) => item.productId === product?.id)
      ) {
        let removedata = prodexits
          .data()
          ?.productId.find((item) => item?.productId == product?.id);

        await updateDoc(doc(fireDB, "carts", docId), {
          productId: arrayRemove(removedata),
        });
      }
      await updateDoc(doc(fireDB, "carts", docId), {
        productId: arrayUnion(body),
      })
        .then((res) => {
          props.navigation.navigate("Cart");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await updateDoc(collectionRef, {
        productId: arrayUnion(body),
      })
        .then((res) => {
          props.navigation.navigate("Cart");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const cartLogic = async () => {
    var docId;
    // Check if the user Already has a cart
    const colRef = collection(fireDB, "carts");
    // Check if the user already has a cart
    const q = query(colRef, where("userId", "==", state?.userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });
    // if Document Already Exists delete
    // the previous one and add a new cart
    if (docId) {
      Alert.alert(
        "Cart Items Exist",
        "You already have products in your cart. What would you like to do?",
        [
          {
            text: "Empty Cart",
            onPress: () => {
              deleteExistingCart(docId);
              addcartToFirebase();
            },
          },
          {
            text: "Add To Existing Cart",
            onPress: () => {
              addToExistingCart(docId);
            },
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancelled"),
          },
        ]
      );
    } else {
      Alert.alert("Confirmation", "Add this item to the cart?", [
        { text: "No", onPress: () => console.log("Cancelled") },
        {
          text: "Yes",
          onPress: () => addcartToFirebase(),
          style: "cancel",
        },
      ]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (productId) {
      (async () => {
        setLoading(true);
        const docRef = doc(fireDB, "products", productId);
        const docOfProduct = await getDoc(docRef);
        if (docOfProduct?.exists() && isMounted) {
          setProduct({ id: docOfProduct?.id, ...docOfProduct?.data() });
        }
        setLoading(false);
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [productId]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      let temp;
      const colRef = collection(fireDB, "subProducts");
      const q = query(colRef, where("productId", "==", productId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc, index) => {
        if (doc.exists()) {
          temp = doc.data().size;
        }
      });

      temp?.forEach((item, index) => {
        item.checked = false;
      });
      if (isMounted) {
        setSubproduct(temp);
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#191919" }}>
        <Header
          title="Order"
          nameicons={"left"}
          onPress={() => props.navigation.goBack()}
          rightIcon={true}
          rightIconName="shopping-bag"
          rightonPress={() => {
            props.navigation.navigate("Cart");
          }}
        />

        {loading ? (
          <Loader />
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ padding: 10 }}>
              <View
                style={{
                  width: "100%",
                  padding: 15,
                  backgroundColor: "#2D2D2D",
                  elevation: 10,
                  shadowColor: "#191919",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  borderRadius: 10,
                }}
              >
                {/* <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: "#fff",
                  }}
                >
                  {product?.name}
                </Text> */}
                <View
                  style={{ width: "100%", flexDirection: "row", elevation: 10 }}
                >
                  <Image
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 10,
                      resizeMode: "contain",
                    }}
                    source={
                      product?.image
                        ? { uri: product?.image }
                        : require("../assets/logo.png")
                    }
                  />

                  <View style={{ width: "100%" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          marginTop: 4,
                          color: "#fff",
                          fontWeight: "bold",
                          flex: 1,

                          flexWrap: "wrap",
                          flexDirection: "row",
                        }}
                        numberOfLines={2}
                      >
                        {product?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        position: "absolute",
                        bottom: 0,
                        width: "75%",
                      }}
                    >
                      <Text
                        style={{ marginLeft: 5, marginTop: 4, color: "grey" }}
                      >
                        ${product?.price}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          addFavourite(product?.id);
                        }}
                      >
                        <MaterialIcons
                          name={favourite ? "favorite" : "favorite-border"}
                          size={24}
                          color="#154525"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View>
                {subproduct?.length && (
                  <View
                    style={{
                      width: "100%",
                      marginTop: 10,
                      alignSelf: "center",
                      backgroundColor: "#2D2D2D",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    {subproduct?.map((item, index) => (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                        key={index}
                      >
                        <Text style={{ color: "white" }}>
                          {item.name} {item.weight && <>({item.weight})</>}
                        </Text>
                        <Text style={{ color: "white" }}>${item.price}</Text>
                        <Checkbox.Android
                          // by default first item is checked
                          onPress={() => {
                            let temp = [...subproduct];
                            temp.forEach((item, index) => {
                              item.checked = false;
                            });
                            temp[index].checked = !temp[index].checked;
                            setSubproduct(temp);
                            setProduct({ ...product, price: item.price });
                          }}
                          color="#154525"
                          status={
                            item.checked == false ? "unchecked" : "checked"
                          }
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View
                style={{
                  backgroundColor: "#fff",
                  shadowColor: "#191919",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 10,
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  marginTop: 10,
                }}
              >
                {/* <View style={{
                                    width: '90%',
                                    alignSelf: 'center',
                                    borderColor: '#A8A8A8',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',

                                }}>
                                    <View>
                                    <Text numberOfLines={1} style={{ color: 'black', width: '100%', fontWeight: 'bold', }} >
                                    Want to make that a combo?
                                    </Text>
                                    </View>
                                    <Switch
                                    trackColor={{ false: '#767577', true: '#154525' }}
                                    thumbColor={isEnabled ? '#fff' : '#fff'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                    />
                                </View> */}
              </View>
              <View style={{ width: "100%", marginTop: 15 }}>
                <Image
                  style={{ width: "100%", height: 200, resizeMode: "stretch" }}
                  source={
                    product?.image
                      ? { uri: product?.image }
                      : require("../assets/logo.png")
                  }
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "#191919",
                  shadowColor: "#191919",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 10,
                  borderRadius: 10,
                  padding: 15,
                }}
              >
                <Text style={{ padding: 10, color: "grey" }}>
                  {product?.description}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: "95%",
                padding: 15,
                backgroundColor: "#2D2D2D",
                elevation: 10,
                shadowColor: "#191919",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                borderRadius: 10,
                marginHorizontal: 5,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    if (quantity !== 1) {
                      setquantity(quantity - 1);
                    }
                  }}
                >
                  <AntDesign name="minussquareo" size={24} color="#154525" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    paddingHorizontal: 10,
                    color: "#fff",
                  }}
                >
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setquantity(quantity + 1);
                  }}
                >
                  <AntDesign name="plussquareo" size={24} color="#154525" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        <View
          style={{
            width: "90%",
            position: "absolute",
            alignSelf: "center",
            bottom: 0,
            marginBottom: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (state.guestUser) {
                Alert.alert("Guest Mode", "Please Login to continue", [
                  {
                    text: "Cancel",
                  },
                  {
                    text: "Login Now",
                    onPress: () => {
                      dispatch(setGuestUser(false));
                      setTimeout(() => {
                        props?.navigation.navigate("Login");
                      }, 500);
                    },
                  },
                ]);
              } else {
                cartLogic();
              }
            }}
            style={{
              width: "100%",
              flexDirection: "row",
              backgroundColor: "#154525",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontWeight: "bold",
                width: "80%",
              }}
            >
              Add {quantity} To Cart
            </Text>
            <Text
              style={{
                textAlign: "right",
                width: "20%",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              ${(product?.price * quantity).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
