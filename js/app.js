// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvS4WWQxexKc50hhUTiOK7-pbbgW-ohGg",
  authDomain: "dashboard-goverment.firebaseapp.com",
  databaseURL: "https://dashboard-goverment-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dashboard-goverment",
  storageBucket: "dashboard-goverment.appspot.com",
  messagingSenderId: "158779726573",
  appId: "1:158779726573:web:2292616126be60375f8ae4",
  measurementId: "G-25PXSR89RC",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

let accessToken;

// Login dengan Google
document.getElementById("login").addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/drive.file");

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    accessToken = credential.accessToken;

    alert("Login successful!");
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed");
  }
});

// Upload file ke Google Drive
async function uploadToDrive(file) {
  const metadata = {
    name: file.name,
    mimeType: file.type,
  };
  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  return response.json();
}

// Simpan metadata file ke Firestore
async function saveFileMetadataToFirestore(fileMetadata) {
  try {
    await addDoc(collection(firestore, "files"), {
      name: fileMetadata.name,
      mimeType: fileMetadata.mimeType,
      size: fileMetadata.size,
      link: `https://drive.google.com/file/d/${fileMetadata.id}/view`,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error saving file metadata:", err);
    throw err;
  }
}

// Tangani file upload
document.getElementById("fileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  try {
    // Upload ke Google Drive
    const driveFile = await uploadToDrive(file);

    // Simpan metadata file
    const fileMetadata = {
      name: file.name,
      mimeType: file.type,
      size: file.size,
      id: driveFile.id,
    };
    await saveFileMetadataToFirestore(fileMetadata);

    alert("File uploaded and metadata saved!");
  } catch (err) {
    console.error("Error:", err);
    alert("Upload failed");
  }
});
