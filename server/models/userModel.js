import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: null },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    
    
    jobRole: { type: String, default: "" }, // Job role of the user
    profilePicture: { type: String, default: "" }, // Profile picture URL or path

     gallery: [{ type: String }] 
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
