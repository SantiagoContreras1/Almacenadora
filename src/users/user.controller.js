import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";


export const getUsers = async (req = request, res = response) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const [total, users] = await Promise.all([
      User.countDocuments(),
      User.find().skip(Number(offset)).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error when searching for users",
      error: error.message,
    });
  }
};


export const getUserById = async (req = request, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error when searching for user",
      error: error.message,
    });
  }
};

export const checkEmail = async (req = request, res) => {
    try {
      const { email } = req.query;
      const user = await User.findOne({email});
        console.log(user)
      if (!user) {
        return res.status(200).json({
          exists: false
        });
      }
  
      res.status(200).json({
       exists: true
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "error when searching for user",
        error: error.message,
      });
    }
};


export const updateUser = async (req, res = response) => {
  try {
    const { userId } = req.params;
    const { role, ...data } = req.body;

    if (role) {
      data.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });

    res.status(200).json({
      success: true,
      msg: "User successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating user",
      error: error.message,
    });
  }
};


export const updatePassword = async (req, res = response) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const hashedPassword = await hash(password);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "User successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating user",
      error: error.message,
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { estado: false }, { new: true });

    res.status(200).json({
      success: true,
      msg: "User deactivated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deactivating user",
      error: error.message,
    });
  }
};
