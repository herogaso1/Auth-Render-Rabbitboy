import * as authService from "../services/authService.js";
import { success, error } from "../utils/response.js";

export const registerUser = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await authService.registerUser(
      req.body
    );

    // Set httpOnly cookie cho refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    success(res, "Đăng ký thành công", { accessToken, user }, 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(
      email,
      password
    );

    // Set httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    success(res, "Đăng nhập thành công", { accessToken });
  } catch (err) {
    error(res, err.message, 401);
  }
};
//getme
export const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user);
    success(res, "Lấy thông tin người dùng thành công", user);
  } catch (err) {
    error(res, "Không tìm thấy người dùng", 400, err.code);
  }
};
export const logoutUser = async (req, res) => {
  try {
    await authService.logoutUser(req.user._id);
    res.clearCookie("refreshToken");
    success(res, "Đăng xuất thành công");
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error("Không tìm thấy refresh token");
    }

    const accessToken = await authService.refreshAccessToken(refreshToken);
    success(res, "Làm mới token thành công", { accessToken });
  } catch (err) {
    error(res, err.message, 401);
  }
};
