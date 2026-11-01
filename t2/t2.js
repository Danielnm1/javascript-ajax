'use strict';

// user information to send to the API
const user = {name:"John Doe",job:"developer",};

// API endpoint 

const requestURL = 'https://reqres.in/api/users';

// create an asynchronous function

async function createUser(){

    try{

        //send a post request

        const response = await fetch(requestURL,{

            method:'POST',
            headers:{'Content-Type':'application/json',
                'x-api-key': 'reqres-free-v1',
            },
            body:JSON.stringify(user),
        });
    // check whether the request was successfull

    if(!response.ok){

        throw new Error(`HTTP error: ${response.status}`);
    }

    // convert the response into JavaScript data
        const responseData = await response.json();
        // Display the response
        console.log(responseData);
    } catch(error){
        console.error('An error occurred:', error.message);

    }

}

// Start the request
createUser();