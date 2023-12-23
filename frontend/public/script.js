// Inside public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reviewId = urlParams.get('id');

    if (reviewId) {
        // If in edit mode, fetch and pre-fill the existing review data
        fetchReviewById(reviewId)
            .then(existingReview => {
                document.getElementById('title').value = existingReview.title;
                document.getElementById('content').value = existingReview.content;
            })
            .catch(error => console.error(error));
    }
    else {
        fetchReviews();
    }
});

function fetchReviewById(reviewId) {
    // Make a GET request to fetch a specific review by ID
    return fetch(`http://localhost:3000/api/reviews/${reviewId}`)
        .then(response => response.json());
}

function fetchReviews() {
    // Make a GET request to fetch reviews from the server
    fetch('http://localhost:3000/api/reviews')
        .then(response => response.json())
        .then(reviews => {
            // Once reviews are fetched, populate the table
            populateReviewsTable(reviews);
        })
        .catch(error => console.error(error));
}

function populateReviewsTable(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';

    // Iterate through the reviews and add them to the table
    reviews.forEach((review, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${review.title}</td>
            <td>${review.content}</td>
            <td>${new Date(review.datetime).toLocaleString()}</td>
            <td><button onclick="redirectToEditReview('${review._id}')">Edit</button></td>
            <td><button onclick="deleteReview('${review._id}')">Delete</button></td>
        `;

        reviewsList.appendChild(row);
    });
}

function redirectToNewReview() {
    // Redirect to the new review page
    window.location.href = '/new';
}

function redirectToEditReview(reviewId) {
    // Redirect to the edit review page with the specific review ID
    window.location.href = `/edit?id=${reviewId}`;
}


function deleteReview(reviewId) {
    // Make a DELETE request to delete the review by ID
    fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(() => {
            // console.log('Review deleted successfully');
            fetchReviews();
        })
        .catch(error => console.error('Error deleting review:', error));
}


function saveReview() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const urlParams = new URLSearchParams(window.location.search);
    const reviewId = urlParams.get('id');

    // If reviewId is present, it's an update; otherwise, it's a new review
    const method = reviewId ? 'PUT' : 'POST';
    const url = reviewId ? `http://localhost:3000/api/reviews/${reviewId}` : 'http://localhost:3000/api/reviews';

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            content,
        }),
    })
        .then(response => response.json())
        .then(updatedReview => {
            console.log('Review saved successfully:', updatedReview);
            redirectToReviewsList(); // Redirect to the reviews list after saving
        })
        .catch(error => console.error('Error saving review:', error));
}

function resetForm() {
    document.getElementById('new-review-form').reset();
}

function redirectToReviewsList() {
    // Redirect to the reviews list page
    window.location.href = '/';
}

