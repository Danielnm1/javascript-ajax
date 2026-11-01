'use strict';

// Reusable function for making API requests
async function fetchData(url, options = {}) {
  // Send the request
  const response = await fetch(url, options);

  // Check whether the response was successful
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  // Return the response data as JSON
  return response.json();
}

// Test the generic fetch function
async function testFetchData() {
  try {
    // User information to send
    const user = {
      name: 'John Doe',
      job: 'Developer',
    };

    // API endpoint
    const url = 'https://reqres.in/api/users';

    // Request options
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
      body: JSON.stringify(user),
    };

    // Call the reusable function
    const userData = await fetchData(url, options);

    // Display the response
    console.log(userData);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Start the test
testFetchData();