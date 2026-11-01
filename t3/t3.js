'use strict';

// URL of a resource that does not exist
const requestURL = 'https://reqres.in/api/unknown/23';

// Create an asynchronous function
async function getNonExistingResource() {
  try {
    // Send a GET request
    const response = await fetch(requestURL, {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });

    // Throw an error if the response is unsuccessful
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    // Convert the response into JavaScript data
    const data = await response.json();

    // Display the response
    console.log(data);
  } catch (error) {
    // Handle the error
    console.error('An error occurred:', error.message);
  }
}

// Start the request
getNonExistingResource();