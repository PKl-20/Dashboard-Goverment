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
        loadBidangKoperasi();
        
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', () => {
                const mainElement = button.closest('main');
                if (mainElement.id === 'Bidang-Pasar') {
                    // Untuk tabel di Bidang Pasar
                    const tableContainer = button.closest('.table-container');
                    if (tableContainer.id === 'kondisiPasarTable') {
                        openAddDataPopup('kondisiPasar');
                    } else if (tableContainer.id === 'losKiosTable') {
                        openAddDataPopup('losKios');
                    } else if (tableContainer.id === 'profilTable') {
                        openAddDataPopup('profil');
                    }
                } else if (mainElement.id === 'Bidang-Koperasi') {
                    // Untuk tabel di Bidang Koperasi
                    const tableContainer = button.closest('.table-container');
                    if (tableContainer.id === 'pelakuUKMTable') {
                        openAddDataPopup('pelakuUKM');
                    } else if (tableContainer.id === 'ukmBerijinTable') {
                        openAddDataPopup('ukmBerijin');
                    } else if (tableContainer.id === 'ukmAksesPerbankanTable') {
                        openAddDataPopup('ukmAksesPerbankan');
                    } else if (tableContainer.id === 'wirausahaBermitraUKMTable') {
                        openAddDataPopup('wirausahaBermitraUKM');
                    } else if (tableContainer.id === 'aksesModalUsahaTable') {
                        openAddDataPopup('aksesModalUsaha');
                    } else if (tableContainer.id === 'miskinPesertaPelatihanTable') {
                        openAddDataPopup('miskinPesertaPelatihan');
                    } else if (tableContainer.id === 'jmlKoperasiProduksiTable') {
                        openAddDataPopup('koperasiProduksi');
                    } else if (tableContainer.id === 'jmlKoperasiAktifTable') {
                        openAddDataPopup('koperasiAktif');
                    } else if (tableContainer.id === 'aksesPasarOnlineTable') {
                        openAddDataPopup('aksesPasarOnline');
                    } else if (tableContainer.id === 'aksesKreditBankTable') {
                        openAddDataPopup('aksesKreditBank');
                    } else if (tableContainer.id === 'jmlKoperasiSehatTable') {
                        openAddDataPopup('koperasiSehat');
                    } else if (tableContainer.id === 'rekapOmzetTable') {
                        openAddDataPopup('rekapOmzet');
                    }
                }
            });
        });

        document.getElementById('addDataForm').addEventListener('submit', async function(event) {
            event.preventDefault();
        
            if (currentTable === 'kondisiPasar') {
                const kondisiValue = document.querySelector('input[name="kondisi"]:checked').value;
                
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
                        baik: kondisiValue === 'baik' ? 'X' : '',
                        tidakBaik: kondisiValue === 'tidakBaik' ? 'X' : '',
                        perluPenyempurnaan: kondisiValue === 'perluPenyempurnaan' ? 'X' : ''
                    }
                };
        
                try {
                    const refPath = ref(db, 'Bidang Pasar/dataKondisiPasar');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPasar();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            } else if (currentTable === 'losKios') {
                const newData = {
                    namaPasar: document.getElementById('namaPasar').value,
                    alamatLengkap: document.getElementById('alamatLengkap').value,
                    jumlahLosKios: {
                        los: parseInt(document.getElementById('jumlahLosKios_los').value),
                        kios: parseInt(document.getElementById('jumlahLosKios_kios').value)
                    },
                    jumlahPedagang: {
                        los: parseInt(document.getElementById('jumlahPedagang_los').value),
                        kios: parseInt(document.getElementById('jumlahPedagang_kios').value)
                    },
                    jumlahTidakTermanfaatkan: {
                        los: parseInt(document.getElementById('jumlahTidakTermanfaatkan_los').value),
                        kios: parseInt(document.getElementById('jumlahTidakTermanfaatkan_kios').value)
                    }
                };
        
                try {
                    const refPath = ref(db, 'Bidang Pasar/jumlahLosKiosPasar/dataPasar');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPasar();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            } else if (currentTable === 'profil') {
                const keteranganValue = document.querySelector('input[name="keterangan"]:checked').value;
                
                const newData = {
                    UPT: document.getElementById('UPT').value,
                    dataPasar: [{
                        namaPasar: document.getElementById('namaPasar').value,
                        jumlahPaguyubanPedagang: parseInt(document.getElementById('jumlahPaguyubanPedagang').value),
                        alamat: document.getElementById('alamat').value,
                        tahunBerdiri: document.getElementById('tahunBerdiri').value,
                        luas: {
                            tanah: parseInt(document.getElementById('luas_tanah').value),
                            bangunan: parseInt(document.getElementById('luas_bangunan').value),
                            lantai: parseInt(document.getElementById('luas_lantai').value)
                        },
                        jumlah: {
                            los: parseInt(document.getElementById('jumlah_los').value),
                            kios: parseInt(document.getElementById('jumlah_kios').value),
                            dasaran: parseInt(document.getElementById('jumlah_dasaran').value)
                        },
                        jumlahPedagang: {
                            los: parseInt(document.getElementById('pedagang_los').value),
                            kios: parseInt(document.getElementById('pedagang_kios').value),
                            dasaran: parseInt(document.getElementById('pedagang_dasaran').value)
                        },
                        fasilitasTersedia: {
                            arealParkir: document.getElementById('arealParkir').value,
                            TPS: document.getElementById('TPS').value,
                            MCK: document.getElementById('MCK').value,
                            tempatIbadah: document.getElementById('tempatIbadah').value,
                            bongkarMuat: document.getElementById('bongkarMuat').value
                        },
                        keterangan: keteranganValue
                    }]
                };
        
                try {
                    const refPath = ref(db, 'Bidang Pasar/matriksProfilPasar/dataUPT');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPasar();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            }
        });
        
        document.getElementById('addDataForm').addEventListener('submit', async function(event) {
            event.preventDefault();
        
            if (currentTable === 'pelakuUKM') {
                const newData = {
                    NAMA: document.getElementById('nama').value,
                    GENDER: document.getElementById('gender').value,
                    NIK: document.getElementById('nik').value,
                    NO_TELP: document.getElementById('noTelp').value,
                    ALAMAT_EMAIL: document.getElementById('email').value,
                    SEKTOR_USAHA: document.getElementById('sektorUsaha').value,
                    ALAMAT: document.getElementById('alamat').value,
                    'NOMOR_INDUK_BERUSAHA_(NIB)': document.getElementById('nib').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Data Pelaku UKM/Triwulan 3');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'ukmBerijin') {
                const newData = {
                    NAMA: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    NIK: document.getElementById('nik').value,
                    Alamat: document.getElementById('alamat').value,
                    'No Hp': document.getElementById('noHp').value,
                    'Nama Usaha': document.getElementById('namaUsaha').value,
                    'Jenis Usaha': document.getElementById('jenisUsaha').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/UKM Berijin/Triwulan 3');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'ukmAksesPerbankan') {
                const newData = {
                    NIK: document.getElementById('nik').value,
                    NAMA: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    Bank: document.getElementById('bank').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/UKM Akses Perbankan/Triwulan 3');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'wirausahaBermitraUKM') {
                const newData = {
                    NAMA: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    'No Hp': document.getElementById('noHp').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Masyarakat Wirausaha Bermitra UKM/Triwulan 3');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'aksesModalUsaha') {
                const newData = {
                    NAMA: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    'No Hp': document.getElementById('noHp').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Masyarakat Akses Modal Usaha/Triwulan 3');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'miskinPesertaPelatihan') {
                const newData = {
                    NAMA: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    'No Hp': document.getElementById('noHp').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Masyarakat Miskin Peserta Pelatihan/Triwulan 3');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'koperasiProduksi') {
                const newData = {
                    'Nama Koperasi': document.getElementById('namaKoperasi').value,
                    Alamat: document.getElementById('alamat').value,
                    Produk: document.getElementById('produk').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Jumlah Koperasi Produksi/Desember');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'koperasiAktif') {
                const newData = {
                    NIK: document.getElementById('nik').value,
                    'Nama Koperasi': document.getElementById('namaKoperasi').value,
                    'No Badan Hukum': document.getElementById('noBadanHukum').value,
                    Alamat: document.getElementById('alamat').value,
                    Desa: document.getElementById('desa').value,
                    Kelurahan: document.getElementById('kelurahan').value,
                    Kecamatan: document.getElementById('kecamatan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Jumlah Koperasi Seluruh Koperasi Aktif/Desember');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'aksesPasarOnline') {
                const newData = {
                    'Nama Koperasi': document.getElementById('namaKoperasi').value,
                    Alamat: document.getElementById('alamat').value,
                    'Media Pemasaran': document.getElementById('mediaPemasaran').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Koperasi Produksi Akses Pasar Online');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'aksesKreditBank') {
                const newData = {
                    'Nama Koperasi': document.getElementById('namaKoperasi').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bank Pemberi Fasilitas': document.getElementById('bankPemberiFasilitas').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Koperasi Akses Kredit Bank');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'koperasiSehat') {
                const newData = {
                    'Nama Koperasi': document.getElementById('namaKoperasi').value,
                    Alamat: document.getElementById('alamat').value,
                    Hasil: document.getElementById('hasil').value,
                    'Tahun Penilaian': document.getElementById('tahunPenilaian').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Jumlah Koperasi Sehat/Triwulan 3');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'rekapOmzet') {
                const newData = {
                    Kecamatan: document.getElementById('kecamatan').value,
                    Koperasi: {
                        'Jumlah Koperasi': parseInt(document.getElementById('jumlahKoperasi').value),
                        Aktif: parseInt(document.getElementById('koperasiAktif').value),
                        'Tidak Aktif': parseInt(document.getElementById('koperasiTidakAktif').value)
                    },
                    Anggota: {
                        'Jumlah Anggota': parseInt(document.getElementById('jumlahAnggota').value),
                        Aktif: parseInt(document.getElementById('anggotaAktif').value),
                        'Tidak Aktif': parseInt(document.getElementById('anggotaTidakAktif').value)
                    },
                    'RAT Unit': parseInt(document.getElementById('ratUnit').value),
                    Manajer: {
                        Jumlah: parseInt(document.getElementById('jumlahManajer').value),
                        Aktif: parseInt(document.getElementById('manajerAktif').value),
                        'Tidak Aktif': parseInt(document.getElementById('manajerTidakAktif').value)
                    },
                    Karyawan: {
                        Jumlah: parseInt(document.getElementById('jumlahKaryawan').value),
                        Aktif: parseInt(document.getElementById('karyawanAktif').value),
                        'Tidak Aktif': parseInt(document.getElementById('karyawanTidakAktif').value)
                    },
                    'Modal Sendiri': document.getElementById('modalSendiri').value,
                    'Modal Luar': document.getElementById('modalLuar').value,
                    'Volume Usaha': document.getElementById('volumeUsaha').value,
                    SHU: document.getElementById('shu').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Rekap Omzet Koperasi');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangKoperasi();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            }
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
                window.location.href = 'pages/dashboard.html';
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
            
            // Konversi data ke array jika diperlukan
            const kondisiPasarData = data.dataKondisiPasar ? 
                Array.isArray(data.dataKondisiPasar) ? 
                    data.dataKondisiPasar : 
                    Object.values(data.dataKondisiPasar) : 
                [];
                
            const losKiosData = data.jumlahLosKiosPasar?.dataPasar ? 
                Array.isArray(data.jumlahLosKiosPasar.dataPasar) ? 
                    data.jumlahLosKiosPasar.dataPasar : 
                    Object.values(data.jumlahLosKiosPasar.dataPasar) : 
                [];
                
            const profilData = data.matriksProfilPasar?.dataUPT ? 
                Array.isArray(data.matriksProfilPasar.dataUPT) ? 
                    data.matriksProfilPasar.dataUPT : 
                    Object.values(data.matriksProfilPasar.dataUPT) : 
                [];

            renderKondisiPasarTable(kondisiPasarData);
            renderLosKiosTable(losKiosData);
            renderProfilTable(profilData);
        }
    });

    // Untuk tabel profil
    const profilRef = ref(db, 'Bidang Pasar/matriksProfilPasar/dataUPT');
    get(profilRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            window.profilData = Object.values(data); // Simpan data ke variabel global
            renderProfilTable(window.profilData);
        }
    }).catch((error) => {
        console.error("Error loading profil data:", error);
    });
}

function renderKondisiPasarTable(data) {
    window.kondisiPasarData = data; // Menyimpan data untuk diakses fungsi edit
    const tbody = document.getElementById('kondisiPasarBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!Array.isArray(data)) {
        console.error('Data bukan array:', data);
        return;
    }

    let no = 1;
    data.forEach((item, index) => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item.namaPasar || ''}</td>
            <td>${item.fasilitas?.arealParkir || ''}</td>
            <td>${item.fasilitas?.TPS || ''}</td>
            <td>${item.fasilitas?.MCK || ''}</td>
            <td>${item.fasilitas?.tempatIbadah || ''}</td>
            <td>${item.fasilitas?.bongkarMuat || ''}</td>
            <td>${item.kondisi?.baik || ''}</td>
            <td>${item.kondisi?.tidakBaik || ''}</td>
            <td>${item.kondisi?.perluPenyempurnaan || ''}</td>
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

function renderLosKiosTable(data) {
    // Simpan data ke variabel global
    window.losKiosData = data;
    
    const tbody = document.getElementById('losKiosBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!Array.isArray(data)) {
        console.error('Data bukan array:', data);
        return;
    }

    let no = 1;
    data.forEach((item, index) => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item.namaPasar || ''}</td>
            <td>${item.alamatLengkap || ''}</td>
            <td>${item.jumlahLosKios?.los || 0}</td>
            <td>${item.jumlahLosKios?.kios || 0}</td>
            <td>${item.jumlahPedagang?.los || 0}</td>
            <td>${item.jumlahPedagang?.kios || 0}</td>
            <td>${item.jumlahTidakTermanfaatkan?.los || 0}</td>
            <td>${item.jumlahTidakTermanfaatkan?.kios || 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editLosKios('${index}')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteLosKios('${index}')">
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
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!Array.isArray(data)) {
        console.error('Data bukan array:', data);
        return;
    }

    let no = 1;
    data.forEach((upt, uptIndex) => {
        if (!upt || !Array.isArray(upt.dataPasar)) return;
        
        upt.dataPasar.forEach((item, pasarIndex) => {
            if (!item) return;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${no++}</td>
                <td>${upt.UPT || ''}</td>
                <td>${item.namaPasar || ''}</td>
                <td>${item.jumlahPaguyubanPedagang || 0}</td>
                <td>${item.alamat || ''}</td>
                <td>${item.tahunBerdiri || ''}</td>
                <td>${item.luas?.tanah || 0}</td>
                <td>${item.luas?.bangunan || 0}</td>
                <td>${item.luas?.lantai || 0}</td>
                <td>${item.jumlah?.los || 0}</td>
                <td>${item.jumlah?.kios || 0}</td>
                <td>${item.jumlah?.dasaran || 0}</td>
                <td>${item.jumlahPedagang?.los || 0}</td>
                <td>${item.jumlahPedagang?.kios || 0}</td>
                <td>${item.jumlahPedagang?.dasaran || 0}</td>
                <td>${item.fasilitasTersedia?.arealParkir || ''}</td>
                <td>${item.fasilitasTersedia?.TPS || ''}</td>
                <td>${item.fasilitasTersedia?.MCK || ''}</td>
                <td>${item.fasilitasTersedia?.tempatIbadah || ''}</td>
                <td>${item.fasilitasTersedia?.bongkarMuat || ''}</td>
                <td>${item.keterangan || ''}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editProfil('${uptIndex}', ${pasarIndex})">
                            <span class="material-icons-sharp">edit</span>
                        </button>
                        <button class="delete-btn" onclick="deleteProfil('${uptIndex}', ${pasarIndex})">
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
            <div class="form-group">
                <input type="text" id="namaPasar" placeholder="Nama Pasar" required>
            </div>
            
            <div class="form-group">
                <label>Fasilitas:</label>
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
            </div>

            <div class="form-group">
                <label>Kondisi:</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="kondisi" value="baik" required> Baik
                    </label>
                    <label>
                        <input type="radio" name="kondisi" value="tidakBaik"> Tidak Baik
                    </label>
                    <label>
                        <input type="radio" name="kondisi" value="perluPenyempurnaan"> Perlu Penyempurnaan
                    </label>
                </div>
            </div>

            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'losKios') {
        form.innerHTML = `
            <div class="form-group">
                <label for="namaPasar">Nama Pasar</label>
                <input type="text" id="namaPasar" placeholder="Masukkan nama pasar" required>
            </div>
            
            <div class="form-group">
                <label for="alamatLengkap">Alamat Lengkap</label>
                <input type="text" id="alamatLengkap" placeholder="Masukkan alamat lengkap" required>
            </div>
            
            <div class="form-section">
                <h3>Jumlah Los & Kios</h3>
                <div class="form-group">
                    <label for="jumlahLosKios_los">Jumlah Los</label>
                    <input type="number" id="jumlahLosKios_los" placeholder="Jumlah los" min="0" required>
                </div>
                <div class="form-group">
                    <label for="jumlahLosKios_kios">Jumlah Kios</label>
                    <input type="number" id="jumlahLosKios_kios" placeholder="Jumlah kios" min="0" required>
                </div>
            </div>
            
            <div class="form-section">
                <h3>Jumlah Pedagang</h3>
                <div class="form-group">
                    <label for="jumlahPedagang_los">Jumlah Pedagang Los</label>
                    <input type="number" id="jumlahPedagang_los" placeholder="Jumlah pedagang los" min="0" required>
                </div>
                <div class="form-group">
                    <label for="jumlahPedagang_kios">Jumlah Pedagang Kios</label>
                    <input type="number" id="jumlahPedagang_kios" placeholder="Jumlah pedagang kios" min="0" required>
                </div>
            </div>
            
            <div class="form-section">
                <h3>Jumlah Tidak Termanfaatkan</h3>
                <div class="form-group">
                    <label for="jumlahTidakTermanfaatkan_los">Los Tidak Termanfaatkan</label>
                    <input type="number" id="jumlahTidakTermanfaatkan_los" placeholder="Jumlah los tidak termanfaatkan" min="0" required>
                </div>
                <div class="form-group">
                    <label for="jumlahTidakTermanfaatkan_kios">Kios Tidak Termanfaatkan</label>
                    <input type="number" id="jumlahTidakTermanfaatkan_kios" placeholder="Jumlah kios tidak termanfaatkan" min="0" required>
                </div>
            </div>
    
            <button type="submit" class="submit-btn">Tambah Data</button>
        `;
    } else if (table === 'profil') {
        form.innerHTML = `
            <div class="form-group">
                <label for="UPT">UPT</label>
                <input type="text" id="UPT" placeholder="UPT" required>
            </div>

            <div class="form-group">
                <label for="namaPasar">Nama Pasar</label>
                <input type="text" id="namaPasar" placeholder="Nama Pasar" required>
            </div>

            <div class="form-group">
                <label for="jumlahPaguyubanPedagang">Jumlah Paguyuban Pedagang</label>
                <input type="number" id="jumlahPaguyubanPedagang" placeholder="Jumlah Paguyuban" required>
            </div>

            <div class="form-group">
                <label for="alamat">Alamat</label>
                <input type="text" id="alamat" placeholder="Alamat" required>
            </div>

            <div class="form-group">
                <label for="tahunBerdiri">Tahun Berdiri</label>
                <input type="number" id="tahunBerdiri" placeholder="Tahun Berdiri" required>
            </div>

            <div class="form-section">
                <h3>Luas</h3>
                <div class="form-group">
                    <label for="luas_tanah">Tanah (m²)</label>
                    <input type="number" id="luas_tanah" placeholder="Luas Tanah" required>
                </div>
                <div class="form-group">
                    <label for="luas_bangunan">Bangunan (m²)</label>
                    <input type="number" id="luas_bangunan" placeholder="Luas Bangunan" required>
                </div>
                <div class="form-group">
                    <label for="luas_lantai">Jumlah Lantai</label>
                    <input type="number" id="luas_lantai" placeholder="Jumlah Lantai" required>
                </div>
            </div>

            <div class="form-section">
                <h3>Jumlah</h3>
                <div class="form-group">
                    <label for="jumlah_los">Los</label>
                    <input type="number" id="jumlah_los" placeholder="Jumlah Los" required>
                </div>
                <div class="form-group">
                    <label for="jumlah_kios">Kios</label>
                    <input type="number" id="jumlah_kios" placeholder="Jumlah Kios" required>
                </div>
                <div class="form-group">
                    <label for="jumlah_dasaran">Dasaran</label>
                    <input type="number" id="jumlah_dasaran" placeholder="Jumlah Dasaran" required>
                </div>
            </div>

            <div class="form-section">
                <h3>Jumlah Pedagang</h3>
                <div class="form-group">
                    <label for="pedagang_los">Los</label>
                    <input type="number" id="pedagang_los" placeholder="Jumlah Pedagang Los" required>
                </div>
                <div class="form-group">
                    <label for="pedagang_kios">Kios</label>
                    <input type="number" id="pedagang_kios" placeholder="Jumlah Pedagang Kios" required>
                </div>
                <div class="form-group">
                    <label for="pedagang_dasaran">Dasaran</label>
                    <input type="number" id="pedagang_dasaran" placeholder="Jumlah Pedagang Dasaran" required>
                </div>
            </div>

            <div class="form-section">
                <h3>Fasilitas Tersedia</h3>
                <div class="form-group">
                    <label>Areal Parkir:</label>
                    <select id="arealParkir" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>TPS:</label>
                    <select id="TPS" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>MCK:</label>
                    <select id="MCK" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tempat Ibadah:</label>
                    <select id="tempatIbadah" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Bongkar Muat:</label>
                    <select id="bongkarMuat" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Keterangan:</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="keterangan" value="Baik" required> Baik
                    </label>
                    <label>
                        <input type="radio" name="keterangan" value="Perlu Rehab"> Perlu Rehab
                    </label>
                    <label>
                        <input type="radio" name="keterangan" value="Perlu Penyempurnaan"> Perlu Penyempurnaan
                    </label>
                </div>
            </div>

            <button type="submit" class="submit-btn">Tambah Data</button>
        `;
    } else if (table === 'pelakuUKM') {
        form.innerHTML = `
            <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" required>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="nik">NIK</label>
                <input type="text" id="nik" required>
            </div>
            <div class="form-group">
                <label for="noTelp">No. Telepon</label>
                <input type="text" id="noTelp" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="sektorUsaha">Sektor Usaha</label>
                <input type="text" id="sektorUsaha" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="nib">NIB</label>
                <input type="text" id="nib">
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'ukmBerijin') {
        form.innerHTML = `
            <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" required>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="nik">NIK</label>
                <input type="text" id="nik" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="noHp">No. HP</label>
                <input type="text" id="noHp" required>
            </div>
            <div class="form-group">
                <label for="namaUsaha">Nama Usaha</label>
                <input type="text" id="namaUsaha" required>
            </div>
            <div class="form-group">
                <label for="jenisUsaha">Jenis Usaha</label>
                <input type="text" id="jenisUsaha" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'ukmAksesPerbankan') {
        form.innerHTML = `
            <div class="form-group">
                <label for="nik">NIK</label>
                <input type="text" id="nik" required>
            </div>
            <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" required>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="bidangUsaha">Bidang Usaha</label>
                <input type="text" id="bidangUsaha" required>
            </div>
            <div class="form-group">
                <label for="bank">Bank</label>
                <input type="text" id="bank" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } // Lanjutan fungsi openAddDataPopup untuk form-form lainnya
    else if (table === 'wirausahaBermitraUKM') {
        form.innerHTML = `
            <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" required>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="bidangUsaha">Bidang Usaha</label>
                <input type="text" id="bidangUsaha" required>
            </div>
            <div class="form-group">
                <label for="noHp">No. HP</label>
                <input type="text" id="noHp" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'aksesModalUsaha') {
        form.innerHTML = `
            <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" required>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="bidangUsaha">Bidang Usaha</label>
                <input type="text" id="bidangUsaha" required>
            </div>
            <div class="form-group">
                <label for="noHp">No. HP</label>
                <input type="text" id="noHp" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'miskinPesertaPelatihan') {
        form.innerHTML = `
            <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" required>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="bidangUsaha">Bidang Usaha</label>
                <input type="text" id="bidangUsaha" required>
            </div>
            <div class="form-group">
                <label for="noHp">No. HP</label>
                <input type="text" id="noHp" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'koperasiProduksi') {
        form.innerHTML = `
            <div class="form-group">
                <label for="namaKoperasi">Nama Koperasi</label>
                <input type="text" id="namaKoperasi" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="jenisProduksi">Jenis Produksi</label>
                <input type="text" id="jenisProduksi" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'koperasiAktif') {
        form.innerHTML = `
            <div class="form-group">
                <label for="nik">NIK</label>
                <input type="text" id="nik" required>
            </div>
            <div class="form-group">
                <label for="namaKoperasi">Nama Koperasi</label>
                <input type="text" id="namaKoperasi" required>
            </div>
            <div class="form-group">
                <label for="noBadanHukum">No Badan Hukum</label>
                <input type="text" id="noBadanHukum" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="desa">Desa</label>
                <input type="text" id="desa" required>
            </div>
            <div class="form-group">
                <label for="kelurahan">Kelurahan</label>
                <input type="text" id="kelurahan" required>
            </div>
            <div class="form-group">
                <label for="kecamatan">Kecamatan</label>
                <input type="text" id="kecamatan" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'aksesPasarOnline') {
        form.innerHTML = `
            <div class="form-group">
                <label for="namaKoperasi">Nama Koperasi</label>
                <input type="text" id="namaKoperasi" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="mediaPemasaran">Media Pemasaran</label>
                <input type="text" id="mediaPemasaran" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'aksesKreditBank') {
        form.innerHTML = `
            <div class="form-group">
                <label for="namaKoperasi">Nama Koperasi</label>
                <input type="text" id="namaKoperasi" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="bankPemberiFasilitas">Bank Pemberi Fasilitas</label>
                <input type="text" id="bankPemberiFasilitas" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'koperasiSehat') {
        form.innerHTML = `
            <div class="form-group">
                <label for="namaKoperasi">Nama Koperasi</label>
                <input type="text" id="namaKoperasi" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="hasil">Hasil</label>
                <input type="text" id="hasil" required>
            </div>
            <div class="form-group">
                <label for="tahunPenilaian">Tahun Penilaian</label>
                <input type="number" id="tahunPenilaian" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'rekapOmzet') {
        form.innerHTML = `
            <div class="form-group">
                <label for="kecamatan">Kecamatan</label>
                <input type="text" id="kecamatan" required>
            </div>
            
            <div class="form-section">
                <h3>Data Koperasi</h3>
                <div class="form-group">
                    <label for="jumlahKoperasi">Jumlah Koperasi</label>
                    <input type="number" id="jumlahKoperasi" required>
                </div>
                <div class="form-group">
                    <label for="koperasiAktif">Aktif</label>
                    <input type="number" id="koperasiAktif" required>
                </div>
                <div class="form-group">
                    <label for="koperasiTidakAktif">Tidak Aktif</label>
                    <input type="number" id="koperasiTidakAktif" required>
                </div>
            </div>

            <div class="form-section">
                <h3>Data Anggota</h3>
                <div class="form-group">
                    <label for="jumlahAnggota">Jumlah Anggota</label>
                    <input type="number" id="jumlahAnggota" required>
                </div>
                <div class="form-group">
                    <label for="anggotaAktif">Aktif</label>
                    <input type="number" id="anggotaAktif" required>
                </div>
                <div class="form-group">
                    <label for="anggotaTidakAktif">Tidak Aktif</label>
                    <input type="number" id="anggotaTidakAktif" required>
                </div>
            </div>

            <div class="form-group">
                <label for="ratUnit">RAT Unit</label>
                <input type="number" id="ratUnit" required>
            </div>

            <div class="form-section">
                <h3>Data Manajer</h3>
                <div class="form-group">
                    <label for="jumlahManajer">Jumlah</label>
                    <input type="number" id="jumlahManajer" required>
                </div>
                <div class="form-group">
                    <label for="manajerAktif">Aktif</label>
                    <input type="number" id="manajerAktif" required>
                </div>
                <div class="form-group">
                    <label for="manajerTidakAktif">Tidak Aktif</label>
                    <input type="number" id="manajerTidakAktif" required>
                </div>
            </div>

            <div class="form-section">
                <h3>Data Karyawan</h3>
                <div class="form-group">
                    <label for="jumlahKaryawan">Jumlah</label>
                    <input type="number" id="jumlahKaryawan" required>
                </div>
                <div class="form-group">
                    <label for="karyawanAktif">Aktif</label>
                    <input type="number" id="karyawanAktif" required>
                </div>
                <div class="form-group">
                    <label for="karyawanTidakAktif">Tidak Aktif</label>
                    <input type="number" id="karyawanTidakAktif" required>
                </div>
            </div>
    
            <div class="form-section">
                <h3>Data Keuangan</h3>
                <div class="form-group">
                    <label for="modalSendiri">Modal Sendiri</label>
                    <input type="text" id="modalSendiri" required>
                </div>
                <div class="form-group">
                    <label for="modalLuar">Modal Luar</label>
                    <input type="text" id="modalLuar" required>
                </div>
                <div class="form-group">
                    <label for="volumeUsaha">Volume Usaha</label>
                    <input type="text" id="volumeUsaha" required>
                </div>
                <div class="form-group">
                    <label for="shu">SHU</label>
                    <input type="text" id="shu" required>
                </div>
            </div>

            <button type="submit">Tambah Data</button>
        `;
    }

    document.getElementById('addDataPopup').style.display = 'block';
}

function closeAddDataPopup() {
    document.getElementById('addDataPopup').style.display = 'none';
}

window.editKondisiPasar = function(index) {
    const editPopup = document.getElementById('editDataPopup');
    const form = document.getElementById('editDataForm');
    const data = window.kondisiPasarData[index];

                form.innerHTML = `
                    <div class="form-group">
            <input type="text" id="edit_namaPasar" placeholder="Nama Pasar" value="${data.namaPasar || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Fasilitas:</label>
                        <select id="edit_arealParkir" required>
                <option value="">Pilih Areal Parkir</option>
                <option value="ADA" ${data.fasilitas?.arealParkir === 'ADA' ? 'selected' : ''}>ADA</option>
                <option value="TIDAK ADA" ${data.fasilitas?.arealParkir === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_TPS" required>
                <option value="">Pilih TPS</option>
                <option value="ADA" ${data.fasilitas?.TPS === 'ADA' ? 'selected' : ''}>ADA</option>
                <option value="TIDAK ADA" ${data.fasilitas?.TPS === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_MCK" required>
                <option value="">Pilih MCK</option>
                <option value="ADA" ${data.fasilitas?.MCK === 'ADA' ? 'selected' : ''}>ADA</option>
                <option value="TIDAK ADA" ${data.fasilitas?.MCK === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_tempatIbadah" required>
                <option value="">Pilih Tempat Ibadah</option>
                <option value="ADA" ${data.fasilitas?.tempatIbadah === 'ADA' ? 'selected' : ''}>ADA</option>
                <option value="TIDAK ADA" ${data.fasilitas?.tempatIbadah === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_bongkarMuat" required>
                <option value="">Pilih Bongkar Muat</option>
                <option value="ADA" ${data.fasilitas?.bongkarMuat === 'ADA' ? 'selected' : ''}>ADA</option>
                <option value="TIDAK ADA" ${data.fasilitas?.bongkarMuat === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Kondisi:</label>
                        <div class="radio-group">
                            <label>
                    <input type="radio" name="edit_kondisi" value="baik" ${data.kondisi?.baik ? 'checked' : ''} required> Baik
                            </label>
                            <label>
                    <input type="radio" name="edit_kondisi" value="tidakBaik" ${data.kondisi?.tidakBaik ? 'checked' : ''}> Tidak Baik
                            </label>
                            <label>
                    <input type="radio" name="edit_kondisi" value="perluPenyempurnaan" ${data.kondisi?.perluPenyempurnaan ? 'checked' : ''}> Perlu Penyempurnaan
                            </label>
                        </div>
                    </div>

                    <button type="submit">Simpan Perubahan</button>
                `;

    editPopup.style.display = 'block';

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const updatedData = {
            namaPasar: document.getElementById('edit_namaPasar').value,
            fasilitas: {
                arealParkir: document.getElementById('edit_arealParkir').value,
                TPS: document.getElementById('edit_TPS').value,
                MCK: document.getElementById('edit_MCK').value,
                tempatIbadah: document.getElementById('edit_tempatIbadah').value,
                bongkarMuat: document.getElementById('edit_bongkarMuat').value
            },
            kondisi: {
                baik: document.querySelector('input[name="edit_kondisi"][value="baik"]').checked ? 'X' : '',
                tidakBaik: document.querySelector('input[name="edit_kondisi"][value="tidakBaik"]').checked ? 'X' : '',
                perluPenyempurnaan: document.querySelector('input[name="edit_kondisi"][value="perluPenyempurnaan"]').checked ? 'X' : ''
            }
        };

        try {
            const kondisiPasarRef = ref(db, 'Bidang Pasar/dataKondisiPasar/' + index);
            await update(kondisiPasarRef, updatedData);
            
            editPopup.style.display = 'none';
            loadBidangPasar();
            alert('Data berhasil diperbarui!');
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Terjadi kesalahan saat memperbarui data');
        }
    };
};

window.deleteKondisiPasar = async function(index) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            // Dapatkan referensi ke dataKondisiPasar
            const kondisiPasarRef = ref(db, 'Bidang Pasar/dataKondisiPasar');
            
            // Ambil snapshot data saat ini
            const snapshot = await get(kondisiPasarRef);
            
            if (snapshot.exists()) {
                // Konversi data ke array
                const currentData = Object.entries(snapshot.val());
                
                // Dapatkan key dari data yang akan dihapus
                const [key, _] = currentData[index];
                
                // Hapus data berdasarkan key
                const deleteRef = ref(db, `Bidang Pasar/dataKondisiPasar/${key}`);
                await remove(deleteRef);
                
                alert('Data berhasil dihapus!');
                loadBidangPasar();
            } else {
                throw new Error('Data tidak ditemukan');
            }
        } catch (error) {
            console.error('Error menghapus data:', error);
            alert('Terjadi kesalahan saat menghapus data: ' + error.message);
        }
    }
};

document.querySelectorAll('.close-popup').forEach(button => {
    button.onclick = function() {
        this.closest('.add-data-popup, .edit-data-popup').style.display = 'none';
    };
});

// Menyimpan data kondisi pasar secara global untuk diakses fungsi edit
window.kondisiPasarData = [];

// Fungsi edit untuk los kios
window.editLosKios = function(index) {
    const editPopup = document.getElementById('editDataPopup');
    const form = document.getElementById('editDataForm');
    const data = window.losKiosData[parseInt(index)]; // Konversi index ke number

    if (!data) {
        console.error('Data tidak ditemukan untuk index:', index);
        alert('Terjadi kesalahan saat memuat data');
        return;
    }

                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_namaPasar">Nama Pasar</label>
            <input type="text" id="edit_namaPasar" placeholder="Masukkan nama pasar" value="${data.namaPasar || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit_alamatLengkap">Alamat Lengkap</label>
            <input type="text" id="edit_alamatLengkap" placeholder="Masukkan alamat lengkap" value="${data.alamatLengkap || ''}" required>
                    </div>
                    
                    <div class="form-section">
                        <h3>Jumlah Los & Kios</h3>
                        <div class="form-group">
                            <label for="edit_jumlahLosKios_los">Jumlah Los</label>
                <input type="number" id="edit_jumlahLosKios_los" placeholder="Jumlah los" min="0" value="${data.jumlahLosKios?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_jumlahLosKios_kios">Jumlah Kios</label>
                <input type="number" id="edit_jumlahLosKios_kios" placeholder="Jumlah kios" min="0" value="${data.jumlahLosKios?.kios || 0}" required>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Jumlah Pedagang</h3>
                        <div class="form-group">
                            <label for="edit_jumlahPedagang_los">Jumlah Pedagang Los</label>
                <input type="number" id="edit_jumlahPedagang_los" placeholder="Jumlah pedagang los" min="0" value="${data.jumlahPedagang?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_jumlahPedagang_kios">Jumlah Pedagang Kios</label>
                <input type="number" id="edit_jumlahPedagang_kios" placeholder="Jumlah pedagang kios" min="0" value="${data.jumlahPedagang?.kios || 0}" required>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Jumlah Tidak Termanfaatkan</h3>
                        <div class="form-group">
                            <label for="edit_jumlahTidakTermanfaatkan_los">Los Tidak Termanfaatkan</label>
                <input type="number" id="edit_jumlahTidakTermanfaatkan_los" placeholder="Jumlah los tidak termanfaatkan" min="0" value="${data.jumlahTidakTermanfaatkan?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_jumlahTidakTermanfaatkan_kios">Kios Tidak Termanfaatkan</label>
                <input type="number" id="edit_jumlahTidakTermanfaatkan_kios" placeholder="Jumlah kios tidak termanfaatkan" min="0" value="${data.jumlahTidakTermanfaatkan?.kios || 0}" required>
                        </div>
                    </div>
            
        <button type="submit">Simpan Perubahan</button>
    `;

    editPopup.style.display = 'block';

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const updatedData = {
            namaPasar: document.getElementById('edit_namaPasar').value,
            alamatLengkap: document.getElementById('edit_alamatLengkap').value,
            jumlahLosKios: {
                los: parseInt(document.getElementById('edit_jumlahLosKios_los').value),
                kios: parseInt(document.getElementById('edit_jumlahLosKios_kios').value)
            },
            jumlahPedagang: {
                los: parseInt(document.getElementById('edit_jumlahPedagang_los').value),
                kios: parseInt(document.getElementById('edit_jumlahPedagang_kios').value)
            },
            jumlahTidakTermanfaatkan: {
                los: parseInt(document.getElementById('edit_jumlahTidakTermanfaatkan_los').value),
                kios: parseInt(document.getElementById('edit_jumlahTidakTermanfaatkan_kios').value)
            }
        };

        try {
            const losKiosRef = ref(db, 'Bidang Pasar/jumlahLosKiosPasar/dataPasar/' + index);
            await update(losKiosRef, updatedData);
            
            editPopup.style.display = 'none';
            loadBidangPasar();
            alert('Data berhasil diperbarui!');
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Terjadi kesalahan saat memperbarui data');
        }
    };
};

window.deleteLosKios = async function(index) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            // Dapatkan referensi ke dataPasar
            const losKiosRef = ref(db, 'Bidang Pasar/jumlahLosKiosPasar/dataPasar');
            
            // Ambil snapshot data saat ini
            const snapshot = await get(losKiosRef);
            
            if (snapshot.exists()) {
                // Konversi data ke array
                const currentData = Object.entries(snapshot.val());
                
                // Dapatkan key dari data yang akan dihapus
                const [key, _] = currentData[index];
                
                // Hapus data berdasarkan key
                const deleteRef = ref(db, `Bidang Pasar/jumlahLosKiosPasar/dataPasar/${key}`);
                await remove(deleteRef);
                
                alert('Data berhasil dihapus!');
                loadBidangPasar();
            } else {
                throw new Error('Data tidak ditemukan');
            }
        } catch (error) {
            console.error('Error menghapus data:', error);
            alert('Terjadi kesalahan saat menghapus data: ' + error.message);
        }
    }
};

window.editProfil = function(uptIndex, pasarIndex) {
    const editPopup = document.getElementById('editDataPopup');
    const form = document.getElementById('editDataForm');
    const data = window.profilData[uptIndex];

    if (!data || !data.dataPasar || !data.dataPasar[pasarIndex]) {
        console.error('Data tidak ditemukan untuk UPT index:', uptIndex, 'dan Pasar index:', pasarIndex);
        alert('Terjadi kesalahan saat memuat data');
        return;
    }

    const pasarData = data.dataPasar[pasarIndex];
    
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_UPT">UPT</label>
            <input type="text" id="edit_UPT" placeholder="Masukkan UPT" value="${data.UPT || ''}" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_namaPasar">Nama Pasar</label>
            <input type="text" id="edit_namaPasar" placeholder="Masukkan nama pasar" value="${pasarData.namaPasar || ''}" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_jumlahPaguyubanPedagang">Jumlah Paguyuban Pedagang</label>
            <input type="number" id="edit_jumlahPaguyubanPedagang" placeholder="Masukkan jumlah paguyuban" value="${pasarData.jumlahPaguyubanPedagang || 0}" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
            <input type="text" id="edit_alamat" placeholder="Masukkan alamat" value="${pasarData.alamat || ''}" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_tahunBerdiri">Tahun Berdiri</label>
            <input type="text" id="edit_tahunBerdiri" placeholder="Masukkan tahun berdiri" value="${pasarData.tahunBerdiri || ''}" required>
                    </div>

                    <div class="form-section">
                        <h3>Luas</h3>
                        <div class="form-group">
                <label for="edit_luas_tanah">Luas Tanah</label>
                <input type="number" id="edit_luas_tanah" placeholder="Luas tanah" value="${pasarData.luas?.tanah || 0}" required>
                        </div>
                        <div class="form-group">
                <label for="edit_luas_bangunan">Luas Bangunan</label>
                <input type="number" id="edit_luas_bangunan" placeholder="Luas bangunan" value="${pasarData.luas?.bangunan || 0}" required>
                        </div>
                        <div class="form-group">
                <label for="edit_luas_lantai">Luas Lantai</label>
                <input type="number" id="edit_luas_lantai" placeholder="Luas lantai" value="${pasarData.luas?.lantai || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Jumlah</h3>
                        <div class="form-group">
                <label for="edit_jumlah_los">Jumlah Los</label>
                <input type="number" id="edit_jumlah_los" placeholder="Jumlah los" value="${pasarData.jumlah?.los || 0}" required>
                        </div>
                        <div class="form-group">
                <label for="edit_jumlah_kios">Jumlah Kios</label>
                <input type="number" id="edit_jumlah_kios" placeholder="Jumlah kios" value="${pasarData.jumlah?.kios || 0}" required>
                        </div>
                        <div class="form-group">
                <label for="edit_jumlah_dasaran">Jumlah Dasaran</label>
                <input type="number" id="edit_jumlah_dasaran" placeholder="Jumlah dasaran" value="${pasarData.jumlah?.dasaran || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Jumlah Pedagang</h3>
                        <div class="form-group">
                <label for="edit_pedagang_los">Jumlah Pedagang Los</label>
                <input type="number" id="edit_pedagang_los" placeholder="Jumlah pedagang los" value="${pasarData.jumlahPedagang?.los || 0}" required>
                        </div>
                        <div class="form-group">
                <label for="edit_pedagang_kios">Jumlah Pedagang Kios</label>
                <input type="number" id="edit_pedagang_kios" placeholder="Jumlah pedagang kios" value="${pasarData.jumlahPedagang?.kios || 0}" required>
                        </div>
                        <div class="form-group">
                <label for="edit_pedagang_dasaran">Jumlah Pedagang Dasaran</label>
                <input type="number" id="edit_pedagang_dasaran" placeholder="Jumlah pedagang dasaran" value="${pasarData.jumlahPedagang?.dasaran || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Fasilitas Tersedia</h3>
                        <div class="form-group">
                            <label>Areal Parkir:</label>
                            <select id="edit_arealParkir" required>
                    <option value="ADA" ${pasarData.fasilitasTersedia?.arealParkir === 'ADA' ? 'selected' : ''}>ADA</option>
                    <option value="TIDAK ADA" ${pasarData.fasilitasTersedia?.arealParkir === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>TPS:</label>
                            <select id="edit_TPS" required>
                    <option value="ADA" ${pasarData.fasilitasTersedia?.TPS === 'ADA' ? 'selected' : ''}>ADA</option>
                    <option value="TIDAK ADA" ${pasarData.fasilitasTersedia?.TPS === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>MCK:</label>
                            <select id="edit_MCK" required>
                    <option value="ADA" ${pasarData.fasilitasTersedia?.MCK === 'ADA' ? 'selected' : ''}>ADA</option>
                    <option value="TIDAK ADA" ${pasarData.fasilitasTersedia?.MCK === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Tempat Ibadah:</label>
                            <select id="edit_tempatIbadah" required>
                    <option value="ADA" ${pasarData.fasilitasTersedia?.tempatIbadah === 'ADA' ? 'selected' : ''}>ADA</option>
                    <option value="TIDAK ADA" ${pasarData.fasilitasTersedia?.tempatIbadah === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Bongkar Muat:</label>
                            <select id="edit_bongkarMuat" required>
                    <option value="ADA" ${pasarData.fasilitasTersedia?.bongkarMuat === 'ADA' ? 'selected' : ''}>ADA</option>
                    <option value="TIDAK ADA" ${pasarData.fasilitasTersedia?.bongkarMuat === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Keterangan:</label>
                        <div class="radio-group">
                            <label>
                    <input type="radio" name="edit_keterangan" value="Baik" ${pasarData.keterangan === 'Baik' ? 'checked' : ''} required> Baik
                            </label>
                            <label>
                    <input type="radio" name="edit_keterangan" value="Perlu Rehab" ${pasarData.keterangan === 'Perlu Rehab' ? 'checked' : ''}> Perlu Rehab
                            </label>
                            <label>
                    <input type="radio" name="edit_keterangan" value="Perlu Penyempurnaan" ${pasarData.keterangan === 'Perlu Penyempurnaan' ? 'checked' : ''}> Perlu Penyempurnaan
                            </label>
                        </div>
                    </div>

        <button type="submit">Simpan Perubahan</button>
    `;

    editPopup.style.display = 'block';

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const updatedData = {
            UPT: document.getElementById('edit_UPT').value,
            dataPasar: [{
                namaPasar: document.getElementById('edit_namaPasar').value,
                jumlahPaguyubanPedagang: parseInt(document.getElementById('edit_jumlahPaguyubanPedagang').value),
                alamat: document.getElementById('edit_alamat').value,
                tahunBerdiri: document.getElementById('edit_tahunBerdiri').value,
                luas: {
                    tanah: parseInt(document.getElementById('edit_luas_tanah').value),
                    bangunan: parseInt(document.getElementById('edit_luas_bangunan').value),
                    lantai: parseInt(document.getElementById('edit_luas_lantai').value)
                },
                jumlah: {
                    los: parseInt(document.getElementById('edit_jumlah_los').value),
                    kios: parseInt(document.getElementById('edit_jumlah_kios').value),
                    dasaran: parseInt(document.getElementById('edit_jumlah_dasaran').value)
                },
                jumlahPedagang: {
                    los: parseInt(document.getElementById('edit_pedagang_los').value),
                    kios: parseInt(document.getElementById('edit_pedagang_kios').value),
                    dasaran: parseInt(document.getElementById('edit_pedagang_dasaran').value)
                },
                fasilitasTersedia: {
                    arealParkir: document.getElementById('edit_arealParkir').value,
                    TPS: document.getElementById('edit_TPS').value,
                    MCK: document.getElementById('edit_MCK').value,
                    tempatIbadah: document.getElementById('edit_tempatIbadah').value,
                    bongkarMuat: document.getElementById('edit_bongkarMuat').value
                },
                keterangan: document.querySelector('input[name="edit_keterangan"]:checked').value
            }]
        };

        try {
            const profilRef = ref(db, `Bidang Pasar/matriksProfilPasar/dataUPT/${uptIndex}/dataPasar/${pasarIndex}`);
            await update(profilRef, updatedData);
            
            editPopup.style.display = 'none';
            loadBidangPasar();
            alert('Data berhasil diperbarui!');
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Terjadi kesalahan saat memperbarui data');
        }
    };
};

window.deleteProfil = async function(uptIndex, pasarIndex) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            const profilRef = ref(db, `Bidang Pasar/matriksProfilPasar/dataUPT/${uptIndex}/dataPasar/${pasarIndex}`);
            await remove(profilRef);
            
            // Cek jika ini adalah data pasar terakhir di UPT tersebut
            const uptRef = ref(db, `Bidang Pasar/matriksProfilPasar/dataUPT/${uptIndex}`);
            const snapshot = await get(uptRef);
            
            if (snapshot.exists()) {
                const uptData = snapshot.val();
                if (!uptData.dataPasar || uptData.dataPasar.length === 0) {
                    // Jika tidak ada data pasar lagi, hapus UPT
                    await remove(uptRef);
                }
            }
            
            alert('Data berhasil dihapus!');
            loadBidangPasar();
        } catch (error) {
            console.error('Error menghapus data:', error);
            alert('Terjadi kesalahan saat menghapus data: ' + error.message);
        }
    }
};

function loadBidangKoperasi() {
    const koperasiRef = ref(db, 'Bidang Koperasi');
    
    onValue(koperasiRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            renderPelakuUKMTable(data['Data Pelaku UKM']?.['Triwulan 3'] || {});
            renderUKMBerijinTable(data['UKM Berijin']?.['Triwulan 3'] || {});
            renderUKMAksesPerbankanTable(data['UKM Akses Perbankan']?.['Triwulan 3'] || {});
            renderWirausahaBermitraUKMTable(data['Masyarakat Wirausaha Bermitra UKM']?.['Triwulan 3'] || {});
            renderAksesModalUsahaTable(data['Masyarakat Akses Modal Usaha']?.['Triwulan 3'] || {});
            renderMiskinPesertaPelatihanTable(data['Masyarakat Miskin Peserta Pelatihan']?.['Triwulan 3'] || {});
            renderKoperasiProduksiTable(data['Jumlah Koperasi Produksi']?.['Desember'] || {});
            renderKoperasiAktifTable(data['Jumlah Koperasi Seluruh Koperasi Aktif'] || {});
            renderAksesPasarOnlineTable(data['Koperasi Produksi Akses Pasar Online'] || {});
            renderAksesKreditBankTable(data['Koperasi Akses Kredit Bank'] || {});
            renderKoperasiSehatTable(data['Jumlah Koperasi Sehat']?.['Triwulan 3'] || {});
            renderRekapOmzetTable(data['Rekap Omzet Koperasi'] || {});
        }
    });
}

// Fungsi untuk render tabel Pelaku UKM
function renderPelakuUKMTable(data) {
    const tbody = document.getElementById('pelakuUKMBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.NAMA || '-'}</td>
            <td>${value.GENDER || '-'}</td>
            <td>${value.NIK || '-'}</td>
            <td>${value.NO_TELP || '-'}</td>
            <td>${value.ALAMAT_EMAIL || '-'}</td>
            <td>${value.SEKTOR_USAHA || '-'}</td>
            <td>${value.ALAMAT || '-'}</td>
            <td>${value['NOMOR_INDUK_BERUSAHA_(NIB)'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'pelakuUKM')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'pelakuUKM')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
            
        `;
        tbody.appendChild(row);
    });
}

function renderUKMBerijinTable(data) {
    const tbody = document.getElementById('ukmBerijinBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.NAMA || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.NIK || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['No Hp'] || '-'}</td>
            <td>${value['Nama Usaha'] || '-'}</td>
            <td>${value['Jenis Usaha'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'ukmBerijin')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'ukmBerijin')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderUKMAksesPerbankanTable(data) {
    const tbody = document.getElementById('ukmAksesPerbankanBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.NIK || '-'}</td>
            <td>${value.NAMA || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value.Bank || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'ukmAksesPerbankan')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'ukmAksesPerbankan')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Wirausaha Bermitra UKM
function renderWirausahaBermitraUKMTable(data) {
    const tbody = document.getElementById('wirausahaBermitraUKMBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.NAMA || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value['No Hp'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'wirausahaBermitraUKM')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'wirausahaBermitraUKM')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Akses Modal Usaha
function renderAksesModalUsahaTable(data) {
    const tbody = document.getElementById('aksesModalUsahaBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.NAMA || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value['No Hp'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'aksesModalUsaha')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'aksesModalUsaha')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Miskin Peserta Pelatihan
function renderMiskinPesertaPelatihanTable(data) {
    const tbody = document.getElementById('miskinPesertaPelatihanBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.NAMA || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value['No Hp'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'miskinPesertaPelatihan')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'miskinPesertaPelatihan')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderKoperasiProduksiTable(data) {
    const tbody = document.getElementById('jmlKoperasiProduksiBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value['Nama Koperasi'] || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Jenis Produksi'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'koperasiProduksi')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'koperasiProduksi')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Koperasi Aktif
function renderKoperasiAktifTable(data) {
    const tbody = document.getElementById('jmlKoperasiAktifBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.NIK || '-'}</td>
            <td>${value['Nama Koperasi'] || '-'}</td>
            <td>${value['No Badan Hukum'] || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value.Desa || '-'}</td>
            <td>${value.Kelurahan || '-'}</td>
            <td>${value.Kecamatan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'koperasiAktif')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'koperasiAktif')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Akses Pasar Online
function renderAksesPasarOnlineTable(data) {
    const tbody = document.getElementById('aksesPasarOnlineBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value['Nama Koperasi'] || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Media Pemasaran'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'aksesPasarOnline')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'aksesPasarOnline')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Akses Kredit Bank
function renderAksesKreditBankTable(data) {
    const tbody = document.getElementById('aksesKreditBankBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value['Nama Koperasi'] || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bank Pemberi Fasilitas'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'aksesKreditBank')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'aksesKreditBank')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Koperasi Sehat
function renderKoperasiSehatTable(data) {
    const tbody = document.getElementById('jmlKoperasiSehatBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value['Nama Koperasi'] || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value.Hasil || '-'}</td>
            <td>${value['Tahun Penilaian'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'koperasiSehat')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'koperasiSehat')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Rekap Omzet
function renderRekapOmzetTable(data) {
    const tbody = document.getElementById('rekapOmzetBody');
    tbody.innerHTML = '';
    let no = 1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.Kecamatan || '-'}</td>
            <td>${value.Koperasi?.['Jumlah Koperasi'] || '-'}</td>
            <td>${value.Koperasi?.Aktif || '-'}</td>
            <td>${value.Koperasi?.['Tidak Aktif'] || '-'}</td>
            <td>${value.Anggota?.['Jumlah Anggota'] || '-'}</td>
            <td>${value.Anggota?.Aktif || '-'}</td>
            <td>${value.Anggota?.['Tidak Aktif'] || '-'}</td>
            <td>${value['RAT Unit'] || '-'}</td>
            <td>${value.Manajer?.Jumlah || '-'}</td>
            <td>${value.Manajer?.Aktif || '-'}</td>
            <td>${value.Manajer?.['Tidak Aktif'] || '-'}</td>
            <td>${value.Karyawan?.Jumlah || '-'}</td>
            <td>${value.Karyawan?.Aktif || '-'}</td>
            <td>${value.Karyawan?.['Tidak Aktif'] || '-'}</td>
            <td>${value['Modal Sendiri'] || '-'}</td>
            <td>${value['Modal Luar'] || '-'}</td>
            <td>${value['Volume Usaha'] || '-'}</td>
            <td>${value.SHU || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editData('${key}', 'rekapOmzet')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteData('${key}', 'rekapOmzet')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi Edit Data Koperasi
window.editData = function(key, table) {
    const editPopup = document.getElementById('editDataPopup');
    const form = document.getElementById('editDataForm');
    
    const dataRef = ref(db, `Bidang Koperasi/${getPathByTable(table)}/${key}`);
    get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            currentTable = table;
            if (table === 'pelakuUKM') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.NAMA || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_gender">Gender</label>
                        <select id="edit_gender" required>
                            <option value="L" ${data.GENDER === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${data.GENDER === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_nik">NIK</label>
                        <input type="text" id="edit_nik" value="${data.NIK || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_noTelp">No. Telepon</label>
                        <input type="text" id="edit_noTelp" value="${data.NO_TELP || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_email">Email</label>
                        <input type="email" id="edit_email" value="${data.ALAMAT_EMAIL || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_sektorUsaha">Sektor Usaha</label>
                        <input type="text" id="edit_sektorUsaha" value="${data.SEKTOR_USAHA || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.ALAMAT || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_nib">NIB</label>
                        <input type="text" id="edit_nib" value="${data['NOMOR_INDUK_BERUSAHA_(NIB)'] || ''}">
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'ukmBerijin') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.NAMA || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_gender">Gender</label>
                        <select id="edit_gender" required>
                            <option value="L" ${data.Gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${data.Gender === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_nik">NIK</label>
                        <input type="text" id="edit_nik" value="${data.NIK || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_noHp">No. HP</label>
                        <input type="text" id="edit_noHp" value="${data['No Hp'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_namaUsaha">Nama Usaha</label>
                        <input type="text" id="edit_namaUsaha" value="${data['Nama Usaha'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_jenisUsaha">Jenis Usaha</label>
                        <input type="text" id="edit_jenisUsaha" value="${data['Jenis Usaha'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'ukmAksesPerbankan') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nik">NIK</label>
                        <input type="text" id="edit_nik" value="${data.NIK || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.NAMA || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_gender">Gender</label>
                        <select id="edit_gender" required>
                            <option value="L" ${data.Gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${data.Gender === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_bidangUsaha">Bidang Usaha</label>
                        <input type="text" id="edit_bidangUsaha" value="${data['Bidang Usaha'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_bank">Bank</label>
                        <input type="text" id="edit_bank" value="${data.Bank || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'wirausahaBermitraUKM') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.NAMA || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_gender">Gender</label>
                        <select id="edit_gender" required>
                            <option value="L" ${data.Gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${data.Gender === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_bidangUsaha">Bidang Usaha</label>
                        <input type="text" id="edit_bidangUsaha" value="${data['Bidang Usaha'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_noHp">No. HP</label>
                        <input type="text" id="edit_noHp" value="${data['No Hp'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'aksesModalUsaha') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.NAMA || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_gender">Gender</label>
                        <select id="edit_gender" required>
                            <option value="L" ${data.Gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${data.Gender === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_bidangUsaha">Bidang Usaha</label>
                        <input type="text" id="edit_bidangUsaha" value="${data['Bidang Usaha'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_noHp">No. HP</label>
                        <input type="text" id="edit_noHp" value="${data['No Hp'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'koperasiProduksi') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_namaKoperasi">Nama Koperasi</label>
                        <input type="text" id="edit_namaKoperasi" value="${data['Nama Koperasi'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_jenisProduksi">Jenis Produksi</label>
                        <input type="text" id="edit_jenisProduksi" value="${data['Jenis Produksi'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'miskinPesertaPelatihan') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.NAMA || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_gender">Gender</label>
                        <select id="edit_gender" required>
                            <option value="L" ${data.Gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${data.Gender === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_nik">NIK</label>
                        <input type="text" id="edit_nik" value="${data.NIK || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_noHp">No. HP</label>
                        <input type="text" id="edit_noHp" value="${data['No Hp'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_jenisPelatihan">Jenis Pelatihan</label>
                        <input type="text" id="edit_jenisPelatihan" value="${data['Jenis Pelatihan'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_tahunPelatihan">Tahun Pelatihan</label>
                        <input type="text" id="edit_tahunPelatihan" value="${data['Tahun Pelatihan'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'koperasiAktif') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nik">NIK</label>
                        <input type="text" id="edit_nik" value="${data.NIK || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_namaKoperasi">Nama Koperasi</label>
                        <input type="text" id="edit_namaKoperasi" value="${data['Nama Koperasi'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_noBadanHukum">No Badan Hukum</label>
                        <input type="text" id="edit_noBadanHukum" value="${data['No Badan Hukum'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_desa">Desa</label>
                        <input type="text" id="edit_desa" value="${data.Desa || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_kelurahan">Kelurahan</label>
                        <input type="text" id="edit_kelurahan" value="${data.Kelurahan || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_kecamatan">Kecamatan</label>
                        <input type="text" id="edit_kecamatan" value="${data.Kecamatan || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'aksesPasarOnline') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_namaKoperasi">Nama Koperasi</label>
                        <input type="text" id="edit_namaKoperasi" value="${data['Nama Koperasi'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_mediaPemasaran">Media Pemasaran</label>
                        <input type="text" id="edit_mediaPemasaran" value="${data['Media Pemasaran'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'aksesKreditBank') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_namaKoperasi">Nama Koperasi</label>
                        <input type="text" id="edit_namaKoperasi" value="${data['Nama Koperasi'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_bankPemberiFasilitas">Bank Pemberi Fasilitas</label>
                        <input type="text" id="edit_bankPemberiFasilitas" value="${data['Bank Pemberi Fasilitas'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'koperasiSehat') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_namaKoperasi">Nama Koperasi</label>
                        <input type="text" id="edit_namaKoperasi" value="${data['Nama Koperasi'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.Alamat || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_hasil">Hasil</label>
                        <input type="text" id="edit_hasil" value="${data.Hasil || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_tahunPenilaian">Tahun Penilaian</label>
                        <input type="number" id="edit_tahunPenilaian" value="${data['Tahun Penilaian'] || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'rekapOmzet') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_kecamatan">Kecamatan</label>
                        <input type="text" id="edit_kecamatan" value="${data.Kecamatan || ''}" required>
                    </div>
                    
                    <div class="form-section">
                        <h3>Data Koperasi</h3>
                        <div class="form-group">
                            <label for="edit_jumlahKoperasi">Jumlah Koperasi</label>
                            <input type="number" id="edit_jumlahKoperasi" value="${data.Koperasi?.['Jumlah Koperasi'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_koperasiAktif">Aktif</label>
                            <input type="number" id="edit_koperasiAktif" value="${data.Koperasi?.Aktif || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_koperasiTidakAktif">Tidak Aktif</label>
                            <input type="number" id="edit_koperasiTidakAktif" value="${data.Koperasi?.['Tidak Aktif'] || ''}" required>
                        </div>
                    </div>
            
                    <div class="form-section">
                        <h3>Data Anggota</h3>
                        <div class="form-group">
                            <label for="edit_jumlahAnggota">Jumlah Anggota</label>
                            <input type="number" id="edit_jumlahAnggota" value="${data.Anggota?.['Jumlah Anggota'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_anggotaAktif">Aktif</label>
                            <input type="number" id="edit_anggotaAktif" value="${data.Anggota?.Aktif || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_anggotaTidakAktif">Tidak Aktif</label>
                            <input type="number" id="edit_anggotaTidakAktif" value="${data.Anggota?.['Tidak Aktif'] || ''}" required>
                        </div>
                    </div>
            
                    <div class="form-group">
                        <label for="edit_ratUnit">RAT Unit</label>
                        <input type="number" id="edit_ratUnit" value="${data['RAT Unit'] || ''}" required>
                    </div>
            
                    <div class="form-section">
                        <h3>Data Manajer</h3>
                        <div class="form-group">
                            <label for="edit_jumlahManajer">Jumlah</label>
                            <input type="number" id="edit_jumlahManajer" value="${data.Manajer?.Jumlah || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_manajerAktif">Aktif</label>
                            <input type="number" id="edit_manajerAktif" value="${data.Manajer?.Aktif || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_manajerTidakAktif">Tidak Aktif</label>
                            <input type="number" id="edit_manajerTidakAktif" value="${data.Manajer?.['Tidak Aktif'] || ''}" required>
                        </div>
                    </div>
            
                    <div class="form-section">
                        <h3>Data Karyawan</h3>
                        <div class="form-group">
                            <label for="edit_jumlahKaryawan">Jumlah</label>
                            <input type="number" id="edit_jumlahKaryawan" value="${data.Karyawan?.Jumlah || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_karyawanAktif">Aktif</label>
                            <input type="number" id="edit_karyawanAktif" value="${data.Karyawan?.Aktif || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_karyawanTidakAktif">Tidak Aktif</label>
                            <input type="number" id="edit_karyawanTidakAktif" value="${data.Karyawan?.['Tidak Aktif'] || ''}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h3>Data Keuangan</h3>
                        <div class="form-group">
                            <label for="edit_modalSendiri">Modal Sendiri</label>
                            <input type="text" id="edit_modalSendiri" value="${data['Modal Sendiri'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_modalLuar">Modal Luar</label>
                            <input type="text" id="edit_modalLuar" value="${data['Modal Luar'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_volumeUsaha">Volume Usaha</label>
                            <input type="text" id="edit_volumeUsaha" value="${data['Volume Usaha'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_shu">SHU</label>
                            <input type="text" id="edit_shu" value="${data.SHU || ''}" required>
                        </div>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            }
            editPopup.style.display = 'block';

            form.onsubmit = async (e) => {
                e.preventDefault();
                
                try {
                    const updatedData = getUpdatedDataByTable(table);
                    await update(dataRef, updatedData);
                    
                    editPopup.style.display = 'none';
                    loadBidangKoperasi();
                    alert('Data berhasil diperbarui!');
                } catch (error) {
                    console.error('Error updating data:', error);
                    alert('Terjadi kesalahan saat memperbarui data');
                }
            };
        }
    });
};

window.deleteData = async function(key, table) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            const deleteRef = ref(db, `Bidang Koperasi/${getPathByTable(table)}/${key}`);
            await remove(deleteRef);
            
            alert('Data berhasil dihapus!');
            loadBidangKoperasi();
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Terjadi kesalahan saat menghapus data: ' + error.message);
        }
    }
};

function getPathByTable(table) {
    switch(table) {
        case 'pelakuUKM':
            return 'Data Pelaku UKM/Triwulan 3';
        case 'ukmBerijin':
            return 'UKM Berijin/Triwulan 3';
        case 'ukmAksesPerbankan':
            return 'UKM Akses Perbankan/Triwulan 3';
        case 'wirausahaBermitraUKM':
            return 'Masyarakat Wirausaha Bermitra UKM/Triwulan 3';
        case 'aksesModalUsaha':
            return 'Masyarakat Akses Modal Usaha/Triwulan 3';
        case 'miskinPesertaPelatihan':
            return 'Masyarakat Miskin Peserta Pelatihan/Triwulan 3';
        case 'koperasiProduksi':
            return 'Jumlah Koperasi Produksi/Desember';
        case 'koperasiAktif':
            return 'Jumlah Koperasi Seluruh Koperasi Aktif';
        case 'aksesPasarOnline':
            return 'Koperasi Produksi Akses Pasar Online';
        case 'aksesKreditBank':
            return 'Koperasi Akses Kredit Bank';
        case 'koperasiSehat':
            return 'Jumlah Koperasi Sehat/Triwulan 3';
        case 'rekapOmzet':
            return 'Rekap Omzet Koperasi';
        default:
            return '';
    }
}

function getUpdatedDataByTable(table) {
    if (table === 'pelakuUKM') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            GENDER: document.getElementById('edit_gender').value,
            NIK: document.getElementById('edit_nik').value,
            NO_TELP: document.getElementById('edit_noTelp').value,
            ALAMAT_EMAIL: document.getElementById('edit_email').value,
            SEKTOR_USAHA: document.getElementById('edit_sektorUsaha').value,
            ALAMAT: document.getElementById('edit_alamat').value,
            'NOMOR_INDUK_BERUSAHA_(NIB)': document.getElementById('edit_nib').value
        };
    } else if (table === 'ukmBerijin') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            NIK: document.getElementById('edit_nik').value,
            Alamat: document.getElementById('edit_alamat').value,
            'No Hp': document.getElementById('edit_noHp').value,
            'Nama Usaha': document.getElementById('edit_namaUsaha').value,
            'Jenis Usaha': document.getElementById('edit_jenisUsaha').value
        };
    } else if (table === 'ukmAksesPerbankan') {
        return {
            NIK: document.getElementById('edit_nik').value,
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Bidang Usaha': document.getElementById('edit_bidangUsaha').value,
            Bank: document.getElementById('edit_bank').value
        };
    } else if (table === 'wirausahaBermitraUKM') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Bidang Usaha': document.getElementById('edit_bidangUsaha').value,
            'No Hp': document.getElementById('edit_noHp').value
        };
    } else if (table === 'aksesModalUsaha') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Bidang Usaha': document.getElementById('edit_bidangUsaha').value,
            'No Hp': document.getElementById('edit_noHp').value
        };
    } else if (table === 'koperasiProduksi') {
        return {
            'Nama Koperasi': document.getElementById('edit_namaKoperasi').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Jenis Produksi': document.getElementById('edit_jenisProduksi').value
        };
    } else if (table === 'miskinPesertaPelatihan') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            NIK: document.getElementById('edit_nik').value,
            Alamat: document.getElementById('edit_alamat').value,
            'No Hp': document.getElementById('edit_noHp').value,
        'Jenis Pelatihan': document.getElementById('edit_jenisPelatihan').value,
        'Tahun Pelatihan': document.getElementById('edit_tahunPelatihan').value
        };
    } else if (table === 'koperasiAktif') {
        return {
            'NIK': document.getElementById('edit_nik').value,
            'Nama Koperasi': document.getElementById('edit_namaKoperasi').value,
            'No Badan Hukum': document.getElementById('edit_noBadanHukum').value,
            'Alamat': document.getElementById('edit_alamat').value,
            'Desa': document.getElementById('edit_desa').value,
            'Kelurahan': document.getElementById('edit_kelurahan').value,
            'Kecamatan': document.getElementById('edit_kecamatan').value
        };
    } else if (table === 'aksesPasarOnline') {
        return {
            'Nama Koperasi': document.getElementById('edit_namaKoperasi').value,
            'Alamat': document.getElementById('edit_alamat').value,
            'Media Pemasaran': document.getElementById('edit_mediaPemasaran').value
        };
    } else if (table === 'aksesKreditBank') {
        return {
            'Nama Koperasi': document.getElementById('edit_namaKoperasi').value,
            'Alamat': document.getElementById('edit_alamat').value,
            'Bank Pemberi Fasilitas': document.getElementById('edit_bankPemberiFasilitas').value
        };
    } else if (table === 'koperasiSehat') {
        return {
            'Nama Koperasi': document.getElementById('edit_namaKoperasi').value,
            'Alamat': document.getElementById('edit_alamat').value,
            'Hasil': document.getElementById('edit_hasil').value,
            'Tahun Penilaian': parseInt(document.getElementById('edit_tahunPenilaian').value)
        };
    } else if (table === 'rekapOmzet') {
        return {
            Kecamatan: document.getElementById('edit_kecamatan').value,
            Koperasi: {
                'Jumlah Koperasi': parseInt(document.getElementById('edit_jumlahKoperasi').value),
                Aktif: parseInt(document.getElementById('edit_koperasiAktif').value),
                'Tidak Aktif': parseInt(document.getElementById('edit_koperasiTidakAktif').value)
            },
            Anggota: {
                'Jumlah Anggota': parseInt(document.getElementById('edit_jumlahAnggota').value),
                Aktif: parseInt(document.getElementById('edit_anggotaAktif').value),
                'Tidak Aktif': parseInt(document.getElementById('edit_anggotaTidakAktif').value)
            },
            'RAT Unit': parseInt(document.getElementById('edit_ratUnit').value),
            Manajer: {
                Jumlah: parseInt(document.getElementById('edit_jumlahManajer').value),
                Aktif: parseInt(document.getElementById('edit_manajerAktif').value),
                'Tidak Aktif': parseInt(document.getElementById('edit_manajerTidakAktif').value)
            },
            Karyawan: {
                Jumlah: parseInt(document.getElementById('edit_jumlahKaryawan').value),
                Aktif: parseInt(document.getElementById('edit_karyawanAktif').value),
                'Tidak Aktif': parseInt(document.getElementById('edit_karyawanTidakAktif').value)
            },
            'Modal Sendiri': document.getElementById('edit_modalSendiri').value,
            'Modal Luar': document.getElementById('edit_modalLuar').value,
            'Volume Usaha': document.getElementById('edit_volumeUsaha').value,
            SHU: document.getElementById('edit_shu').value
        };
    }
    return {};
}