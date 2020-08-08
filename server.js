require('dotenv').config();

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cors = require('cors'),
    path = require('path'),
    compression = require('compression'),
    morgan = require('morgan'),
    PORT = process.env.PORT || 4000;

// Handle models database
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', (e) => console.error(e));
db.once('open', () => console.log('Mongoose connected~'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(morgan('tiny'));

// Route
app.use('/api', require('./controllers/questions'));
app.use('/api', require('./controllers/comments'));
app.use('/api/user', require('./controllers/user'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static(path.join(__dirname, 'client/build'), { maxAge: '1d' }));

    // Set load specific html for client
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => console.log(`Running at ${PORT}`));
