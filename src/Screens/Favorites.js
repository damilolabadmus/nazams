import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Header } from "../Components/Header";
import EditLocation from "../Components/EditLocation";
import { useFocusEffect } from "@react-navigation/native";

import {
  collection,
  getDoc,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { fireDB } from "../config";
import { Context } from "../store";
import FavoritesComp from "../Components/FavoritesComp";
import { setGuestUser } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";

export function Favorites({ ...props }) {
  const [expanded, setExpanded] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);
  // const { state, dispatch } = useContext(Context);
  const state = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const [favorites, setFavorites] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          let products = [];
          onSnapshot(doc(fireDB, "favourite", state.userId), (items) => {
            if (items.data()?.productIds) {
              items.data()?.productIds?.forEach(async (item) => {
                let productData = await getDoc(doc(fireDB, "products", item));
                if (productData.exists()) {
                  products.push({
                    prodId: productData.id,
                    ...productData.data(),
                  });
                }
              });
            }
          });
          setTimeout(() => {
            setFavorites(products);
          }, 1000);
          // onSnapshot(doc(fireDB, "favourite", state.userId), (doc) => {
          //   const data = getProducts(doc.data().productIds);

          //   // setFavorites({ ...doc.data(), id: doc.id });
          // });
          /***
           * 
           * let products = [];
           *  onSnapshot(doc(fireDB, "favourite", state.userId), (doc) => {
           * if(doc.data().productIds){
           * doc.data().productIds.forEach(async(doc)=>{
           let productData = await getDoc(doc(fireDB, "products", doc));
           if (productData.exists()) {
             products.push( {
               prodId: productData.id,
               ...productData.data(),
              });
            }
            * }

         
          });
    const querySnaphot = await getDocs(collection(fireDB, "favourite"));
    querySnaphot.forEach(async (doc) => {
      
      newItem.productData = [];
      newItem.productId?.forEach(async (item, index) => {
        let productData = await getDoc(item);
        if (productData.exists()) {
          newItem.productData[index] = {
            prodId: productData.id,
            ...productData.data(),
          };
        }
      });
      products.push(newItem);
    });
    setTimeout(() => {
      setCoupons(products);
    }, 2000);
           */
        } catch (e) {
          console.log(e);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [])
  );
  useEffect(() => {
    let isMounted = true;
    // getFaves();
    return () => {
      isMounted = false;
    };
  }, []);

  const getFaves = async () => {
    const colRef = collection(fireDB, "favourite");
    const q = query(colRef, where("userId", "==", state.userId));
    await onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((item) => {
        const data = getProducts(item);

        // setFavorites({ ...item.data(), id: item.id });
      });
    });
  };

  const getProducts = async (item) => {
    const docx = doc(fireDB, "products", item);
    const docSnap = await getDoc(docx);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: doc.id };
    }
  };
  const addFavourite = async (id) => {
    const docRef = doc(fireDB, "favourite", state?.userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data()?.productIds.some((item) => item === id)) {
        await updateDoc(doc(fireDB, "favourite", state?.userId), {
          productIds: arrayRemove(id),
        });
      } else {
        await updateDoc(doc(fireDB, "favourite", state?.userId), {
          productIds: arrayUnion(id),
        });
      }
    } else {
      await updateDoc(doc(fireDB, "favourite", state?.userId), {
        productIds: arrayUnion(id),
      });
    }
  };
  const addFavouriteCart = async (addthis) => {
    const q = query(
      collection(fireDB, "carts"),
      where("userId", "==", state?.userId)
    );
    const body = {
      productId: addthis.id,
      quantity: 1,
      total: addthis?.price * 1,
      productprice: addthis?.price,
      image: addthis?.image,
      name: addthis?.name,
    };
    let docId;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });

    if (docId) {
      const collectionRef = doc(fireDB, "carts", docId);
      const prodexits = await getDoc(collectionRef);
      if (prodexits.exists()) {
        if (
          prodexits
            .data()
            ?.productId.some((item) => item.productId === addthis.id)
        ) {
          Alert.alert(
            "Duplicate Product",
            "This Product is already in your cart section."
          );
        } else {
          await updateDoc(doc(fireDB, "carts", docId), {
            productId: arrayUnion(body),
          })
            .then((res) => {
              Alert.alert(
                "Proceed to Checkout",
                "Your product has been added to the Cart",
                [
                  {
                    text: "Go to Cart",
                    onPress: () => props?.navigation.navigate("Cart"),
                  },
                  {
                    text: "Cancel",
                    onPress: () => {},
                  },
                ]
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      const docRef = addDoc(collection(fireDB, "carts"), {
        productId: [body],
        userId: state.userId,
      })
        .then((res) => {
          if (res) {
            Alert.alert(
              "Proceed to Checkout",
              "Your product has been added to the Cart",
              [
                {
                  text: "Go to Cart",
                  onPress: () => props?.navigation.navigate("Cart"),
                },
                {
                  text: "Cancel",
                  onPress: () => {},
                },
              ]
            );
          }
        })
        .catch((err) => console.log(err));
    }
    // if (find.productId) {
    // } else {
    // }

    // const collectionRef = doc(fireDB, "carts", productDetail.id);
    // await updateDoc(collectionRef, {
    //   productId: arrayUnion(body),
    // });
  };

  if (state.guestUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#191919" }}>
        <Header
          rightIcon={true}
          rightIconName={"shopping-bag"}
          title="Favorites"
          rightonPress={() => props.navigation.navigate("Cart")}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
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
                backgroundColor: "#154525",
                padding: 10,
                color: "#fff",
              }}
            >
              Please Login to Add to Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#191919" }}>
      <Header
        rightIcon={true}
        rightIconName={"shopping-bag"}
        title="Favorites"
        rightonPress={() => props.navigation.navigate("Cart")}
      />

      <EditLocation handlePress={handlePress} expanded={expanded} />
      {favorites?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={favorites}
          keyExtractor={(item, index) => index}
          renderItem={(item, index) => {
            return (
              <FavoritesComp
                title={item.item.name}
                description={item.item.description}
                price={item.item.price}
                image={item.item.image}
                addFavourite={addFavourite}
                addFavouriteCart={addFavouriteCart}
                prodId={item.item.prodId}
              />
            );
          }}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Favorites")}
          >
            <Text
              style={{
                fontWeight: "bold",
                backgroundColor: "#154525",
                padding: 10,
                color: "#fff",
              }}
            >
              No Favorite Product Found
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
