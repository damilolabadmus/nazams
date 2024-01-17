import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWLcTpmrJK2l61JmcVqioJlOxgxHZHaIU",
  authDomain: "nizams-kathi-kabab.firebaseapp.com",
  projectId: "nizams-kathi-kabab",
  storageBucket: "nizams-kathi-kabab.appspot.com",
  messagingSenderId: "781750665399",
  appId: "1:781750665399:web:932fde03c94c0542144d32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);

// Get Categories Title
const auth = getAuth(app);
async function getCategories() {
  var dataforTheCategories = [];
  const productForMenu = collection(fireDB, "categories");
  const docOfMenuCategories = await getDocs(productForMenu);
  docOfMenuCategories.forEach((doc) => {
    var tempData = doc.data();
    dataforTheCategories.push({
      cat_id: doc.id,
      title: tempData.title,
      cat_img: tempData.category_img,
      position: tempData.position,
    });
  });
  return dataforTheCategories;
}

// Get Products for Each Category
async function getProductsByCategories(idForCategory) {
  let dataCategoryProducts = [];
  const colRef = collection(fireDB, "products");
  const q = query(colRef, where("category_id", "==", idForCategory));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let tempData = doc.data();
    dataCategoryProducts.push({
      productId: doc.id,
      productName: tempData.name,
      productCalories: tempData.cals,
      productImg: tempData.image,
      productPrice: tempData.price,
      productDescription: tempData.description,
    });
  });
  return dataCategoryProducts;
}

export { app, fireDB, getCategories, getProductsByCategories, auth };
