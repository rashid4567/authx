import express from "express";
import {
  blockUser,
  unblockUser,
  searchUser,
  updateAdminProfile,
  getAllUser,
  addUser,
  updateUser,
} from "../controllers/adminController.js";
import { isAdmin, protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUser);
router.put("/block/:id", protect, isAdmin, blockUser);
router.put("/unblock/:id", protect, isAdmin, unblockUser);
router.get("/search", protect, isAdmin, searchUser);
router.put("/update/:id", protect, isAdmin, updateAdminProfile);
router.put("/update-user/:id", protect, isAdmin, updateUser);
router.post("/add", protect, isAdmin, addUser);

export default router;
