import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "../Components/Header";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import RecommendedFood from "../Components/RecommendedFood";
import FullButton from "../Components/FullButton";
// Firebase Implementation
import { fireDB } from "../config";
import {
  collection,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { Context } from "../store";
import { useDispatch, useSelector } from "react-redux";

export const Cart = ({ ...props }) => {
  // const { state, dispatch } = useContext(Context);
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartDetails, setcartDetails] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [temp, setTemp] = useState();
  const [docofCart, setDocofCart] = useState();
  const [rendernow, setrenderNow] = useState(true);
  const [recommendedProd, setRecommendedProducts] = useState([]);
  const [total, setTotal] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalForproduct: 0,
  });
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          const colref = collection(fireDB, "carts");
          const userIdref = query(colref, where("userId", "==", state.userId));
          await onSnapshot(userIdref, (cartProducts) => {
            cartProducts.forEach((doc) => {
              setProductDetail({ ...doc.data(), id: doc.id });
            });
          });
        } catch (e) {
          console.log(e);
        }
      })();

      return () => {
        isActive = false;
      };
    }, [loading])
  );

  // useEffect(() => {
  //   let isMounted = true;
  //   let newTemp = [];
  //   cartDetails?.productId?.map((item, index) => newTemp.push(item));
  //   setTemp(newTemp);
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [cartDetails]);

  useEffect(() => {
    let isMounted = true;
    // calculatePrices();
    getProducts();
    return () => {
      isMounted = false;
    };
  }, [productDetail]);

  // useEffect(() => {
  //   let isMounted = true;
  //   const arr = [];
  //   temp?.forEach((item, index) => {
  //     arr.push(getProductDetails(item.productId));
  //   });
  //   Promise.all(arr).then((res) => {
  //     temp?.forEach((item, index) => {
  //       res[index].docIDforcart = docofCart;
  //       res[index].productId = temp[index].productId;
  //       res[index].productquantity = temp[index].quantity;
  //     });
  //     setProductDetail(res);
  //   });
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [temp]);

  // async function getCartDetailsForPlacingOrder() {
  //   try {
  //     const colref = collection(fireDB, "carts");
  //     const userIdref = query(colref, where("userId", "==", state.userId));
  //     const cartProducts = await onSnapshot(userIdref, (cartProducts) => {
  //       cartProducts.forEach((doc) => {
  //         setDocofCart(doc.id); // what document
  //         setcartDetails({ ...doc.data(), id: doc.id }); // cart details
  //         setProductDetail({ ...doc.data(), id: doc.id });
  //         console.log(doc.data(), "this data");
  //       });
  //     });

  //     if (rendernow == false) {
  //       return cartProducts();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const matchCouponCode = async (couponCode) => {
    try {
      const colref = collection(fireDB, "coupons");
      const userIdref = query(colref, where("couponCode", "==", couponCode));
      const results = await onSnapshot(userIdref, (coupon) => {});
    } catch (err) {
      console.log(err);
    }
  };
  // For Prices and Taxes and Total
  const calculatePrices = useMemo(() => {
    if (productDetail) {
      let sum = 0;
      productDetail?.productId?.forEach(function (value) {
        sum += parseFloat(value.total);
      });
      return sum;
    } else {
      return 0;
    }
  }, [productDetail]);
  const subTotal = useMemo(() => {
    const subtaxes = calculatePrices * 0.13;
    return calculatePrices + subtaxes;
  }, [calculatePrices]);

  // getting product details
  const getProductDetails = async (productDocId) => {
    const prodColref = doc(fireDB, "products", productDocId);
    return new Promise(async (rsl, rej) => {
      const docSnap = await onSnapshot(prodColref, (results) => {
        if (results.exists()) {
          rsl(results.data());
        } else {
          rej("No Products Found");
        }
      });
    });
  };

  // Delete the product by ID
  const deleteProductfromCartbyID = async (prod, delData) => {
    if (prod) {
      const delRef = doc(fireDB, "carts", prod);
      await updateDoc(delRef, {
        productId: arrayRemove(delData),
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    // var newArray = productDetail;
    // var tempArraytoUpdate = [];
    // var filteredArrayForProducts = newArray.filter((prod) => {
    //   return prod.productId !== prodID;
    // });
    // if (filteredArrayForProducts.length !== 0) {
    //   filteredArrayForProducts?.forEach((item, index) => {
    //     tempArraytoUpdate.push({
    //       productId: item.productId,
    //       quantity: item.productquantity,
    //     });
    //   });
    //   const collectionRef = doc(fireDB, "carts", docofCart);
    //   await updateDoc(collectionRef, {
    //     productId: tempArraytoUpdate,
    //   })
    //     .then((res) => {
    //       setrenderNow(false);
    //       setProductDetail(filteredArrayForProducts);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // } else {
    //   setProductDetail(filteredArrayForProducts);
    //   deleteCart(docofCart);
    //   setDocofCart("");
    //   setrenderNow(false);
    //   props.navigation.navigate("MenuCategories");
    // }
  };

  // delete cart
  const deleteCart = (docscart) => {
    const delRef = doc(fireDB, "carts", docscart);
    deleteDoc(delRef)
      .then((res) => {})
      .catch((err) => {
        // console.log(err)
      });
  };

  const destructureProductDetail = (addorremove, items) => {
    let prodDetail = { ...productDetail };
    let item = prodDetail?.productId?.find(
      (prod) => prod.productId === items.productId
    );
    if (addorremove === "plus") {
      setProductDetail({
        ...productDetail,
        productId: productDetail?.productId?.map((prod) =>
          prod.productId === items.productId
            ? {
                ...prod,
                quantity: prod.quantity + 1,
                total: prod.productprice * prod.quantity,
              }
            : prod
        ),
      });
    } else if (addorremove === "minus") {
      if (item.quantity > 1) {
        setProductDetail({
          ...productDetail,
          productId: productDetail?.productId?.map((prod) =>
            prod.productId === items.productId
              ? {
                  ...prod,
                  quantity: prod.quantity - 1,
                  total: prod.productprice * prod.quantity,
                }
              : prod
          ),
        });
      }
    }
    // setProductDetail({
    //   ...productDetail,
    //   productId: productDetail?.productId?.map((prod) =>
    //     prod.productId === items.productId
    //       ? { ...prod, quantity: prod.quantity + 1 }
    //       : prod
    //   ),
    // });
    // let prod_element = { ...prodDetail?.productId[index] };
    // let tempnew = [...productDetail];
    // let temp_element = productDetail?.productId[index];
    // console.log(tempnew, temp_element);
    // if (addorremove == "plus") {
    //   temp_element.quantity += 1;
    // } else if (addorremove == "minus") {
    //   if (temp_element.quantity > 1) {
    //     temp_element.quantity -= 1;
    //   }
    // }
    // tempnew.productId[index] = temp_element;
    // setProductDetail(tempnew);
  };

  // Get All the products for recommended Components
  const getProducts = async () => {
    const q = query(collection(fireDB, "products"));

    await onSnapshot(q, (cartProducts) => {
      const cities = [];
      cartProducts.forEach((doc) => {
        // console.log(doc.data(), "this document of snap");
        cities.push({ ...doc.data(), id: doc.id });
      });
      if (productDetail) {
        cities.filter((prod) => {
          return !productDetail?.productId?.some(
            (item) => item.productId === prod.id
          );
        });
      }
      setRecommendedProducts(cities);
    });
  };

  const addRecommeded = async (addthis) => {
    const body = {
      productId: addthis.id,
      quantity: 1,
      total: addthis?.price * 1,
      productprice: addthis?.price,
      image:
        addthis.image == undefined || addthis.image == "" ? "" : addthis?.image,
      name: addthis?.name,
    };
    const collectionRef = doc(fireDB, "carts", productDetail.id);
    await updateDoc(collectionRef, {
      productId: arrayUnion(body),
    });
    /**
     *
     */
    // addthis.docIDforcart = docofCart;
    // addthis.productquantity = 1;
    // setProductDetail((prevState) => [...prevState, addthis]);
    //
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     // console.log(err);
    //   });
  };

  const saveUpdatedCart = async () => {
    // var tempArr = [];
    //
    // productDetail?.map((item, index) => {
    //   tempArr.push({
    //     productId: item.productId,
    //     quantity: item.productquantity,
    //     total: item.productquantity * item.price,
    //     image: item.image == "" || item.image == undefined ? "" : item.image,
    //   });
    // });

    const colRef = doc(fireDB, "carts", productDetail?.id);
    await updateDoc(colRef, {
      productId: productDetail?.productId,
    })
      .then((res) => {
        props.navigation.navigate("PaymentDetails");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return productDetail ? (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title="Cart"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            backgroundColor: "#2D2D2D",
            elevation: 10,
            shadowColor: "#191919",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            padding: 14,
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", marginTop: 4, color: "#fff" }}>
              {productDetail?.productId?.length} Items
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("MenuCategories")}
            >
              <Text style={{ color: "#fff", fontSize: 12, textAlign: "right" }}>
                + Add More Items
              </Text>
            </TouchableOpacity>
          </View>

          {productDetail?.productId?.length > 0 &&
            productDetail?.productId?.map((item, index) => {
              return (
                <View key={index}>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      paddingHorizontal: 5,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#fff",
                          marginTop: 4,
                        }}
                      >
                        {item?.name}
                      </Text>
                      <Text
                        style={{ fontSize: 12, color: "#fff", marginTop: 4 }}
                      >
                        ${item?.productprice}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textAlign: "right",
                        }}
                      >
                        ${item?.productprice * item?.quantity}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 10,
                      width: "100%",
                    }}
                  >
                    <View style={{ flexDirection: "row", width: "50%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          destructureProductDetail("minus", item);
                        }}
                      >
                        <AntDesign
                          name="minussquareo"
                          size={24}
                          color="#154525"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 17,
                          paddingHorizontal: 10,
                          color: "#fff",
                        }}
                      >
                        {item?.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          destructureProductDetail("plus", item);
                        }}
                      >
                        <AntDesign
                          name="plussquare"
                          size={24}
                          color="#154525"
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.navigate("OrderDetails", {
                            productId: item?.productId,
                          });
                        }}
                      >
                        <Text
                          style={{
                            color: "#154525",
                            fontSize: 14,
                            textAlign: "right",
                          }}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          deleteProductfromCartbyID(productDetail?.id, item);
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            textAlign: "right",
                          }}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            padding: 10,
            justifyContent: "space-between",
            backgroundColor: "#2D2D2D",
            shadowColor: "#191919",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 10,
            width: "95%",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Coupons
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{ justifyContent: "center", alignContent: "center" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                name="ios-pricetag"
                size={14}
                color="#154525"
                style={{ marginTop: 3, marginRight: 3 }}
              />
              <Text
                style={{
                  color: "#154525",
                  fontSize: 12,
                }}
              >
                Apply a Coupon
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,.5)",
            }}
          >
            <View
              style={{
                margin: 20,
                backgroundColor: "#191919",
                // borderRadius: 20,
                padding: 10,
                width: 300,
                alignItems: "center",
                shadowColor: "#191919",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}
                >
                  Add a Coupon Code
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={{}}
                >
                  <AntDesign name="closesquare" size={24} color="#154525" />
                </TouchableOpacity>
              </View>
              <View style={{ width: "90%", padding: 10 }}>
                <Text style={{ color: "#fff" }}>
                  Have a Coupon or a promo code? Enter it here
                </Text>
                <TextInput
                  placeholder="Coupon Code Here"
                  placeholderTextColor={"grey"}
                  style={{
                    textAlign: "left",
                    marginTop: 4,
                    borderBottomWidth: 1,
                    width: "100%",
                    padding: 10,
                    color: "#fff",
                  }}
                  onChangeText={(val) => {
                    dispatch({ type: "COUPON_CODE", payload: val });
                  }}
                />
              </View>
              <View style={{ width: "100%", padding: 10 }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={{
                    backgroundColor: "#154525",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 17,
                    }}
                  >
                    Use Coupon
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            backgroundColor: "#2D2D2D",
            width: "95%",
            alignSelf: "center",
            elevation: 10,
            shadowColor: "#191919",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            padding: 15,
            marginTop: 10,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              Your Recommended Items
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("MenuCategories")}
            >
              <Text style={{ color: "#154525", fontSize: 12 }}>View Menu</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recommendedProd}
            horizontal
            keyExtractor={(item, index) => index}
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={(item, index) => (
              <RecommendedFood
                recommended={item}
                addproductCart={() => addRecommeded(item?.item)}
              />
            )}
          />
        </View>
        <View
          style={{
            backgroundColor: "#2D2D2D",
            width: "95%",
            elevation: 10,
            shadowColor: "#191919",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            padding: 10,
            // borderRadius: 10,
            alignSelf: "center",
            marginTop: 10,
            marginBottom: 80,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "white" }}>Sub Total</Text>
            <Text style={{ color: "white" }}>${calculatePrices}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "white" }}>Taxes</Text>
            <Text style={{ color: "white" }}>
              ${(calculatePrices * 0.13).toFixed(2)}
            </Text>
          </View>
          {/* {total.discount > 0 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <Text style={{ color: "white" }}>Discount</Text>
              <Text style={{ color: "white" }}>${total?.tax}</Text>
            </View>
          ) : null} */}
          <View
            style={{
              borderBottomColor: "#EBEBEB",
              borderBottomWidth: 1,
              marginTop: 4,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Total</Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              ${/* {total.totalForproduct} */}
              {subTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      {productDetail?.productId?.length > 0 ? (
        <FullButton
          title={"Save & Continue"}
          onPress={() => saveUpdatedCart()}
        />
      ) : (
        <FullButton
          title={"Start Adding items to your cart"}
          onPress={() => props.navigation.navigate("MenuCategories")}
        />
      )}
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        title="Cart"
        nameicons={"left"}
        onPress={() => props.navigation.goBack()}
      />

      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Image
          source={require("../assets/ucarttttttempty.png")}
          style={{ width: 190, height: 300 }}
        />
        <TouchableOpacity
          style={{ backgroundColor: "#154525", padding: 15, marginTop: 20 }}
          onPress={() => {
            props.navigation.navigate("MenuCategories");
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Start Adding items to your cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
