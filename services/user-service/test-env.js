// Quick test to check environment variables
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables Check:');
console.log('============================');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('============================');
