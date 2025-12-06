import express from 'express';
import { create, update, remove, getAll } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
// Có thể import thêm validate middleware nếu muốn

const router = express.Router();

// Tất cả các API dưới đây đều yêu cầu phải đăng nhập
router.use(protect);

router.post('/', create);
router.get('/', getAll);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;