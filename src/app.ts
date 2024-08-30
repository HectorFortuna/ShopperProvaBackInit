import express from 'express';
import dotenv from 'dotenv';
import measureRoutes from './routes/measureRoutes.js';
import sequelize from './database/index.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '200mb' })); 
app.use(express.urlencoded({ extended: true, limit: '200mb' }))
app.use('/api', measureRoutes);

const startServer = async () => {
    try {
        await sequelize.sync();
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();