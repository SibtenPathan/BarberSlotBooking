import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import routes from './routes/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000 ;

app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

app.get('/health',(req , res)=>{
    res.json({
        message:'Barber Booking API Gateway',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            users: '/api/users/*',
            barbers: '/api/barbers/*',
            bookings: '/api/bookings/*',
            payments: '/api/payments/*'
        }
    });
});

// 404 Handler - Route Not Found
app.use((req, res)=>{
    res.status(404).json({
        error:'Route not found',
        path:req.originalUrl,
        method: req.method,
        messaege: 'this requested endpoint does not exist'
    });
});

// Global Error Handler
app.use((err, req, res, next)=>{
    console.error('Error:',err.messaege);
    console.error('Stack',err.stack);

    res.status(err.status || 500).json({
        error: "Internal Server Error",
        messaege: err.messaege,
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    });
});

app.listen(PORT, ()=>{
  console.log('═══════════════════════════════════════════');
  console.log('🚪 API GATEWAY STARTED');
  console.log('═══════════════════════════════════════════');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('═══════════════════════════════════════════');
  console.log('✅ Ready to accept requests');
  console.log('Press Ctrl+C to stop server');
  console.log('═══════════════════════════════════════════');
});