import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  deleteUser,
  updateUser,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { refreshToken } from "../controllers/authController.js";
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Thông tin đăng nhập không đúng
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Chưa xác thực
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Chưa xác thực
 */
router.post("/logout", protect, logoutUser);

router.post("/refresh", refreshToken);

// router.delete("/delete/:id", protect, deleteUser);
// /**
//  * @swagger
//  * /api/auth/delete/{id}:
//  *   delete:
//  *     summary: Xóa người dùng
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: ID của người dùng
//  *     responses:
//  *       200:
//  *         description: Xóa người dùng thành công
//  *       400:
//  *         description: Người dùng không tồn tại
//  *       401:
//  *         description: Chưa xác thực
//  */

// 🔒 Chỉ có admin mới có quyền xóa
router.delete("/delete/:id", protect, authorize("admin"), deleteUser);
router.put("/update/:id", protect, updateUser);
export default router;
