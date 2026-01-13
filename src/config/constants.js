// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Project VIP";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  VERIFY_OTP: "/api/auth/verify-otp",
  
  // Applicant
  APPLICANT_PROFILE: "/api/applicant/profile",
  APPLY_JOB: "/api/applicant/apply",
  MY_APPLICATIONS: "/api/applicant/applications",
  
  // Company
  COMPANY_PROFILE: "/api/company/profile",
  COMPANY_APPLICANTS: "/api/company/applicants",
  UPDATE_APPLICATION_STATUS: "/api/company/application",
  SCHEDULE_INTERVIEW: "/api/company/application",
  
  // Jobs
  JOBS: "/api/jobs",
  
  // Admin
  ADMIN_PROFILE: "/api/admin/profile",
  BLOCK_USER: "/api/admin/block-user",
  PROMO_JOB: "/api/admin/promo-job",
  PROMO_REQUESTS: "/api/admin/promo-requests",
  ADMIN_USERS: "/api/admin/users",
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  COMPANY: "COMPANY",
  APPLICANT: "APPLICANT",
};

// Dashboard Routes
export const DASHBOARD_ROUTES = {
  [USER_ROLES.SUPER_ADMIN]: "/admin/dashboard",
  [USER_ROLES.COMPANY]: "/company/dashboard",
  [USER_ROLES.APPLICANT]: "/applicant/dashboard",
};