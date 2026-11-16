const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const cvRoutes = require('./routes/cv.routes');

const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const port = 3000;

app.use(express.json({ limit: '5mb' }));
app.use(cors());
app.use(logger);
app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes);

app.use('/api/cvs', cvRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'CvMaker API is running!'
    });
});

app.use('/api/profiles', profileRoutes);

const pdfRoutes = require('./routes/pdf.routes');

app.use('/api/pdf', pdfRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Failed to start the server:', error.message);
        process.exit(1);
    }
};

startServer();