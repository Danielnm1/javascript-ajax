'use strict';

// API endpoint
const API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

// Select HTML elements
const restaurantList = document.querySelector('#restaurant-list');
const loadingMessage = document.querySelector('#loading-message');
const errorMessage = document.querySelector('#error-message');

const dialog = document.querySelector('#restaurant-dialog');
const restaurantDetails = document.querySelector('#restaurant-details');
const closeButton = document.querySelector('#close-button');

const menuLoading = document.querySelector('#menu-loading');
const menuError = document.querySelector('#menu-error');
const menuContent = document.querySelector('#menu-content');

// Store the restaurants retrieved from the API
let restaurants = [];

// Reusable function for making API requests
async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

// Display all restaurants in the table
function displayRestaurants() {
  restaurantList.textContent = '';

  // Create a sorted copy of the restaurant array by name
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  sortedRestaurants.forEach((restaurant) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = restaurant.name;

    const addressCell = document.createElement('td');
    addressCell.textContent = restaurant.address;

    row.appendChild(nameCell);
    row.appendChild(addressCell);

    // Handle clicks on the row
    row.addEventListener('click', () => {
      // Remove previous highlighting
      document.querySelectorAll('tr.highlight').forEach((selectedRow) => {
        selectedRow.classList.remove('highlight');
      });

      // Highlight selected row
      row.classList.add('highlight');

      // Display details and show modal
      displayRestaurantDetails(restaurant);
      dialog.showModal();

      // Retrieve menu
      getRestaurantMenu(restaurant);
    });

    restaurantList.appendChild(row);
  });
}

// Display selected restaurant details inside the modal
function displayRestaurantDetails(restaurant) {
  restaurantDetails.textContent = '';

  const heading = document.createElement('h2');
  heading.textContent = restaurant.name;
  restaurantDetails.appendChild(heading);

  const details = [
    { label: 'Address', value: restaurant.address },
    { label: 'Postal code', value: restaurant.postalCode },
    { label: 'City', value: restaurant.city },
    { label: 'Phone', value: restaurant.phone },
    { label: 'Company', value: restaurant.company },
  ];

  details.forEach((detail) => {
    const paragraph = document.createElement('p');

    const label = document.createElement('strong');
    label.textContent = `${detail.label}: `;

    const value = document.createElement('span');
    value.textContent = detail.value ?? 'Not available';

    paragraph.appendChild(label);
    paragraph.appendChild(value);

    restaurantDetails.appendChild(paragraph);
  });
}

// Retrieve daily menu for selected restaurant
async function getRestaurantMenu(restaurant) {
  menuContent.textContent = '';
  menuError.textContent = '';
  menuLoading.textContent = "Loading today's menu...";

  try {
    //  target _id as required by Metropolia API spec
    const restaurantId = restaurant._id;

    if (!restaurantId) {
      throw new Error('The selected restaurant has no valid _id.');
    }

    // GET /api/v1/restaurants/daily/:id/:lang
    const menuURL = `${API_URL}/restaurants/daily/${encodeURIComponent(restaurantId)}/en`;

    const menuData = await fetchData(menuURL);

    menuLoading.textContent = '';

    // Display the daily menu
    displayMenu(menuData);
  } catch (error) {
    menuLoading.textContent = '';
    menuError.textContent = `Could not load the menu: ${error.message}`;

    console.error('Menu request failed:', error);
  }
}

// Display courses in the daily menu
function displayMenu(menuData) {
  menuContent.textContent = '';

  const courses = menuData.courses;

  if (!Array.isArray(courses) || courses.length === 0) {
    menuContent.textContent = 'No menu information available for today.';
    return;
  }

  const courseList = document.createElement('ul');

  courses.forEach((course) => {
    const listItem = document.createElement('li');

    const name = document.createElement('h4');
    name.textContent = course.name ?? 'Unnamed course';

    const price = document.createElement('p');
    price.textContent = `Price: ${course.price ?? 'Not available'}`;

    const diets = document.createElement('p');
    diets.textContent = `Diets: ${course.diets ?? 'Not available'}`;

    listItem.appendChild(name);
    listItem.appendChild(price);
    listItem.appendChild(diets);

    courseList.appendChild(listItem);
  });

  menuContent.appendChild(courseList);
}

// Load all restaurants when application starts
async function getRestaurants() {
  loadingMessage.textContent = 'Loading restaurants...';
  errorMessage.textContent = '';

  try {
    // Fetch all restaurants
    const restaurantData = await fetchData(`${API_URL}/restaurants`);

    // Flexible extraction: handles { restaurants: [...] }, { data: [...] }, or raw array [...]
    if (Array.isArray(restaurantData)) {
      restaurants = restaurantData;
    } else if (Array.isArray(restaurantData.restaurants)) {
      restaurants = restaurantData.restaurants;
    } else if (Array.isArray(restaurantData.data)) {
      restaurants = restaurantData.data;
    } else {
      throw new Error('Invalid restaurant data structure received from API.');
    }

    // Display restaurants
    displayRestaurants();

    loadingMessage.textContent = '';
  } catch (error) {
    loadingMessage.textContent = '';
    errorMessage.textContent = `Could not load restaurants: ${error.message}`;

    console.error('Restaurant request failed:', error);
  }
}

// Close dialog and clear highlighted row
closeButton.addEventListener('click', () => {
  dialog.close();

  document.querySelectorAll('tr.highlight').forEach((selectedRow) => {
    selectedRow.classList.remove('highlight');
  });
});

// Start the application
getRestaurants();