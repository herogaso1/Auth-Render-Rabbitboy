import express from "express";
import {
  create,
  update,
  remove,
  getAll,
  assignUsers,
  unassignUser,
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
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Project
 *               description:
 *                 type: string
 *                 example: Project description
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed, cancelled]
 *                 default: pending
 *                 example: pending
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 0
 *                 example: 0
 *               assigned_users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["675a1b2c3d4e5f6g7h8i9j0k"]
 *                 description: Mảng ID của users được assign vào project
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
 *               title:
 *                 type: string
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed, cancelled]
 *                 example: in-progress
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 50
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

/**
 * @swagger
 * /api/projects/{id}/assign:
 *   post:
 *     summary: Assign users vào project (CHỈ ADMIN)
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
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["675a1b2c3d4e5f6g7h8i9j0k", "675b2c3d4e5f6g7h8i9j0k1l"]
 *                 description: Mảng các user IDs cần assign
 *     responses:
 *       200:
 *         description: Assign thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Chỉ Admin mới có quyền
 *       404:
 *         description: Không tìm thấy project
 */
router.post("/:id/assign", assignUsers);

/**
 * @swagger
 * /api/projects/{id}/unassign:
 *   post:
 *     summary: Unassign user khỏi project (CHỈ ADMIN)
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
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "675a1b2c3d4e5f6g7h8i9j0k"
 *                 description: User ID cần unassign
 *     responses:
 *       200:
 *         description: Unassign thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Chỉ Admin mới có quyền
 *       404:
 *         description: Không tìm thấy project
 */
router.post("/:id/unassign", unassignUser);

export default router;
