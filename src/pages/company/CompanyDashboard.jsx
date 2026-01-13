import { Routes, Route } from "react-router-dom";
import { User, PlusCircle, FileText, Star, Users, Calendar, Video } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import CompanyProfile from "./CompanyProfile";
import CreateJobPost from "./CreateJobPost";
import MyPosts from "./MyPosts";
import RequestPromotion from "./RequestPromotion";
import ScheduleInterview from "./ScheduleInterview";
import ManageInterviews from "./ManageInterviews";

const menuItems = [
  { path: "/company/dashboard", label: "Company Profile", icon: <User size={20} /> },
  { path: "/company/dashboard/create-job", label: "Create Job Post", icon: <PlusCircle size={20} /> },
  { path: "/company/dashboard/my-posts", label: "My Posts", icon: <FileText size={20} /> },
  { path: "/company/dashboard/request-promotion", label: "Request Promotion", icon: <Star size={20} /> },
  { path: "/company/dashboard/schedule-interview", label: "Schedule Interview", icon: <Calendar size={20} /> },
  { path: "/company/dashboard/manage-interviews", label: "Manage Interviews", icon: <Video size={20} /> },
];

export default function CompanyDashboard() {
  return (
    <DashboardLayout menuItems={menuItems} title="Company Portal">
      <Routes>
        <Route index element={<CompanyProfile />} />
        <Route path="create-job" element={<CreateJobPost />} />
        <Route path="my-posts" element={<MyPosts />} />
        <Route path="request-promotion" element={<RequestPromotion />} />
        <Route path="schedule-interview" element={<ScheduleInterview />} />
        <Route path="manage-interviews" element={<ManageInterviews />} />
      </Routes>
    </DashboardLayout>
  );
}
