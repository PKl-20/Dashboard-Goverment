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
        setupDocumentUpload();
        
        const tabButtons = document.querySelectorAll('.tab-button');
        const tableContainers = document.querySelectorAll('.table-container');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tableContainers.forEach(container => container.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(`${tabId}Table`).classList.add('active');
            });
        });

        loadBidangPasar();

        // Tambahkan event listener untuk tombol "Tambah Data"
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', () => {
                const tableId = button.closest('.table-container').id;
                if (tableId === 'kondisiPasarTable') {
                    openAddDataPopup('kondisiPasar');
                } else if (tableId === 'losKiosTable') {
                    openAddDataPopup('losKios');
                } else if (tableId === 'profilTable') {
                    openAddDataPopup('profil');
                }
            });
        });
    }
    
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    const closePopup = document.querySelector('.close-popup');
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            document.getElementById('addDataPopup').style.display = 'none';
        });
    }
});

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('Password').value;
    
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

function loadBidangPasar() {
    const bidangPasarRef = ref(db, 'Bidang Pasar');
    
    onValue(bidangPasarRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            renderKondisiPasarTable(data.dataKondisiPasar);
            renderLosKiosTable(data.jumlahLosKiosPasar.dataPasar);
            renderProfilTable(data.matriksProfilPasar.dataUPT);
        }
    });
}

function renderKondisiPasarTable(data) {
    const tbody = document.getElementById('kondisiPasarBody');
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.namaPasar}</td>
            <td>${item.fasilitas.arealParkir}</td>
            <td>${item.fasilitas.TPS}</td>
            <td>${item.fasilitas.MCK}</td>
            <td>${item.fasilitas.tempatIbadah}</td>
            <td>${item.fasilitas.bongkarMuat}</td>
            <td>${item.kondisi.baik}</td>
            <td>${item.kondisi.tidakBaik}</td>
            <td>${item.kondisi.perluPenyempurnaan}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editKondisiPasar(${index})">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteKondisiPasar(${index})">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Los & Kios
function renderLosKiosTable(data) {
    const tbody = document.getElementById('losKiosBody');
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.namaPasar}</td>
            <td>${item.alamatLengkap}</td>
            <td>${item.jumlahLosKios.los}</td>
            <td>${item.jumlahLosKios.kios}</td>
            <td>${item.jumlahPedagang.los}</td>
            <td>${item.jumlahPedagang.kios}</td>
            <td>${item.jumlahTidakTermanfaatkan.los}</td>
            <td>${item.jumlahTidakTermanfaatkan.kios}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editLosKios(${index})">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteLosKios(${index})">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderProfilTable(data) {
    const tbody = document.getElementById('profilBody');
    tbody.innerHTML = '';
    let no = 1;
    data.forEach((upt) => {
        upt.dataPasar.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${no++}</td>
                <td>${upt.UPT}</td>
                <td>${item.namaPasar}</td>
                <td>${item.jumlahPaguyubanPedagang}</td>
                <td>${item.alamat}</td>
                <td>${item.tahunBerdiri}</td>
                <td>${item.luas.tanah}</td>
                <td>${item.luas.bangunan}</td>
                <td>${item.luas.lantai}</td>
                <td>${item.jumlah.los}</td>
                <td>${item.jumlah.kios}</td>
                <td>${item.jumlah.dasaran}</td>
                <td>${item.jumlahPedagang.los}</td>
                <td>${item.jumlahPedagang.kios}</td>
                <td>${item.jumlahPedagang.dasaran}</td>
                <td>${item.fasilitasTersedia.arealParkir}</td>
                <td>${item.fasilitasTersedia.TPS}</td>
                <td>${item.fasilitasTersedia.MCK}</td>
                <td>${item.fasilitasTersedia.tempatIbadah}</td>
                <td>${item.fasilitasTersedia.bongkarMuat}</td>
                <td>${item.keterangan}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editProfil(${index})">
                            <span class="material-icons-sharp">edit</span>
                        </button>
                        <button class="delete-btn" onclick="deleteProfil(${index})">
                            <span class="material-icons-sharp">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    });
}

let currentTable = '';

function openAddDataPopup(table) {
    currentTable = table;
    const form = document.getElementById('addDataForm');
    form.innerHTML = ''; // Kosongkan form

    if (table === 'kondisiPasar') {
        form.innerHTML = `
            <input type="text" id="namaPasar" placeholder="Nama Pasar" required>
            <select id="arealParkir" required>
                <option value="">Pilih Areal Parkir</option>
                <option value="ADA">ADA</option>
                <option value="TIDAK ADA">TIDAK ADA</option>
            </select>
            <select id="TPS" required>
                <option value="">Pilih TPS</option>
                <option value="ADA">ADA</option>
                <option value="TIDAK ADA">TIDAK ADA</option>
            </select>
            <select id="MCK" required>
                <option value="">Pilih MCK</option>
                <option value="ADA">ADA</option>
                <option value="TIDAK ADA">TIDAK ADA</option>
            </select>
            <select id="tempatIbadah" required>
                <option value="">Pilih Tempat Ibadah</option>
                <option value="ADA">ADA</option>
                <option value="TIDAK ADA">TIDAK ADA</option>
            </select>
            <select id="bongkarMuat" required>
                <option value="">Pilih Bongkar Muat</option>
                <option value="ADA">ADA</option>
                <option value="TIDAK ADA">TIDAK ADA</option>
            </select>
            <label>
                <input type="checkbox" id="kondisiBaik"> Baik
            </label>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'losKios') {
        form.innerHTML = `
            <input type="text" id="namaPasar" placeholder="Nama Pasar" required>
            <input type="text" id="alamatLengkap" placeholder="Alamat Lengkap" required>
            <input type="number" id="jumlahLos" placeholder="Jumlah Los" required>
            <input type="number" id="jumlahKios" placeholder="Jumlah Kios" required>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'profil') {
        form.innerHTML = `
            <input type="text" id="UPT" placeholder="UPT" required>
            <input type="text" id="namaPasar" placeholder="Nama Pasar" required>
            <input type="number" id="jumlahPaguyuban" placeholder="Jumlah Paguyuban" required>
            <input type="text" id="alamat" placeholder="Alamat" required>
            <button type="submit">Tambah Data</button>
        `;
    }

    document.getElementById('addDataPopup').style.display = 'block';
}

function closeAddDataPopup() {
    document.getElementById('addDataPopup').style.display = 'none';
}

document.getElementById('addDataForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (currentTable === 'kondisiPasar') {
        const newData = {
            namaPasar: document.getElementById('namaPasar').value,
            fasilitas: {
                arealParkir: document.getElementById('arealParkir').value,
                TPS: document.getElementById('TPS').value,
                MCK: document.getElementById('MCK').value,
                tempatIbadah: document.getElementById('tempatIbadah').value,
                bongkarMuat: document.getElementById('bongkarMuat').value
            },
            kondisi: {
                baik: document.getElementById('kondisiBaik').checked ? 'X' : '',
                tidakBaik: '',
                perluPenyempurnaan: ''
            }
        };
        const refPath = ref(db, 'Bidang Pasar/dataKondisiPasar');
        await push(refPath, newData);
    } else if (currentTable === 'losKios') {
        const newData = {
            namaPasar: document.getElementById('namaPasar').value,
            alamatLengkap: document.getElementById('alamatLengkap').value,
            jumlahLosKios: {
                los: parseInt(document.getElementById('jumlahLos').value),
                kios: parseInt(document.getElementById('jumlahKios').value)
            },
            jumlahPedagang: {
                los: 0,
                kios: 0
            },
            jumlahTidakTermanfaatkan: {
                los: 0,
                kios: 0
            }
        };
        const refPath = ref(db, 'Bidang Pasar/jumlahLosKiosPasar/dataPasar');
        await push(refPath, newData);
    } else if (currentTable === 'profil') {
        const newData = {
            UPT: document.getElementById('UPT').value,
            dataPasar: [{
                namaPasar: document.getElementById('namaPasar').value,
                jumlahPaguyubanPedagang: parseInt(document.getElementById('jumlahPaguyuban').value),
                alamat: document.getElementById('alamat').value,
                tahunBerdiri: '',
                luas: {
                    tanah: 0,
                    bangunan: 0,
                    lantai: 0
                },
                jumlah: {
                    los: 0,
                    kios: 0,
                    dasaran: 0
                },
                jumlahPedagang: {
                    los: 0,
                    kios: 0,
                    dasaran: 0
                },
                fasilitasTersedia: {
                    arealParkir: '',
                    TPS: '',
                    MCK: '',
                    tempatIbadah: '',
                    bongkarMuat: ''
                },
                keterangan: ''
            }]
        };
        const refPath = ref(db, 'Bidang Pasar/matriksProfilPasar/dataUPT');
        await push(refPath, newData);
    }

    closeAddDataPopup();
    loadBidangPasar(); // Refresh data
});