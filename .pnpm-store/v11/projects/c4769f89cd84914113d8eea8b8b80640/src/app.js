import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import userRoutes from './routes/userRoutes.js';
import verifyToken from './middleware/verifyToken.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);

app.get('/api/health', (request, response) => {
  response.status(200).json({ success: true, message: 'Smart WMS API is running', data: null });
});

app.use('/api/categories', verifyToken, categoryRoutes);
app.use('/api/units', verifyToken, unitRoutes);
app.use('/api/suppliers', verifyToken, supplierRoutes);
app.use('/api/products', verifyToken, productRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api', verifyToken, stockRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);
app.use('/api/reports', verifyToken, reportRoutes);

export default app;
