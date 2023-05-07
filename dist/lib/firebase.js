"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.db = exports.auth = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: "AIzaSyCDuHNoHptwXQH9LICAm7qHlGoAcTa4foU",
    authDomain: "meet-and-go-new.firebaseapp.com",
    projectId: "meet-and-go-new",
    storageBucket: "meet-and-go-new.appspot.com",
    messagingSenderId: "771714448080",
    appId: "1:771714448080:web:ac18135b096bbee62c7cd5",
    measurementId: "G-HDLLHFJT47"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.storage = (0, storage_1.getStorage)(app);
