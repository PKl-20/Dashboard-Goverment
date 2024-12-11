const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {                         
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})

const dashboardLink = document.getElementById('dashboard-link');
const bidangPerdaganganLink = document.getElementById('perdagangan-link');
const bidangPasarLink = document.getElementById('pasar-link');
const bidangKoperasiLink = document.getElementById('koperasi-link');
const exportDataLink = document.getElementById('data-link');
const newDocumentLink = document.getElementById('document-link');

const Dashboard = document.getElementById('Dashboard');
const bidangPerdagangan = document.getElementById('Bidang-Perdagangan');
const bidangPasar = document.getElementById('Bidang-Pasar');
const bidangKoperasi = document.getElementById('Bidang-Koperasi');
const exportData = document.getElementById('Export-Data');
const newDocument = document.getElementById('New-Document');

bidangPerdagangan.style.display = 'none';
bidangPasar.style.display = 'none';
bidangKoperasi.style.display = 'none';
exportData.style.display = 'none';
newDocument.style.display = 'none';
        
function updateActiveState(activeLink) {
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (!link.classList.contains('dropdown-btn')) {
            link.classList.remove('active');
        }
    });
    
    if (activeLink && !activeLink.classList.contains('dropdown-btn')) {
        activeLink.classList.add('active');
    }
}
        
if (dashboardLink) {
    dashboardLink.addEventListener('click', function() {
        Dashboard.style.display = 'block';
        bidangPerdagangan.style.display = 'none';
        bidangPasar.style.display = 'none';
        bidangKoperasi.style.display = 'none';
        exportData.style.display = 'none';
        newDocument.style.display = 'none';
        subMenuPerdagangan = 'none';
        subMenuPasar = 'none';
        subMenuKoperasi = 'none';
        updateActiveState(this);
    });
}
        
if (bidangPerdaganganLink) {
    bidangPerdaganganLink.addEventListener('click', function() {
        Dashboard.style.display = 'none';
        bidangPerdagangan.style.display = 'block';
        bidangPasar.style.display = 'none';
        bidangKoperasi.style.display = 'none';
        exportData.style.display = 'none';
        newDocument.style.display = 'none';
        subMenuPerdagangan = 'block';
        subMenuPasar = 'none';
        subMenuKoperasi = 'none';
        updateActiveState(this);
    });
}

if (bidangPasarLink) {
    bidangPasarLink.addEventListener('click', function() {
        Dashboard.style.display = 'none';
        bidangPerdagangan.style.display = 'none';
        bidangPasar.style.display = 'block';
        bidangKoperasi.style.display = 'none';
        exportData.style.display = 'none';
        newDocument.style.display = 'none';
        subMenuPerdagangan = 'none';
        subMenuPasar = 'block';
        subMenuKoperasi = 'none';
        updateActiveState(this);
    });
}

if (bidangKoperasiLink) {
    bidangKoperasiLink.addEventListener('click', function() {
        Dashboard.style.display = 'none';
        bidangPerdagangan.style.display = 'none';
        bidangPasar.style.display = 'none';
        bidangKoperasi.style.display = 'block';
        exportData.style.display = 'none';
        newDocument.style.display = 'none';
        subMenuPerdagangan = 'none';
        subMenuPasar = 'none';
        subMenuKoperasi = 'block';
        updateActiveState(this);
    });
}

if (exportDataLink) {
    exportDataLink.addEventListener('click', function() {
        Dashboard.style.display = 'none';
        bidangPerdagangan.style.display = 'none';
        bidangPasar.style.display = 'none';
        bidangKoperasi.style.display = 'none';
        exportData.style.display = 'block';
        newDocument.style.display = 'none';
        updateActiveState(this);
    });
}

if (newDocumentLink) {
    newDocumentLink.addEventListener('click', function() {
        Dashboard.style.display = 'none';
        bidangPerdagangan.style.display = 'none';
        bidangPasar.style.display = 'none';
        bidangKoperasi.style.display = 'none';
        exportData.style.display = 'none';
        newDocument.style.display = 'block';
        updateActiveState(this);
    });
}