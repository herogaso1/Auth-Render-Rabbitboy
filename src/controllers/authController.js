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
//delete

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

export const deleteUser = async (req, res) => {
  try {
    console.log(req.params.id, req.user.role);
    await authService.deleteUser(req.params.id, req.user.role);
    success(res, "Xóa người dùng thành công");
  } catch (err) {
    console.log(err);
    if (err.code === "USER_NOT_FOUND")
      error(res, "người dùng không tồn tại", 400);
    else if (err.code === "FORBIDDEN")
      error(res, "Bạn không có quyền xóa người dùng", 403);
  }
};
export const updateUser = async (req, res) => {
  try {
    const updated = await authService.updateUser(
      req.params.id,
      req.body.name,
      req.user.id,
      req.user.role
    );
    success(res, "Cập nhật thành công", updated);
  } catch (err) {
    console.log(err);
    if (err.message === "FORBIDDEN")
      error(res, "Bạn không có quyền cập nhật", 403);
    else if (err.message === "USER_NOT_FOUND")
      error(res, "người dùng không tồn tại", 400);
    else error(res, "Lỗi server", 500, err.message);
  }
};
