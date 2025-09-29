import User from "../model/user.js";
import bcrypt from "bcryptjs";

export const getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 5, keyword = "", isBlocked } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 5;

    const query = {
      role: { $ne: "admin" },
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    };

    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === "true";
    }

    const users = await User.find(query)
      .select("-password -refreshToken")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const totalUser = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total: totalUser,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalUser / limitNum),
      },
    });
  } catch (err) {
    console.error("Get all users error", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    let { name, email, password, isBlocked = false } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isBlocked,
    });

    res.status(201).json({
      message: "User added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("Add user error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user?.role === "admin") {
      return res.status(403).json({ message: "Cannot block an admin account" });
    }

    await User.findByIdAndUpdate(id, { isBlocked: true });
    res.json({ message: "User blocked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user?.role === "admin") {
      return res
        .status(403)
        .json({ message: "Cannot unblock an admin account" });
    }

    await User.findByIdAndUpdate(id, { isBlocked: false });
    res.json({ message: "User unblocked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const users = await User.find({
      role: { $ne: "admin" },
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password -refreshToken");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const admin = await User.findOneAndUpdate(
      { _id: id, role: "admin" },
      { name, email },
      { new: true }
    ).select("-password -refreshToken");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.role === "admin") {
      return res
        .status(403)
        .json({ message: "Cannot update admin users through this endpoint" });
    }
    const emailExists = await User.findOne({
      email,
      _id: { $ne: id },
    });

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select("-password -refreshToken");

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
