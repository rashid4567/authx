import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import upload from "../utils/uploads.js";
const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put(
  "/updateProfile",
  protect,
  upload.single("image"),
  updateUserProfile
);

export default router;
