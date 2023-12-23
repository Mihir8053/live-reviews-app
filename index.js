const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// static folder for serving HTML, JS, and other static files
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

mongoose.connect('mongodb://localhost:27017/live-reviews-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Review Schema
const reviewSchema = new mongoose.Schema({
    title: String,
    content: String,
    datetime: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

//WebSockets setup
io.on('connection', (socket) => {
    console.log('A user connected');

    // Broadcast changes when a review is added/edited/deleted
    socket.on('reviewChanged', () => {
        io.emit('reviewsUpdated');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.post('/api/reviews', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newReview = new Review({
            title,
            content,
            datetime: new Date(),
        });

        await newReview.save();
        io.emit('reviewsUpdated'); // Notify clients about the update
        res.json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ datetime: 'desc' });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/reviews/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        // Delete the review by its ID
        await Review.deleteOne({ _id: reviewId });

        // Emit a socket event to notify clients that reviews have been updated
        io.emit('reviewsUpdated');
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

//for the edit page
app.route('/api/reviews/:id')
    .get(async (req, res) => {
        const reviewId = req.params.id;

        try {
            const review = await Review.findById(reviewId);

            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json(review);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
    .put(async (req, res) => {
        const reviewId = req.params.id;
        const { title, content } = req.body;

        try {
            const updatedReview = await Review.findByIdAndUpdate(
                reviewId,
                { title, content },
                { new: true } // Return the updated document
            );

            if (!updatedReview) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json(updatedReview);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });



// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

// Route to serve the new-review HTML file
app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'new-review.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'edit-review.html'));
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
