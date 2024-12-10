import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, get, update, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable,getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6tJYFtZla6pxjVJjc3eox3sSpGW-MIBk",
    authDomain: "musicappstream-70860.firebaseapp.com",
    databaseURL: "https://musicappstream-70860-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "musicappstream-70860",
    storageBucket: "musicappstream-70860.appspot.com",
    messagingSenderId: "277133232650",
    appId: "1:277133232650:web:83c469563e556e20d56df3",
    measurementId: "G-PTK1S4CMF2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    if (currentPage.includes('index.html') || currentPage === '/') {
        setupLoginForm();
        checkLoginStatus();
    } else if (currentPage.includes('dashboard.html')) {
        checkLoginStatus();
        loadDashboard();
    }
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
}
});

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePassword);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const adminRef = ref(db, 'admin');
        const snapshot = await get(adminRef);
        
        if (snapshot.exists()) {
            let isAuthenticated = false;
            
            snapshot.forEach((childSnapshot) => {
                const adminData = childSnapshot.val();
                if (adminData.username === username && adminData.password === password) {
                    isAuthenticated = true;
                }
            });
            
            if (isAuthenticated) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', username);
                window.location.href = '../pages/dashboard.html';
            } else {
                alert('Username atau password salah!');
            }
        } else {
            alert('Data tidak ditemukan!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat login!');
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
}

function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;

    if (isLoggedIn === 'true') {
        if (currentPage.includes('index.html') || currentPage === '/') {
            window.location.href = '../pages/dashboard.html';
        }
    } else {
        if (currentPage.includes('dashboard.html')) {
            window.location.href = '../index.html';
        }
    }
}

function loadDashboard() {
    const username = sessionStorage.getItem('username');
    console.log('Loading dashboard for user:', username);
    
    if (window.location.pathname.includes('dashboard.html')) {
        setupDocumentUpload();
    }
}

function logoutUser() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = '../index.html';
}

function storeFiles(){
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const storageRef = storageRef(storage, 'files/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
    });
}

function setupDocumentUpload() {
    const documentCard = document.querySelector('.document-card');
    const documentPopup = document.getElementById('documentPopup');
    const closePopup = document.querySelector('.close-document-popup');
    const documentForm = document.getElementById('documentForm');

    if (documentCard && documentPopup) {
        documentCard.addEventListener('click', () => {
            documentPopup.style.display = 'block';
        });
    }

    if (closePopup && documentPopup) {
        closePopup.addEventListener('click', () => {
            documentPopup.style.display = 'none';
        });
    }

    if (documentForm) {
        documentForm.addEventListener('submit', handleDocumentUpload);
    }
}

async function handleDocumentUpload(e) {
    e.preventDefault();
    
    const documentName = document.getElementById('documentName').value;
    const documentFile = document.getElementById('documentFile').files[0];
    
    const MAX_FILE_SIZE = 100 * 1024 * 1024; 
    
    if (!documentFile) {
        alert('Silakan pilih file terlebih dahulu');
        return;
    }

    if (documentFile.size > MAX_FILE_SIZE) {
        alert(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE/1024/1024}MB`);
        return;
    }

    try {
        // Buat elemen progress bar jika belum ada
        let progressContainer = document.querySelector('.upload-progress-container');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'upload-progress-container';
            progressContainer.innerHTML = `
                <div class="upload-progress">
                    <div class="progress-bar" id="uploadProgress"></div>
                </div>
                <div class="upload-status" id="uploadStatus">Memulai upload...</div>
            `;
            const form = document.getElementById('documentForm');
            form.insertBefore(progressContainer, form.querySelector('button'));
        }

        const uploadButton = document.querySelector('#documentForm button');
        uploadButton.disabled = true;
        uploadButton.textContent = 'Mengupload...';

        // Setup file reference dengan timestamp
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${documentFile.name}`;
        const fileRef = storageRef(storage, `documents/${fileName}`);

        // Mulai upload dengan progress monitoring
        const uploadTask = uploadBytesResumable(fileRef, documentFile);

        uploadTask.on('state_changed', 
            // Progress handler
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const progressBar = document.getElementById('uploadProgress');
                const statusDiv = document.getElementById('uploadStatus');
                
                // Update progress bar
                progressBar.style.width = `${progress}%`;
                
                // Update status text dengan informasi ukuran
                const uploadedMB = (snapshot.bytesTransferred / 1024 / 1024).toFixed(2);
                const totalMB = (snapshot.totalBytes / 1024 / 1024).toFixed(2);
                statusDiv.textContent = `Mengupload ${uploadedMB}MB dari ${totalMB}MB (${Math.round(progress)}%)`;
            },
            // Error handler
            (error) => {
                console.error('Upload error:', error);
                alert('Terjadi kesalahan saat upload: ' + error.message);
                progressContainer.remove();
                uploadButton.disabled = false;
                uploadButton.textContent = 'Upload Document';
            },
            // Completion handler
            async () => {
                try {
                    // Dapatkan URL download
                    const downloadURL = await getDownloadURL(fileRef);
                    
                    // Simpan metadata ke Realtime Database
                    const docRef = ref(db, 'documents');
                    const newDocRef = push(docRef);
                    await set(newDocRef, {
                        name: documentName,
                        fileName: fileName,
                        originalFileName: documentFile.name,
                        fileUrl: downloadURL,
                        uploadDate: new Date().toISOString(),
                        fileSize: documentFile.size,
                        fileType: documentFile.type,
                        uploadedBy: sessionStorage.getItem('username') || 'unknown'
                    });

                    alert('Dokumen berhasil diupload!');
                    document.getElementById('documentPopup').style.display = 'none';
                    document.getElementById('documentForm').reset();
                    
                } catch (error) {
                    console.error('Error saving metadata:', error);
                    alert('Terjadi kesalahan saat menyimpan data dokumen');
                } finally {
                    progressContainer.remove();
                    uploadButton.disabled = false;
                    uploadButton.textContent = 'Upload Document';
                }
            }
        );

    } catch (error) {
        console.error('Error initiating upload:', error);
        alert('Terjadi kesalahan saat memulai upload');
        const uploadButton = document.querySelector('#documentForm button');
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload Document';
    }
}