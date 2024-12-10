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

// Select all sidebar links and main sections
const sidebarLinks = document.querySelectorAll('.sidebar a');
const mainSections = document.querySelectorAll('main');

// Initially hide all main sections except the Dashboard
mainSections.forEach(section => {
    if (section.id !== 'Dashboard') {
        section.style.display = 'none';
    }
});

// Function to update active state and display the correct section
function updateSection(activeLink, sectionId) {
    // Remove 'active' class from all links
    sidebarLinks.forEach(link => link.classList.remove('active'));
    // Add 'active' class to the clicked link
    activeLink.classList.add('active');

    // Hide all main sections
    mainSections.forEach(section => section.style.display = 'none');
    // Show the selected main section
    document.getElementById(sectionId).style.display = 'block';
}

// Add event listeners to each sidebar link
sidebarLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        const sectionId = this.querySelector('h3').textContent.replace(/\s+/g, '-');

        // Check if the clicked link is the logout button
        if (sectionId === 'Logout') {
            event.preventDefault();
            return;
        }

        updateSection(this, sectionId);
    });
});

document.getElementById('Dashboard').style.display = 'block';
