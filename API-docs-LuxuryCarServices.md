# Luxury Car Services

## Database Schema Design
![db-schema]

[db-schema]: ./Images/db-schema.png
---

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the correct role(s) or permission(s).

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

---

## USER ROUTES

### Get the Current User

Returns the information about the current user that is logged in.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: `/users/current`
  * Body: none 

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: `/users/login`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current user's information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: `/users/signup`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Error Response: User already exists with the specified email or username
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

---

## CARS

### Get all Cars

Returns all cars available for booking.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: `/cars`
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Cars": [
        {
          "id": 1,
          "ownerId": 1,
          "make": "Tesla",
          "model": "Model S",
          "year": 2021,
          "pricePerDay": 500,
          "description": "Luxury electric sedan",
          "location": "San Francisco, CA",
          "createdAt": "2021-11-19T20:39:36.000Z",
          "updatedAt": "2021-11-19T20:39:36.000Z",
          "avgRating": 4.8,
          "previewImage": "image_url"
        }
      ]
    }
    ```

### Get all Cars owned by the Current User

Returns all the cars owned (created) by the current logged-in user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: `/cars/current`
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Cars": [
        {
          "id": 1,
          "ownerId": 1,
          "make": "Tesla",
          "model": "Model S",
          "year": 2021,
          "pricePerDay": 500,
          "description": "Luxury electric sedan",
          "location": "San Francisco, CA",
          "createdAt": "2021-11-19T20:39:36.000Z",
          "updatedAt": "2021-11-19T20:39:36.000Z",
          "avgRating": 4.8,
          "previewImage": "image_url"
        }
      ]
    }
    ```

### Get details of a Car by ID

Returns the details of a car specified by its id.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: `/cars/:carId`
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "make": "Tesla",
      "model": "Model S",
      "year": 2021,
      "pricePerDay": 500,
      "description": "Luxury electric sedan",
      "location": "San Francisco, CA",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-19T20:39:36.000Z",
      "numReviews": 5,
      "avgStarRating": 4.8,
      "CarImages": [
        {
          "id": 1,
          "url": "image_url",
          "preview": true
        },
        {
          "id": 2,
          "url": "image_url",
          "preview": false
        }
      ],
      "Owner": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith"
      }
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

### Create a Car

Creates and returns a new car.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: `/cars`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "make": "Tesla",
      "model": "Model S",
      "year": 2021,
      "pricePerDay": 500,
      "description": "Luxury electric sedan",
      "location": "San Francisco, CA"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "make": "Tesla",
      "model": "Model S",
      "year": 2021,
      "pricePerDay": 500,
      "description": "Luxury electric sedan",
      "location": "San Francisco, CA",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-19T20:39:36.000Z"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "errors": {
        "make": "Make is required",
        "model": "Model is required",
        "year": "Year is required and must be a valid year",
        "pricePerDay": "Price per day must be a positive number",
        "description": "Description is required",
        "location": "Location is required"
      }
    }
    ```

### Add an Image to a Car

Create and return a new image for a car specified by id.

* Require Authentication: true
* Require proper authorization: Car must belong to the current user
* Request
  * Method: POST
  * Route path: `/cars/:carId/images`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "url": "image_url",
      "preview": true
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "url": "image_url",
      "preview": true
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

### Edit a Car

Updates and returns an existing car.

* Require Authentication: true
* Require proper authorization: Car must belong to the current user
* Request
  * Method: PUT
  * Route path: `/cars/:carId`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "make": "Tesla",
      "model": "Model S",
      "year": 2022,
      "pricePerDay": 550,
      "description": "Updated luxury electric sedan",
      "location": "San Francisco, CA"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "make": "Tesla",
      "model": "Model S",
      "year": 2022,
      "pricePerDay": 550,
      "description": "Updated luxury electric sedan",
      "location": "San Francisco, CA",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-20T10:06:40.000Z"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "errors": {
        "make": "Make is required",
        "model": "Model is required",
        "year": "Year is required and must be a valid year",
        "pricePerDay": "Price per day must be a positive number",
        "description": "Description is required",
        "location": "Location is required"
      }
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

### Delete a Car

Deletes an existing car.

* Require Authentication: true
* Require proper authorization: Car must belong to the current user
* Request
  * Method: DELETE
  * Route path: `/cars/:carId`
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

---

## REVIEWS

### Get all Reviews of the Current User

Returns all the reviews written by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: `/reviews/current`
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "carId": 1,
          "review": "This car was an amazing ride!",
          "stars": 5,
          "createdAt": "2023-10-07 14:30:00",
          "updatedAt": "2023-10-07 14:30:00",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe"
          },
          "Car": {
            "id": 1,
            "ownerId": 1,
            "make": "Tesla",
            "model": "Model S",
            "year": 2022,
            "location": "San Francisco, CA",
            "pricePerDay": 500,
            "previewImage": "image_url"
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image_url"
            }
          ]
        }
      ]
    }
    ```

### Get all Reviews for a Car

Returns all the reviews that belong to a car specified by its id.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: `/cars/:carId/reviews`
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "carId": 1,
          "review": "Amazing experience!",
          "stars": 5,
          "createdAt": "2021-11-19T20:39:36.000Z",
          "updatedAt": "2021-11-19T20:39:36.000Z",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image_url"
            }
          ]
        }
      ]
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

### Create a Review for a Car

Create and return a new review for a car specified by id.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: `/cars/:carId/reviews`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "review": "Amazing experience!",
      "stars": 5
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "carId": 1,
      "review": "Amazing experience!",
      "stars": 5,
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-19T20:39:36.000Z"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5"
      }
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

* Error Response: Review from the current user already exists for the Car
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already has a review for this car"
    }
    ```

### Add an Image to a Review

Create and return a new image for a review specified by id.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: POST
  * Route path: `/reviews/:reviewId/images`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "url": "image_url"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "url": "image_url"
    }
    ```

* Error Response: Couldn't find a Review with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

### Edit a Review

Update and return an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: PUT
  * Route path: `/reviews/:reviewId`
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "review": "Updated review text",
      "stars": 4
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "carId": 1,
      "review": "Updated review text",
      "stars": 4,
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-20T10:06:40.000Z"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5"
      }
    }
    ```

* Error response: Couldn't find a car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

* Error response: Review from the current user already exists for the car
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already has a review for this car"
    }
    ```

### Delete a Review

Delete an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: DELETE
  * Route path:/reviews/:reviewId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Couldn't find a Review with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

## BOOKINGS

### Get all of the Current User's Bookings

Return all the bookings that the current user has made.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /bookings/current
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "Bookings": [
    {
      "id": 1,
      "carId": 1,
      "Car": {
        "id": 1,
        "ownerId": 1,
        "make": "Tesla",
        "model": "Model S",
        "location": "San Francisco, CA",
        "pricePerDay": 500,
        "previewImage": "image_url"
      },
      "userId": 2,
      "startDate": "2021-11-19",
      "endDate": "2021-11-20",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-19T20:39:36.000Z"
        }
      ]
    }
    ```

### Get all Bookings for a Car based on the Car's id

Return all the bookings for a Car specified by id.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /cars/:carId/bookings
  * Body: none

* Successful Response: If you ARE NOT the owner of the car.
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Bookings": [
    {
      "carId": 1,
      "startDate": "2021-11-19",
      "endDate": "2021-11-20"
        }
      ]
    }
    ```

* Successful Response: If you ARE the owner of the Car.
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Bookings": [
    {
      "User": {
        "id": 2,
        "firstName": "John",
        "lastName": "Smith"
      },
      "id": 1,
      "carId": 1,
      "userId": 2,
      "startDate": "2021-11-19",
      "endDate": "2021-11-20",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-19T20:39:36.000Z"
        }
      ]
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

### Create a Booking for a Car based on the Car's id

Create and return a new booking from a Car specified by id.

* Require Authentication: true
* Require proper authorization: Car must NOT belong to the current user
* Request
  * Method: POST
  * Route path: /cars/:carId/bookings
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "startDate": "2021-11-19",
      "endDate": "2021-11-20"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "carId": 1,
      "userId": 2,
      "startDate": "2021-11-19",
      "endDate": "2021-11-20",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-19T20:39:36.000Z"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "message": "Validation error",
  "errors": {
    "startDate": "Start date is required",
    "endDate": "End date is required"
      }
    }
    ```

* Error Response: Couldn't find a Car with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car couldn't be found"
    }
    ```

* Error Response: Booking conflict
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Sorry, this car is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    }
    ```

### Edit a Booking

Update and return an existing booking.

* Require Authentication: true
* Require proper authorization: Booking must belong to the current user
* Request
  * Method: PUT
  * Route path: /bookings/:bookingId
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "startDate": "2021-11-20",
      "endDate": "2021-11-21"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "carId": 1,
      "userId": 1,
      "startDate": "2021-11-20",
      "endDate": "2021-11-21",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-20T10:06:40.000Z"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "errors": {
        "startDate": "Start date is required",
        "endDate": "End date is required"
      }
    }
    ```

* Error Response: Couldn't find a Booking with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

* Error Response: Can't edit a booking that's past the end date
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Past bookings can't be modified"
    }
    ```

* Error Response: Booking conflict
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Sorry, this car is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    }
    ```

### Delete a Booking

Delete an existing booking.

* Require Authentication: true
* Require proper authorization: Booking must belong to the current user or the
  Car must belong to the current user
* Request
  * Method: DELETE
  * Route path: /bookings/:bookingId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Couldn't find a Booking with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

* Error Response: Bookings that have been started can't be deleted
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bookings that have been started can't be deleted"
    }
    ```

## IMAGES

### Delete a Car Image

Delete an existing image for a Car.

* Require Authentication: true
* Require proper authorization: Car must belong to the current user
* Request
  * Method: DELETE
  * Route path: /cars/:carId/images/:imageId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Couldn't find a Car Image with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Car Image couldn't be found"
    }
    ```

### Delete a Review Image

Delete an existing image for a Review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: DELETE
  * Route path: /reviews/:reviewId/images/:imageId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Couldn't find a Review Image with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review Image couldn't be found"
    }
    ```

## Add Query Filters to Get All Cars

Return cars filtered by query parameters.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /cars
  * Query Parameters
    * page: integer, minimum: 1, default: 1
    * size: integer, minimum: 1, maximum: 20, default: 20
    * make: string, optional (e.g., "Tesla")
    * model: string, optional (e.g., "Model S") 
    * minYear: integer, optional (e.g., 2015)
    * maxYear: integer, optional (e.g., 2022)
    * minPrice: decimal, optional, minimum: 0
    * maxPrice: decimal, optional, minimum: 0
    * location: string, optional (e.g., "San Francisco")
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
     "Cars": [
    {
      "id": 1,
      "ownerId": 1,
      "make": "Tesla",
      "model": "Model S",
      "year": 2021,
      "pricePerDay": 500,
      "location": "San Francisco, CA",
      "description": "Luxury electric car",
      "createdAt": "2021-11-19T20:39:36.000Z",
      "updatedAt": "2021-11-19T20:39:36.000Z",
      "avgRating": 4.5,
      "previewImage": "image_url"
    }
  ],
  "page": 2,
  "size": 20
    }
    ```

* Error Response: Query parameter validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
     "message": "Bad Request",
     "errors": {
     "page": "Page must be greater than or equal to 1",
     "size": "Size must be between 1 and 20",
     "make": "Make is invalid",
     "model": "Model is invalid",
     "minYear": "Minimum year is invalid",
     "maxYear": "Maximum year is invalid",
     "minPrice": "Minimum price must be greater than or equal to 0",
     "maxPrice": "Maximum price must be greater than or equal to 0",
     "location": "Location is invalid"
      }
    }
    ```

