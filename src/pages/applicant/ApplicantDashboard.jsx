import { Routes, Route } from "react-router-dom";
import { User, Briefcase, Building2, Send, Video } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import JobPosts from "./JobPosts";
import MyApplications from "./MyApplications";
import MyProfile from "./MyProfile";
import Companies from "./Companies";
import MyInterviews from "./MyInterviews";

const menuItems = [
  { path: "/applicant/dashboard", label: "Job Posts", icon: <Briefcase size={20} /> },
  { path: "/applicant/dashboard/applications", label: "My Applications", icon: <Send size={20} /> },
  { path: "/applicant/dashboard/interviews", label: "My Interviews", icon: <Video size={20} /> },
  { path: "/applicant/dashboard/profile", label: "My Profile", icon: <User size={20} /> },
  { path: "/applicant/dashboard/companies", label: "Companies", icon: <Building2 size={20} /> },
];

export default function ApplicantDashboard() {
  return (
    <DashboardLayout menuItems={menuItems} title="Applicant Portal">
      <Routes>
        <Route index element={<JobPosts />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="interviews" element={<MyInterviews />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="companies" element={<Companies />} />
      </Routes>
    </DashboardLayout>
  );
}
