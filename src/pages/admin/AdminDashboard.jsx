import { Routes, Route } from "react-router-dom";
import { BarChart3, PlusCircle, FileText, Star, Shield, Users, CheckSquare } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import SuperAdminDashboard from "./SuperAdminDashboard";
import CreateJobPost from "./CreateJobPost";
import AdminPosts from "./AdminPosts";
import PromotePost from "./PromotePost";
import PromoRequests from "./PromoRequests";
import ModerateUsers from "./ModerateUsers";
import ModeratePosts from "./ModeratePosts";

const menuItems = [
  { path: "/admin/dashboard", label: "My Dashboard", icon: <BarChart3 size={20} /> },
  { path: "/admin/dashboard/create-job", label: "Create Job Post", icon: <PlusCircle size={20} /> },
  { path: "/admin/dashboard/my-posts", label: "My Posts", icon: <FileText size={20} /> },
  { path: "/admin/dashboard/promote-post", label: "Promote Post", icon: <Star size={20} /> },
  { path: "/admin/dashboard/promo-requests", label: "Promo Requests", icon: <CheckSquare size={20} /> },
  { path: "/admin/dashboard/moderate-users", label: "Moderate Users", icon: <Users size={20} /> },
  { path: "/admin/dashboard/moderate-posts", label: "Moderate Posts", icon: <Shield size={20} /> },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout menuItems={menuItems} title="Admin Portal">
      <Routes>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="create-job" element={<CreateJobPost />} />
        <Route path="my-posts" element={<AdminPosts />} />
        <Route path="promote-post" element={<PromotePost />} />
        <Route path="promo-requests" element={<PromoRequests />} />
        <Route path="moderate-users" element={<ModerateUsers />} />
        <Route path="moderate-posts" element={<ModeratePosts />} />
      </Routes>
    </DashboardLayout>
  );
}
