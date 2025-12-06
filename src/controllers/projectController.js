import * as projectService from "../services/projectService.js";
import { success, error } from "../utils/response.js";

export const create = async (req, res) => {
  try {
    // req.user.id lấy từ Token
    const newProject = await projectService.createProject(
      req.body,
      req.user.id
    );
    return success(res, "Tạo dự án thành công", newProject, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const updated = await projectService.updateProject(
      req.params.id,
      req.body,
      req.user.id, // ID người đang thao tác
      req.user.role // Role người đang thao tác
    );
    console.log(updated);
    return success(res, "Cập nhật thành công", updated);
  } catch (err) {
    if (err.message === "FORBIDDEN")
      return error(res, "Bạn không có quyền sửa dự án này", 403, "FORBIDDEN");
    if (err.message === "PROJECT_NOT_FOUND")
      return error(res, "Không tìm thấy", 404);
    return error(res, "Lỗi server", 500, err.message);
  }
};
