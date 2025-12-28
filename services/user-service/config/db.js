import mongoose from 'mongoose';

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('═══════════════════════════════════════════');
        console.log('📦 MongoDB Connected - User Service');
        console.log(`🗄️  Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
        console.log('═══════════════════════════════════════════');
    }
    catch(error){
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Please make sure MongoDB is running!');
        console.error('Start MongoDB with: mongod');
        
        process.exit(1);
    }
}

export default connectDB