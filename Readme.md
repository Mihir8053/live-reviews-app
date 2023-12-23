# Live Feed App

Live Reviews allows users to add/edit/remove review and view all reviews with live feeding.

## Problem Statement

Implement a dynamic review system where in a user can add, edit or delete a review. The solution aims to streamline the review management process, enhancing user experience and productivity.

## Project Setup

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB compass](https://www.mongodb.com/) (Make sure MongoDB compass is installed and running)

### Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
## install dependencies

cd live-reviews-app
npm install

##start the server
nodemon index.js
```

## Backend

- MongoDB database is used to store user reviews.
- The database is connected using a URI, pointing to a localhost instance.
- Each review in the database has fields for id, title, content, and date-time.
- WebSockets are implemented to broadcast updates whenever a review is added, edited, or deleted.

#Frontend
-There are 3 different HTML files in the frontend.
-The edit-review file is used for making additions or deletions to the existing review.
-The Save button saves the changes and redirects it to the home page.
-The index.html file is for the home page.
-The new-review.html file redirects the user to a new page where new reviews can be written and posted to the website.
-Additionaly there is also a script file which provides the callback functions and makes request to the backend server.

## Backend Routes

- **Database Connection:** MongoDB database is used to store user reviews with id, title, content, and date-time.

- **WebSockets Setup:** Socket.IO is implemented to broadcast updates whenever a review is added, edited, or deleted.

- **POST /api/reviews:** Adds a new review to the database and broadcasts the update to connected clients.

- **GET /api/reviews:** Retrieves all reviews from the database, sorted by date-time in descending order.

- **DELETE /api/reviews/id:** Deletes a review by ID from the database and notifies clients about the update.

- **GET /api/reviews/id:** Retrieves a specific review by ID from the database.

- **PUT /api/reviews/id:** Updates a review by ID in the database and returns the updated document.

- **Route to Serve Home Page:** Serves the main HTML file for the home page.

- **Route to Serve New Review Page:** Serves the HTML file for creating a new review.

- **Route to Serve Edit Review Page:** Serves the HTML file for editing an existing review.

##MongoDB schema
The mongoDB database consists of the following entries.

- **title:** String - Title of the review.
- **content:** String - Content of the review.
- **datetime:** Date - Date and time when the review was created, defaulting to the current date and time.
