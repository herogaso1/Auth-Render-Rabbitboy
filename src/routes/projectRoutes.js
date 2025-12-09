import express from "express";
import {
  create,
  update,
  remove,
  getAll,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
// Có thể import thêm validate middleware nếu muốn

const router = express.Router();

// Tất cả các API dưới đây đều yêu cầu phải đăng nhập
router.use(protect);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Tạo project mới
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Project
 *               description:
 *                 type: string
 *                 example: Project description
 *     responses:
 *       201:
 *         description: Tạo project thành công
 *       401:
 *         description: Chưa xác thực
 */
router.post("/", create);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Lấy danh sách tất cả projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách projects
 *       401:
 *         description: Chưa xác thực
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Cập nhật project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy project
 */
router.put("/:id", update);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Xóa project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của project
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy project
 */
router.delete("/:id", remove);

export default router;
