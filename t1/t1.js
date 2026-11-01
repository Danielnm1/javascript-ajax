'use strict';

// URL of the user we want to retrieve

const requestURL = 'https://reqres.in/api/users/1';

// create asynchronous function

async function getUser(){

    try{ 
        // send GET request to the API
        
    const response = await fetch(requestURL ,{

        headers: {
        'x-api-key': 'reqres-free-v1',
      },});

      // check whether the request was successfull 

      if(!response.ok){
        throw new Error(`HTTP error:${response.status}`);
      }
      
      // convert JSOn into JavaScript data
      const userData = await response.json();

      // Display theresponse into the console
      console.log(userData);

    } catch(error){
        console.error('An error occurred:', error.message);
    }
}
getUser()