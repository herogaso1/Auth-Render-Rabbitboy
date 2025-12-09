import Project from "../models/projectModel.js";

// 1. Tạo Project (CHỈ ADMIN mới tạo được)
export const createProject = async (data, userId, userRole) => {
  // Kiểm tra quyền Admin
  if (userRole !== "admin") {
    const err = new Error("FORBIDDEN");
    err.code = "FORBIDDEN";
    throw err;
  }

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

// 4. Lấy danh sách (Admin xem hết - User chỉ xem project được assign)
export const getMyProjects = async (userId, userRole) => {
  if (userRole === "admin") {
    // Admin thấy tất cả projects
    return await Project.find()
      .populate("owner_id", "name email avatar")
      .populate("assigned_users", "name email avatar");
  }
  // User thường chỉ thấy project mà mình được assign
  return await Project.find({ assigned_users: userId })
    .populate("owner_id", "name email avatar")
    .populate("assigned_users", "name email avatar");
};

// 5. Assign users vào project (CHỈ ADMIN)
export const assignUsersToProject = async (projectId, userIds, adminRole) => {
  if (adminRole !== "admin") {
    const err = new Error("FORBIDDEN");
    err.code = "FORBIDDEN";
    throw err;
  }

  const project = await Project.findById(projectId);
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  // Thêm users vào assigned_users (không trùng lặp)
  project.assigned_users = [
    ...new Set([...project.assigned_users, ...userIds]),
  ];
  await project.save();

  return await Project.findById(projectId)
    .populate("owner_id", "name email avatar")
    .populate("assigned_users", "name email avatar");
};

// 6. Unassign user khỏi project (CHỈ ADMIN)
export const unassignUserFromProject = async (projectId, userId, adminRole) => {
  if (adminRole !== "admin") {
    const err = new Error("FORBIDDEN");
    err.code = "FORBIDDEN";
    throw err;
  }

  const project = await Project.findById(projectId);
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  // Xóa user khỏi assigned_users
  project.assigned_users = project.assigned_users.filter(
    (id) => id.toString() !== userId
  );
  await project.save();

  return await Project.findById(projectId)
    .populate("owner_id", "name email avatar")
    .populate("assigned_users", "name email avatar");
};
