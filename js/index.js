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
const importDataLink = document.getElementById('import-link');
const newDocumentLink = document.getElementById('document-link');

const Dashboard = document.getElementById('Dashboard');
const bidangPerdagangan = document.getElementById('Bidang-Perdagangan');
const bidangPasar = document.getElementById('Bidang-Pasar');
const bidangKoperasi = document.getElementById('Bidang-Koperasi');
const exportData = document.getElementById('Export-Data');
const importData = document.getElementById('Import-Data');
const newDocument = document.getElementById('New-Document');

bidangPerdagangan.style.display = 'none';
bidangPasar.style.display = 'none';
bidangKoperasi.style.display = 'none';
exportData.style.display = 'none';
importData.style.display = 'none';
newDocument.style.display = 'none';

function closePopup() {
    const editPopup = document.getElementById('editDataPopup');
    const addPopup = document.getElementById('addDataPopup');

    if (editPopup) {
        editPopup.style.display = 'none';
    }

    if (addPopup) {
        addPopup.style.display = 'none';
    }
}
        
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
        importData.style.display = 'none';
        newDocument.style.display = 'none';
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
        importData.style.display = 'none';
        newDocument.style.display = 'none';
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
        importData.style.display = 'none';
        newDocument.style.display = 'none';
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
        importData.style.display = 'none';
        newDocument.style.display = 'none';
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
        importData.style.display = 'none';
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
        importData.style.display = 'none';
        newDocument.style.display = 'block';
        updateActiveState(this);
    });
}

if (importDataLink) {
    importDataLink.addEventListener('click', function() {
        Dashboard.style.display = 'none';
        bidangPerdagangan.style.display = 'none';
        bidangPasar.style.display = 'none';
        bidangKoperasi.style.display = 'none';
        exportData.style.display = 'none';
        importData.style.display = 'block';
        newDocument.style.display = 'none';
        updateActiveState(this);
    });
}

function handleExportData() {
    const exportCards = document.querySelectorAll('.export-card');
    const selectAllBtn = document.querySelector('.select-all-btn');
    const deselectAllBtn = document.querySelector('.deselect-all-btn');
    const exportSelectedBtn = document.querySelector('.export-selected-btn');

    exportCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            updateExportButtonState();
        });
    });

    selectAllBtn.addEventListener('click', () => {
        exportCards.forEach(card => {
            card.classList.add('active');
        });
        updateExportButtonState();
    });

    deselectAllBtn.addEventListener('click', () => {
        exportCards.forEach(card => {
            card.classList.remove('active');
        });
        updateExportButtonState();
    });

    function updateExportButtonState() {
        const selectedCards = document.querySelectorAll('.export-card.active');
        exportSelectedBtn.disabled = selectedCards.length === 0;
        exportSelectedBtn.style.opacity = selectedCards.length === 0 ? '0.5' : '1';
    }

    exportSelectedBtn.addEventListener('click', () => {
        const selectedTables = Array.from(document.querySelectorAll('.export-card.active'))
            .map(card => card.dataset.table);
        
        if (selectedTables.length > 0) {
            console.log('Mengexport tabel:', selectedTables);
        }
    });

    updateExportButtonState();
}

document.addEventListener('DOMContentLoaded', () => {
    handleExportData();
});