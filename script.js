// Get all elements
const stamp = document.getElementById('stamp');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const cardHotspots = document.querySelectorAll('.card-hotspot');
const fullsizeViewer = document.getElementById('fullsizeViewer');
const fullsizeImage = document.getElementById('fullsizeImage');
const clickToEnter = document.getElementById('clickToEnter');

let isOpened = false;
let currentCard = null;

console.log('Page loaded - stamp element:', stamp);

// Stamp click to open envelope
if (stamp) {
    stamp.addEventListener('click', function(e) {
        console.log('Stamp clicked!');
        e.stopPropagation();
        if (!isOpened) {
            console.log('Opening envelope...');
            envelopeWrapper.classList.add('opening');
            isOpened = true;
        } else {
            console.log('Already opened');
        }
    });
    console.log('Click listener added to stamp');
} else {
    console.error('Stamp element not found!');
}

// Card hotspot click to view fullsize
cardHotspots.forEach(hotspot => {
    hotspot.addEventListener('click', function() {
        console.log('Card clicked');
        const cardSrc = hotspot.getAttribute('data-card');
        currentCard = cardSrc;
        fullsizeImage.src = cardSrc;
        fullsizeViewer.classList.add('active');
        console.log('Fullsize viewer activated');
        
        // Show click-to-enter for all cards
        setTimeout(() => {
            fullsizeViewer.classList.add('show-enter');
            console.log('Click-to-enter should now be visible');
        }, 300);
    });
});

// Click on fullsize image (works for gardencard and circularcard with click-to-enter)
fullsizeImage.addEventListener('click', function(e) {
    console.log('Fullsize image clicked, currentCard:', currentCard);
    console.log('Has show-enter class:', fullsizeViewer.classList.contains('show-enter'));
    if (fullsizeViewer.classList.contains('show-enter')) {
        e.stopPropagation();
        if (currentCard === 'gardencard.png') {
            // Navigate to garden.html
            window.location.href = 'garden.html';
        } else if (currentCard === 'circularcard.png') {
            // Navigate to circular.html
            window.location.href = 'circular.html';
        } else if (currentCard === 'sandcard.png') {
            // Navigate to sand.html
            console.log('Navigating to sand.html');
            window.location.href = 'sand.html';
        }
    }
});

// Close fullsize viewer when clicking on background (not on image)
fullsizeViewer.addEventListener('click', function(e) {
    if (e.target === fullsizeViewer) {
        fullsizeViewer.classList.remove('active', 'show-enter');
        currentCard = null;
    }
});

// Close fullsize viewer function (for stamp click)
function closeFullsize() {
    fullsizeViewer.classList.remove('active', 'show-enter');
    currentCard = null;
}

// ESC key to close fullsize viewer
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fullsizeViewer.classList.contains('active')) {
        fullsizeViewer.classList.remove('active', 'show-enter');
        currentCard = null;
    }
});