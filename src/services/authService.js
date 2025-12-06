import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//hàm tao token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//đăng kí
export const registerUser = async (userData) => {
  // kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }
  const user = await User.create(userData);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  //lưu refresh token vào database
  user.refreshToken = refreshToken;
  await user.save();
  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //trả về access token và user
  return { accessToken, refreshToken, user: newUser };
};
//đăng nhập
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Lưu refresh token mới
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};
//thay thế hàm generateToken cũ
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
//gửi lại generateToken dựa
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
//getme
export const getMe = async (user) => {
  return user;
};
//logout
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return true;
};
//delete user
export const deleteUser = async (userId, role) => {
  console.log("role: ", role);
  if (role !== "admin") {
    //throw new err_code
    const err = new Error("Forbidden");
    err.code = "FORBIDDEN";
    throw err;
  }
  await User.findByIdAndDelete(userId);
  return true;
};
export const refreshAccessToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Refresh token không hợp lệ");
  }

  return generateAccessToken(user._id);
};
//update user
export const updateUser = async (userId, userData) => {
  const user = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });
  if (!user) {
   const err = new Error("User not found");
    err.code = "USER_NOT_FOUND";
    throw err;
  }
  if (user.role !== "admin") {
    //throw new err_code
    const err = new Error("Forbidden");
    err.code = "FORBIDDEN";
    throw err;
  }
  return user;
};
export default {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateUser,
  deleteUser,
  refreshAccessToken,
};
