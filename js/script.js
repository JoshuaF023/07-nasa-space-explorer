// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get the button and gallery elements
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA API key
const API_KEY = '16qgs6wc33x7JcTixyufLmfFW0Ja6x33HLRLC1OO';

// Function to fetch images from NASA APOD API
async function fetchSpaceImages(startDate, endDate) {
  // Show loading message
  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🔄</div><p>Loading space photos…</p></div>`;

  // Build the API URL
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from NASA
    const response = await fetch(url);
    const data = await response.json();

    // If the API returns a single object, put it in an array
    const images = Array.isArray(data) ? data : [data];

    // Show the gallery
    showGallery(images);
  } catch (error) {
    // Show error message
    gallery.innerHTML = `<div class="placeholder"><p>Sorry, something went wrong. Please try again!</p></div>`;
  }
}

// Function to display the gallery
function showGallery(images) {
  // If no images, show a message
  if (!images.length) {
    gallery.innerHTML = `<div class="placeholder"><p>No images found for this date range.</p></div>`;
    return;
  }

  // Create HTML for each image
  gallery.innerHTML = images.map((item, index) => {
    // Only show images (not videos)
    if (item.media_type !== 'image') return '';
    return `
      <div class="gallery-item" data-index="${index}">
        <img src="${item.url}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      </div>
    `;
  }).join('');

  // Add click event to each gallery item
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const idx = item.getAttribute('data-index');
      showModal(images[idx]);
    });
  });
}

// Function to show the modal
function showModal(imageData) {
  // Create modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <button class="close-modal">&times;</button>
      <img src="${imageData.hdurl || imageData.url}" alt="${imageData.title}" />
      <h2>${imageData.title}</h2>
      <p><strong>Date:</strong> ${imageData.date}</p>
      <p>${imageData.explanation}</p>
    </div>
  `;
  document.body.appendChild(modal);

  // Close modal on button click or overlay click
  modal.querySelector('.close-modal').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// Listen for button click to get images
getImagesButton.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  fetchSpaceImages(startDate, endDate);
});
