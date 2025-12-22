import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqUDMQgc57d4wWSW2auFyYCS19q8vxBU4",
  authDomain: "digihealth-65f04.firebaseapp.com",
  projectId: "digihealth-65f04",
  storageBucket: "digihealth-65f04.appspot.com",
  messagingSenderId: "704628949252",
  appId: "1:704628949252:web:b38a476bd9c4259f829051"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
