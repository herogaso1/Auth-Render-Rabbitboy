import Project from "../models/projectModel.js";

// 1. Tạo Project (Tự động lấy ID người đang login làm owner)
export const createProject = async (data, userId) => {
  // data gồm title, description, status, progress...
  // Gán thêm owner_id vào data
  return await Project.create({ ...data, owner_id: userId });
};

// 2. Cập nhật Project (Có check quyền)
export const updateProject = async (projectId, data, userId, userRole) => {
  const project = await Project.findById(projectId);

  if (!project) throw new Error("PROJECT_NOT_FOUND");

  // CHECK QUYỀN SỞ HỮU:
  // Nếu người sửa KHÔNG PHẢI chủ sở hữu VÀ cũng KHÔNG PHẢI admin
  if (project.owner_id.toString() !== userId && userRole !== "admin") {
    throw new Error("FORBIDDEN"); // Không có quyền
  }

  // Nếu qua được bước trên nghĩa là có quyền
  const updatedProject = await Project.findByIdAndUpdate(projectId, data, {
    new: true,
  });
  return updatedProject;
};

// 3. Xóa Project (Tương tự)
export const deleteProject = async (projectId, userId, userRole) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  if (project.owner_id.toString() !== userId && userRole !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return await Project.findByIdAndDelete(projectId);
};

// 4. Lấy danh sách (Ai lấy của người nấy - hoặc Admin xem hết)
export const getMyProjects = async (userId, userRole) => {
  if (userRole === "admin") {
    return await Project.find().populate("owner_id", "name email avatar");
  }
  // Nếu là user thường, chỉ lấy project của mình
  return await Project.find({ owner_id: userId });
};
