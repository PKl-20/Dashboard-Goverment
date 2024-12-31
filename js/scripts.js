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
        loadExportData();

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

        loadBidangPerdagangan();
        loadBidangPasar();
        loadBidangKoperasi();
        
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', () => {
                const mainElement = button.closest('main');
                if (mainElement.id === 'Bidang-Perdagangan') {
                    // Untuk tabel di Bidang Perdagangan
                    const tableContainer = button.closest('.table-container');
                    if (tableContainer.id === 'pelayananTeraTable') {
                        openAddDataPopup('pelayananTera');
                    } else if (tableContainer.id === 'teraKabWSBTable') {
                        openAddDataPopup('teraKabWSB');
                    } else if (tableContainer.id === 'marketplaceTable') {
                        openAddDataPopup('marketplace');
                    } else if (tableContainer.id === 'tokoModernTable') {
                        openAddDataPopup('tokoModern');
                    } else if (tableContainer.id === 'tokoModernOSSTable') {
                        openAddDataPopup('tokoModernOSS');
                    } else if (tableContainer.id === 'tokoUMKMTable') {
                        openAddDataPopup('tokoUMKM');
                    } else if (tableContainer.id === 'komoditasEksporTable') {
                        openAddDataPopup('komoditasEkspor');
                    } else if (tableContainer.id === 'matrikaEksporTable') {
                        openAddDataPopup('matrikaEkspor');
                    } else if (tableContainer.id === 'disparitasHargaTable') {
                        openAddDataPopup('disparitasHarga');
                    } else if (tableContainer.id === 'hasilPengawasanTable') {
                        openAddDataPopup('hasilPengawasan');
                    }
                } else if (mainElement.id === 'Bidang-Pasar') {
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

        //Bidang Perdagangan
        document.getElementById('addDataForm').addEventListener('submit', async function(event) {
            event.preventDefault();
        
            if (currentTable === 'pelayananTera') {
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Data Pelayanan Tera');
                    const snapshot = await get(refPath);
                    const existingData = snapshot.val() || {};
                    const newData = {
                        UTTP: document.getElementById('UTTP').value,
                        'Triwulan 1': document.getElementById('triwulan1').value,
                        'Triwulan 2': document.getElementById('triwulan2').value,
                        'Triwulan 3': document.getElementById('triwulan3').value,
                        'Triwulan 4': document.getElementById('triwulan4').value
                    };
            
                    let totalTW1 = 0, totalTW2 = 0, totalTW3 = 0, totalTW4 = 0;

                    Object.entries(existingData).forEach(([key, value]) => {
                        if (key !== 'Total' && key !== 'Total Semua Layanan') {
                            totalTW1 += parseInt(value['Triwulan 1'] || 0);
                            totalTW2 += parseInt(value['Triwulan 2'] || 0);
                            totalTW3 += parseInt(value['Triwulan 3'] || 0);
                            totalTW4 += parseInt(value['Triwulan 4'] || 0);
                        }
                    });

                    totalTW1 += parseInt(newData['Triwulan 1']);
                    totalTW2 += parseInt(newData['Triwulan 2']);
                    totalTW3 += parseInt(newData['Triwulan 3']);
                    totalTW4 += parseInt(newData['Triwulan 4']);

                    const totalSemuaLayanan = totalTW1 + totalTW2 + totalTW3 + totalTW4;

                    const updates = {};

                    const newPostKey = push(refPath).key;
                    updates[newPostKey] = newData;

                    updates['Total'] = {
                        'Triwulan 1': totalTW1.toString(),
                        'Triwulan 2': totalTW2.toString(),
                        'Triwulan 3': totalTW3.toString(),
                        'Triwulan 4': totalTW4.toString()
                    };

                    updates['Total Semua Layanan'] = totalSemuaLayanan.toString();

                    await update(refPath, updates);
            
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            } else if (currentTable === 'marketplace') {
                const newData = {
                    'Nama Marketplace': document.getElementById('namaMarketplace').value,
                    'Tahun n-2': document.getElementById('tahunN2').value,
                    'Tahun n-1': document.getElementById('tahunN1').value,
                    'Tahun n': {
                        'Triwuan 1': document.getElementById('triwulan1').value,
                        'Triwuan 2': document.getElementById('triwulan2').value,
                        'Triwuan 3': document.getElementById('triwulan3').value,
                        'Triwuan 4': document.getElementById('triwulan4').value
                    },
                    'Keterangan': document.getElementById('keterangan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Data Marketplace Lokal');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            } else if (currentTable === 'teraKabWSB') {
                const form = document.getElementById('addDataForm');
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
            
                    // Fungsi untuk menghitung total UTTP
                    const calculateTotal = () => {
                        let total = 0;
                        const inputIds = [
                            'up1', 'up2',                           // UP
                            'tak1', 'tak2',                        // TAK
                            'atb1', 'atb2', 'atb3',               // Anak Timbangan Biasa
                            'atbh1', 'atbh2', 'atbh3',            // Anak Timbangan Halus
                            'dl1', 'dl2',                         // Dacin Logam
                            's1', 's2',                           // Sentisimal
                            'tbi1', 'tbi2',                       // Bobot Ingsut
                            'tp1', 'tp2',                         // Timbangan Pegas
                            'meja', 'neraca',                     // Timbangan Lainnya
                            'te2_1', 'te2_2',                     // TE II
                            'te34_1', 'te34_2', 'te34_3',        // TE III & IV
                            'alatUkur', 'teb'                     // Lainnya
                        ];
            
                        inputIds.forEach(id => {
                            const value = document.getElementById(id).value;
                            if (value && value !== '-') {
                                total += parseInt(value) || 0;
                            }
                        });
                        return total;
                    };
            
                    const newData = {
                        Kecamatan: document.getElementById('kecamatan').value,
                        Lokasi: document.getElementById('lokasi').value,
                        UP: {
                            '1 m ≤ up ≤ 2 m': document.getElementById('up1').value || '-',
                            'up ≤ 1 m': document.getElementById('up2').value || '-'
                        },
                        TAK: {
                            '5 l ≤  tb ≤ 25 l': document.getElementById('tak1').value || '-',
                            'tb > 2 l': document.getElementById('tak2').value || '-'
                        },
                        'ANAK TIMBANGAN': {
                            'Biasa': {
                                'atb ≤ 1 kg': document.getElementById('atb1').value || '-',
                                '1 < atb ≤ 5 kg': document.getElementById('atb2').value || '-',
                                '5 < atb ≤ 20 kg': document.getElementById('atb3').value || '-'
                            },
                            'Halus': {
                                'atb ≤ 1 kg': document.getElementById('atbh1').value || '-',
                                '1 < atb ≤ 5 kg': document.getElementById('atbh2').value || '-',
                                '5 < atb ≤ 20 kg': document.getElementById('atbh3').value || '-'
                            }
                        },
                        'TIMBANGAN': {
                            'DACIN LOGAM': {
                                'DL ≤ 25 kg': document.getElementById('dl1').value || '-',
                                'DL > 25 kg': document.getElementById('dl2').value || '-'
                            },
                            'SENTISIMAL': {
                                'S ≤ 150 kg': document.getElementById('s1').value || '-',
                                '150 kg < S ≤ 500 kg': document.getElementById('s2').value || '-'
                            },
                            'BOBOT INGSUT': {
                                'TBI ≤ 25 kg': document.getElementById('tbi1').value || '-',
                                '25 kg < TBI ≤ 150 kg': document.getElementById('tbi2').value || '-'
                            },
                            'PEGAS': {
                                'TP ≤ 25 kg': document.getElementById('tp1').value || '-',
                                'TP > 25 kg': document.getElementById('tp2').value || '-'
                            },
                            'MEJA': document.getElementById('meja').value || '-',
                            'NERACA': document.getElementById('neraca').value || '-',
                            'TE (II)': {
                                'TE ≤ 1 kg': document.getElementById('te2_1').value || '-',
                                'TE > 1 kg': document.getElementById('te2_2').value || '-'
                            },
                            'TE (III & IV)': {
                                '25 < kg TE ≤ 25 kg': document.getElementById('te34_1').value || '-',
                                '25 < kg TE ≤ 150 kg': document.getElementById('te34_2').value || '-',
                                '25 < kg TE ≤ 500 kg': document.getElementById('te34_3').value || '-'
                            }
                        },
                        'Alat Ukur Tinggi Orang': document.getElementById('alatUkur').value || '-',
                        'TEB 1000 KG': document.getElementById('teb').value || '-',
                        'Jumlah Total UTTP': calculateTotal().toString()
                    };
            
                    try {
                        const refPath = ref(db, 'Bidang Perdagangan/Data Semua Tera Kab WSB');
                        await push(refPath, newData);
                        
                        // Hitung dan update Jumlah Keseluruhan
                        const snapshot = await get(refPath);
                        if (snapshot.exists()) {
                            let totalKeseluruhan = 0;
                            Object.values(snapshot.val()).forEach(item => {
                                if (item['Jumlah Total UTTP'] && item['Jumlah Total UTTP'] !== '-') {
                                    totalKeseluruhan += parseInt(item['Jumlah Total UTTP']);
                                }
                            });
                            
                            const summaryRef = ref(db, 'Bidang Perdagangan/Data Semua Tera Kab WSB/Jumlah Keseluruhan');
                            await set(summaryRef, totalKeseluruhan.toString());
                        }
            
                        alert('Data berhasil ditambahkan!');
                        closeAddDataPopup();
                        loadBidangPerdagangan();
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Terjadi kesalahan saat menambahkan data!');
                    }
                });
            } else if (currentTable === 'tokoModern') {
                const newData = {
                    'TANGGAL SK': document.getElementById('tanggalSK').value,
                    'NAMA DAN ALAMAT LOKASI TEMPAT USAHA': {
                        'NAMA': document.getElementById('namaUsaha').value,
                        'ALAMAT': document.getElementById('alamatUsaha').value
                    },
                    'NAMA DAN ALAMAT PEMILIK': {
                        'NAMA': document.getElementById('namaPemilik').value,
                        'ALAMAT': document.getElementById('alamatPemilik').value
                    },
                    'NOMOR INDUK BERUSAHA': {
                        'NIB': document.getElementById('statusNIB').value,
                        'NO NIB': document.getElementById('nomorNIB').value,
                        'STATUS': document.getElementById('status').value
                    },
                    'PERIZINAN': {
                        'SIUP': document.getElementById('SIUP').value,
                        "TDP": document.getElementById('TDP').value,
                        'HO': document.getElementById('HO').value
                    }
                };
        
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Data Toko Modern');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            } else if (currentTable === 'tokoModernOSS') {
                const newData = {
                    'Nama dan Alamat Lokasi Tempat Usaha': {
                        'Nama': document.getElementById('namaUsaha').value,
                        'Alamat': document.getElementById('alamatUsaha').value
                    },
                    'Nama dan Alamat Pemilik': {
                        'Nama': document.getElementById('namaPemilik').value,
                        'Alamat': document.getElementById('alamatPemilik').value
                    },
                    'NOMOR_INDUK_BERUSAHA_(NIB)': {
                        'NIB': document.getElementById('statusNIB').value,
                        'Nomor': document.getElementById('nomorNIB').value,
                        'Status': document.getElementById('statusNIBActive').value
                    },
                    'No Telp': document.getElementById('noTelp').value,
                    'Komoditi atau KBLI': document.getElementById('komoditi').value,
                    'Jenis Toko': document.getElementById('jenisToko').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Data Toko Modern OSS');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'tokoUMKM') {
                const newData = {
                    'Toko Modern': document.getElementById('tokoModern').value,
                    'Alamat': document.getElementById('alamat').value,
                    'Produk UMKM yang Dipasarkan': document.getElementById('produkUMKM').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Data Toko Modern Memasarkan UMKM');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'komoditasEkspor') {
                const newData = {
                    'Komoditas': document.getElementById('komoditas').value,
                    'Perusahaan': document.getElementById('perusahaan').value,
                    'Alamat': document.getElementById('alamat').value,
                    'Negara Tujuan': document.getElementById('negaraTujuan').value,
                    'Keterangan': document.getElementById('keterangan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Komoditas Ekspor');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'matrikaEkspor') {
                const newData = {
                    'Barang Ekspor': document.getElementById('barangEkspor').value,
                    'Perusahaan': document.getElementById('perusahaan').value,
                    'Produksi': {
                        'Kapasitas': document.getElementById('produksiKapasitas').value,
                        'Satuan': document.getElementById('produksiSatuan').value
                    },
                    'Ekspor': {
                        'Kapasitas': document.getElementById('eksporKapasitas').value,
                        'Satuan': document.getElementById('eksporSatuan').value
                    },
                    'Nilai (USD)': document.getElementById('nilaiUSD').value,
                    'Negara Tujuan': document.getElementById('negaraTujuan').value,
                    'Komoditas': document.getElementById('komoditas').value,
                    'Keterangan': document.getElementById('keterangan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Matrika Ekspor/Tembakau');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
        
            } else if (currentTable === 'disparitasHarga') {
                // Fungsi untuk mengubah string harga ke number
                const parseHarga = (hargaStr) => {
                    return parseInt(hargaStr.replace(/\D/g, ''));
                };
            
                // Fungsi untuk memformat harga ke format Rupiah
                const formatHarga = (number) => {
                    return `RP. ${Math.abs(number)}`;
                };
            
                // Ambil nilai harga dari input
                const hargaWonosobo = document.getElementById('hargaWonosobo').value;
                const hargaTemanggung = document.getElementById('hargaTemanggung').value;
            
                // Konversi ke number untuk perhitungan
                const hargaWsb = parseHarga(hargaWonosobo);
                const hargaTmg = parseHarga(hargaTemanggung);
            
                // Hitung selisih (Temanggung - Wonosobo)
                const selisih = hargaTmg - hargaWsb;
            
                // Hitung persentase
                const persen = ((selisih / hargaTmg) * 100).toFixed(0); // Bulatkan ke bilangan bulat
            
                const newData = {
                    'Nama Sampel Komoditi': document.getElementById('namaKomoditi').value,
                    'Satuan': document.getElementById('satuan').value,
                    'Bulan n': {
                        'Kabupaten Wonosobo': hargaWonosobo,
                        'Kabupaten Temanggung': hargaTemanggung
                    },
                    'Selisih': selisih >= 0 ? formatHarga(selisih) : `-${formatHarga(selisih)}`,
                    'Persen': `${persen}%`
                };
            
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Disparitas Harga');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            } else if (currentTable === 'hasilPengawasan') {
                const newData = {
                    'Kios Pupuk Lengkap': document.getElementById('kiosPupuk').value,
                    'Wilayah': document.getElementById('wilayah').value,
                    'NOMOR_INDUK_BERUSAHA_(NIB)': document.getElementById('nib').value,
                    'Harga HET': document.getElementById('hargaHET').value,
                    'Papan Nama': document.getElementById('papanNama').value,
                    'SPJB': document.getElementById('spjb').value,
                    'Penyerapan Kartu Tani (%)': document.getElementById('penyerapanKartuTani').value,
                    'RDKK': document.getElementById('rdkk').value,
                    'Hasil': document.getElementById('hasil').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Perdagangan/Hasil Pengawasan');
                    await push(refPath, newData);
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            }
        });

        //Bidang Pasar
        document.getElementById('addDataForm').addEventListener('submit', async function(event) {
            event.preventDefault();
        
            if (currentTable === 'kondisiPasar') {
                const kondisiValue = document.querySelector('input[name="kondisi"]:checked').value;
                
                const newData = {
                    'Nama Pasar': document.getElementById('namaPasar').value,
                    'Fasilitas': {
                        'Areal Parkir': document.getElementById('arealParkir').value,
                        'TPS': document.getElementById('TPS').value,
                        'MCK': document.getElementById('MCK').value,
                        'Tempat Ibadah': document.getElementById('tempatIbadah').value,
                        'Bongkar Muat': document.getElementById('bongkarMuat').value
                    },
                    'kondisi': {
                        'Baik': kondisiValue === 'baik' ? 'X' : '',
                        'Tidak Baik': kondisiValue === 'tidakBaik' ? 'X' : '',
                        'Perlu Penyempurnaan': kondisiValue === 'perluPenyempurnaan' ? 'X' : ''
                    }
                };
        
                try {
                    const refPath = ref(db, 'Bidang Pasar/Data Kondisi Pasar');
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
                    'Nama Pasar': document.getElementById('namaPasar').value,
                    'Alamat Lengkap': document.getElementById('alamatLengkap').value,
                    'Jumlah LosKios': {
                        los: parseInt(document.getElementById('jumlahLosKios_los').value),
                        kios: parseInt(document.getElementById('jumlahLosKios_kios').value)
                    },
                    'Jumlah Pedagang': {
                        los: parseInt(document.getElementById('jumlahPedagang_los').value),
                        kios: parseInt(document.getElementById('jumlahPedagang_kios').value)
                    },
                    'Jumlah Tidak Termanfaatkan': {
                        los: parseInt(document.getElementById('jumlahTidakTermanfaatkan_los').value),
                        kios: parseInt(document.getElementById('jumlahTidakTermanfaatkan_kios').value)
                    }
                };
            
                try {
                    // Tambah data baru
                    const refPath = ref(db, 'Bidang Pasar/Data Los Kios Pasar');
                    await push(refPath, newData);
            
                    // Update total/summary
                    const snapshot = await get(refPath);
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        let summary = {
                            'Jumlah LosKios': { los: 0, kios: 0 },
                            'Jumlah Pedagang': { los: 0, kios: 0 },
                            'Jumlah Tidak Termanfaatkan': { los: 0, kios: 0 }
                        };
            
                        // Hitung total dari semua data
                        Object.entries(data).forEach(([key, value]) => {
                            if (key !== 'Jumlah') {
                                summary['Jumlah LosKios'].los += parseInt(value['Jumlah LosKios']?.los || 0);
                                summary['Jumlah LosKios'].kios += parseInt(value['Jumlah LosKios']?.kios || 0);
                                summary['Jumlah Pedagang'].los += parseInt(value['Jumlah Pedagang']?.los || 0);
                                summary['Jumlah Pedagang'].kios += parseInt(value['Jumlah Pedagang']?.kios || 0);
                                summary['Jumlah Tidak Termanfaatkan'].los += parseInt(value['Jumlah Tidak Termanfaatkan']?.los || 0);
                                summary['Jumlah Tidak Termanfaatkan'].kios += parseInt(value['Jumlah Tidak Termanfaatkan']?.kios || 0);
                            }
                        });
            
                        // Update summary di database
                        const summaryRef = ref(db, 'Bidang Pasar/Data Los Kios Pasar/Jumlah');
                        await update(summaryRef, summary);
                    }
            
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
                    'UPT': document.getElementById('UPT').value,
                    'Nama Pasar': document.getElementById('namaPasar').value,
                    'Jumlah Paguyuban Pedagang': parseInt(document.getElementById('jumlahPaguyubanPedagang').value),
                    'Alamat': document.getElementById('alamat').value,
                    'Tahun Berdiri': document.getElementById('tahunBerdiri').value,
                    'Luas': {
                        tanah: parseInt(document.getElementById('luas_tanah').value),
                        bangunan: parseInt(document.getElementById('luas_bangunan').value),
                        lantai: parseInt(document.getElementById('luas_lantai').value)
                    },
                    'Jumlah': {
                        los: parseInt(document.getElementById('jumlah_los').value),
                        kios: parseInt(document.getElementById('jumlah_kios').value),
                        dasaran: parseInt(document.getElementById('jumlah_dasaran').value)
                    },
                    'Jumlah Pedagang': {
                        los: parseInt(document.getElementById('pedagang_los').value),
                        kios: parseInt(document.getElementById('pedagang_kios').value),
                        dasaran: parseInt(document.getElementById('pedagang_dasaran').value)
                    },
                    'Fasilitas': {
                        'Areal Parkir': document.getElementById('Areal Parkir').value,
                        'TPS': document.getElementById('TPS').value,
                        'MCK': document.getElementById('MCK').value,
                        'Tempat Ibadah': document.getElementById('Tempat Ibadah').value,
                        'Bongkar Muat': document.getElementById('Bongkar Muat').value
                    },
                    'Keterangan': keteranganValue
                };
        
                try {
                    const refPath = ref(db, 'Bidang Pasar/Matriks Profil Pasar');
                    await push(refPath, newData);
                    await updateProfilSummary();
                    alert('Data berhasil ditambahkan!');
                    closeAddDataPopup();
                    loadBidangPasar();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat menambahkan data!');
                }
            }
        });
        
        //Bidang Koperasi
        document.getElementById('addDataForm').addEventListener('submit', async function(event) {
            event.preventDefault();
        
            if (currentTable === 'pelakuUKM') {
                const newData = {
                    NAMA: document.getElementById('nama').value,
                    GENDER: document.getElementById('gender').value,
                    NIK: document.getElementById('nik').value,
                    'NO TELP': document.getElementById('noTelp').value,
                    'ALAMAT EMAIL': document.getElementById('email').value,
                    'SEKTOR USAHA': document.getElementById('sektorUsaha').value,
                    ALAMAT: document.getElementById('alamat').value,
                    'NOMOR_INDUK_BERUSAHA_(NIB)': document.getElementById('nib').value,
                    TRIWULAN: document.getElementById('triwulan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Data Pelaku UKM');
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
                    Nama: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    NIK: document.getElementById('nik').value,
                    Alamat: document.getElementById('alamat').value,
                    'No Telp': document.getElementById('noHp').value,
                    'Nama Usaha': document.getElementById('namaUsaha').value,
                    'Jenis Usaha': document.getElementById('jenisUsaha').value,
                    Triwulan: document.getElementById('triwulan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/UKM Berijin');
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
                    Nama: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    Bank: document.getElementById('bank').value,
                    Triwulan: document.getElementById('triwulan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/UKM Akses Perbankan');
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
                    Nama: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    'No Telp': document.getElementById('noHp').value,
                    Triwulan: document.getElementById('triwulan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Masyarakat Wirausaha Bermitra UKM');
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
                    Nama: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    'No Telp': document.getElementById('noHp').value,
                    Triwulan: document.getElementById('triwulan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Masyarakat Akses Modal Usaha');
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
                    Nama: document.getElementById('nama').value,
                    Gender: document.getElementById('gender').value,
                    Alamat: document.getElementById('alamat').value,
                    'Bidang Usaha': document.getElementById('bidangUsaha').value,
                    'No Telp': document.getElementById('noHp').value,
                    Triwulan: document.getElementById('triwulan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Masyarakat Miskin Peserta Pelatihan');
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
                    Produk: document.getElementById('produk').value,
                    Bulan: document.getElementById('bulan').value
                };
        
                try {
                    const refPath = ref(db, 'Bidang Koperasi/Jumlah Koperasi Produksi');
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
                    const refPath = ref(db, 'Bidang Koperasi/Jumlah Seluruh Koperasi Aktif/Desember');
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
                    const refPath = ref(db, 'Bidang Koperasi/Jumlah Koperasi Sehat');
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
                    await updateRekapOmzetSummary();
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
                window.location.href = 'dashboard.html';
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
            window.location.href = 'dashboard.html';
        }
    } else {
        if (currentPage.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }
}

function logoutUser() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
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

function loadBidangPerdagangan() {
    const bidangPerdaganganRef = ref(db, 'Bidang Perdagangan');
    
    onValue(bidangPerdaganganRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            const pelayananTeraRawData = data['Data Pelayanan Tera'];
            console.log('Raw Data:', pelayananTeraRawData); // Debug raw data
                // Hitung total semua layanan
            let totalSemuaLayanan = 0;
            
            const pelayananTeraData = pelayananTeraRawData ? 
                Object.entries(pelayananTeraRawData)
                    .map(([key, value]) => {
                        if (key !== 'Total' && key !== 'Total Semua Layanan') {
                            // Jumlahkan semua nilai triwulan untuk setiap item
                            const tw1 = parseInt(value['Triwulan 1'] || 0);
                            const tw2 = parseInt(value['Triwulan 2'] || 0);
                            const tw3 = parseInt(value['Triwulan 3'] || 0);
                            const tw4 = parseInt(value['Triwulan 4'] || 0);
                            totalSemuaLayanan += tw1 + tw2 + tw3 + tw4;
                        }
                            if (key === 'Total Semua Layanan') {
                            return {
                                id: key,
                                value: totalSemuaLayanan.toString() // Gunakan total yang baru dihitung
                            };
                        } else if (key === 'Total') {
                            return {
                                id: key,
                                ...value
                            };
                        } else {
                            return {
                                id: key,
                                ...value
                            };
                        }
                    }) : [];
            
            const teraKabWSBData = data['Data Semua Tera Kab WSB'] ? 
                Object.entries(data['Data Semua Tera Kab WSB'])
                    .map(([key, value]) => ({
                        id: key,
                        ...value
                    }))
                    .filter(item => item.id !== 'Jumlah Keseluruhan') : [];

            const jumlahKeseluruhan = data['Data Semua Tera Kab WSB']?.['Jumlah Keseluruhan'] || '0';

            teraKabWSBData.push({
                id: 'Jumlah Keseluruhan',
                value: jumlahKeseluruhan
            });
            
            const marketplaceData = data['Data Marketplace Lokal'] ? 
                Object.entries(data['Data Marketplace Lokal']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];
            
            const tokoModernData = data['Data Toko Modern'] ? 
                Object.entries(data['Data Toko Modern']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];
            
            const tokoModernOSSData = data['Data Toko Modern OSS'] ? 
                Object.entries(data['Data Toko Modern OSS']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];
            
            const tokoUMKMData = data['Data Toko Modern Memasarkan UMKM'] ? 
                Object.entries(data['Data Toko Modern Memasarkan UMKM']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];
            
            const komoditasEksporData = data['Komoditas Ekspor'] ? 
                Object.entries(data['Komoditas Ekspor']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];
            
            // Perbaikan untuk Matrika Ekspor
            const matrikaEksporData = data['Matrika Ekspor'] ? 
                Object.entries(data['Matrika Ekspor']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];
            
            const disparitasHargaData = data['Disparitas Harga'] ? 
                Object.entries(data['Disparitas Harga']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];
            
            const hasilPengawasanData = data['Hasil Pengawasan'] ? 
                Object.entries(data['Hasil Pengawasan']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];

            renderPelayananTeraTable(pelayananTeraData);
            renderTeraKabWSBTable(teraKabWSBData);
            renderMarketplaceTable(marketplaceData);
            renderTokoModernTable(tokoModernData);
            renderTokoModernOSSTable(tokoModernOSSData);
            renderTokoUMKMTable(tokoUMKMData);
            renderKomoditasEksporTable(komoditasEksporData);
            renderMatrikaEksporTable(matrikaEksporData);
            renderDisparitasHargaTable(disparitasHargaData);
            renderHasilPengawasanTable(hasilPengawasanData);
        }
    });
} 

function renderPelayananTeraTable(data) {
    const tbody = document.getElementById('pelayananTeraBody');
    const tfoot = document.getElementById('pelayananTeraFooter');
    if (!tbody || !tfoot) return;
    
    tbody.innerHTML = '';
    let no = 1;
    let totalPerTriwulan = data.find(item => item.id === 'Total') || {
        'Triwulan 1': '0',
        'Triwulan 2': '0',
        'Triwulan 3': '0',
        'Triwulan 4': '0'
    };

    const validData = data.filter(item => 
        item.id !== 'Total' && item.id !== 'Total Semua Layanan'
    );

    validData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item.UTTP || ''}</td>
            <td>${item['Triwulan 1'] || ''}</td>
            <td>${item['Triwulan 2'] || ''}</td>
            <td>${item['Triwulan 3'] || ''}</td>
            <td>${item['Triwulan 4'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'pelayananTera')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'pelayananTera')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    const totalSemuaLayanan = data.find(item => item.id === 'Total Semua Layanan')?.value;
        tfoot.innerHTML = `
        <tr>
            <td colspan="2">Total per Triwulan</td>
            <td>${totalPerTriwulan['Triwulan 1']}</td>
            <td>${totalPerTriwulan['Triwulan 2']}</td>
            <td>${totalPerTriwulan['Triwulan 3']}</td>
            <td>${totalPerTriwulan['Triwulan 4']}</td>
            <td></td>
        </tr>
        <tr>
            <td colspan="2">Total Semua Layanan</td>
            <td colspan="5">${totalSemuaLayanan || '0'}</td>
        </tr>
    `;
}

function renderTeraKabWSBTable(data) {
    const tbody = document.getElementById('teraKabWSBBody');
    const tfoot = document.getElementById('teraKabWSBFooter');
    if (!tbody || !tfoot) return;
    
    tbody.innerHTML = '';
    tfoot.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item || item.id === 'Jumlah Keseluruhan') return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item.Kecamatan || ''}</td>
            <td>${item.Lokasi || ''}</td>
            <td>${item.UP?.['1 m ≤ up ≤ 2 m'] || '-'}</td>
            <td>${item.UP?.['up ≤ 1 m'] || '-'}</td>
            <td>${item.TAK?.['5 l ≤  tb ≤ 25 l'] || '-'}</td>
            <td>${item.TAK?.['tb > 2 l'] || '-'}</td>
            <td>${item['ANAK TIMBANGAN']?.Biasa?.['atb ≤ 1 kg'] || '-'}</td>
            <td>${item['ANAK TIMBANGAN']?.Biasa?.['1 < atb ≤ 5 kg'] || '-'}</td>
            <td>${item['ANAK TIMBANGAN']?.Biasa?.['5 < atb ≤ 20 kg'] || '-'}</td>
            <td>${item['ANAK TIMBANGAN']?.Halus?.['atb ≤ 1 kg'] || '-'}</td>
            <td>${item['ANAK TIMBANGAN']?.Halus?.['1 < atb ≤ 5 kg'] || '-'}</td>
            <td>${item['ANAK TIMBANGAN']?.Halus?.['5 < atb ≤ 20 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['DACIN LOGAM']?.['DL ≤ 25 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['DACIN LOGAM']?.['DL > 25 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.SENTISIMAL?.['S ≤ 150 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.SENTISIMAL?.['150 kg < S ≤ 500 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['BOBOT INGSUT']?.['TBI ≤ 25 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['BOBOT INGSUT']?.['25 kg < TBI ≤ 150 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.PEGAS?.['TP ≤ 25 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.PEGAS?.['TP > 25 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.MEJA || '-'}</td>
            <td>${item.TIMBANGAN?.NERACA || '-'}</td>
            <td>${item.TIMBANGAN?.['TE (II)']?.['TE ≤ 1 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['TE (II)']?.['TE > 1 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['TE (III & IV)']?.['25 < kg TE ≤ 25 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['TE (III & IV)']?.['25 < kg TE ≤ 150 kg'] || '-'}</td>
            <td>${item.TIMBANGAN?.['TE (III & IV)']?.['25 < kg TE ≤ 500 kg'] || '-'}</td>
            <td>${item['Alat Ukur Tinggi Orang'] || '-'}</td>
            <td>${item['TEB 1000 KG'] || '-'}</td>
            <td>${item['Jumlah Total UTTP'] || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'teraKabWSB')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'teraKabWSB')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Render footer dengan total keseluruhan
    const footerRow = document.createElement('tr');
    footerRow.innerHTML = `
        <td colspan="30" style="text-align: right; font-weight: bold;">Jumlah Keseluruhan:</td>
        <td style="font-weight: bold;">${data.find(item => item.id === 'Jumlah Keseluruhan')?.value || '0'}</td>
        <td></td>
    `;
    tfoot.appendChild(footerRow);
}

function renderMarketplaceTable(data) {
    const tbody = document.getElementById('marketplaceBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Nama Marketplace'] || ''}</td>
            <td>${item['Tahun n-2'] || ''}</td>
            <td>${item['Tahun n-1'] || ''}</td>
            <td>${item['Tahun n']?.['Triwuan 1'] || ''}</td>
            <td>${item['Tahun n']?.['Triwuan 2'] || ''}</td>
            <td>${item['Tahun n']?.['Triwuan 3'] || ''}</td>
            <td>${item['Tahun n']?.['Triwuan 4'] || ''}</td>
            <td>${item['Keterangan'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'marketplace')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'marketplace')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderTokoModernTable(data) {
    const tbody = document.getElementById('tokoModernBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['TANGGAL SK'] || ''}</td>
            <td>${item['NAMA DAN ALAMAT LOKASI TEMPAT USAHA']?.NAMA || ''}</td>
            <td>${item['NAMA DAN ALAMAT LOKASI TEMPAT USAHA']?.ALAMAT || ''}</td>
            <td>${item['NAMA DAN ALAMAT PEMILIK']?.NAMA || ''}</td>
            <td>${item['NAMA DAN ALAMAT PEMILIK']?.ALAMAT || ''}</td>
            <td>${item['NOMOR INDUK BERUSAHA'].NIB || ''}</td>
            <td>${item['NOMOR INDUK BERUSAHA']?.['NO NIB'] || ''}</td>
            <td>${item['NOMOR INDUK BERUSAHA'].STATUS || ''}</td>
            <td>${item['PERIZINAN'].SIUP || ''}</td>
            <td>${item['PERIZINAN'].TDP || ''}</td>
            <td>${item['PERIZINAN'].HO || ''}</td>
            <td>${item['IUTM'] || ''}</td>
            <td>${item['JENIS TOKO MODERN'] || ''}</td>
            <td>${item['KOMODITI atau KBLI'] || ''}</td>
            <td>${item['CATATAN PERUBAHAN'] || ''}</td>
            <td>${item['KETERANGAN'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'tokoModern')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'tokoModern')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderTokoModernOSSTable(data) {
    const tbody = document.getElementById('tokoModernOSSBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Nama dan Alamat Lokasi Tempat Usaha']?.Nama || ''}</td>
            <td>${item['Nama dan Alamat Lokasi Tempat Usaha']?.Alamat || ''}</td>
            <td>${item['Nama dan Alamat Pemilik']?.Nama || ''}</td>
            <td>${item['Nama dan Alamat Pemilik']?.Alamat || ''}</td>
            <td>${item['NOMOR_INDUK_BERUSAHA_(NIB)']?.NIB || ''}</td>
            <td>${item['NOMOR_INDUK_BERUSAHA_(NIB)']?.Nomor || ''}</td>
            <td>${item['NOMOR_INDUK_BERUSAHA_(NIB)']?.Status || ''}</td>
            <td>${item['No Telp'] || ''}</td>
            <td>${item['Komoditi atau KBLI'] || ''}</td>
            <td>${item['Jenis Toko'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'tokoModernOSS')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'tokoModernOSS')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderTokoUMKMTable(data) {
    const tbody = document.getElementById('tokoUMKMBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Toko Modern'] || ''}</td>
            <td>${item['Alamat'] || ''}</td>
            <td>${item['Produk UMKM yang Dipasarkan'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'tokoUMKM')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'tokoUMKM')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderKomoditasEksporTable(data) {
    const tbody = document.getElementById('komoditasEksporBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Komoditas'] || ''}</td>
            <td>${item['Perusahaan'] || ''}</td>
            <td>${item['Alamat'] || ''}</td>
            <td>${item['Negara Tujuan'] || ''}</td>
            <td>${item['Keterangan'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'komoditasEkspor')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'komoditasEkspor')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderMatrikaEksporTable(data) {
    const tbody = document.getElementById('matrikaEksporBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Barang'] || ''}</td>
            <td>${item['Perusahaan'] || ''}</td>
            <td>${item['Produksi']?.Kapasitas || ''}</td>
            <td>${item['Produksi']?.Satuan || ''}</td>
            <td>${item['Ekspor']?.Kapasitas || ''}</td>
            <td>${item['Ekspor']?.Satuan || ''}</td>
            <td>${item['Nilai (usd)'] || ''}</td>
            <td>${item['Negara Tujuan'] || ''}</td>
            <td>${item['Komoditas'] || ''}</td>
            <td>${item['Keterangan'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'matrikaEkspor')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'matrikaEkspor')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderDisparitasHargaTable(data) {
    const tbody = document.getElementById('disparitasHargaBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Nama Sampel Komoditi'] || ''}</td>
            <td>${item['Satuan'] || ''}</td>
            <td>${item['Bulan n']?.['Kabupaten Wonosobo'] || ''}</td>
            <td>${item['Bulan n']?.['Kabupaten Temanggung'] || ''}</td>
            <td>${item['Selisih'] || ''}</td>
            <td>${item['Persen'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'disparitasHarga')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'disparitasHarga')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderHasilPengawasanTable(data) {
    const tbody = document.getElementById('hasilPengawasanBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;
    
    data.forEach(item => {
        if (!item) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Kios Pupuk Lengkap'] || ''}</td>
            <td>${item['Wilayah'] || ''}</td>
            <td>${item['NOMOR_INDUK_BERUSAHA_(NIB)'] || ''}</td>
            <td>${item['Harga HET'] || ''}</td>
            <td>${item['Papan Nama'] || ''}</td>
            <td>${item['SPJB'] || ''}</td>
            <td>${item['Penyerapan Kartu Tani (%)'] || ''}</td>
            <td>${item['RDKK'] || ''}</td>
            <td>${item['Hasil'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPerdagangan('${item.id}', 'hasilPengawasan')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPerdagangan('${item.id}', 'hasilPengawasan')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi Edit Data Perdagangan
window.editDataPerdagangan = function(key, table) {
    const editPopup = document.getElementById('editDataPopup');
    const form = document.getElementById('editDataForm');
    
    const path = getPathByTablePerdagangan(table);
    if (!path) {
        console.error('Path tidak valid untuk table:', table);
        return;
    }
    
    const dataRef = ref(db, `Bidang Perdagangan/${path}/${key}`);
    get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            form.setAttribute('data-key', key);
            form.setAttribute('data-table', table);
            currentTable = table;
            if (table === 'pelayananTera') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_uttp">UTTP</label>
                        <input type="text" id="edit_uttp" value="${data.UTTP || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan1">Triwulan 1</label>
                        <input type="text" id="edit_triwulan1" value="${data['Triwulan 1'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan2">Triwulan 2</label>
                        <input type="text" id="edit_triwulan2" value="${data['Triwulan 2'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan3">Triwulan 3</label>
                        <input type="text" id="edit_triwulan3" value="${data['Triwulan 3'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan4">Triwulan 4</label>
                        <input type="text" id="edit_triwulan4" value="${data['Triwulan 4'] || ''}" required>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            } else if (table === 'teraKabWSB') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_kecamatan">Kecamatan</label>
                        <input type="text" id="edit_kecamatan" value="${data.Kecamatan || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_lokasi">Lokasi</label>
                        <input type="text" id="edit_lokasi" value="${data.Lokasi || ''}" required>
                    </div>
                    <div class="form-section">
                        <h4>UP</h4>
                        <div class="form-group">
                            <label for="edit_up1">1 m ≤ up ≤ 2 m</label>
                            <input type="text" id="edit_up1" value="${data.UP?.['1 m ≤ up ≤ 2 m'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_up2">up ≤ 1 m</label>
                            <input type="text" id="edit_up2" value="${data.UP?.['up ≤ 1 m'] || '-'}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>TAK</h4>
                        <div class="form-group">
                            <label for="edit_tak1">5 l ≤ tb ≤ 25 l</label>
                            <input type="text" id="edit_tak1" value="${data.TAK?.['5 l ≤  tb ≤ 25 l'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_tak2">tb > 2 l</label>
                            <input type="text" id="edit_tak2" value="${data.TAK?.['tb > 2 l'] || '-'}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>ANAK TIMBANGAN</h4>
                        <h5>Biasa</h5>
                        <div class="form-group">
                            <label for="edit_atb1">atb ≤ 1 kg</label>
                            <input type="text" id="edit_atb1" value="${data['ANAK TIMBANGAN']?.Biasa?.['atb ≤ 1 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_atb2">1 < atb ≤ 5 kg</label>
                            <input type="text" id="edit_atb2" value="${data['ANAK TIMBANGAN']?.Biasa?.['1 < atb ≤ 5 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_atb3">5 < atb ≤ 20 kg</label>
                            <input type="text" id="edit_atb3" value="${data['ANAK TIMBANGAN']?.Biasa?.['5 < atb ≤ 20 kg'] || '-'}" required>
                        </div>
                        <h5>Halus</h5>
                        <div class="form-group">
                            <label for="edit_atbh1">atb ≤ 1 kg</label>
                            <input type="text" id="edit_atbh1" value="${data['ANAK TIMBANGAN']?.Halus?.['atb ≤ 1 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_atbh2">1 < atb ≤ 5 kg</label>
                            <input type="text" id="edit_atbh2" value="${data['ANAK TIMBANGAN']?.Halus?.['1 < atb ≤ 5 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_atbh3">5 < atb ≤ 20 kg</label>
                            <input type="text" id="edit_atbh3" value="${data['ANAK TIMBANGAN']?.Halus?.['5 < atb ≤ 20 kg'] || '-'}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>TIMBANGAN</h4>
                        <h5>DACIN LOGAM</h5>
                        <div class="form-group">
                            <label for="edit_dl1">DL ≤ 25 kg</label>
                            <input type="text" id="edit_dl1" value="${data.TIMBANGAN?.['DACIN LOGAM']?.['DL ≤ 25 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_dl2">DL > 25 kg</label>
                            <input type="text" id="edit_dl2" value="${data.TIMBANGAN?.['DACIN LOGAM']?.['DL > 25 kg'] || '-'}" required>
                        </div>
                        <h5>SENTISIMAL</h5>
                        <div class="form-group">
                            <label for="edit_s1">S ≤ 150 kg</label>
                            <input type="text" id="edit_s1" value="${data.TIMBANGAN?.SENTISIMAL?.['S ≤ 150 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_s2">150 kg < S ≤ 500 kg</label>
                            <input type="text" id="edit_s2" value="${data.TIMBANGAN?.SENTISIMAL?.['150 kg < S ≤ 500 kg'] || '-'}" required>
                        </div>
                        <h5>BOBOT INGSUT</h5>
                        <div class="form-group">
                            <label for="edit_tbi1">TBI ≤ 25 kg</label>
                            <input type="text" id="edit_tbi1" value="${data.TIMBANGAN?.['BOBOT INGSUT']?.['TBI ≤ 25 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_tbi2">25 kg < TBI ≤ 150 kg</label>
                            <input type="text" id="edit_tbi2" value="${data.TIMBANGAN?.['BOBOT INGSUT']?.['25 kg < TBI ≤ 150 kg'] || '-'}" required>
                        </div>
                        <h5>PEGAS</h5>
                        <div class="form-group">
                            <label for="edit_tp1">TP ≤ 25 kg</label>
                            <input type="text" id="edit_tp1" value="${data.TIMBANGAN?.PEGAS?.['TP ≤ 25 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_tp2">TP > 25 kg</label>
                            <input type="text" id="edit_tp2" value="${data.TIMBANGAN?.PEGAS?.['TP > 25 kg'] || '-'}" required>
                        </div>
                        <h5>Lainnya</h5>
                        <div class="form-group">
                            <label for="edit_meja">MEJA</label>
                            <input type="text" id="edit_meja" value="${data.TIMBANGAN?.MEJA || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_neraca">NERACA</label>
                            <input type="text" id="edit_neraca" value="${data.TIMBANGAN?.NERACA || '-'}" required>
                        </div>
                        <h5>TE (II)</h5>
                        <div class="form-group">
                            <label for="edit_te2_1">TE ≤ 1 kg</label>
                            <input type="text" id="edit_te2_1" value="${data.TIMBANGAN?.['TE (II)']?.['TE ≤ 1 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_te2_2">TE > 1 kg</label>
                            <input type="text" id="edit_te2_2" value="${data.TIMBANGAN?.['TE (II)']?.['TE > 1 kg'] || '-'}" required>
                        </div>
                        <h5>TE (III & IV)</h5>
                        <div class="form-group">
                            <label for="edit_te34_1">25 < kg TE ≤ 25 kg</label>
                            <input type="text" id="edit_te34_1" value="${data.TIMBANGAN?.['TE (III & IV)']?.['25 < kg TE ≤ 25 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_te34_2">25 < kg TE ≤ 150 kg</label>
                            <input type="text" id="edit_te34_2" value="${data.TIMBANGAN?.['TE (III & IV)']?.['25 < kg TE ≤ 150 kg'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_te34_3">25 < kg TE ≤ 500 kg</label>
                            <input type="text" id="edit_te34_3" value="${data.TIMBANGAN?.['TE (III & IV)']?.['25 < kg TE ≤ 500 kg'] || '-'}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>Lainnya</h4>
                        <div class="form-group">
                            <label for="edit_alatUkur">Alat Ukur Tinggi Orang</label>
                            <input type="text" id="edit_alatUkur" value="${data['Alat Ukur Tinggi Orang'] || '-'}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_teb">TEB 1000 KG</label>
                            <input type="text" id="edit_teb" value="${data['TEB 1000 KG'] || '-'}" required>
                        </div>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            }  else if (table === 'marketplace') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama_marketplace">Nama Marketplace</label>
                        <input type="text" id="edit_nama_marketplace" value="${data['Nama Marketplace'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_tahun_n2">Tahun n-2</label>
                        <input type="text" id="edit_tahun_n2" value="${data['Tahun n-2'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_tahun_n1">Tahun n-1</label>
                        <input type="text" id="edit_tahun_n1" value="${data['Tahun n-1'] || ''}" required>
                    </div>
                    <div class="form-section">
                        <h4>Tahun n</h4>
                        <div class="form-group">
                            <label for="edit_triwulan1">Triwulan 1</label>
                            <input type="text" id="edit_triwulan1" value="${data['Tahun n']?.['Triwuan 1'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_triwulan2">Triwulan 2</label>
                            <input type="text" id="edit_triwulan2" value="${data['Tahun n']?.['Triwuan 2'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_triwulan3">Triwulan 3</label>
                            <input type="text" id="edit_triwulan3" value="${data['Tahun n']?.['Triwuan 3'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_triwulan4">Triwulan 4</label>
                            <input type="text" id="edit_triwulan4" value="${data['Tahun n']?.['Triwuan 4'] || ''}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit_keterangan">Keterangan</label>
                        <input type="text" id="edit_keterangan" value="${data['Keterangan'] || ''}" required>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            } else if (table === 'tokoModern') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_tanggal_sk">Tanggal SK</label>
                        <input type="text" id="edit_tanggal_sk" value="${data['TANGGAL SK'] || ''}" required>
                    </div>
                    <div class="form-section">
                        <h4>Nama dan Alamat Lokasi Tempat Usaha</h4>
                        <div class="form-group">
                            <label for="edit_nama_usaha">Nama</label>
                            <input type="text" id="edit_nama_usaha" value="${data['NAMA DAN ALAMAT LOKASI TEMPAT USAHA']?.NAMA || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_alamat_usaha">Alamat</label>
                            <input type="text" id="edit_alamat_usaha" value="${data['NAMA DAN ALAMAT LOKASI TEMPAT USAHA']?.ALAMAT || ''}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>Nama dan Alamat Pemilik</h4>
                        <div class="form-group">
                            <label for="edit_nama_pemilik">Nama</label>
                            <input type="text" id="edit_nama_pemilik" value="${data['NAMA DAN ALAMAT PEMILIK']?.NAMA || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_alamat_pemilik">Alamat</label>
                            <input type="text" id="edit_alamat_pemilik" value="${data['NAMA DAN ALAMAT PEMILIK']?.ALAMAT || ''}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit_nib">Status</label>
                        <select id="edit_nib" required>
                            <option value="Ada" ${data['NOMOR INDUK BERUSAHA'].NIB === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="Tidak Ada" ${data['NOMOR INDUK BERUSAHA'].NIB === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                    </div>
                    <div class="form-section">
                        <h4>Nomor Induk Berusaha</h4>
                        <div class="form-group">
                            <label for="edit_no_nib">No NIB</label>
                            <input type="text" id="edit_no_nib" value="${data['NOMOR INDUK BERUSAHA']?.['NO NIB'] || ''}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit_status">Status</label>
                        <select id="edit_status" required>
                            <option value="Aktif" ${data['NOMOR INDUK BERUSAHA'].STATUS === 'Aktif' ? 'selected' : ''}>Aktif</option>
                            <option value="Tidak Aktif" ${data['NOMOR INDUK BERUSAHA'].STATUS === 'Tidak Aktif' ? 'selected' : ''}>Tidak Aktif</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_SIUP">Status</label>
                        <select id="edit_SIUP" required>
                            <option value="Ada" ${data['PERIZINAN'].SIUP === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="Tidak Ada" ${data['PERIZINAN'].SIUP === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_TDP">Status</label>
                        <select id="edit_TDP" required>
                            <option value="Ada" ${data['PERIZINAN'].TDP === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="Tidak Ada" ${data['PERIZINAN'].TDP === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_HO">Status</label>
                        <select id="edit_HO" required>
                            <option value="Aktif" ${data['PERIZINAN'].HO === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="Tidak Aktif" ${data['PERIZINAN'].HO === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_iutm">IUTM</label>
                        <input type="text" id="edit_iutm" value="${data['IUTM'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_jenis_toko">Jenis Toko Modern</label>
                        <input type="text" id="edit_jenis_toko" value="${data['JENIS TOKO MODERN'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_komoditi">Komoditi/KBLI</label>
                        <input type="text" id="edit_komoditi" value="${data['KOMODITI atau KBLI'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_catatan">Catatan Perubahan</label>
                        <input type="text" id="edit_catatan" value="${data['CATATAN PERUBAHAN'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_keterangan">Keterangan</label>
                        <input type="text" id="edit_keterangan" value="${data['KETERANGAN'] || ''}" required>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            }  else if (table === 'tokoModernOSS') {
                form.innerHTML = `
                    <div class="form-section">
                        <h4>Nama dan Alamat Lokasi Tempat Usaha</h4>
                        <div class="form-group">
                            <label for="edit_nama_usaha">Nama</label>
                            <input type="text" id="edit_nama_usaha" value="${data['Nama dan Alamat Lokasi Tempat Usaha']?.Nama || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_alamat_usaha">Alamat</label>
                            <input type="text" id="edit_alamat_usaha" value="${data['Nama dan Alamat Lokasi Tempat Usaha']?.Alamat || ''}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>Nama dan Alamat Pemilik</h4>
                        <div class="form-group">
                            <label for="edit_nama_pemilik">Nama</label>
                            <input type="text" id="edit_nama_pemilik" value="${data['Nama dan Alamat Pemilik']?.Nama || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_alamat_pemilik">Alamat</label>
                            <input type="text" id="edit_alamat_pemilik" value="${data['Nama dan Alamat Pemilik']?.Alamat || ''}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>NIB</h4>
                        <div class="form-group">
                            <label for="edit_nib">NIB</label>
                            <select id="edit_nib" required>
                                <option value="Ada" ${data['NOMOR_INDUK_BERUSAHA_(NIB)'].NIB === 'ADA' ? 'selected' : ''}>ADA</option>
                                <option value="Tidak Ada" ${data['NOMOR_INDUK_BERUSAHA_(NIB)'].NIB === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit_nomor_nib">Nomor</label>
                            <input type="text" id="edit_nomor_nib" value="${data['NOMOR_INDUK_BERUSAHA_(NIB)']?.Nomor || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_status_nib">Status</label>
                            <select id="edit_status_nib" required>
                                <option value="Aktif" ${data['NOMOR_INDUK_BERUSAHA_(NIB)'].Status === 'Aktif' ? 'selected' : ''}>Aktif</option>
                                <option value="Tidak Aktif" ${data['NOMOR_INDUK_BERUSAHA_(NIB)'].Status === 'Tidak Aktif' ? 'selected' : ''}>Tidak Aktif</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit_no_telp">No Telp</label>
                        <input type="text" id="edit_no_telp" value="${data['No Telp'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_komoditi">Komoditi/KBLI</label>
                        <input type="text" id="edit_komoditi" value="${data['Komoditi atau KBLI'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_jenis_toko">Jenis Toko</label>
                        <input type="text" id="edit_jenis_toko" value="${data['Jenis Toko'] || ''}" required>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            } else if (table === 'tokoUMKM') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_toko_modern">Toko Modern</label>
                        <input type="text" id="edit_toko_modern" value="${data['Toko Modern'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <input type="text" id="edit_alamat" value="${data['Alamat'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_produk_umkm">Produk UMKM yang Dipasarkan</label>
                        <input type="text" id="edit_produk_umkm" value="${data['Produk UMKM yang Dipasarkan'] || ''}" required>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            }  else if (table === 'komoditasEkspor') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_komoditas">Komoditas</label>
                        <input type="text" id="edit_komoditas" value="${data['Komoditas'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_perusahaan">Perusahaan</label>
                        <input type="text" id="edit_perusahaan" value="${data['Perusahaan'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <input type="text" id="edit_alamat" value="${data['Alamat'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_negara_tujuan">Negara Tujuan</label>
                        <input type="text" id="edit_negara_tujuan" value="${data['Negara Tujuan'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_keterangan">Keterangan</label>
                        <input type="text" id="edit_keterangan" value="${data['Keterangan'] || ''}" required>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            }  else if (table === 'matrikaEkspor') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_barang_ekspor">Perusahaan</label>
                        <input type="text" id="edit_barang_ekspor" value="${data['Barang'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_perusahaan">Perusahaan</label>
                        <input type="text" id="edit_perusahaan" value="${data['Perusahaan'] || ''}" required>
                    </div>
                    <div class="form-section">
                        <h4>Produksi</h4>
                        <div class="form-group">
                            <label for="edit_produksi_kapasitas">Kapasitas</label>
                            <input type="text" id="edit_produksi_kapasitas" value="${data['Produksi']?.Kapasitas || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_produksi_satuan">Satuan</label>
                            <input type="text" id="edit_produksi_satuan" value="${data['Produksi']?.Satuan || ''}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>Ekspor</h4>
                        <div class="form-group">
                            <label for="edit_ekspor_kapasitas">Kapasitas</label>
                            <input type="text" id="edit_ekspor_kapasitas" value="${data['Ekspor']?.Kapasitas || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_ekspor_satuan">Satuan</label>
                            <input type="text" id="edit_ekspor_satuan" value="${data['Ekspor']?.Satuan || ''}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit_nilai_usd">Nilai (USD)</label>
                        <input type="text" id="edit_nilai_usd" value="${data['Nilai (usd)'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_negara_tujuan">Negara Tujuan</label>
                        <input type="text" id="edit_negara_tujuan" value="${data['Negara Tujuan'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_komoditas">Komoditas</label>
                        <input type="text" id="edit_komoditas" value="${data['Komoditas'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_keterangan">Keterangan</label>
                        <input type="text" id="edit_keterangan" value="${data['Keterangan'] || ''}" required>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            }  else if (table === 'disparitasHarga') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama_sampel">Nama Sampel Komoditi</label>
                        <input type="text" id="edit_nama_sampel" value="${data['Nama Sampel Komoditi'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_satuan">Satuan</label>
                        <input type="text" id="edit_satuan" value="${data['Satuan'] || ''}" required>
                    </div>
                    <div class="form-section">
                        <h4>Bulan n</h4>
                        <div class="form-group">
                            <label for="edit_wonosobo">Kabupaten Wonosobo</label>
                            <input type="text" id="edit_wonosobo" value="${data['Bulan n']?.['Kabupaten Wonosobo'] || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_temanggung">Kabupaten Temanggung</label>
                            <input type="text" id="edit_temanggung" value="${data['Bulan n']?.['Kabupaten Temanggung'] || ''}" required>
                        </div>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            }  else if (table === 'hasilPengawasan') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_kios">Kios Pupuk Lengkap</label>
                        <input type="text" id="edit_kios" value="${data['Kios Pupuk Lengkap'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_wilayah">Wilayah</label>
                        <input type="text" id="edit_wilayah" value="${data['Wilayah'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_nib">NIB</label>
                        <select id="edit_nib" required>
                            <option value="Ada" ${data['NOMOR_INDUK_BERUSAHA_(NIB)'] === 'Ada' ? 'selected' : ''}>Ada</option>
                            <option value="Tidak Ada" ${data['NOMOR_INDUK_BERUSAHA_(NIB)'] === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_het">Harga HET</label>
                        <select id="edit_het" required>
                            <option value="Ada" ${data['Harga HET'] === 'Ada' ? 'selected' : ''}>Ada</option>
                            <option value="Tidak Ada" ${data['HARGA HET'] === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_papan_nama">Papan Nama</label>
                        <select id="edit_papan_nama" required>
                            <option value="Ada" ${data['Papan Nama'] === 'Ada' ? 'selected' : ''}>Ada</option>
                            <option value="Tidak Ada" ${data['Papan Nama'] === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_spjb">SPJB</label>
                        <select id="edit_spjb" required>
                            <option value="Ada" ${data['SPJB'] === 'Ada' ? 'selected' : ''}>Ada</option>
                            <option value="Tidak Ada" ${data['SPJB'] === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_kartu_tani">Penyerapan Kartu Tani (%)</label>
                        <input type="text" id="edit_kartu_tani" value="${data['Penyerapan Kartu Tani (%)'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_rdkk">RDKK</label>
                        <select id="edit_rdkk" required>
                            <option value="Ada" ${data['RDKK'] === 'Ada' ? 'selected' : ''}>Ada</option>
                            <option value="Tidak Ada" ${data['RDKK'] === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_hasil">Hasil</label>
                        <select id="edit_hasil" required>
                            <option value="Memenuhi Syarat" ${data['Hasil'] === 'Memenuhi Syarat' ? 'selected' : ''}>Memenuhi Syarat</option>
                            <option value="Tidak Memenuhi Syarat" ${data['Hasil'] === 'Tidak Memenuhi Syarat' ? 'selected' : ''}>Tidak Memenuhi Syarat</option>
                        </select>
                    </div>
                    <button type="submit" class="submit-btn">Simpan Perubahan</button>
                `;
            }
            form.onsubmit = async (e) => {
                e.preventDefault();
                try {
                    const itemKey = form.getAttribute('data-key');
                    const currentTable = form.getAttribute('data-table');
                    const currentPath = getPathByTablePerdagangan(currentTable);
                    const updateRef = ref(db, `Bidang Perdagangan/${currentPath}/${itemKey}`);
                    
                    const updatedData = await getUpdatedDataByTablePerdagangan(currentTable);
                    await update(updateRef, updatedData);
                    
                    if (currentTable === 'teraKabWSB') {
                        await updateTeraKabWSBSummary(); // Tambahkan ini
                    }
                    
                    alert('Data berhasil diperbarui!');
                    editPopup.style.display = 'none';
                    loadBidangPerdagangan();
                } catch (error) {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan saat memperbarui data!');
                }
            };
            editPopup.style.display = 'block';
        } else {
            console.log('Data tidak ditemukan untuk key:', key);
        }
    }).catch((error) => {
        console.error('Error saat mengambil data:', error);
    });
}
 
async function getUpdatedDataByTablePerdagangan(table) {
    switch(table) {
        case 'pelayananTera':
            try {
                const form = document.getElementById('editDataForm');
                const itemKey = form.getAttribute('data-key');
                
                // Ambil data yang ada untuk menghitung total
                const refPath = ref(db, 'Bidang Perdagangan/Data Pelayanan Tera');
                const snapshot = await get(refPath);
                const existingData = snapshot.val() || {};
                
                // Data yang akan diupdate untuk item yang diedit
                const updatedItemData = {
                    'UTTP': document.getElementById('edit_uttp').value,
                    'Triwulan 1': document.getElementById('edit_triwulan1').value,
                    'Triwulan 2': document.getElementById('edit_triwulan2').value,
                    'Triwulan 3': document.getElementById('edit_triwulan3').value,
                    'Triwulan 4': document.getElementById('edit_triwulan4').value
                };
                
                // Hitung total untuk semua triwulan
                let totalTW1 = 0, totalTW2 = 0, totalTW3 = 0, totalTW4 = 0;
                
                // Loop melalui semua data kecuali Total dan Total Semua Layanan
                Object.entries(existingData).forEach(([key, value]) => {
                    if (key !== 'Total' && key !== 'Total Semua Layanan') {
                        if (key === itemKey) {
                            // Gunakan nilai baru untuk item yang sedang diedit
                            totalTW1 += parseInt(updatedItemData['Triwulan 1'] || 0);
                            totalTW2 += parseInt(updatedItemData['Triwulan 2'] || 0);
                            totalTW3 += parseInt(updatedItemData['Triwulan 3'] || 0);
                            totalTW4 += parseInt(updatedItemData['Triwulan 4'] || 0);
                        } else {
                            // Gunakan nilai yang ada untuk item lain
                            totalTW1 += parseInt(value['Triwulan 1'] || 0);
                            totalTW2 += parseInt(value['Triwulan 2'] || 0);
                            totalTW3 += parseInt(value['Triwulan 3'] || 0);
                            totalTW4 += parseInt(value['Triwulan 4'] || 0);
                        }
                    }
                });
                
                // Hitung total semua layanan
                const totalSemuaLayanan = totalTW1 + totalTW2 + totalTW3 + totalTW4;
                
                // Siapkan objek updates
                const updates = {};
                updates[itemKey] = updatedItemData;
                updates['Total'] = {
                    'Triwulan 1': totalTW1.toString(),
                    'Triwulan 2': totalTW2.toString(),
                    'Triwulan 3': totalTW3.toString(),
                    'Triwulan 4': totalTW4.toString()
                };
                updates['Total Semua Layanan'] = totalSemuaLayanan.toString();
                
                // Update database
                await update(refPath, updates);
                return updatedItemData;
            } catch (error) {
                console.error('Error updating pelayanan tera:', error);
                throw error;
            }
        case 'teraKabWSB':
            return {
                'Kecamatan': document.getElementById('edit_kecamatan').value,
                'Lokasi': document.getElementById('edit_lokasi').value,
                'UP': {
                    '1 m ≤ up ≤ 2 m': document.getElementById('edit_up1').value || '-',
                    'up ≤ 1 m': document.getElementById('edit_up2').value || '-'
                },
                'TAK': {
                    '5 l ≤  tb ≤ 25 l': document.getElementById('edit_tak1').value || '-',
                    'tb > 2 l': document.getElementById('edit_tak2').value || '-'
                },
                'ANAK TIMBANGAN': {
                    'Biasa': {
                        'atb ≤ 1 kg': document.getElementById('edit_atb1').value || '-',
                        '1 < atb ≤ 5 kg': document.getElementById('edit_atb2').value || '-',
                        '5 < atb ≤ 20 kg': document.getElementById('edit_atb3').value || '-'
                    },
                    'Halus': {
                        'atb ≤ 1 kg': document.getElementById('edit_atbh1').value || '-',
                        '1 < atb ≤ 5 kg': document.getElementById('edit_atbh2').value || '-',
                        '5 < atb ≤ 20 kg': document.getElementById('edit_atbh3').value || '-'
                    }
                },
                'TIMBANGAN': {
                    'DACIN LOGAM': {
                        'DL ≤ 25 kg': document.getElementById('edit_dl1').value || '-',
                        'DL > 25 kg': document.getElementById('edit_dl2').value || '-'
                    },
                    'SENTISIMAL': {
                        'S ≤ 150 kg': document.getElementById('edit_s1').value || '-',
                        '150 kg < S ≤ 500 kg': document.getElementById('edit_s2').value || '-'
                    },
                    'BOBOT INGSUT': {
                        'TBI ≤ 25 kg': document.getElementById('edit_tbi1').value || '-',
                        '25 kg < TBI ≤ 150 kg': document.getElementById('edit_tbi2').value || '-'
                    },
                    'PEGAS': {
                        'TP ≤ 25 kg': document.getElementById('edit_tp1').value || '-',
                        'TP > 25 kg': document.getElementById('edit_tp2').value || '-'
                    },
                    'MEJA': document.getElementById('edit_meja').value || '-',
                    'NERACA': document.getElementById('edit_neraca').value || '-',
                    'TE (II)': {
                        'TE ≤ 1 kg': document.getElementById('edit_te2_1').value || '-',
                        'TE > 1 kg': document.getElementById('edit_te2_2').value || '-'
                    },
                    'TE (III & IV)': {
                        '25 < kg TE ≤ 25 kg': document.getElementById('edit_te34_1').value || '-',
                        '25 < kg TE ≤ 150 kg': document.getElementById('edit_te34_2').value || '-',
                        '25 < kg TE ≤ 500 kg': document.getElementById('edit_te34_3').value || '-'
                    }
                },
                'Alat Ukur Tinggi Orang': document.getElementById('edit_alatUkur').value || '-',
                'TEB 1000 KG': document.getElementById('edit_teb').value || '-',
                'Jumlah Total UTTP': (() => {
                    let total = 0;
                    const inputIds = [
                        'edit_up1', 'edit_up2',                     // UP
                        'edit_tak1', 'edit_tak2',                   // TAK
                        'edit_atb1', 'edit_atb2', 'edit_atb3',     // Anak Timbangan Biasa
                        'edit_atbh1', 'edit_atbh2', 'edit_atbh3',  // Anak Timbangan Halus
                        'edit_dl1', 'edit_dl2',                     // Dacin Logam
                        'edit_s1', 'edit_s2',                       // Sentisimal
                        'edit_tbi1', 'edit_tbi2',                   // Bobot Ingsut
                        'edit_tp1', 'edit_tp2',                     // Timbangan Pegas
                        'edit_meja', 'edit_neraca',                 // Timbangan Lainnya
                        'edit_te2_1', 'edit_te2_2',                 // TE II
                        'edit_te34_1', 'edit_te34_2', 'edit_te34_3', // TE III & IV
                        'edit_alatUkur', 'edit_teb'                 // Lainnya
                    ];
                    inputIds.forEach(id => {
                        const value = document.getElementById(id).value;
                        if (value && value !== '-') {
                            total += parseInt(value) || 0;
                        }
                    });
                    return total.toString();
                })()
            };
        case 'marketplace':
            return {
                'Nama Marketplace': document.getElementById('edit_nama_marketplace').value,
                'Tahun n-2': document.getElementById('edit_tahun_n2').value,
                'Tahun n-1': document.getElementById('edit_tahun_n1').value,
                'Tahun n': {
                    'Triwuan 1': document.getElementById('edit_triwulan1').value,
                    'Triwuan 2': document.getElementById('edit_triwulan2').value,
                    'Triwuan 3': document.getElementById('edit_triwulan3').value,
                    'Triwuan 4': document.getElementById('edit_triwulan4').value
                },
                'Keterangan': document.getElementById('edit_keterangan').value
            };
        case 'tokoModern':
            return {
                'TANGGAL SK': document.getElementById('edit_tanggal_sk').value,
                'NAMA DAN ALAMAT LOKASI TEMPAT USAHA': {
                    'NAMA': document.getElementById('edit_nama_usaha').value,
                    'ALAMAT': document.getElementById('edit_alamat_usaha').value
                },
                'NAMA DAN ALAMAT PEMILIK': {
                    'NAMA': document.getElementById('edit_nama_pemilik').value,
                    'ALAMAT': document.getElementById('edit_alamat_pemilik').value
                },
                'NOMOR INDUK BERUSAHA': {
                    'NO NIB': document.getElementById('edit_no_nib').value,
                    'NO NIB': document.getElementById('edit_no_nib').value,
                    'STATUS': document.getElementById('edit_status').value
                },
                'PERIZINAN':{
                    'HO': document.getElementById('edit_HO').value,
                    'SIUP': document.getElementById('edit_SIUP').value,
                    'TDP': document.getElementById('edit_TDP').value
                },
                'IUTM': document.getElementById('edit_iutm').value,
                'JENIS TOKO MODERN': document.getElementById('edit_jenis_toko').value,
                'KOMODITI atau KBLI': document.getElementById('edit_komoditi').value,
                'CATATAN PERUBAHAN': document.getElementById('edit_catatan').value,
                'KETERANGAN': document.getElementById('edit_keterangan').value
            };
        case 'tokoModernOSS':
           return {
               'Nama dan Alamat Lokasi Tempat Usaha': {
                   'Nama': document.getElementById('edit_nama_usaha').value,
                   'Alamat': document.getElementById('edit_alamat_usaha').value
               },
               'Nama dan Alamat Pemilik': {
                   'Nama': document.getElementById('edit_nama_pemilik').value,
                   'Alamat': document.getElementById('edit_alamat_pemilik').value
               },
               'NOMOR_INDUK_BERUSAHA_(NIB)': {
                   'NIB': document.getElementById('edit_nib').value,
                   'Nomor': document.getElementById('edit_nomor_nib').value,
                   'Status': document.getElementById('edit_status_nib').value
               },
               'No Telp': document.getElementById('edit_no_telp').value,
               'Komoditi atau KBLI': document.getElementById('edit_komoditi').value,
               'Jenis Toko': document.getElementById('edit_jenis_toko').value
           };
        case 'tokoUMKM':
           return {
               'Toko Modern': document.getElementById('edit_toko_modern').value,
               'Alamat': document.getElementById('edit_alamat').value,
               'Produk UMKM yang Dipasarkan': document.getElementById('edit_produk_umkm').value
           };
        case 'komoditasEkspor':
           return {
               'Komoditas': document.getElementById('edit_komoditas').value,
               'Perusahaan': document.getElementById('edit_perusahaan').value,
               'Alamat': document.getElementById('edit_alamat').value,
               'Negara Tujuan': document.getElementById('edit_negara_tujuan').value,
               'Keterangan': document.getElementById('edit_keterangan').value
           };
        case 'matrikaEkspor':
            return {
                'Barang': document.getElementById('edit_barang_ekspor').value,
                'Perusahaan': document.getElementById('edit_perusahaan').value,
                'Produksi': {
                    'Kapasitas': document.getElementById('edit_produksi_kapasitas').value,
                    'Satuan': document.getElementById('edit_produksi_satuan').value
                },
                'Ekspor': {
                    'Kapasitas': document.getElementById('edit_ekspor_kapasitas').value,
                    'Satuan': document.getElementById('edit_ekspor_satuan').value
                },
                'Nilai (usd)': document.getElementById('edit_nilai_usd').value,
                'Negara Tujuan': document.getElementById('edit_negara_tujuan').value,
                'Komoditas': document.getElementById('edit_komoditas').value,
                'Keterangan': document.getElementById('edit_keterangan').value
            };
        case 'disparitasHarga':
                try {
                    // Fung untuk mengubah string harga ke number
                const parseHarga = (hargaStr) => {
                    return parseInt(hargaStr.replace(/\D/g, ''));
                };
                
                // Fungsi untuk memformat harga ke format Rupiah
                const formatHarga = (number) => {
                    return `RP. ${Math.abs(number)}`;
                };
                
                // Ambil nilai harga dari input
                const hargaWonosobo = document.getElementById('edit_wonosobo').value;
                const hargaTemanggung = document.getElementById('edit_temanggung').value;
                
                // Konversi ke number untuk perhitungan
                const hargaWsb = parseHarga(hargaWonosobo);
                const hargaTmg = parseHarga(hargaTemanggung);
                
                // Hitung selisih (Temanggung - Wonosobo)
                const selisih = hargaTmg - hargaWsb;
                
                // Hitung persentase
                const persen = ((selisih / hargaTmg) * 100).toFixed(0);
                
                return {
                    'Nama Sampel Komoditi': document.getElementById('edit_nama_sampel').value,
                    'Satuan': document.getElementById('edit_satuan').value,
                    'Bulan n': {
                        'Kabupaten Wonosobo': hargaWonosobo,
                        'Kabupaten Temanggung': hargaTemanggung
                    },
                    'Selisih': selisih >= 0 ? formatHarga(selisih) : `-${formatHarga(selisih)}`,
                    'Persen': `${persen}%`
                };
            } catch (error) {
                console.error('Error updating disparitas harga:', error);
                throw error;
            }
        case 'hasilPengawasan':
           return {
               'Kios Pupuk Lengkap': document.getElementById('edit_kios').value,
               'Wilayah': document.getElementById('edit_wilayah').value,
               'NOMOR_INDUK_BERUSAHA_(NIB)': document.getElementById('edit_nib').value,
               'Harga HET': document.getElementById('edit_het').value,
               'Papan Nama': document.getElementById('edit_papan_nama').value,
               'SPJB': document.getElementById('edit_spjb').value,
               'Penyerapan Kartu Tani (%)': document.getElementById('edit_kartu_tani').value,
               'RDKK': document.getElementById('edit_rdkk').value,
               'Hasil': document.getElementById('edit_hasil').value
           };
        default:
           return {};
   }
}

window.deleteDataPerdagangan = async function(key, table) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            const deleteRef = ref(db, `Bidang Perdagangan/${getPathByTablePerdagangan(table)}/${key}`);
            await remove(deleteRef);
            
            if (table === 'teraKabWSB') {
                await updateTeraKabWSBSummary(); // Tambahkan ini
            }
            
            alert('Data berhasil dihapus!');
            loadBidangPerdagangan();
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus data!');
        }
    }
};

// Fungsi helper untuk mendapatkan path database berdasarkan tabel
function getPathByTablePerdagangan(table) {
    switch(table) {
        case 'pelayananTera':
            return 'Data Pelayanan Tera';
        case 'teraKabWSB':
            return 'Data Semua Tera Kab WSB';
        case 'marketplace':
            return 'Data Marketplace Lokal';
        case 'tokoModern':
            return 'Data Toko Modern';
        case 'tokoModernOSS':
            return 'Data Toko Modern OSS';
        case 'tokoUMKM':
            return 'Data Toko Modern Memasarkan UMKM';
        case 'komoditasEkspor':
            return 'Komoditas Ekspor';
        case 'matrikaEkspor':
            return 'Matrika Ekspor';
        case 'disparitasHarga':
            return 'Disparitas Harga';
        case 'hasilPengawasan':
            return 'Hasil Pengawasan';
        default:
            console.error('Table tidak dikenali:', table);
            return '';
    }
} 

async function updateTeraKabWSBSummary() {
    const teraKabWSBRef = ref(db, 'Bidang Perdagangan/Data Semua Tera Kab WSB');
    const snapshot = await get(teraKabWSBRef);
    
    if (snapshot.exists()) {
        const data = snapshot.val();
        let totalKeseluruhan = 0;

        // Hitung total dari setiap entri
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah Keseluruhan' && value['Jumlah Total UTTP'] && value['Jumlah Total UTTP'] !== '-') {
                totalKeseluruhan += parseInt(value['Jumlah Total UTTP']);
            }
        });

        // Update Jumlah Keseluruhan
        const summaryRef = ref(db, 'Bidang Perdagangan/Data Semua Tera Kab WSB/Jumlah Keseluruhan');
        await set(summaryRef, totalKeseluruhan.toString());
    }
}

function loadBidangPasar() {
    const bidangPasarRef = ref(db, 'Bidang Pasar');
    
    onValue(bidangPasarRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Ambil data kondisi pasar
            const kondisiPasarData = data['Data Kondisi Pasar'] ? 
                Object.entries(data['Data Kondisi Pasar']).map(([key, value]) => ({
                    id: key,
                    ...value
                })) : [];

            // Ambil data los kios pasar
            const losKiosData = data['Data Los Kios Pasar'] ? 
                Object.entries(data['Data Los Kios Pasar'])
                    .filter(([key]) => key !== 'Jumlah')
                    .map(([key, value]) => ({
                        id: key,
                        ...value
                    })) : [];

            const profilData = data['Matriks Profil Pasar'] ? 
                Object.entries(data['Matriks Profil Pasar'])
                    .filter(([key]) => key !== 'Jumlah')  // Filter out summary data
                    .map(([key, value]) => ({
                        id: key,
                        ...value
                    })) : [];

            renderKondisiPasarTable(kondisiPasarData);
            renderLosKiosTable(losKiosData, data['Data Los Kios Pasar']?.Jumlah);
            renderProfilTable(profilData, data['Matriks Profil Pasar']?.Jumlah);
        }
    });
}

function renderKondisiPasarTable(data) {
    const tbody = document.getElementById('kondisiPasarBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let no = 1;

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Nama Pasar'] || ''}</td>
            <td>${item.Fasilitas?.['Areal Parkir'] || ''}</td>
            <td>${item.Fasilitas?.TPS || ''}</td>
            <td>${item.Fasilitas?.MCK || ''}</td>
            <td>${item.Fasilitas?.['Tempat Ibadah'] || ''}</td>
            <td>${item.Fasilitas?.['Bongkar Muat'] || ''}</td>
            <td>${item.kondisi?.Baik || ''}</td>
            <td>${item.kondisi?.['Tidak Baik'] || ''}</td>
            <td>${item.kondisi?.['Perlu Penyempurnaan'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPasar('${item.id}', 'kondisiPasar')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPasar('${item.id}', 'kondisiPasar')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderLosKiosTable(data, summary) {
    const tbody = document.getElementById('losKiosBody');
    const tfoot = document.getElementById('losKiosFooter');
    if (!tbody || !tfoot) return;
    
    tbody.innerHTML = '';
    let no = 1;

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['Nama Pasar'] || ''}</td>
            <td>${item['Alamat Lengkap'] || ''}</td>
            <td>${item['Jumlah LosKios']?.los || 0}</td>
            <td>${item['Jumlah LosKios']?.kios || 0}</td>
            <td>${item['Jumlah Pedagang']?.los || 0}</td>
            <td>${item['Jumlah Pedagang']?.kios || 0}</td>
            <td>${item['Jumlah Tidak Termanfaatkan']?.los || 0}</td>
            <td>${item['Jumlah Tidak Termanfaatkan']?.kios || 0}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPasar('${item.id}', 'losKios')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPasar('${item.id}', 'losKios')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    if (summary) {
        tfoot.innerHTML = `
            <tr>
                <td colspan="3">Total</td>
                <td>${summary['Jumlah LosKios']?.los || 0}</td>
                <td>${summary['Jumlah LosKios']?.kios || 0}</td>
                <td>${summary['Jumlah Pedagang']?.los || 0}</td>
                <td>${summary['Jumlah Pedagang']?.kios || 0}</td>
                <td>${summary['Jumlah Tidak Termanfaatkan']?.los || 0}</td>
                <td>${summary['Jumlah Tidak Termanfaatkan']?.kios || 0}</td>
                <td></td>
            </tr>
        `;
    }
}

function renderProfilTable(data, summary) {
    const tbody = document.getElementById('profilBody');
    const tfoot = document.getElementById('profilFooter');
    if (!tbody || !tfoot) return;
    
    tbody.innerHTML = '';
    let no = 1;

    // Filter data untuk memisahkan data utama dengan data jumlah
    const mainData = data.filter(item => item.id !== 'Jumlah');
    
    mainData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${item['UPT'] || ''}</td>
            <td>${item['Nama Pasar'] || ''}</td>
            <td>${item['Jumlah Paguyuban Pedagang'] || 0}</td>
            <td>${item['Alamat'] || ''}</td>
            <td>${item['Tahun Berdiri'] || ''}</td>
            <td>${item['Luas']?.tanah || 0}</td>
            <td>${item['Luas']?.bangunan || 0}</td>
            <td>${item['Luas']?.lantai || 0}</td>
            <td>${item['Jumlah']?.los || 0}</td>
            <td>${item['Jumlah']?.kios || 0}</td>
            <td>${item['Jumlah']?.dasaran || 0}</td>
            <td>${item['Jumlah Pedagang']?.los || 0}</td>
            <td>${item['Jumlah Pedagang']?.kios || 0}</td>
            <td>${item['Jumlah Pedagang']?.dasaran || 0}</td>
            <td>${item['Fasilitas']?.['Areal Parkir'] || '-'}</td>
            <td>${item['Fasilitas']?.TPS || '-'}</td>
            <td>${item['Fasilitas']?.MCK || '-'}</td>
            <td>${item['Fasilitas']?.['Tempat Ibadah'] || '-'}</td>
            <td>${item['Fasilitas']?.['Bongkar Muat'] || '-'}</td>
            <td>${item['Keterangan'] || ''}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editDataPasar('${item.id}', 'profil')" class="edit-btn">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button onclick="deleteDataPasar('${item.id}', 'profil')" class="delete-btn">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    if (summary) {
        tfoot.innerHTML = `
            <tr>
                <td colspan="2">Jumlah</td>
                <td colspan="7">${summary['Total Pasar'] || 'Total'}</td>
                <td>${summary['Jumlah']?.los || 0}</td>
                <td>${summary['Jumlah']?.kios || 0}</td>
                <td>${summary['Jumlah']?.dasaran || 0}</td>
                <td>${summary['Jumlah Pedagang']?.los || 0}</td>
                <td>${summary['Jumlah Pedagang']?.kios || 0}</td>
                <td>${summary['Jumlah Pedagang']?.dasaran || 0}</td>
                <td colspan="7"></td>
            </tr>
        `;
    }
}

let currentTable = '';

function openAddDataPopup(table) {
    currentTable = table;
    const form = document.getElementById('addDataForm');
    form.innerHTML = '';

    //form Perdagangan
    if (table === 'pelayananTera') {
        form.innerHTML = `
            <div class="form-group">
                <label for="UTTP">UTTP</label>
                <input type="text" id="UTTP" required>
            </div>
            <div class="form-group">
                <label for="triwulan1">Triwulan 1</label>
                <input type="number" id="triwulan1" required>
            </div>
            <div class="form-group">
                <label for="triwulan2">Triwulan 2</label>
                <input type="number" id="triwulan2" required>
            </div>
            <div class="form-group">
                <label for="triwulan3">Triwulan 3</label>
                <input type="number" id="triwulan3" required>
            </div>
            <div class="form-group">
                <label for="triwulan4">Triwulan 4</label>
                <input type="number" id="triwulan4" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'marketplace') {
        form.innerHTML = `
            <div class="form-group">
                <label for="namaMarketplace">Nama Marketplace</label>
                <input type="text" id="namaMarketplace" required>
            </div>
            <div class="form-group">
                <label for="tahunN2">Tahun n-2</label>
                <input type="text" id="tahunN2" placeholder="RP. " required>
            </div>
            <div class="form-group">
                <label for="tahunN1">Tahun n-1</label>
                <input type="text" id="tahunN1" placeholder="RP. " required>
            </div>
            <div class="form-group">
                <label for="triwulan1">Triwulan 1</label>
                <input type="text" id="triwulan1" placeholder="RP. " required>
            </div>
            <div class="form-group">
                <label for="triwulan2">Triwulan 2</label>
                <input type="text" id="triwulan2" placeholder="RP. " required>
            </div>
            <div class="form-group">
                <label for="triwulan3">Triwulan 3</label>
                <input type="text" id="triwulan3" placeholder="RP. " required>
            </div>
            <div class="form-group">
                <label for="triwulan4">Triwulan 4</label>
                <input type="text" id="triwulan4" placeholder="RP. " required>
            </div>
            <div class="form-group">
                <label for="keterangan">Keterangan</label>
                <textarea id="keterangan" required></textarea>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'teraKabWSB') {
        form.innerHTML = `
            <div class="form-group">
                <label for="kecamatan">Kecamatan</label>
                <input type="text" id="kecamatan" required>
            </div>
            <div class="form-group">
                <label for="lokasi">Lokasi</label>
                <input type="text" id="lokasi" required>
            </div>
            
            <div class="form-section">
                <h3>UP (Ukuran Panjang)</h3>
                <div class="form-group">
                    <label for="up1">1 m ≤ up ≤ 2 m</label>
                    <input type="number" id="up1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="up2">up ≤ 1 m</label>
                    <input type="number" id="up2" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>TAK (Takaran)</h3>
                <div class="form-group">
                    <label for="tak1">5 l ≤ tb ≤ 25 l</label>
                    <input type="number" id="tak1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="tak2">tb > 2 l</label>
                    <input type="number" id="tak2" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Anak Timbangan Biasa</h3>
                <div class="form-group">
                    <label for="atb1">atb ≤ 1 kg</label>
                    <input type="number" id="atb1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="atb2">1 < atb ≤ 5 kg</label>
                    <input type="number" id="atb2" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="atb3">5 < atb ≤ 20 kg</label>
                    <input type="number" id="atb3" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Anak Timbangan Halus</h3>
                <div class="form-group">
                    <label for="atbh1">atb ≤ 1 kg</label>
                    <input type="number" id="atbh1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="atbh2">1 < atb ≤ 5 kg</label>
                    <input type="number" id="atbh2" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="atbh3">5 < atb ≤ 20 kg</label>
                    <input type="number" id="atbh3" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Dacin Logam</h3>
                <div class="form-group">
                    <label for="dl1">DL ≤ 25 kg</label>
                    <input type="number" id="dl1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="dl2">DL > 25 kg</label>
                    <input type="number" id="dl2" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Sentisimal</h3>
                <div class="form-group">
                    <label for="s1">S ≤ 150 kg</label>
                    <input type="number" id="s1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="s2">150 kg < S ≤ 500 kg</label>
                    <input type="number" id="s2" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Bobot Ingsut</h3>
                <div class="form-group">
                    <label for="tbi1">TBI ≤ 25 kg</label>
                    <input type="number" id="tbi1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="tbi2">25 kg < TBI ≤ 150 kg</label>
                    <input type="number" id="tbi2" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Timbangan Pegas</h3>
                <div class="form-group">
                    <label for="tp1">TP ≤ 25 kg</label>
                    <input type="number" id="tp1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="tp2">TP > 25 kg</label>
                    <input type="number" id="tp2" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Timbangan Lainnya</h3>
                <div class="form-group">
                    <label for="meja">Meja</label>
                    <input type="number" id="meja" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="neraca">Neraca</label>
                    <input type="number" id="neraca" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Timbangan Elektronik II</h3>
                <div class="form-group">
                    <label for="te2_1">TE ≤ 1 kg</label>
                    <input type="number" id="te2_1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="te2_2">TE > 1 kg</label>
                    <input type="number" id="te2_2" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Timbangan Elektronik III & IV</h3>
                <div class="form-group">
                    <label for="te34_1">TE ≤ 25 kg</label>
                    <input type="number" id="te34_1" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="te34_2">25 kg < TE ≤ 150 kg</label>
                    <input type="number" id="te34_2" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="te34_3">150 kg < TE ≤ 500 kg</label>
                    <input type="number" id="te34_3" placeholder="-">
                </div>
            </div>

            <div class="form-section">
                <h3>Lainnya</h3>
                <div class="form-group">
                    <label for="alatUkur">Alat Ukur Tinggi Orang</label>
                    <input type="number" id="alatUkur" placeholder="-">
                </div>
                <div class="form-group">
                    <label for="teb">TEB 1000 KG</label>
                    <input type="number" id="teb" placeholder="-">
                </div>
            </div>

            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'tokoModern') {
        form.innerHTML = `
            <div class="form-group">
                <label for="tanggalSK">Tanggal SK</label>
                <input type="date" id="tanggalSK" required>
            </div>
            <div class="form-section">
                <h3>Nama dan Alamat Lokasi Tempat Usaha</h3>
                <div class="form-group">
                    <label for="namaUsaha">Nama</label>
                    <input type="text" id="namaUsaha" required>
                </div>
                <div class="form-group">
                    <label for="alamatUsaha">Alamat</label>
                    <textarea id="alamatUsaha" required></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3>Nama dan Alamat Pemilik</h3>
                <div class="form-group">
                    <label for="namaPemilik">Nama</label>
                    <input type="text" id="namaPemilik" required>
                </div>
                <div class="form-group">
                    <label for="alamatPemilik">Alamat</label>
                    <textarea id="alamatPemilik" required></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3>Nomor Induk Berusaha</h3>
                <div class="form-group">
                    <label>NIB</label>
                    <select id="statusNIB" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="nomorNIB">Nomor NIB</label>
                    <input type="text" id="nomorNIB">
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" required>
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <h3>Perizinan</h3>
                <div class="form-group">
                    <label>SIUP</label>
                    <select id="SIUP" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>TDP</label>
                    <select id="TDP" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>HO</label>
                    <select id="HO" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'tokoModernOSS') {
        form.innerHTML = `
            <div class="form-section">
                <h3>Nama dan Alamat Lokasi Tempat Usaha</h3>
                <div class="form-group">
                    <label for="namaUsaha">Nama</label>
                    <input type="text" id="namaUsaha" required>
                </div>
                <div class="form-group">
                    <label for="alamatUsaha">Alamat</label>
                    <textarea id="alamatUsaha" required></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3>Nama dan Alamat Pemilik</h3>
                <div class="form-group">
                    <label for="namaPemilik">Nama</label>
                    <input type="text" id="namaPemilik" required>
                </div>
                <div class="form-group">
                    <label for="alamatPemilik">Alamat</label>
                    <textarea id="alamatPemilik" required></textarea>
                </div>
            </div>
            <div class="form-section">
                <h3>NIB</h3>
                <div class="form-group">
                    <label>Status NIB</label>
                    <select id="statusNIB" required>
                        <option value="Ada">Ada</option>
                        <option value="Tidak Ada">Tidak Ada</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="nomorNIB">Nomor NIB</label>
                    <input type="text" id="nomorNIB">
                </div>
                <div class="form-group">
                    <label for="statusNIBActive">Status</label>
                    <select id="statusNIBActive" required>
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="noTelp">No Telp</label>
                <input type="text" id="noTelp" required>
            </div>
            <div class="form-group">
                <label for="komoditi">Komoditi/KBLI</label>
                <input type="text" id="komoditi" required>
            </div>
            <div class="form-group">
                <label for="jenisToko">Jenis Toko</label>
                <input type="text" id="jenisToko" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'tokoUMKM') {
        form.innerHTML = `
            <div class="form-group">
                <label for="tokoModern">Toko Modern</label>
                <input type="text" id="tokoModern" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="produkUMKM">Produk UMKM yang Dipasarkan</label>
                <input type="text" id="produkUMKM" required>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'komoditasEkspor') {
        form.innerHTML = `
            <div class="form-group">
                <label for="komoditas">Komoditas</label>
                <input type="text" id="komoditas" required>
            </div>
            <div class="form-group">
                <label for="perusahaan">Perusahaan</label>
                <input type="text" id="perusahaan" required>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" required></textarea>
            </div>
            <div class="form-group">
                <label for="negaraTujuan">Negara Tujuan</label>
                <input type="text" id="negaraTujuan" required>
            </div>
            <div class="form-group">
                <label for="keterangan">Keterangan</label>
                <textarea id="keterangan" required></textarea>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'matrikaEkspor') {
        form.innerHTML = `
            <div class="form-group">
                <label for="barangEkspor">Barang Ekspor</label>
                <input type="text" id="barangEkspor" required>
            </div>
            <div class="form-group">
                <label for="perusahaan">Perusahaan</label>
                <input type="text" id="perusahaan" required>
            </div>
            <div class="form-section">
                <h3>Produksi</h3>
                <div class="form-group">
                    <label for="produksiKapasitas">Kapasitas</label>
                    <input type="number" id="produksiKapasitas" required>
                </div>
                <div class="form-group">
                    <label for="produksiSatuan">Satuan</label>
                    <input type="text" id="produksiSatuan" required>
                </div>
            </div>
            <div class="form-section">
                <h3>Ekspor</h3>
                <div class="form-group">
                    <label for="eksporKapasitas">Kapasitas</label>
                    <input type="number" id="eksporKapasitas" required>
                </div>
                <div class="form-group">
                    <label for="eksporSatuan">Satuan</label>
                    <input type="text" id="eksporSatuan" required>
                </div>
            </div>
            <div class="form-group">
                <label for="nilaiUSD">Nilai (USD)</label>
                <input type="text" id="nilaiUSD" placeholder="$ " required>
            </div>
            <div class="form-group">
                <label for="negaraTujuan">Negara Tujuan</label>
                <input type="text" id="negaraTujuan" required>
            </div>
            <div class="form-group">
                <label for="komoditas">Komoditas</label>
                <input type="text" id="komoditas" required>
            </div>
            <div class="form-group">
                <label for="keterangan">Keterangan</label>
                <textarea id="keterangan" required></textarea>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    } else if (table === 'disparitasHarga') {
        form.innerHTML = `
            <div class="form-group">
                <label for="namaKomoditi">Nama Sampel Komoditi</label>
                <input type="text" id="namaKomoditi" required>
            </div>
            <div class="form-group">
                <label for="satuan">Satuan</label>
                <input type="text" id="satuan" required>
            </div>
            <div class="form-group">
                <label for="hargaWonosobo">Harga Kabupaten Wonosobo</label>
                <div class="input-group">
                    <input type="text" 
                           id="hargaWonosobo" 
                           required 
                           class="currency-input"
                           placeholder="Masukkan harga">
                </div>
            </div>
            <div class="form-group">
                <label for="hargaTemanggung">Harga Kabupaten Temanggung</label>
                <div class="input-group">
                    <input type="text" 
                           id="hargaTemanggung" 
                           required 
                           class="currency-input"
                           placeholder="Masukkan harga">
                </div>
            </div>
            <button type="submit">Tambah Data</button>
        `;

        const formatCurrency = (input) => {
            let value = input.value.replace(/\D/g, '');
            if (value) {
                value = `RP. ${value}`;
            }
            input.value = value;
        };
        const currencyInputs = document.querySelectorAll('.currency-input');
        currencyInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^\d]/g, '');
            });
            input.addEventListener('blur', (e) => {
                formatCurrency(e.target);
            });
            input.addEventListener('focus', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        });
    } else if (table === 'hasilPengawasan') {
        form.innerHTML = `
            <div class="form-group">
                <label for="kiosPupuk">Kios Pupuk Lengkap</label>
                <input type="text" id="kiosPupuk" required>
            </div>
            <div class="form-group">
                <label for="wilayah">Wilayah</label>
                <input type="text" id="wilayah" required>
            </div>
            <div class="form-group">
                <label for="nib">NIB</label>
                <select id="nib" required>
                    <option value="Ada">Ada</option>
                    <option value="Tidak Ada">Tidak Ada</option>
                </select>
            </div>
            <div class="form-group">
                <label for="hargaHET">Harga HET</label>
                <select id="hargaHET" required>
                    <option value="Ada">Ada</option>
                    <option value="Tidak Ada">Tidak Ada</option>
                </select>
            </div>
            <div class="form-group">
                <label for="papanNama">Papan Nama</label>
                <select id="papanNama" required>
                    <option value="Ada">Ada</option>
                    <option value="Tidak Ada">Tidak Ada</option>
                </select>
            </div>
            <div class="form-group">
                <label for="spjb">SPJB</label>
                <select id="spjb" required>
                    <option value="Ada">Ada</option>
                    <option value="Tidak Ada">Tidak Ada</option>
                </select>
            </div>
            <div class="form-group">
                <label for="penyerapanKartuTani">Penyerapan Kartu Tani (%)</label>
                <input type="number" id="penyerapanKartuTani" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="rdkk">RDKK</label>
                <select id="rdkk" required>
                    <option value="Ada">Ada</option>
                    <option value="Tidak Ada">Tidak Ada</option>
                </select>
            </div>
            <div class="form-group">
                <label for="hasil">Hasil</label>
                <select id="hasil" required>
                    <option value="Memenuhi Syarat">Memenuhi Syarat</option>
                    <option value="Tidak Memenuhi Syarat">Tidak Memenuhi Syarat</option>
                </select>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    }
    
    //form Pasar
    else if (table === 'kondisiPasar') {
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
                    <select id="Areal Parkir" required>
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
                    <select id="Tempat Ibadah" required>
                        <option value="ADA">ADA</option>
                        <option value="TIDAK ADA">TIDAK ADA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Bongkar Muat:</label>
                    <select id="Bongkar Muat" required>
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
    } 
    
    //form Koperasi
    else if (table === 'pelakuUKM') {
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
            <div class="form-group">
                <label for="triwulan">Triwulan</label>
                <select id="triwulan" required>
                    <option value="Triwulan 1">Triwulan 1</option>
                    <option value="Triwulan 2">Triwulan 2</option>
                    <option value="Triwulan 3">Triwulan 3</option>
                    <option value="Triwulan 4">Triwulan 4</option>
                </select>
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
            <div class="form-group">
                <label for="triwulan">Triwulan</label>
                <select id="triwulan" required>
                    <option value="Triwulan 1">Triwulan 1</option>
                    <option value="Triwulan 2">Triwulan 2</option>
                    <option value="Triwulan 3">Triwulan 3</option>
                    <option value="Triwulan 4">Triwulan 4</option>
                </select>
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
            <div class="form-group">
                <label for="triwulan">Triwulan</label>
                <select id="triwulan" required>
                    <option value="Triwulan 1">Triwulan 1</option>
                    <option value="Triwulan 2">Triwulan 2</option>
                    <option value="Triwulan 3">Triwulan 3</option>
                    <option value="Triwulan 4">Triwulan 4</option>
                </select>
            </div>
            <button type="submit">Tambah Data</button>
        `;
    }
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
            <div class="form-group">
                <label for="triwulan">Triwulan</label>
                <select id="triwulan" required>
                    <option value="Triwulan 1">Triwulan 1</option>
                    <option value="Triwulan 2">Triwulan 2</option>
                    <option value="Triwulan 3">Triwulan 3</option>
                    <option value="Triwulan 4">Triwulan 4</option>
                </select>
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
            <div class="form-group">
                <label for="triwulan">Triwulan</label>
                <select id="triwulan" required>
                    <option value="Triwulan 1">Triwulan 1</option>
                    <option value="Triwulan 2">Triwulan 2</option>
                    <option value="Triwulan 3">Triwulan 3</option>
                    <option value="Triwulan 4">Triwulan 4</option>
                </select>
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
            <div class="form-group">
                <label for="triwulan">Triwulan</label>
                <select id="triwulan" required>
                    <option value="Triwulan 1">Triwulan 1</option>
                    <option value="Triwulan 2">Triwulan 2</option>
                    <option value="Triwulan 3">Triwulan 3</option>
                    <option value="Triwulan 4">Triwulan 4</option>
                </select>
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
            <div class="form-group">
                <label for="bulan">Bulan</label>
                <input type="month" id="bulan" required>
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

// Fungsi edit untuk kondisi pasar
window.editDataPasar = function(key, table) {
    const editPopup = document.getElementById('editDataPopup');
    const form = document.getElementById('editDataForm');
    
    const path = getPathByTablePasar(table);
    if (!path) {
        console.error('Path tidak valid untuk table:', table);
        return;
    }
    
    const dataRef = ref(db, `Bidang Pasar/${path}/${key}`);
    get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            form.setAttribute('data-key', key);
            form.setAttribute('data-table', table);
            
            if (table === 'kondisiPasar') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_namaPasar">Nama Pasar</label>
                        <input type="text" id="edit_namaPasar" value="${data['Nama Pasar'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Fasilitas:</label>
                        <select id="edit_arealParkir" required>
                            <option value="">Pilih Areal Parkir</option>
                            <option value="ADA" ${data.Fasilitas?.['Areal Parkir'] === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="TIDAK ADA" ${data.Fasilitas?.['Areal Parkir'] === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_TPS" required>
                            <option value="">Pilih TPS</option>
                            <option value="ADA" ${data.Fasilitas?.TPS === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="TIDAK ADA" ${data.Fasilitas?.TPS === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_MCK" required>
                            <option value="">Pilih MCK</option>
                            <option value="ADA" ${data.Fasilitas?.MCK === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="TIDAK ADA" ${data.Fasilitas?.MCK === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_tempatIbadah" required>
                            <option value="">Pilih Tempat Ibadah</option>
                            <option value="ADA" ${data.Fasilitas?.['Tempat Ibadah'] === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="TIDAK ADA" ${data.Fasilitas?.['Tempat Ibadah'] === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                        <select id="edit_bongkarMuat" required>
                            <option value="">Pilih Bongkar Muat</option>
                            <option value="ADA" ${data.Fasilitas?.['Bongkar Muat'] === 'ADA' ? 'selected' : ''}>ADA</option>
                            <option value="TIDAK ADA" ${data.Fasilitas?.['Bongkar Muat'] === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Kondisi:</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="edit_kondisi" value="Baik" ${data.kondisi?.Baik === 'X' ? 'checked' : ''} required> Baik
                            </label>
                            <label>
                                <input type="radio" name="edit_kondisi" value="Tidak Baik" ${data.kondisi?.['Tidak Baik'] === 'X' ? 'checked' : ''}> Tidak Baik
                            </label>
                            <label>
                                <input type="radio" name="edit_kondisi" value="Perlu Penyempurnaan" ${data.kondisi?.['Perlu Penyempurnaan'] === 'X' ? 'checked' : ''}> Perlu Penyempurnaan
                            </label>
                        </div>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;

                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const kondisi = document.querySelector('input[name="edit_kondisi"]:checked').value;
                    
                    const updatedData = {
                        'Nama Pasar': document.getElementById('edit_namaPasar').value,
                        'Fasilitas': {
                            'Areal Parkir': document.getElementById('edit_arealParkir').value,
                            'TPS': document.getElementById('edit_TPS').value,
                            'MCK': document.getElementById('edit_MCK').value,
                            'Tempat Ibadah': document.getElementById('edit_tempatIbadah').value,
                            'Bongkar Muat': document.getElementById('edit_bongkarMuat').value
                        },
                        'kondisi': {
                            'Baik': kondisi === 'Baik' ? 'X' : '',
                            'Tidak Baik': kondisi === 'Tidak Baik' ? 'X' : '',
                            'Perlu Penyempurnaan': kondisi === 'Perlu Penyempurnaan' ? 'X' : ''
                        }
                    };

                    try {
                        await update(dataRef, updatedData);
                        editPopup.style.display = 'none';
                        loadBidangPasar();
                        alert('Data berhasil diperbarui!');
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Terjadi kesalahan saat memperbarui data!');
                    }
                };
            } else if (table === 'losKios') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_namaPasar">Nama Pasar</label>
                        <input type="text" id="edit_namaPasar" value="${data['Nama Pasar'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamatLengkap">Alamat Lengkap</label>
                        <input type="text" id="edit_alamatLengkap" value="${data['Alamat Lengkap'] || ''}" required>
                    </div>
                    
                    <div class="form-section">
                        <h3>Jumlah Los Kios</h3>
                        <div class="form-group">
                            <label for="edit_jumlahLos">Los</label>
                            <input type="number" id="edit_jumlahLos" value="${data['Jumlah LosKios']?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_jumlahKios">Kios</label>
                            <input type="number" id="edit_jumlahKios" value="${data['Jumlah LosKios']?.kios || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Jumlah Pedagang</h3>
                        <div class="form-group">
                            <label for="edit_pedagangLos">Los</label>
                            <input type="number" id="edit_pedagangLos" value="${data['Jumlah Pedagang']?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_pedagangKios">Kios</label>
                            <input type="number" id="edit_pedagangKios" value="${data['Jumlah Pedagang']?.kios || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Jumlah Tidak Termanfaatkan</h3>
                        <div class="form-group">
                            <label for="edit_tidakTermanfaatkanLos">Los</label>
                            <input type="number" id="edit_tidakTermanfaatkanLos" value="${data['Jumlah Tidak Termanfaatkan']?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_tidakTermanfaatkanKios">Kios</label>
                            <input type="number" id="edit_tidakTermanfaatkanKios" value="${data['Jumlah Tidak Termanfaatkan']?.kios || 0}" required>
                        </div>
                    </div>

                    <button type="submit">Simpan Perubahan</button>
                `;

                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const updatedData = {
                        'Nama Pasar': document.getElementById('edit_namaPasar').value,
                        'Alamat Lengkap': document.getElementById('edit_alamatLengkap').value,
                        'Jumlah LosKios': {
                            los: parseInt(document.getElementById('edit_jumlahLos').value),
                            kios: parseInt(document.getElementById('edit_jumlahKios').value)
                        },
                        'Jumlah Pedagang': {
                            los: parseInt(document.getElementById('edit_pedagangLos').value),
                            kios: parseInt(document.getElementById('edit_pedagangKios').value)
                        },
                        'Jumlah Tidak Termanfaatkan': {
                            los: parseInt(document.getElementById('edit_tidakTermanfaatkanLos').value),
                            kios: parseInt(document.getElementById('edit_tidakTermanfaatkanKios').value)
                        }
                    };

                    try {
                        await update(dataRef, updatedData);
                        await updateLosKiosSummary();
                        editPopup.style.display = 'none';
                        loadBidangPasar();
                        alert('Data berhasil diperbarui!');
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Terjadi kesalahan saat memperbarui data!');
                    }
                };
            } else if (table === 'profil') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_upt">UPT</label>
                        <input type="text" id="edit_upt" value="${data.UPT || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_namaPasar">Nama Pasar</label>
                        <input type="text" id="edit_namaPasar" value="${data['Nama Pasar'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_jumlahPaguyuban">Jumlah Paguyuban Pedagang</label>
                        <input type="number" id="edit_jumlahPaguyuban" value="${data['Jumlah Paguyuban Pedagang'] || 0}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <input type="text" id="edit_alamat" value="${data.Alamat || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_tahunBerdiri">Tahun Berdiri</label>
                        <input type="text" id="edit_tahunBerdiri" value="${data['Tahun Berdiri'] || ''}" required>
                    </div>

                    <div class="form-section">
                        <h3>Luas</h3>
                        <div class="form-group">
                            <label for="edit_luasTanah">Tanah</label>
                            <input type="number" id="edit_luasTanah" value="${data.Luas?.tanah || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_luasBangunan">Bangunan</label>
                            <input type="number" id="edit_luasBangunan" value="${data.Luas?.bangunan || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_luasLantai">Lantai</label>
                            <input type="number" id="edit_luasLantai" value="${data.Luas?.lantai || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Jumlah</h3>
                        <div class="form-group">
                            <label for="edit_jumlahLos">Los</label>
                            <input type="number" id="edit_jumlahLos" value="${data.Jumlah?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_jumlahKios">Kios</label>
                            <input type="number" id="edit_jumlahKios" value="${data.Jumlah?.kios || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_jumlahDasaran">Dasaran</label>
                            <input type="number" id="edit_jumlahDasaran" value="${data.Jumlah?.dasaran || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Jumlah Pedagang</h3>
                        <div class="form-group">
                            <label for="edit_pedagangLos">Los</label>
                            <input type="number" id="edit_pedagangLos" value="${data['Jumlah Pedagang']?.los || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_pedagangKios">Kios</label>
                            <input type="number" id="edit_pedagangKios" value="${data['Jumlah Pedagang']?.kios || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_pedagangDasaran">Dasaran</label>
                            <input type="number" id="edit_pedagangDasaran" value="${data['Jumlah Pedagang']?.dasaran || 0}" required>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Fasilitas</h3>
                        <div class="form-group">
                            <label>Areal Parkir:</label>
                            <select id="edit_arealParkir" required>
                                <option value="ADA" ${data.Fasilitas?.arealParkir === 'ADA' ? 'selected' : ''}>ADA</option>
                                <option value="TIDAK ADA" ${data.Fasilitas?.arealParkir === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>TPS:</label>
                            <select id="edit_TPS" required>
                                <option value="ADA" ${data.Fasilitas?.TPS === 'ADA' ? 'selected' : ''}>ADA</option>
                                <option value="TIDAK ADA" ${data.Fasilitas?.TPS === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>MCK:</label>
                            <select id="edit_MCK" required>
                                <option value="ADA" ${data.Fasilitas?.MCK === 'ADA' ? 'selected' : ''}>ADA</option>
                                <option value="TIDAK ADA" ${data.Fasilitas?.MCK === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Tempat Ibadah:</label>
                            <select id="edit_tempatIbadah" required>
                                <option value="ADA" ${data.Fasilitas?.tempatIbadah === 'ADA' ? 'selected' : ''}>ADA</option>
                                <option value="TIDAK ADA" ${data.Fasilitas?.tempatIbadah === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Bongkar Muat:</label>
                            <select id="edit_bongkarMuat" required>
                                <option value="ADA" ${data.Fasilitas?.bongkarMuat === 'ADA' ? 'selected' : ''}>ADA</option>
                                <option value="TIDAK ADA" ${data.Fasilitas?.bongkarMuat === 'TIDAK ADA' ? 'selected' : ''}>TIDAK ADA</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Keterangan:</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="edit_keterangan" value="Baik" ${data.Keterangan === 'Baik' ? 'checked' : ''} required> Baik
                            </label>
                            <label>
                                <input type="radio" name="edit_keterangan" value="Perlu Rehab" ${data.Keterangan === 'Perlu Rehab' ? 'checked' : ''}> Perlu Rehab
                            </label>
                            <label>
                                <input type="radio" name="edit_keterangan" value="Perlu Penyempurnaan" ${data.Keterangan === 'Perlu Penyempurnaan' ? 'checked' : ''}> Perlu Penyempurnaan
                            </label>
                        </div>
                    </div>

                    <button type="submit">Simpan Perubahan</button>
                `;

                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const keterangan = document.querySelector('input[name="edit_keterangan"]:checked').value;
                    
                    const updatedData = {
                        'UPT': document.getElementById('edit_upt').value,
                        'Nama Pasar': document.getElementById('edit_namaPasar').value,
                        'Jumlah Paguyuban Pedagang': parseInt(document.getElementById('edit_jumlahPaguyuban').value),
                        'Alamat': document.getElementById('edit_alamat').value,
                        'Tahun Berdiri': document.getElementById('edit_tahunBerdiri').value,
                        'Luas': {
                            tanah: parseInt(document.getElementById('edit_luasTanah').value),
                            bangunan: parseInt(document.getElementById('edit_luasBangunan').value),
                            lantai: parseInt(document.getElementById('edit_luasLantai').value)
                        },
                        'Jumlah': {
                            los: parseInt(document.getElementById('edit_jumlahLos').value),
                            kios: parseInt(document.getElementById('edit_jumlahKios').value),
                            dasaran: parseInt(document.getElementById('edit_jumlahDasaran').value)
                        },
                        'Jumlah Pedagang': {
                            los: parseInt(document.getElementById('edit_pedagangLos').value),
                            kios: parseInt(document.getElementById('edit_pedagangKios').value),
                            dasaran: parseInt(document.getElementById('edit_pedagangDasaran').value)
                        },
                        'Fasilitas': {
                            arealParkir: document.getElementById('edit_arealParkir').value,
                            TPS: document.getElementById('edit_TPS').value,
                            MCK: document.getElementById('edit_MCK').value,
                            tempatIbadah: document.getElementById('edit_tempatIbadah').value,
                            bongkarMuat: document.getElementById('edit_bongkarMuat').value
                        },
                        'Keterangan': keterangan
                    };

                    try {
                        await update(dataRef, updatedData);
                        await updateProfilSummary();
                        editPopup.style.display = 'none';
                        loadBidangPasar();
                        alert('Data berhasil diperbarui!');
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Terjadi kesalahan saat memperbarui data!');
                    }
                };
            }
        }
    });
    editPopup.style.display = 'block';
};


function getPathByTablePasar(table) {
    const paths = {
        kondisiPasar: 'Data Kondisi Pasar',
        losKios: 'Data Los Kios Pasar',
        profil: 'Matriks Profil Pasar'
    };
    return paths[table];
}

window.deleteDataPasar = async function(key, table) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            const path = getPathByTablePasar(table);
            if (!path) throw new Error('Invalid table path');

            const deleteRef = ref(db, `Bidang Pasar/${path}/${key}`);
            await remove(deleteRef);
            if (table === 'losKios') {
                await updateLosKiosSummary();
            } else if (table === 'profil') {
                await updateProfilSummary();
            }
            alert('Data berhasil dihapus!');
            loadBidangPasar();
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus data!');
        }
    }
};

async function updateLosKiosSummary() {
    const losKiosRef = ref(db, 'Bidang Pasar/Data Los Kios Pasar');
    const snapshot = await get(losKiosRef);
    
    if (snapshot.exists()) {
        const data = snapshot.val();
        let summary = {
            'Jumlah LosKios': { los: 0, kios: 0 },
            'Jumlah Pedagang': { los: 0, kios: 0 },
            'Jumlah Tidak Termanfaatkan': { los: 0, kios: 0 }
        };

        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah') {
                summary['Jumlah LosKios'].los += parseInt(value['Jumlah LosKios']?.los || 0);
                summary['Jumlah LosKios'].kios += parseInt(value['Jumlah LosKios']?.kios || 0);
                summary['Jumlah Pedagang'].los += parseInt(value['Jumlah Pedagang']?.los || 0);
                summary['Jumlah Pedagang'].kios += parseInt(value['Jumlah Pedagang']?.kios || 0);
                summary['Jumlah Tidak Termanfaatkan'].los += parseInt(value['Jumlah Tidak Termanfaatkan']?.los || 0);
                summary['Jumlah Tidak Termanfaatkan'].kios += parseInt(value['Jumlah Tidak Termanfaatkan']?.kios || 0);
            }
        });

        const summaryRef = ref(db, 'Bidang Pasar/Data Los Kios Pasar/Jumlah');
        await update(summaryRef, summary);
    }
}

async function updateProfilSummary() {
    const profilRef = ref(db, 'Bidang Pasar/Matriks Profil Pasar');
    const snapshot = await get(profilRef);
    
    if (snapshot.exists()) {
        const data = snapshot.val();
        let summary = {
            'Total Pasar': '0 Pasar',
            'Jumlah': { 
                los: 0, 
                kios: 0, 
                dasaran: 0 
            },
            'Jumlah Pedagang': { 
                los: 0, 
                kios: 0, 
                dasaran: 0 
            }
        };

        let totalPasar = 0;
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah') {
                totalPasar++;
                summary['Jumlah'].los += parseInt(value['Jumlah']?.los || 0);
                summary['Jumlah'].kios += parseInt(value['Jumlah']?.kios || 0);
                summary['Jumlah'].dasaran += parseInt(value['Jumlah']?.dasaran || 0);
                summary['Jumlah Pedagang'].los += parseInt(value['Jumlah Pedagang']?.los || 0);
                summary['Jumlah Pedagang'].kios += parseInt(value['Jumlah Pedagang']?.kios || 0);
                summary['Jumlah Pedagang'].dasaran += parseInt(value['Jumlah Pedagang']?.dasaran || 0);
            }
        });

        summary['Total Pasar'] = `${totalPasar} Pasar`;
        const summaryRef = ref(db, 'Bidang Pasar/Matriks Profil Pasar/Jumlah');
        await update(summaryRef, summary);
    }
}

function loadBidangKoperasi() {
    const koperasiRef = ref(db, 'Bidang Koperasi');
    
    onValue(koperasiRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const rekapOmzetData = data['Rekap Omzet Koperasi'] ? 
                Object.entries(data['Rekap Omzet Koperasi'])
                    .filter(([key]) => key !== 'Jumlah')
                    .reduce((obj, [key, value]) => {
                        obj[key] = value;
                        return obj;
                    }, {}) : {};
            
            const rekapOmzetSummary = data['Rekap Omzet Koperasi']?.Jumlah || null;
            
            renderPelakuUKMTable(data['Data Pelaku UKM'] || {});
            renderUKMBerijinTable(data['UKM Berijin'] || {});
            renderUKMAksesPerbankanTable(data['UKM Akses Perbankan'] || {});
            renderWirausahaBermitraUKMTable(data['Masyarakat Wirausaha Bermitra UKM'] || {});
            renderAksesModalUsahaTable(data['Masyarakat Akses Modal Usaha'] || {});
            renderMiskinPesertaPelatihanTable(data['Masyarakat Miskin Peserta Pelatihan'] || {});
            renderKoperasiProduksiTable(data['Jumlah Koperasi Produksi'] || {});
            renderKoperasiAktifTable(data['Jumlah Seluruh Koperasi Aktif'] || {});
            renderAksesPasarOnlineTable(data['Koperasi Produksi Akses Pasar Online'] || {});
            renderAksesKreditBankTable(data['Koperasi Akses Kredit Bank'] || {});
            renderKoperasiSehatTable(data['Jumlah Koperasi Sehat'] || {});
            renderRekapOmzetTable(rekapOmzetData, rekapOmzetSummary);
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
            <td>${value['NO TELP'] || '-'}</td>
            <td>${value['ALAMAT EMAIL'] || '-'}</td>
            <td>${value['SEKTOR USAHA'] || '-'}</td>
            <td>${value.ALAMAT || '-'}</td>
            <td>${value['NOMOR_INDUK_BERUSAHA_(NIB)'] || '-'}</td>
            <td>${value.TRIWULAN || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'pelakuUKM')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'pelakuUKM')">
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
            <td>${value.Nama || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.NIK || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['No Telp'] || '-'}</td>
            <td>${value['Nama Usaha'] || '-'}</td>
            <td>${value['Jenis Usaha'] || '-'}</td>
            <td>${value.Triwulan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'ukmBerijin')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'ukmBerijin')">
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
            <td>${value.Nama || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value.Bank || '-'}</td>
            <td>${value.Triwulan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'ukmAksesPerbankan')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'ukmAksesPerbankan')">
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
            <td>${value.Nama || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value['No Telp'] || '-'}</td>
            <td>${value.Triwulan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'wirausahaBermitraUKM')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'wirausahaBermitraUKM')">
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
            <td>${value.Nama || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value['No Telp'] || '-'}</td>
            <td>${value.Triwulan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'aksesModalUsaha')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'aksesModalUsaha')">
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
    let no =1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value.Nama || '-'}</td>
            <td>${value.Gender || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value['Bidang Usaha'] || '-'}</td>
            <td>${value['No Telp'] || '-'}</td>
            <td>${value.Triwulan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'miskinPesertaPelatihan')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'miskinPesertaPelatihan')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Koperasi Produksi
function renderKoperasiProduksiTable(data) {
    const tbody = document.getElementById('jmlKoperasiProduksiBody');
    tbody.innerHTML = '';
    let no =1;

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${value['Nama Koperasi'] || '-'}</td>
            <td>${value.Alamat || '-'}</td>
            <td>${value.Produk || '-'}</td>
            <td>${value.Bulan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'koperasiProduksi')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'koperasiProduksi')">
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
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'koperasiAktif')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'koperasiAktif')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Koperasi Akses Pasar Online
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
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'aksesPasarOnline')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'aksesPasarOnline')">
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
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'aksesKreditBank')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'aksesKreditBank')">
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
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'koperasiSehat')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'koperasiSehat')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi untuk render tabel Rekap Omzet
function renderRekapOmzetTable(data, summary) {
    const tbody = document.getElementById('rekapOmzetBody');
    const tfoot = document.getElementById('rekapOmzetFooter');
    if (!tbody || !tfoot) return;
    
    tbody.innerHTML = '';
    tfoot.innerHTML = '';
    let no = 1;

    // Render body table
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
                    <button class="edit-btn" onclick="editDataKoperasi('${key}', 'rekapOmzet')">
                        <span class="material-icons-sharp">edit</span>
                    </button>
                    <button class="delete-btn" onclick="deleteDataKoperasi('${key}', 'rekapOmzet')">
                        <span class="material-icons-sharp">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Render footer dengan data summary
    if (summary) {
        const footerRow = document.createElement('tr');
        footerRow.innerHTML = `
            <td colspan="2" style="font-weight: bold; text-align: center;">JUMLAH</td>
            <td>${summary.Koperasi?.['Jumlah Koperasi'] || 0}</td>
            <td>${summary.Koperasi?.Aktif || 0}</td>
            <td>${summary.Koperasi?.['Tidak Aktif'] || 0}</td>
            <td>${summary.Anggota?.['Jumlah Anggota'] || 0}</td>
            <td>${summary.Anggota?.Aktif || 0}</td>
            <td>${summary.Anggota?.['Tidak Aktif'] || 0}</td>
            <td>${summary['RAT Unit'] || 0}</td>
            <td>${summary.Manajer?.Jumlah || 0}</td>
            <td>${summary.Manajer?.Aktif || 0}</td>
            <td>${summary.Manajer?.['Tidak Aktif'] || 0}</td>
            <td>${summary.Karyawan?.Jumlah || 0}</td>
            <td>${summary.Karyawan?.Aktif || 0}</td>
            <td>${summary.Karyawan?.['Tidak Aktif'] || 0}</td>
            <td>${summary['Modal Sendiri'] || 'Rp. 0'}</td>
            <td>${summary['Modal Luar'] || 'Rp. 0'}</td>
            <td>${summary['Volume Usaha'] || 'Rp. 0'}</td>
            <td>${summary.SHU || 'Rp. 0'}</td>
            <td></td>
        `;
        tfoot.appendChild(footerRow);
    }
}

// Fungsi Edit Data Koperasi
window.editDataKoperasi = function(key, table) {
    const editPopup = document.getElementById('editDataPopup');
    const form = document.getElementById('editDataForm');
    
    const dataRef = ref(db, `Bidang Koperasi/${getPathByTableKoperasi(table)}/${key}`);
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
                        <input type="text" id="edit_noTelp" value="${data['NO TELP'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_email">Email</label>
                        <input type="email" id="edit_email" value="${data['ALAMAT EMAIL'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_sektorUsaha">Sektor Usaha</label>
                        <input type="text" id="edit_sektorUsaha" value="${data['SEKTOR USAHA'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_alamat">Alamat</label>
                        <textarea id="edit_alamat" required>${data.ALAMAT || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_nib">NIB</label>
                        <input type="text" id="edit_nib" value="${data['NOMOR_INDUK_BERUSAHA_(NIB)'] || ''}">
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan">Triwulan</label>
                        <select id="edit_triwulan" required>
                            <option value="Triwulan 1" ${data.TRIWULAN === 'Triwulan 1' ? 'selected' : ''}>Triwulan 1</option>
                            <option value="Triwulan 2" ${data.TRIWULAN === 'Triwulan 2' ? 'selected' : ''}>Triwulan 2</option>
                            <option value="Triwulan 3" ${data.TRIWULAN === 'Triwulan 3' ? 'selected' : ''}>Triwulan 3</option>
                            <option value="Triwulan 4" ${data.TRIWULAN === 'Triwulan 4' ? 'selected' : ''}>Triwulan 4</option>
                        </select>
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
                        <input type="text" id="edit_noHp" value="${data['No Telp'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_namaUsaha">Nama Usaha</label>
                        <input type="text" id="edit_namaUsaha" value="${data['Nama Usaha'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_jenisUsaha">Jenis Usaha</label>
                        <input type="text" id="edit_jenisUsaha" value="${data['Jenis Usaha'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan">Triwulan</label>
                        <select id="edit_triwulan" required>
                            <option value="Triwulan 1" ${data.Triwulan === 'Triwulan 1' ? 'selected' : ''}>Triwulan 1</option>
                            <option value="Triwulan 2" ${data.Triwulan === 'Triwulan 2' ? 'selected' : ''}>Triwulan 2</option>
                            <option value="Triwulan 3" ${data.Triwulan === 'Triwulan 3' ? 'selected' : ''}>Triwulan 3</option>
                            <option value="Triwulan 4" ${data.Triwulan === 'Triwulan 4' ? 'selected' : ''}>Triwulan 4</option>
                        </select>
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
                    <div class="form-group">
                        <label for="edit_triwulan">Triwulan</label>
                        <select id="edit_triwulan" required>
                            <option value="Triwulan 1" ${data.Triwulan === 'Triwulan 1' ? 'selected' : ''}>Triwulan 1</option>
                            <option value="Triwulan 2" ${data.Triwulan === 'Triwulan 2' ? 'selected' : ''}>Triwulan 2</option>
                            <option value="Triwulan 3" ${data.Triwulan === 'Triwulan 3' ? 'selected' : ''}>Triwulan 3</option>
                            <option value="Triwulan 4" ${data.Triwulan === 'Triwulan 4' ? 'selected' : ''}>Triwulan 4</option>
                        </select>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'wirausahaBermitraUKM') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.Nama || ''}" required>
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
                        <input type="text" id="edit_noHp" value="${data['No Telp'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan">Triwulan</label>
                        <select id="edit_triwulan" required>
                            <option value="Triwulan 1" ${data.Triwulan === 'Triwulan 1' ? 'selected' : ''}>Triwulan 1</option>
                            <option value="Triwulan 2" ${data.Triwulan === 'Triwulan 2' ? 'selected' : ''}>Triwulan 2</option>
                            <option value="Triwulan 3" ${data.Triwulan === 'Triwulan 3' ? 'selected' : ''}>Triwulan 3</option>
                            <option value="Triwulan 4" ${data.Triwulan === 'Triwulan 4' ? 'selected' : ''}>Triwulan 4</option>
                        </select>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'aksesModalUsaha') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.Nama || ''}" required>
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
                        <input type="text" id="edit_noHp" value="${data['No Telp'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan">Triwulan</label>
                        <select id="edit_triwulan" required>
                            <option value="Triwulan 1" ${data.Triwulan === 'Triwulan 1' ? 'selected' : ''}>Triwulan 1</option>
                            <option value="Triwulan 2" ${data.Triwulan === 'Triwulan 2' ? 'selected' : ''}>Triwulan 2</option>
                            <option value="Triwulan 3" ${data.Triwulan === 'Triwulan 3' ? 'selected' : ''}>Triwulan 3</option>
                            <option value="Triwulan 4" ${data.Triwulan === 'Triwulan 4' ? 'selected' : ''}>Triwulan 4</option>
                        </select>
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
                        <input type="text" id="edit_jenisProduksi" value="${data.Produk || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_bulan">Bulan</label>
                        <input type="month" id="edit_bulan" value="${data.Bulan || ''}" required>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else if (table === 'miskinPesertaPelatihan') {
                form.innerHTML = `
                    <div class="form-group">
                        <label for="edit_nama">Nama</label>
                        <input type="text" id="edit_nama" value="${data.Nama || ''}" required>
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
                        <input type="text" id="edit_noHp" value="${data['No Telp'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_jenisPelatihan">Jenis Pelatihan</label>
                        <input type="text" id="edit_jenisPelatihan" value="${data['Jenis Pelatihan'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_tahunPelatihan">Tahun Pelatihan</label>
                        <input type="text" id="edit_tahunPelatihan" value="${data['Tahun Pelatihan'] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_triwulan">Triwulan</label>
                        <select id="edit_triwulan" required>
                            <option value="Triwulan 1" ${data.Triwulan === 'Triwulan 1' ? 'selected' : ''}>Triwulan 1</option>
                            <option value="Triwulan 2" ${data.Triwulan === 'Triwulan 2' ? 'selected' : ''}>Triwulan 2</option>
                            <option value="Triwulan 3" ${data.Triwulan === 'Triwulan 3' ? 'selected' : ''}>Triwulan 3</option>
                            <option value="Triwulan 4" ${data.Triwulan === 'Triwulan 4' ? 'selected' : ''}>Triwulan 4</option>
                        </select>
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

                    if (table === 'rekapOmzet') {
                        await updateRekapOmzetSummary();
                    }
                    
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

window.deleteDataKoperasi = async function(key, table) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            const deleteRef = ref(db, `Bidang Koperasi/${getPathByTableKoperasi(table)}/${key}`);
            await remove(deleteRef);
            
            if (table === 'rekapOmzet') {
                await updateRekapOmzetSummary();
            }
            
            alert('Data berhasil dihapus!');
            loadBidangKoperasi();
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Terjadi kesalahan saat menghapus data: ' + error.message);
        }
    }
};

function getPathByTableKoperasi(table) {
    switch(table) {
        case 'pelakuUKM':
            return 'Data Pelaku UKM';
        case 'ukmBerijin':
            return 'UKM Berijin';
        case 'ukmAksesPerbankan':
            return 'UKM Akses Perbankan';
        case 'wirausahaBermitraUKM':
            return 'Masyarakat Wirausaha Bermitra UKM';
        case 'aksesModalUsaha':
            return 'Masyarakat Akses Modal Usaha';
        case 'miskinPesertaPelatihan':
            return 'Masyarakat Miskin Peserta Pelatihan';
        case 'koperasiProduksi':
            return 'Jumlah Koperasi Produksi';
        case 'koperasiAktif':
            return 'Jumlah Seluruh Koperasi Aktif';
        case 'aksesPasarOnline':
            return 'Koperasi Produksi Akses Pasar Online';
        case 'aksesKreditBank':
            return 'Koperasi Akses Kredit Bank';
        case 'koperasiSehat':
            return 'Jumlah Koperasi Sehat';
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
            'NO TELP': document.getElementById('edit_noTelp').value,
            'ALAMAT EMAIL': document.getElementById('edit_email').value,
            'SEKTOR USAHA': document.getElementById('edit_sektorUsaha').value,
            ALAMAT: document.getElementById('edit_alamat').value,
            'NOMOR_INDUK_BERUSAHA_(NIB)': document.getElementById('edit_nib').value,
            TRIWULAN: document.getElementById('edit_triwulan').value

        };
    } else if (table === 'ukmBerijin') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            NIK: document.getElementById('edit_nik').value,
            Alamat: document.getElementById('edit_alamat').value,
            'No Telp': document.getElementById('edit_noHp').value,
            'Nama Usaha': document.getElementById('edit_namaUsaha').value,
            'Jenis Usaha': document.getElementById('edit_jenisUsaha').value,
            Triwulan: document.getElementById('edit_triwulan').value
        };
    } else if (table === 'ukmAksesPerbankan') {
        return {
            NIK: document.getElementById('edit_nik').value,
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Bidang Usaha': document.getElementById('edit_bidangUsaha').value,
            Bank: document.getElementById('edit_bank').value,
            Triwulan: document.getElementById('edit_triwulan').value
        };
    } else if (table === 'wirausahaBermitraUKM') {
        return {
            Nama: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Bidang Usaha': document.getElementById('edit_bidangUsaha').value,
            'No Telp': document.getElementById('edit_noHp').value,
            Triwulan: document.getElementById('edit_triwulan').value
        };
    } else if (table === 'aksesModalUsaha') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Bidang Usaha': document.getElementById('edit_bidangUsaha').value,
            'No Telp': document.getElementById('edit_noHp').value,
            Triwulan: document.getElementById('edit_triwulan').value
        };
    } else if (table === 'koperasiProduksi') {
        return {
            'Nama Koperasi': document.getElementById('edit_namaKoperasi').value,
            Alamat: document.getElementById('edit_alamat').value,
            'Jenis Produksi': document.getElementById('edit_jenisProduksi').value,
            Bulan: document.getElementById('edit_bulan').value
        };
    } else if (table === 'miskinPesertaPelatihan') {
        return {
            NAMA: document.getElementById('edit_nama').value,
            Gender: document.getElementById('edit_gender').value,
            NIK: document.getElementById('edit_nik').value,
            Alamat: document.getElementById('edit_alamat').value,
            'No Telp': document.getElementById('edit_noHp').value,
            'Jenis Pelatihan': document.getElementById('edit_jenisPelatihan').value,
            'Tahun Pelatihan': document.getElementById('edit_tahunPelatihan').value,
            Triwulan: document.getElementById('edit_triwulan').value
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

async function updateRekapOmzetSummary() {
    const rekapOmzetRef = ref(db, 'Bidang Koperasi/Rekap Omzet Koperasi');
    const snapshot = await get(rekapOmzetRef);
    
    if (snapshot.exists()) {
        const data = snapshot.val();
        let summary = {
            Koperasi: {
                'Jumlah Koperasi': 0,
                'Aktif': 0,
                'Tidak Aktif': 0
            },
            Anggota: {
                'Jumlah Anggota': 0,
                'Aktif': 0,
                'Tidak Aktif': 0
            },
            'RAT Unit': 0,
            Manajer: {
                'Jumlah': 0,
                'Aktif': 0,
                'Tidak Aktif': 0
            },
            Karyawan: {
                'Jumlah': 0,
                'Aktif': 0,
                'Tidak Aktif': 0
            },
            'Modal Sendiri': 'Rp. 0',
            'Modal Luar': 'Rp. 0',
            'Volume Usaha': 'Rp. 0',
            'SHU': 'Rp. 0'
        };

        let totalModalSendiri = 0;
        let totalModalLuar = 0;
        let totalVolumeUsaha = 0;
        let totalSHU = 0;

        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah') {
                // Update Koperasi
                summary.Koperasi['Jumlah Koperasi'] += parseInt(value.Koperasi?.['Jumlah Koperasi'] || 0);
                summary.Koperasi['Aktif'] += parseInt(value.Koperasi?.Aktif || 0);
                summary.Koperasi['Tidak Aktif'] += parseInt(value.Koperasi?.['Tidak Aktif'] || 0);

                // Update Anggota
                summary.Anggota['Jumlah Anggota'] += parseInt(value.Anggota?.['Jumlah Anggota'] || 0);
                summary.Anggota['Aktif'] += parseInt(value.Anggota?.Aktif || 0);
                summary.Anggota['Tidak Aktif'] += parseInt(value.Anggota?.['Tidak Aktif'] || 0);

                // Update RAT Unit
                summary['RAT Unit'] += parseInt(value['RAT Unit'] || 0);

                // Update Manajer
                summary.Manajer['Jumlah'] += parseInt(value.Manajer?.Jumlah || 0);
                summary.Manajer['Aktif'] += parseInt(value.Manajer?.Aktif || 0);
                summary.Manajer['Tidak Aktif'] += parseInt(value.Manajer?.['Tidak Aktif'] || 0);

                // Update Karyawan
                summary.Karyawan['Jumlah'] += parseInt(value.Karyawan?.Jumlah || 0);
                summary.Karyawan['Aktif'] += parseInt(value.Karyawan?.Aktif || 0);
                summary.Karyawan['Tidak Aktif'] += parseInt(value.Karyawan?.['Tidak Aktif'] || 0);

                // Update nilai keuangan (menghapus 'Rp. ' dan mengkonversi ke number)
                totalModalSendiri += parseInt(value['Modal Sendiri']?.replace(/[^0-9]/g, '') || 0);
                totalModalLuar += parseInt(value['Modal Luar']?.replace(/[^0-9]/g, '') || 0);
                totalVolumeUsaha += parseInt(value['Volume Usaha']?.replace(/[^0-9]/g, '') || 0);
                totalSHU += parseInt(value.SHU?.replace(/[^0-9]/g, '') || 0);
            }
        });

        // Format nilai keuangan kembali ke format rupiah
        summary['Modal Sendiri'] = `Rp. ${totalModalSendiri}`;
        summary['Modal Luar'] = `Rp. ${totalModalLuar}`;
        summary['Volume Usaha'] = `Rp. ${totalVolumeUsaha}`;
        summary['SHU'] = `Rp. ${totalSHU}`;

        const summaryRef = ref(db, 'Bidang Koperasi/Rekap Omzet Koperasi/Jumlah');
        await update(summaryRef, summary);
    }
}

async function loadExportData() {
    const exportSelectedBtn = document.querySelector('.export-selected-btn'); 
    
    exportSelectedBtn.addEventListener('click', async () => {
        const activeCards = document.querySelectorAll('.export-card.active');
        if (activeCards.length === 0) {
            alert('Pilih minimal satu data untuk diekspor!');
            return;
        }
        
        try {
            const response = await fetch("assets/files/template.xlsx");
            const templateBuffer = await response.arrayBuffer();
            
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(templateBuffer);

            for (const card of activeCards) {
                const tableId = card.getAttribute('data-table');
                const sheetTitle = card.querySelector('h3').textContent;
                
                let worksheetName = sheetTitle;
                if (worksheetName.length > 31) {
                    switch(tableId) {
                        case 'tokoModernMemasarkanUMKM':
                            worksheetName = 'Data Toko Modern & UMKM';
                            break;
                        case 'wirausahaBermitraUKM':
                            worksheetName = 'Data Wirausaha & UKM';
                            break;
                        case 'miskinPesertaPelatihan':
                            worksheetName = 'Data Peserta Pelatihan';
                            break;
                        case 'koperasiAktif':
                            worksheetName = 'Data Koperasi Aktif';
                            break;
                        case 'aksesPasarOnline':
                            worksheetName = 'Koperasi Akses Pasar Online';
                            break;
                        case 'koperasiProduksi':
                            worksheetName = 'Data Koperasi Produksi';
                            break;    
                    }
                }
                const worksheet = workbook.addWorksheet(worksheetName);
                const templateSheet = workbook.getWorksheet(1);

                let lastColumn;
                switch(tableId) {
                    // Bidang Perdagangan
                    case 'pelayananTera':
                        lastColumn = 'F';
                        break;
                    case 'teraKabWSB':
                        lastColumn = 'AE'; // No, Nama Wajib Tera, Alamat, Jenis UTTP, Tanggal Tera, Status
                        break;
                    case 'marketplace':
                        lastColumn = 'I';
                        break;
                    case 'disparitasHarga':
                        lastColumn = 'G'; // No, Nama Sampel Komoditi, Satuan, Kab Wonosobo, Kab Temanggung, Selisih, Persen
                        break;
                    case 'hasilPengawasan':
                        lastColumn = 'J'; // No, Wilayah, Kios Pupuk, NIB, SPJB, RDKK, Harga HET, Papan Nama, Penyerapan, Hasil
                        break;
                    case 'tokoModern':
                        lastColumn = 'Q'; // No, Nama Toko, Alamat, Kecamatan, Kelurahan, Status, Keterangan
                        break;
                    case 'tokoModernOSS':
                        lastColumn = 'K'; // No, Nama Toko, Alamat, NIB, Kecamatan, Kelurahan, Status
                        break;
                    case 'tokoModernMemasarkanUMKM':
                        lastColumn = 'D'; // No, Nama Toko, Alamat, Jumlah UMKM, Status, Keterangan
                        break;
                    case 'komoditasEkspor':
                        lastColumn = 'F'; // No, Nama, Alamat, Jenis Usaha, Status, NIB, Keterangan
                        break;
                    case 'matrikaEkspor':
                        lastColumn = 'K'; // No, Nama, Alamat, Jenis Usaha, Status, NIB, Keterangan
                        break;    

                    // Bidang Pasar
                    case 'kondisiPasar':
                        lastColumn = 'J'; // No, Nama, NIK, Alamat, No Los/Kios, Jenis Dagangan, Status, Keterangan
                        break;
                    case 'losKios':
                        lastColumn = 'I'; // No, Nama Pasar, Alamat, Kecamatan, Kelurahan, Luas, Status
                        break;
                    case 'profil':
                        lastColumn = 'U'; // No, Nama Kios, Alamat, Pemilik, Status, Jenis Dagangan, Keterangan
                        break;

                    // Bidang Koperasi
                    case 'pelakuUKM':
                        lastColumn = 'J'; // No, NIK, Nama, Gender, No Telp, Email, Sektor Usaha, Alamat
                        break;
                    case 'ukmBerijin':
                        lastColumn = 'I'; // No, NIK, Nama, Alamat, Jenis Usaha, No NIB, Tanggal NIB
                        break;
                    case 'ukmAksesPerbankan':
                        lastColumn = 'G'; // No, NIK, Nama, Alamat, Bank, Jenis Kredit, Nominal
                        break;
                    case 'wirausahaBermitraUKM':
                        lastColumn = 'G'; // No, NIK, Nama, Alamat, Jenis Usaha, Mitra, Bentuk Kemitraan
                        break;
                    case 'aksesModalUsaha':
                        lastColumn = 'G'; // No, NIK, Nama, Alamat, Sumber Modal, Nominal, Tanggal
                        break;
                    case 'miskinPesertaPelatihan':
                        lastColumn = 'G'; // No, NIK, Nama, Alamat, Jenis Pelatihan, Tanggal Pelatihan, Status
                        break;
                    case 'koperasiProduksi':
                        lastColumn = 'E'; // No, Nama Koperasi, Alamat, Produk, Bulan
                        break;
                    case 'koperasiAktif':
                        lastColumn = 'H'; // No, Nama Koperasi, NIK, No Badan Hukum, Alamat, Kelurahan, Kecamatan, Desa
                        break;
                    case 'aksesPasarOnline':
                        lastColumn = 'D'; // No, Nama Koperasi, Alamat, Media Pemasaran
                        break;
                    case 'aksesKreditBank':
                        lastColumn = 'D'; // No, Nama Koperasi, Alamat, Bank Pemberi Fasilitas
                        break;
                    case 'koperasiSehat':
                        lastColumn = 'E'; // No, Nama Koperasi, Alamat, Hasil, Tahun Penilaian
                        break;
                    case 'rekapOmzet':
                        lastColumn = 'S'; // No, Kecamatan, Data Koperasi (3), Data Anggota (3), RAT Unit, Data Manajer (3), Data Karyawan (3), Data Keuangan (4)
                        break;
                    default:
                        lastColumn = 'F'; // Default 6 kolom
                }

                // Merge cells untuk header sesuai lebar tabel
                worksheet.mergeCells(`A1:${lastColumn}1`); // PEMERINTAH KABUPATEN WONOSOBO
                worksheet.mergeCells(`A2:${lastColumn}2`); // DINAS PERDAGANGAN, KOPERASI, UKM
                worksheet.mergeCells(`A3:${lastColumn}3`); // Alamat
                worksheet.mergeCells(`A4:${lastColumn}4`); // Telp/Fax
                worksheet.mergeCells(`A5:${lastColumn}5`); // Website

                // Copy 5 baris pertama dari template
                for (let i = 1; i <= 5; i++) {
                    const row = templateSheet.getRow(i);
                    const newRow = worksheet.getRow(i);
                    
                    // Copy values dan styling
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        if (colNumber <= lastColumn.charCodeAt(0) - 64) { // Konversi huruf ke angka (A=1, B=2, dst)
                            const newCell = newRow.getCell(colNumber);
                            newCell.value = cell.value;
                            newCell.style = Object.assign({}, cell.style);
                            
                            // Tambahkan border untuk header
                            newCell.border = {
                                top: { style: 'thin' },
                                bottom: { style: 'thin' },
                                left: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                        }
                    });
                    
                    newRow.height = row.height;
                }

                // Tambahkan judul tabel
                worksheet.mergeCells(`A7:${lastColumn}8`);
                const titleCell = worksheet.getCell('A7');
                titleCell.value = sheetTitle;
                titleCell.font = { size: 16, bold: true, color: { argb: '000000' } };
                titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

                // Sisanya tetap sama
                let data = [];
                switch(tableId) {
                    // Bidang Perdagangan
                    case 'pelayananTera':
                        data = await getPelayananTeraData();
                        await generatePelayananTeraSheet(worksheet, data);
                        break;
                    case 'teraKabWSB':
                        data = await getTeraKabWSBData();
                        await generateTeraKabWSBSheet(worksheet, data);
                        break;
                    case 'marketplace':
                        data = await getMarketplaceData();
                        await generateMarketplaceSheet(worksheet, data);
                        break;
                    case 'disparitasHarga':
                        data = await getDisparitasHargaData();
                        await generateDisparitasHargaSheet(worksheet, data);
                        break;
                    case 'hasilPengawasan':
                        data = await getHasilPengawasanData();
                        await generateHasilPengawasanSheet(worksheet, data);
                        break;
                    case 'tokoModern':
                        data = await getTokoModernData();
                        await generateTokoModernSheet(worksheet, data);
                        break;
                    case 'tokoModernOSS':
                        data = await getTokoModernOSSData();
                        await generateTokoModernOSSSheet(worksheet, data);
                        break;
                    case 'tokoModernMemasarkanUMKM':
                        data = await getTokoModernMemasarkanUMKMData();
                        await generateTokoModernMemasarkanUMKMSheet(worksheet, data);
                        break;
                    case 'komoditasEkspor':
                        data = await getKomoditasEksporData();
                        await generateKomoditasEksporSheet(worksheet, data);
                        break;
                    case 'matrikaEkspor':
                        data = await getMatrikaEksporData();
                        await generateMatrikaEksporSheet(worksheet, data);
                        break;
                
                    // Bidang Pasar
                    case 'kondisiPasar':
                        data = await getKondisiPasarData();
                        await generateKondisiPasarSheet(worksheet, data);
                        break;
                    case 'losKios':
                        data = await getLosKiosData();
                        await generateLosKiosSheet(worksheet, data);
                        break;
                    case 'profil':
                        data = await getProfilData();
                        await generateProfilSheet(worksheet, data);
                        break;

                    // Bidang Koperasi
                    case 'pelakuUKM':
                        data = await getPelakuUKMData();
                        await generatePelakuUKMSheet(worksheet, data);
                        break;
                    case 'ukmBerijin':
                        data = await getUKMBerijinData();
                        await generateUKMBerijinSheet(worksheet, data);
                        break;
                    case 'ukmAksesPerbankan':
                        data = await getUKMAksesPerbankanData();
                        await generateUKMAksesPerbankanSheet(worksheet, data);
                        break;
                    case 'wirausahaBermitraUKM':
                        data = await getWirausahaBermitraUKMData();
                        await generateWirausahaBermitraUKMSheet(worksheet, data);
                        break;
                    case 'aksesModalUsaha':
                        data = await getAksesModalUsahaData();
                        await generateAksesModalUsahaSheet(worksheet, data);
                        break;
                    case 'miskinPesertaPelatihan':
                        data = await getMiskinPesertaPelatihanData();
                        await generateMiskinPesertaPelatihanSheet(worksheet, data);
                        break;
                    case 'koperasiProduksi':
                        data = await getKoperasiProduksiData();
                        await generateKoperasiProduksiSheet(worksheet, data);
                        break;
                    case 'koperasiAktif':
                        data = await getKoperasiAktifData();
                        await generateKoperasiAktifSheet(worksheet, data);
                        break;
                    case 'aksesPasarOnline':
                        data = await getAksesPasarOnlineData();
                        await generateAksesPasarOnlineSheet(worksheet, data);
                        break;
                    case 'aksesKreditBank':
                        data = await getAksesKreditBankData();
                        await generateAksesKreditBankSheet(worksheet, data);
                        break;
                    case 'koperasiSehat':
                        data = await getKoperasiSehatData();
                        await generateKoperasiSehatSheet(worksheet, data);
                        break;
                    case 'rekapOmzet':
                        data = await getRekapOmzetData();
                        await generateRekapOmzetSheet(worksheet, data);
                        break;
                }
            }

            workbook.removeWorksheet('Sheet1');
            
            // Export workbook
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Data_Export_${new Date().toLocaleDateString()}.xlsx`;
            link.click();
        } catch (error) {
            console.error('Error saat mengekspor data:', error);
            alert('Terjadi kesalahan saat mengekspor data!');
        }
    });
}

// ============= BIDANG PERDAGANGAN =============

// 1. Pelayanan Tera
async function getPelayananTeraData() {
    const teraRef = ref(db, 'Bidang Perdagangan/Data Pelayanan Tera');
    const snapshot = await get(teraRef);
    return snapshot.val();
}

async function generatePelayananTeraSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'UTTP',
        'Triwulan 1',
        'Triwulan 2',
        'Triwulan 3',
        'Triwulan 4'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        let totalTriwulan1 = 0;
        let totalTriwulan2 = 0;
        let totalTriwulan3 = 0;
        let totalTriwulan4 = 0;

        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Total' && key !== 'Total Semua Layanan') {
                const row = worksheet.getRow(rowIndex);
                const triwulan1 = parseFloat(value['Triwulan 1']) || 0;
                const triwulan2 = parseFloat(value['Triwulan 2']) || 0;
                const triwulan3 = parseFloat(value['Triwulan 3']) || 0;
                const triwulan4 = parseFloat(value['Triwulan 4']) || 0;

                totalTriwulan1 += triwulan1;
                totalTriwulan2 += triwulan2;
                totalTriwulan3 += triwulan3;
                totalTriwulan4 += triwulan4;

                row.values = [
                    no++,
                    value['UTTP'] || '',
                    triwulan1,
                    triwulan2,
                    triwulan3,
                    triwulan4
                ];
                styleDataRow(row);
                rowIndex++;
            }
        });

        const totalData = data['Total'];
        const totalSemuaLayanan = data['Total Semua Layanan'];

        const totalRow = worksheet.getRow(rowIndex);
        totalRow.values = [
            '',
            'Total',
            totalData['Triwulan 1'] || totalTriwulan1,
            totalData['Triwulan 2'] || totalTriwulan2,
            totalData['Triwulan 3'] || totalTriwulan3,
            totalData['Triwulan 4'] || totalTriwulan4
        ];
        // Gabungkan 2 kolom pertama untuk Total
        worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
        worksheet.getCell(`A${rowIndex}`).value = 'Total';
        worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center' };
        styleDataRow(totalRow);
        totalRow.font = { bold: true };
        rowIndex++;

        const totalLayananRow = worksheet.getRow(rowIndex);
        totalLayananRow.values = [
            '',
            'Total Semua Layanan',
            totalSemuaLayanan || '',
            '',
            '',
            '' 
        ];
        // Gabungkan 2 kolom pertama untuk Total Semua Layanan
        worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
        worksheet.getCell(`A${rowIndex}`).value = 'Total Semua Layanan';
        worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center' };
        // Gabungkan 4 kolom terakhir
        worksheet.mergeCells(`C${rowIndex}:F${rowIndex}`);
        worksheet.getCell(`C${rowIndex}`).value = totalSemuaLayanan || '';
        worksheet.getCell(`C${rowIndex}`).alignment = { horizontal: 'center' };
        styleDataRow(totalLayananRow);
        totalLayananRow.font = { bold: true };
    }
    autoFitColumns(worksheet);
}


// 2. Tera Kab WSB
async function getTeraKabWSBData() {
    const teraKabRef = ref(db, 'Bidang Perdagangan/Data Semua Tera Kab WSB');
    const snapshot = await get(teraKabRef);
    return snapshot.val();
}

async function generateTeraKabWSBSheet(worksheet, data) {

    // Merge cells untuk header
    worksheet.mergeCells('A10:A12');  // NO
    worksheet.mergeCells('B10:B12');  // Kecamatan
    worksheet.mergeCells('C10:C12');  // Lokasi
    
    // UP
    worksheet.mergeCells('D10:E10');   // UP
    worksheet.mergeCells('D11:D12');   // 1 m ≤ up ≤ 2 m
    worksheet.mergeCells('E11:E12');   // up ≤ 1 m
    
    // TAK
    worksheet.mergeCells('F10:G10');   // TAK
    worksheet.mergeCells('F11:F12');   // 5 l ≤ tb ≤ 25 l
    worksheet.mergeCells('G11:G12');   // tb > 2 l
    
    // ANAK TIMBANGAN
    worksheet.mergeCells('H10:M10');   // ANAK TIMBANGAN
    worksheet.mergeCells('H11:J11');   // Biasa
    worksheet.mergeCells('K11:M11');   // Halus
    
    // TIMBANGAN
    worksheet.mergeCells('N10:AB10');  // TIMBANGAN
    worksheet.mergeCells('N11:O11');   // DACIN LOGAM
    worksheet.mergeCells('P11:Q11');   // SENTISIMAL
    worksheet.mergeCells('R11:S11');   // BOBOT INGSUT
    worksheet.mergeCells('T11:U11');   // PEGAS
    worksheet.mergeCells('V11:V12');   // MEJA
    worksheet.mergeCells('W11:W12');   // NERACA
    worksheet.mergeCells('X11:Y11');   // TE (II)
    worksheet.mergeCells('Z11:AB11');  // TE (III & IV)
    
    // Kolom terakhir
    worksheet.mergeCells('AC10:AC12'); // Alat Ukur Tinggi Orang
    worksheet.mergeCells('AD10:AD12'); // TEB 1000 KG
    worksheet.mergeCells('AE10:AE12'); // Jumlah Total UTTP

    const headers = [
        [
            'NO', 'Kecamatan', 'Lokasi',
            'UP', 'UP',
            'TAK', 'TAK',
            'Anak Timbangan', 'Anak Timbangan', 'Anak Timbangan', 'Anak Timbangan', 'Anak Timbangan', 'Anak Timbangan',
            'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan', 'Timbangan',
            'Alat Ukur Tinggi Orang', 'TEB 1000 KG', 'Jumlah Total UTTP'
        ],
        [
            'NO', 'Kecamatan', 'Lokasi',  // Menambahkan kembali header yang di-merge vertikal
            '1 m ≤ up ≤ 2 m', 'up ≤ 1 m',
            '5 ≤ tb ≤ 25 l', 'tb ≥ 2 l',
            'Biasa', 'Biasa', 'Biasa',
            'Halus', 'Halus', 'Halus',
            'Dacin Logam', 'Dacin Logam',
            'Sentisimal', 'Sentisimal',
            'Bobot Ingsut', 'Bobot Ingsut',
            'Pegas', 'Pegas',
            'MEJA', 'NERACA',
            'TE', 'TE',
            'TE', 'TE', 'TE',
            'Alat Ukur Tinggi Orang', 'TEB 1000 KG', 'Jumlah Total UTTP'  // Menambahkan kembali header yang di-merge vertikal
        ],
        [
            'NO', 'Kecamatan', 'Lokasi',  // Menambahkan kembali header yang di-merge vertikal
            '1 m ≤ up ≤ 2 m', 'up ≤ 1 m',
            '5 ≤ tb ≤ 25 l', 'tb ≥ 2 l',
            'atb ≤1 kg', '1 < atb ≤5 kg', '5 < atb ≥ 20 kg',
            'atb ≤1 kg (H)', '1 < atb ≤5 kg (H)', '5 < atb ≥ 20 kg (H)',
            'DL ≤25 kg', 'DL > 25 kg',
            'S ≤150 kg', 'S > 150 kg',
            'S ≤150 kg', 'S > 150 kg',
            'TP ≤25 kg', 'TP > 25 kg',
            'MEJA', 'NERACA',
            'TE ≤ 1 kg', 'TE > 1 kg',
            'TE ≤ 25 kg', '25 kg < TE ≤ 150 kg', '150 kg < TE ≤ 500 kg',
            'Alat Ukur Tinggi Orang', 'TEB 1000 KG', 'Jumlah Total UTTP'  // Menambahkan kembali header yang di-merge vertikal
        ]
    ];

    // Terapkan header
    headers.forEach((headerRow, idx) => {
        const row = worksheet.getRow(idx + 10);
        headerRow.forEach((header, colIdx) => {
            const cell = row.getCell(colIdx + 1);
            cell.value = header;
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        });
        styleHeader(row);
    });

    let rowIndex = 13;
    let no = 1;
    let totalUTTP = 0;

    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah Keseluruhan') {
                const row = worksheet.getRow(rowIndex);
                const values = new Array(31).fill('-');

                values[0] = no++;
                values[1] = value.Kecamatan || '-';
                values[2] = value.Lokasi || '-';

                // UP
                values[3] = value.UP['1 m ≤ up ≤ 2 m'];
                values[4] = value.UP['up ≤ 1 m'];

                // TAK
                values[5] = value.TAK['5 l ≤  tb ≤ 25 l'];
                values[6] = value.TAK['tb > 2 l'];

                // ANAK TIMBANGAN
                values[7] = value['ANAK TIMBANGAN'].Biasa['atb ≤ 1 kg'];
                values[8] = value['ANAK TIMBANGAN'].Biasa['1 < atb ≤ 5 kg'];
                values[9] = value['ANAK TIMBANGAN'].Biasa['5 < atb ≤ 20 kg'];
                values[10] = value['ANAK TIMBANGAN'].Halus['atb ≤ 1 kg'];
                values[11] = value['ANAK TIMBANGAN'].Halus['1 < atb ≤ 5 kg'];
                values[12] = value['ANAK TIMBANGAN'].Halus['5 < atb ≤ 20 kg'];

                // TIMBANGAN
                values[13] = value.TIMBANGAN['DACIN LOGAM']['DL ≤ 25 kg'];
                values[14] = value.TIMBANGAN['DACIN LOGAM']['DL > 25 kg'];
                values[15] = value.TIMBANGAN.SENTISIMAL['S ≤ 150 kg'];
                values[16] = value.TIMBANGAN.SENTISIMAL['150 kg < S ≤ 500 kg'];
                values[17] = value.TIMBANGAN['BOBOT INGSUT']['TBI ≤ 25 kg'];
                values[18] = value.TIMBANGAN['BOBOT INGSUT']['25 kg < TBI ≤ 150 kg'];
                values[19] = value.TIMBANGAN.PEGAS['TP ≤ 25 kg'];
                values[20] = value.TIMBANGAN.PEGAS['TP > 25 kg'];
                values[21] = value.TIMBANGAN.MEJA;
                values[22] = value.TIMBANGAN.NERACA;
                values[23] = value.TIMBANGAN['TE (II)']['TE ≤ 1 kg'];
                values[24] = value.TIMBANGAN['TE (II)']['TE > 1 kg'];
                values[25] = value.TIMBANGAN['TE (III & IV)']['25 < kg TE ≤ 25 kg'];
                values[26] = value.TIMBANGAN['TE (III & IV)']['25 < kg TE ≤ 150 kg'];
                values[27] = value.TIMBANGAN['TE (III & IV)']['25 < kg TE ≤ 500 kg'];

                // Kolom terakhir
                values[28] = value['Alat Ukur Tinggi Orang'];
                values[29] = value['TEB 1000 KG'];
                values[30] = value['Jumlah Total UTTP'];

                row.values = values;
                styleDataRow(row);
                
                // Menambahkan total UTTP
                if (value['Jumlah Total UTTP'] && value['Jumlah Total UTTP'] !== '-') {
                    totalUTTP += parseInt(value['Jumlah Total UTTP']);
                }
                
                rowIndex++;
            }
        });

        // Tambahkan Jumlah Keseluruhan
        const totalRow = worksheet.getRow(rowIndex);
        
        // Gabungkan kolom untuk Jumlah Keseluruhan
        worksheet.mergeCells(`A${rowIndex}:AD${rowIndex}`);
        worksheet.getCell(`A${rowIndex}`).value = 'Jumlah Keseluruhan';
        worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center' };
        worksheet.getCell(`AE${rowIndex}`).value = totalUTTP.toString();
        worksheet.getCell(`AE${rowIndex}`).alignment = { horizontal: 'center' };
        
        styleDataRow(totalRow);
        totalRow.font = { bold: true };
    }

    // Set lebar kolom
    worksheet.columns.forEach((col, idx) => {
        if (idx === 0) col.width = 4;      // NO
        else if (idx === 1) col.width = 15; // Kecamatan
        else if (idx === 2) col.width = 15; // Lokasi
        else col.width = 8;                 // Kolom lainnya
    });

    // Set tinggi baris header
    worksheet.getRow(10).height = 30;
    worksheet.getRow(11).height = 30;
    worksheet.getRow(12).height = 30;
}

// 3. Marketplace
async function getMarketplaceData() {
    const marketplaceRef = ref(db, 'Bidang Perdagangan/Data Marketplace Lokal');
    const snapshot = await get(marketplaceRef);
    return snapshot.val();
}

async function generateMarketplaceSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Marketplace',
        'Tahun n-1',
        'Tahun n-2',
        'Tahun n',
        'Tahun n',
        'Tahun n',
        'Tahun n',
        'Keterangan'
    ];
    worksheet.getRow(11).values = [
        '',
        '',
        '',
        '',
        'Triwuan 1',
        'Triwuan 2',
        'Triwuan 3',
        'Triwuan 4',
        ''
    ];

    worksheet.mergeCells('E10:H10');
    worksheet.getCell('E10').value = 'Tahun n';

    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);
    const headerRow2 = worksheet.getRow(11);
    styleHeader(headerRow2);

    let rowIndex = 12;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama Marketplace'] || '',
                value['Tahun n-1'] || '',
                value['Tahun n-2'] || '',
                value['Tahun n']?.['Triwuan 1'] || '',
                value['Tahun n']?.['Triwuan 2'] || '',
                value['Tahun n']?.['Triwuan 3']|| '',
                value['Tahun n']?.['Triwuan 4'] || '',
                value['Keterangan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }

    autoFitColumns(worksheet);
}


// 4. Toko Modern
async function getTokoModernData() {
    const tokoRef = ref(db, 'Bidang Perdagangan/Data Toko Modern');
    const snapshot = await get(tokoRef);
    return snapshot.val();
}

async function generateTokoModernSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Tanggal SK',
        'Nama Usaha',
        'Alamat Usaha',
        'Nama Pemilik',
        'Alamat Pemilik',
        'Nomor Induk Berusaha',
        '',
        '',
        'Perizinan',
        '',
        '',
        'IUTM',
        'Jenis Toko',
        'KBLI',
        'Catatan',
        'Keterangan'
    ];
    worksheet.getRow(11).values = [
        '',
        '',
        '',
        '',
        '',
        '',
        'NIB',
        'No NIB',
        'STATUS',
        'SIUP',
        'TDP',
        'HO',
        '',
        '',
        '',
        '',
        ''
    ];

    worksheet.mergeCells('G10:I10');
    worksheet.getCell('G10').value = 'Nomor Induk Berusaha';
    worksheet.mergeCells('J10:L10');
    worksheet.getCell('J10').value = 'Perizinan';
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);
    const headerRow2 = worksheet.getRow(11);
    styleHeader(headerRow2);

    let rowIndex = 12;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['TANGGAL SK'] || '',
                value['NAMA DAN ALAMAT LOKASI TEMPAT USAHA']?.NAMA || '',
                value['NAMA DAN ALAMAT LOKASI TEMPAT USAHA']?.ALAMAT || '',
                value['NAMA DAN ALAMAT PEMILIK'].NAMA || '',
                value['NAMA DAN ALAMAT PEMILIK'].ALAMAT || '',
                value['NOMOR INDUK BERUSAHA']?.['NIB'] || '',
                value['NOMOR INDUK BERUSAHA']?.['NO NIB'] || '',
                value['NOMOR INDUK BERUSAHA']?.['STATUS'] || '',
                value['PERIZINAN'].SIUP || '',
                value['PERIZINAN'].TDP || '',
                value['PERIZINAN'].HO || '',
                value['IUTM'] || '',
                value['JENIS TOKO MODERN'] || '',
                value['KOMODITI atau KBLI'] || '',
                value['CATATAN PERTUBAHAN'] || '',
                value['KETERANGAN'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 5. Toko Modern OSS
async function getTokoModernOSSData() {
    const tokoRef = ref(db, 'Bidang Perdagangan/Data Toko Modern OSS');
    const snapshot = await get(tokoRef);
    return snapshot.val();
}

async function generateTokoModernOSSSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Usaha',
        'Alamat Usaha',
        'Nama Pemilik',
        'Alamat Pemilik',
        'Nomor Induk Berusaha',
        '',
        '',
        'No Telepon',
        'Komoditi / KBLI',
        'Jenis Toko'
    ];
    worksheet.getRow(11).values = [
        '',
        '',
        '',
        '',
        '',
        'NIB',
        'Nomor NIB',
        'Status',
        '',
        '',
        ''
    ];

    worksheet.mergeCells('F10:H10');
    worksheet.getCell('F10').value = 'Nomor Induk Berusaha';
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);
    const headerRow2 = worksheet.getRow(11);
    styleHeader(headerRow2);

    let rowIndex = 12;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama dan Alamat Lokasi Tempat Usaha'].Nama || '',
                value['Nama dan Alamat Lokasi Tempat Usaha'].Alamat || '',
                value['Nama dan Alamat Pemilik'].Nama || '',
                value['Nama dan Alamat Pemilik'].Alamat || '',
                value['NOMOR_INDUK_BERUSAHA_(NIB)'].NIB || '',
                value['NOMOR_INDUK_BERUSAHA_(NIB)'].Nomor || '',
                value['NOMOR_INDUK_BERUSAHA_(NIB)'].Status || '',
                value['No Telp'] || '',
                value['Komoditi atau KBLI'] || '',
                value['Jenis Toko'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 6. Toko Modern Memasarkan UMKM
async function getTokoModernMemasarkanUMKMData() {
    const tokoRef = ref(db, 'Bidang Perdagangan/Data Toko Modern Memasarkan UMKM');
    const snapshot = await get(tokoRef);
    return snapshot.val();
}

async function generateTokoModernMemasarkanUMKMSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Toko Modern',
        'Alamat',
        'Produk UMKM yang Dipasarkan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Toko Modern'] || '',
                value['Alamat'] || '',
                value['Produk UMKM yang Dipasarkan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 7. Komoditas Ekspor
async function getKomoditasEksporData() {
    const eksporRef = ref(db, 'Bidang Perdagangan/Komoditas Ekspor');
    const snapshot = await get(eksporRef);
    return snapshot.val();
}

async function generateKomoditasEksporSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Komoditas',
        'Perusahaan',
        'Alamat',
        'Negara Tujuan',
        'Keterangan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Komoditas'] || '',
                value['Perusahaan'] || '',
                value['Alamat'] || '',
                value['Negara Tujuan'] || '',
                value['Keterangan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 8. Matrika Ekspor
async function getMatrikaEksporData() {
    const matrikaRef = ref(db, 'Bidang Perdagangan/Matrika Ekspor');
    const snapshot = await get(matrikaRef);
    return snapshot.val();
}

async function generateMatrikaEksporSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Barang Ekspor',
        'Perusahaan',
        'Produksi',
        '',
        'Ekspor',
        '',
        'Nilai (USD)',
        'Negara Tujuan',
        'Komoditas',
        'Keterangan'
    ];
    worksheet.getRow(11).values = [
        '',
        '',
        '',
        'Kapasitas',
        'Satuan',
        'Kapasitas',
        'Satuan',
        '',
        '',
        '',
        '',
    ];

    worksheet.mergeCells('D10:E10');
    worksheet.getCell('D10').value = 'Produksi';
    worksheet.mergeCells('F10:G10');
    worksheet.getCell('F10').value = 'Ekspor';
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);
    const headerRow2 = worksheet.getRow(11);
    styleHeader(headerRow2);

    let rowIndex = 12;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Barang'] || '',
                value['Perusahaan'] || '',
                value['Produksi'].Kapasitas || '',
                value['Produksi'].Satuan || '',
                value['Ekspor'].Kapasitas || '',
                value['Ekspor'].Satuan || '',
                value['Nilai (usd)'] || '',
                value['Negara Tujuan'] || '',
                value['Komoditas'] || '',
                value['Keterangan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 9. Disparitas Harga
async function getDisparitasHargaData() {
    const disparitasRef = ref(db, 'Bidang Perdagangan/Disparitas Harga');
    const snapshot = await get(disparitasRef);
    return snapshot.val();
}

async function generateDisparitasHargaSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No', 
        'Nama Sampel Komoditi', 
        'Satuan',
        'Kabupaten Wonosobo',
        'Kabupaten Temanggung',
        'Selisih',
        'Persen'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama Sampel Komoditi'] || '',
                value['Satuan'] || '',
                value['Bulan n']?.['Kabupaten Wonosobo'] || '',
                value['Bulan n']?.['Kabupaten Temanggung'] || '',
                value['Selisih'] || '',
                value['Persen'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 10. Hasil Pengawasan
async function getHasilPengawasanData() {
    const pengawasanRef = ref(db, 'Bidang Perdagangan/Hasil Pengawasan');
    const snapshot = await get(pengawasanRef);
    return snapshot.val();
}

async function generateHasilPengawasanSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Kios Pupuk Lengkap',
        'Wilayah',
        'NIB',
        'Harga HET',
        'Papan Nama',
        'SPJB',
        'Penyerapan Kartu Tani (%)',
        'RDKK',
        'Hasil'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Kios Pupuk Lengkap'] || '',
                value['Wilayah'] || '',
                value['NOMOR_INDUK_BERUSAHA_(NIB)'] || '',
                value['Harga HET'] || '',
                value['Papan Nama'] || '',
                value['SPJB'] || '',
                value['Penyerapan Kartu Tani (%)'] || '',
                value['RDKK'] || '',
                value['Hasil'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// ============= BIDANG PASAR =============

// 1. Kondisi Pasar
async function getKondisiPasarData() {
    const pasarRef = ref(db, 'Bidang Pasar/Data Kondisi Pasar');
    const snapshot = await get(pasarRef);
    return snapshot.val();
}

async function generateKondisiPasarSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Pasar',
        'Fasilitas Tersedia',
        '',
        '',
        '',
        '',
        'Keterangan',
        '',
        ''
    ];
    worksheet.getRow(11).values = [
        '',
        '',
        'Areal Parkir',
        'TPS',
        'MCK',
        'Tempat Ibadah',
        'Bongkar Muat',
        'Baik',
        'Tidak Baik',
        'Perlu Penyempurnaan'
    ];
    
    worksheet.mergeCells('C10:G10');
    worksheet.getCell('C10').value = 'Fasilitas Tersedia';
    worksheet.mergeCells('H10:J10');
    worksheet.getCell('H10').value = 'Keterangan';

    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);
    const headerRow2 = worksheet.getRow(11);
    styleHeader(headerRow2);

    let rowIndex = 12;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama Pasar'] || '',
                value['Fasilitas']?.['Areal Parkir'] || '',
                value['Fasilitas'].TPS || '',
                value['Fasilitas'].MCK || '',
                value['Fasilitas']?.['Tempat Ibadah'] || '',
                value['Fasilitas']?.['Bongkar Muat'] || '',
                value['Kondisi'].Baik || '',
                value['Kondisi']?.['Perlu Penyempurnaan'] || '',
                value['Kondisi']?.['Tidak Baik'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 2. Los & Kios
async function getLosKiosData() {
    const losKiosRef = ref(db, 'Bidang Pasar/Data Los Kios Pasar');
    const snapshot = await get(losKiosRef);
    return snapshot.val();
}

async function generateLosKiosSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Pasar',
        'Alamat Lengkap',
        'Jumlah Los/Kios',
        '',
        'Jumlah Pedagang Los/Kios',
        '',
        'Jumlah yang Tidak Termanfaatkan',
        ''
    ];
    worksheet.getRow(11).values = [
        '',
        '',
        '',
        'Los',
        'Kios',
        'Los',
        'Kios',
        'Los',
        'Kios'
    ];
    
    worksheet.mergeCells('D10:E10');
    worksheet.getCell('D10').value = 'Jumlah Los/Kios';
    worksheet.mergeCells('F10:G10');
    worksheet.getCell('F10').value = 'Jumlah Pedagang Los/Kios';
    worksheet.mergeCells('H10:I10');
    worksheet.getCell('H10').value = 'Jumlah yang Tidak Termanfaatkan';

    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);
    const headerRow2 = worksheet.getRow(11);
    styleHeader(headerRow2);

    let rowIndex = 12;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah') {
                const row = worksheet.getRow(rowIndex);
                row.values = [
                    no++,
                    value['Nama Pasar'] || '',
                    value['Alamat Lengkap'] || '',
                    value['Jumlah LosKios']?.los || 0,
                    value['Jumlah LosKios']?.kios || 0,
                    value['Jumlah Pedagang']?.los || 0,
                    value['Jumlah Pedagang']?.kios || 0,
                    value['Jumlah Tidak Termanfaatkan']?.los || 0,
                    value['Jumlah Tidak Termanfaatkan']?.kios || 0
                ];
                styleDataRow(row);
                rowIndex++;
            }
        });

        const jumlahData = data['Jumlah'];
        const totalRow = worksheet.getRow(rowIndex);
        totalRow.values = [
            '',
            'JUMLAH',
            '',
            jumlahData['Jumlah LosKios']?.los || 0,
            jumlahData['Jumlah LosKios']?.kios || 0,
            jumlahData['Jumlah Pedagang']?.los || 0,
            jumlahData['Jumlah Pedagang']?.kios || 0,
            jumlahData['Jumlah Tidak Termanfaatkan']?.los || 0,
            jumlahData['Jumlah Tidak Termanfaatkan']?.kios || 0
        ];

        worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
        worksheet.getCell(`A${rowIndex}`).value = 'JUMLAH';
        worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center' };

        styleDataRow(totalRow);
        totalRow.font = { bold: true };
    }
    autoFitColumns(worksheet);
}

// 3. Profil Pasar
async function getProfilData() {
    const profilRef = ref(db, 'Bidang Pasar/Matriks Profil Pasar');
    const snapshot = await get(profilRef);
    return snapshot.val();
}

async function generateProfilSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'UPT',
        'Nama Pasar',
        'Jumlah Paguyuban Pedagang',
        'Alamat',
        'Tahun Berdiri',
        'Luas',
        '',
        '',
        'Jumlah',
        '',
        '',
        'Jumlah Pedagang',
        '',
        '',
        'Fasilitas Tersedia',
        '',
        '',
        '',
        '',
        'Keterangan'
    ];
    worksheet.getRow(11).values = [
        '',
        '',
        '',
        '',
        '',
        '',
        'Tanah',
        'Bangunan',
        'Jumlah Lantai',
        'Los',
        'Kios',
        'Dasaran',
        'Los',
        'Kios',
        'Dasaran',
        'Areal Parkir',
        'TPS',
        'MCK',
        'Tempat Ibadah',
        'Bongkar Muat',
        ''
    ];

    worksheet.mergeCells('G10:I10');
    worksheet.getCell('G10').value = 'Luas';
    worksheet.mergeCells('J10:L10');
    worksheet.getCell('J10').value = 'Jumlah';
    worksheet.mergeCells('M10:O10');
    worksheet.getCell('H10').value = 'Jumlah Pedagang';
    worksheet.mergeCells('P10:T10');
    worksheet.getCell('P10').value = 'Fasilitas Tersedia';

    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);
    const headerRow2 = worksheet.getRow(11);
    styleHeader(headerRow2);

    let rowIndex = 12;
    let no = 1;
    
    // Untuk menyimpan total
    let totalLos = 0;
    let totalKios = 0;
    let totalDasaran = 0;
    let totalPedagangLos = 0;
    let totalPedagangKios = 0;
    let totalPedagangDasaran = 0;
    let totalPasar = 0;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah') {
                const row = worksheet.getRow(rowIndex);
                
                // Menambah total
                totalLos += parseInt(value['Jumlah']?.los ?? 0);
                totalKios += parseInt(value['Jumlah']?.kios ?? 0);
                totalDasaran += parseInt(value['Jumlah']?.dasaran ?? 0);
                totalPedagangLos += parseInt(value['Jumlah Pedagang']?.los ?? 0);
                totalPedagangKios += parseInt(value['Jumlah Pedagang']?.kios ?? 0);
                totalPedagangDasaran += parseInt(value['Jumlah Pedagang']?.dasaran ?? 0);
                totalPasar++;

                row.values = [
                    no++,
                    value['UPT'] || '',
                    value['Nama Pasar'] || '',
                    value['Jumlah Paguyuban Pedagang'] || '',
                    value['Alamat'] || '',
                    value['Tahun Berdiri'] || '',
                    value['Luas']?.tanah ?? '',
                    value['Luas']?.bangunan ?? '',
                    value['Luas']?.lantai ?? '',
                    value['Jumlah']?.los ?? '',
                    value['Jumlah']?.kios ?? '',
                    value['Jumlah']?.dasaran ?? '',
                    value['Jumlah Pedagang']?.los ?? '',
                    value['Jumlah Pedagang']?.kios ?? '',
                    value['Jumlah Pedagang']?.dasaran ?? '',
                    value['Fasilitas']?.['Areal Parkir'] ?? '',
                    value['Fasilitas']?.TPS ?? '',
                    value['Fasilitas']?.MCK ?? '',
                    value['Fasilitas']?.['Tempat Ibadah'] ?? '',
                    value['Fasilitas']?.['Bongkar Muat'] ?? '',
                    value['Keterangan'] ?? ''
                ];
                styleDataRow(row);
                rowIndex++;
            }
        });

        // Tambahkan baris Jumlah
        const totalRow = worksheet.getRow(rowIndex);
        
        // Merge cells untuk kata "JUMLAH"
        worksheet.mergeCells(`A${rowIndex}:I${rowIndex}`);
        worksheet.getCell(`A${rowIndex}`).value = 'JUMLAH';
        worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center' };
        
        totalRow.values = [
            '', // A - akan di-merge
            '', // B - akan di-merge
            '', // C - akan di-merge
            '', // D - akan di-merge
            '', // E - akan di-merge
            '', // F - akan di-merge
            '', // G - akan di-merge
            '', // H - akan di-merge
            '', // I - akan di-merge
            totalLos,           // J
            totalKios,          // K
            totalDasaran,       // L
            totalPedagangLos,   // M
            totalPedagangKios,  // N
            totalPedagangDasaran, // O
            '', // P
            '', // Q
            '', // R
            '', // S
            '', // T
            `${totalPasar} Pasar` // U
        ];
        
        styleDataRow(totalRow);
        totalRow.font = { bold: true };
        totalRow.alignment = { horizontal: 'center' };
    }
    
    autoFitColumns(worksheet);
}

// ============= BIDANG KOPERASI =============

// 1. Pelaku UKM
async function getPelakuUKMData() {
    const ukmRef = ref(db, 'Bidang Koperasi/Data Pelaku UKM');
    const snapshot = await get(ukmRef);
    return snapshot.val();
}

async function generatePelakuUKMSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama',
        'Gender',
        'NIK',
        'No Telepon',
        'Email',
        'Sektor Usaha',
        'Alamat',
        'NIB',
        'Triwulan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['NAMA'] || '',
                value['GENDER'] || '',
                value['NIK'] || '',
                value['NO TELP'] || '',
                value['ALAMAT EMAIL'] || '',
                value['SEKTOR USAHA'] || '',
                value['ALAMAT'] || '',
                value['NIB'] || '-',
                value['TRIWULAN'] || '-'
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 2. UKM Berijin
async function getUKMBerijinData() {
    const ukmRef = ref(db, 'Bidang Koperasi/UKM Berijin');
    const snapshot = await get(ukmRef);
    return snapshot.val();
}

async function generateUKMBerijinSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama',
        'Gender',
        'NIK',
        'Alamat',
        'No Telepon',
        'Nama Usaha',
        'Jenis Usaha',
        'Triwulan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                
                value['Nama'] || '',
                value['Gender'] || '',
                value['NIK'] || '',
                value['Alamat'] || '',
                value['No Telp'] || '',
                value['Nama Usaha'] || '',
                value['Jenis Usaha'] || '',
                value['Triwulan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 3. UKM Akses Perbankan
async function getUKMAksesPerbankanData() {
    const ukmRef = ref(db, 'Bidang Koperasi/UKM Akses Perbankan');
    const snapshot = await get(ukmRef);
    return snapshot.val();
}

async function generateUKMAksesPerbankanSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'NIK',
        'Nama',
        'Gender',
        'Alamat',
        'Bidang Usaha',
        'Bank',
        'Triwulan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['NIK'] || '',
                value['Nama'] || '',
                value['Gender'] || '',
                value['Alamat'] || '',
                value['Bidang Usaha'] || '',
                value['Bank'] || '',
                value['Triwulan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 4. Wirausaha Bermitra UKM
async function getWirausahaBermitraUKMData() {
    const wirausahaRef = ref(db, 'Bidang Koperasi/Masyarakat Wirausaha Bermitra UKM');
    const snapshot = await get(wirausahaRef);
    return snapshot.val();
}

async function generateWirausahaBermitraUKMSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama',
        'Gender',
        'Alamat',
        'Bidang Usaha',
        'No Telp',
        'Triwulan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama'] || '',
                value['Gender'] || '',
                value['Alamat'] || '',
                value['Bidang Usaha'] || '',
                value['No Telp'] || '',
                value['Triwulan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 5. Akses Modal Usaha
async function getAksesModalUsahaData() {
    const modalRef = ref(db, 'Bidang Koperasi/Masyarakat Akses Modal Usaha');
    const snapshot = await get(modalRef);
    return snapshot.val();
}

async function generateAksesModalUsahaSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama',
        'Gender',
        'Alamat',
        'Bidang Usaha',
        'No Telp',
        'Triwulan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama'] || '',
                value['Gender'] || '',
                value['Alamat'] || '',
                value['Bidang Usaha'] || '',
                value['No Telp'] || '',
                value['Triwulan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 6. Miskin Peserta Pelatihan
async function getMiskinPesertaPelatihanData() {
    const pelatihanRef = ref(db, 'Bidang Koperasi/Masyarakat Miskin Peserta Pelatihan');
    const snapshot = await get(pelatihanRef);
    return snapshot.val();
}

async function generateMiskinPesertaPelatihanSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama',
        'Gender',
        'Alamat',
        'Bidang Usaha',
        'No Telp',
        'Triwulan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama'] || '',
                value['Gender'] || '',
                value['Alamat'] || '',
                value['Bidang Usaha'] || '',
                value['No Telp'] || '',
                value['Triwulan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 7. Koperasi Produksi
async function getKoperasiProduksiData() {
    const koperasiRef = ref(db, 'Bidang Koperasi/Jumlah Koperasi Produksi');
    const snapshot = await get(koperasiRef);
    return snapshot.val();
}

async function generateKoperasiProduksiSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Koperasi',
        'Alamat',
        'Produk',
        'Bulan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama Koperasi'] || '',
                value['Alamat'] || '',
                value['Produk'] || '',
                value['Bulan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 8. Koperasi Aktif
async function getKoperasiAktifData() {
    const koperasiRef = ref(db, 'Bidang Koperasi/Jumlah Seluruh Koperasi Aktif');
    const snapshot = await get(koperasiRef);
    return snapshot.val();
}

async function generateKoperasiAktifSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'NIK',
        'Nama Koperasi',
        'No Badan Hukum',
        'Alamat',
        'Desa',
        'Kelurahan',
        'Kecamatan'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['NIK'] || '',
                value['Nama Koperasi'] || '',
                value['No Badan Hukum'] || '',
                value['Alamat'] || '',
                value['Desa'] || '',
                value['Kelurahan'] || '',
                value['Kecamatan'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 9. Akses Pasar Online
async function getAksesPasarOnlineData() {
    const pasarRef = ref(db, 'Bidang Koperasi/Koperasi Produksi Akses Pasar Online');
    const snapshot = await get(pasarRef);
    return snapshot.val();
}

async function generateAksesPasarOnlineSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Koperasi',
        'Alamat',
        'Media Pemasaran'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama Koperasi'] || '',
                value['Alamat'] || '',
                value['Media Pemasaran'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 10. Akses Kredit Bank
async function getAksesKreditBankData() {
    const kreditRef = ref(db, 'Bidang Koperasi/Koperasi Akses Kredit Bank');
    const snapshot = await get(kreditRef);
    return snapshot.val();
}

async function generateAksesKreditBankSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Koperasi',
        'Alamat',
        'Bank Pemberi Fasilitas'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama Koperasi'] || '',
                value['Alamat'] || '',
                value['Bank Pemberi Fasilitas'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 11. Koperasi Sehat
async function getKoperasiSehatData() {
    const sehatRef = ref(db, 'Bidang Koperasi/Jumlah Koperasi Sehat');
    const snapshot = await get(sehatRef);
    return snapshot.val();
}

async function generateKoperasiSehatSheet(worksheet, data) {
    worksheet.getRow(10).values = [
        'No',
        'Nama Koperasi',
        'Alamat',
        'Hasil',
        'Tahun Penilaian'
    ];
    
    const headerRow = worksheet.getRow(10);
    styleHeader(headerRow);

    let rowIndex = 11;
    let no = 1;
    
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.values = [
                no++,
                value['Nama Koperasi'] || '',
                value['Alamat'] || '',
                value['Hasil'] || '',
                value['Tahun Penilaian'] || ''
            ];
            styleDataRow(row);
            rowIndex++;
        });
    }
    autoFitColumns(worksheet);
}

// 12. Rekap Omzet
async function getRekapOmzetData() {
    const omzetRef = ref(db, 'Bidang Koperasi/Rekap Omzet Koperasi');
    const snapshot = await get(omzetRef);
    return snapshot.val();
}

async function generateRekapOmzetSheet(worksheet, data) {
    // Header
    worksheet.getRow(10).values = [
        'No',
        'Kecamatan',
        'Anggota',
        '',
        '',
        'Koperasi',
        '',
        '',
        'Manajer',
        '',
        '',
        'Karyawan',
        '',
        '',
        'Modal Sendiri',
        'Modal Luar',
        'Volume Usaha',
        'SHU',
        'RAT Unit'
    ];

    // Sub header
    worksheet.getRow(11).values = [
        '',
        '',
        'Jumlah',
        'Aktif',
        'Tidak Aktif',
        'Jumlah',
        'Aktif',
        'Tidak Aktif',
        'Jumlah',
        'Aktif',
        'Tidak Aktif',
        'Jumlah',
        'Aktif',
        'Tidak Aktif',
        '',
        '',
        '',
        '',
        ''
    ];

    // Merge cells untuk header
    worksheet.mergeCells('A10:A11');  // No
    worksheet.mergeCells('B10:B11');  // Kecamatan
    worksheet.mergeCells('C10:E10');  // Anggota
    worksheet.mergeCells('F10:H10');  // Koperasi
    worksheet.mergeCells('I10:K10');  // Manajer
    worksheet.mergeCells('L10:N10');  // Karyawan
    worksheet.mergeCells('O10:O11');  // Modal Sendiri
    worksheet.mergeCells('P10:P11');  // Modal Luar
    worksheet.mergeCells('Q10:Q11');  // Volume Usaha
    worksheet.mergeCells('R10:R11');  // SHU
    worksheet.mergeCells('S10:S11');  // RAT Unit

    // Style headers
    styleHeader(worksheet.getRow(10));
    styleHeader(worksheet.getRow(11));

    let rowIndex = 12;
    let no = 1;
    
    // Untuk menyimpan total
    let totalAnggota = { jumlah: 0, aktif: 0, tidakAktif: 0 };
    let totalKoperasi = { jumlah: 0, aktif: 0, tidakAktif: 0 };
    let totalManajer = { jumlah: 0, aktif: 0, tidakAktif: 0 };
    let totalKaryawan = { jumlah: 0, aktif: 0, tidakAktif: 0 };
    let totalModalSendiri = 0;
    let totalModalLuar = 0;
    let totalVolumeUsaha = 0;
    let totalSHU = 0;
    let totalRAT = 0;

    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'Jumlah') {
                const row = worksheet.getRow(rowIndex);
                
                // Menghitung total
                totalAnggota.jumlah += parseInt(value.Anggota?.['Jumlah Anggota'] || 0);
                totalAnggota.aktif += parseInt(value.Anggota?.Aktif || 0);
                totalAnggota.tidakAktif += parseInt(value.Anggota?.['Tidak Aktif'] || 0);
                totalKoperasi.jumlah += parseInt(value.Koperasi?.['Jumlah Koperasi'] || 0);
                totalKoperasi.aktif += parseInt(value.Koperasi?.Aktif || 0);
                totalKoperasi.tidakAktif += parseInt(value.Koperasi?.['Tidak Aktif'] || 0);
                totalManajer.jumlah += parseInt(value.Manajer?.Jumlah || 0);
                totalManajer.aktif += parseInt(value.Manajer?.Aktif || 0);
                totalManajer.tidakAktif += parseInt(value.Manajer?.['Tidak Aktif'] || 0);
                totalKaryawan.jumlah += parseInt(value.Karyawan?.Jumlah || 0);
                totalKaryawan.aktif += parseInt(value.Karyawan?.Aktif || 0);
                totalKaryawan.tidakAktif += parseInt(value.Karyawan?.['Tidak Aktif'] || 0);
                totalModalSendiri += parseInt(value['Modal Sendiri']?.replace(/[^\d]/g, '') || 0);
                totalModalLuar += parseInt(value['Modal Luar']?.replace(/[^\d]/g, '') || 0);
                totalVolumeUsaha += parseInt(value['Volume Usaha']?.replace(/[^\d]/g, '') || 0);
                totalSHU += parseInt(value['SHU']?.replace(/[^\d]/g, '') || 0);
                totalRAT += parseInt(value['RAT Unit'] || 0);

                row.values = [
                    no++,
                    value.Kecamatan || '',
                    value.Anggota?.['Jumlah Anggota'] || '',
                    value.Anggota?.Aktif || '',
                    value.Anggota?.['Tidak Aktif'] || '',
                    value.Koperasi?.['Jumlah Koperasi'] || '',
                    value.Koperasi?.Aktif || '',
                    value.Koperasi?.['Tidak Aktif'] || '',
                    value.Manajer?.Jumlah || '',
                    value.Manajer?.Aktif || '',
                    value.Manajer?.['Tidak Aktif'] || '',
                    value.Karyawan?.Jumlah || '',
                    value.Karyawan?.Aktif || '',
                    value.Karyawan?.['Tidak Aktif'] || '',
                    value['Modal Sendiri'] || '',
                    value['Modal Luar'] || '',
                    value['Volume Usaha'] || '',
                    value['SHU'] || '',
                    value['RAT Unit'] || ''
                ];
                styleDataRow(row);
                rowIndex++;
            }
        });

        // Tambahkan baris Jumlah
        const totalRow = worksheet.getRow(rowIndex);

        totalRow.values = [
            'JUMLAH',
            '',
            totalAnggota.jumlah,
            totalAnggota.aktif,
            totalAnggota.tidakAktif,
            totalKoperasi.jumlah,
            totalKoperasi.aktif,
            totalKoperasi.tidakAktif,
            totalManajer.jumlah,
            totalManajer.aktif,
            totalManajer.tidakAktif,
            totalKaryawan.jumlah,
            totalKaryawan.aktif,
            totalKaryawan.tidakAktif,
            `Rp. ${totalModalSendiri.toLocaleString()}`,
            `Rp. ${totalModalLuar.toLocaleString()}`,
            `Rp. ${totalVolumeUsaha.toLocaleString()}`,
            `Rp. ${totalSHU.toLocaleString()}`,
            totalRAT
        ];

        worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
        worksheet.getCell(`A${rowIndex}`).value = 'JUMLAH';
        worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center' };

        styleDataRow(totalRow);
        totalRow.font = { bold: true };
    }
    
    autoFitColumns(worksheet);
}

// Fungsi helper untuk styling
function styleHeader(row) {
    row.eachCell(cell => {
        cell.font = { bold: true, color: { argb: '000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
    row.height = 30; // Sesuaikan tinggi header
}

function styleDataRow(row) {
    row.eachCell(cell => {
        cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
}

function autoFitColumns(worksheet) {
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            // Jika nilai cell adalah angka, gunakan panjang default
            if (typeof cell.value === 'number') {
                maxLength = Math.max(maxLength, 8);
                return;
            }
            
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        
        // Tetapkan batas minimum dan maksimum untuk lebar kolom
        const minWidth = 8;
        const maxWidth = 20;
        
        // Hitung lebar yang sesuai
        let finalWidth = maxLength < minWidth ? minWidth : maxLength + 2;
        
        // Terapkan batas maksimum
        finalWidth = Math.min(finalWidth, maxWidth);
        
        // Terapkan lebar kolom
        column.width = finalWidth;
    });
}