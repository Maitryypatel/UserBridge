import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getAllUsers, updateUserProfile } from "../controllers/userController.js";
import upload from "../middleware/Upload.js";

const userRouter = express.Router();

// Get all users -- for guest user
userRouter.get("/public-users", getAllUsers);


userRouter.put("/update-profile", userAuth, upload.single("profilePicture"), updateUserProfile);

export default userRouter;
