import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name must be less than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    role: {
        type: String,
        enum: ['customer', 'barber', 'admin'],
        default: 'customer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP: {
        type: String,
        select: false
    },
    emailVerificationOTPExpire: {
        type: Date,
        select: false
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateEmailVerificationOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.emailVerificationOTP = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');
    const expireMinutes = parseInt(process.env.OTP_EXPIRE_MINUTES) || 10;
    this.emailVerificationOTPExpire = Date.now() + expireMinutes * 60 * 1000;

    return otp;
};

userSchema.methods.generateResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
};


const User = mongoose.model('User', userSchema);
export default User;
