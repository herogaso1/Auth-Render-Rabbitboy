import * as projectService from "../services/projectService.js";
import { success, error } from "../utils/response.js";

export const create = async (req, res) => {
  try {
    // req.user._id lấy từ Token
    const newProject = await projectService.createProject(
      req.body,
      req.user._id.toString()
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
      req.user._id.toString(), // ID người đang thao tác
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

export const remove = async (req, res) => {
  try {
    await projectService.deleteProject(
      req.params.id,
      req.user._id.toString(),
      req.user.role
    );
    return success(res, "Xóa dự án thành công");
  } catch (err) {
    if (err.message === "FORBIDDEN")
      return error(res, "Bạn không có quyền xóa dự án này", 403);
    if (err.message === "PROJECT_NOT_FOUND")
      return error(res, "Không tìm thấy dự án", 404);
    return error(res, "Lỗi server", 500);
  }
};

export const getAll = async (req, res) => {
  try {
    const projects = await projectService.getMyProjects(
      req.user._id.toString(),
      req.user.role
    );
    return success(res, "Lấy danh sách thành công", projects);
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};
