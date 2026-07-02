import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";

import AdminDashboard from "../pages/admin/Dashboard";
import PlacementDashboard from "../pages/placement/Dashboard";
import TrainerDashboard from "../pages/trainer/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import StudentDrives from "../pages/student/StudentDrives";
import StudentDriveDetail from "../pages/student/StudentDriveDetail";
import Profile from "../pages/student/Profile";
import StudentDetail from "../pages/trainer/StudentDetail";
import Register from "../pages/Register";
import ViewProfile from "../pages/student/ViewProfile";
import Students from "../pages/placement/Students";
import Companies from "../pages/placement/Companies";
import ViewStudent from "../pages/placement/ViewStudent";
import Drives from "../pages/placement/Drives";
import CreateDrive from "../pages/placement/CreateDrive";
import Jobs from "../pages/placement/Jobs"; 
import CreateJob from "../pages/placement/CreateJob";
import DriveDetail from "../pages/placement/DriveDetail";
import StudentJobs from "../pages/student/StudentJobs";
import StudentJobDetail from "../pages/student/StudentJobDetail";
import Applications from "../pages/placement/Applications";
import MyApplications from "../pages/student/MyApplications";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/" 
                    element={<Login />} 
                />
                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/placement/dashboard"
                    element={<PlacementDashboard />}
                />

                <Route
                    path="/trainer/dashboard"
                    element={<TrainerDashboard />}
                />

                <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                />
                <Route
                    path="/student/profile"
                    element={<Profile />}
                />
                <Route
                    path="/trainer/student/:id"
                    element={<StudentDetail />}
                />
                <Route
                    path="/student/view-profile"
                    element={<ViewProfile />}
                />
                <Route
                    path="/placement/students"
                    element={<Students />}
                />
                <Route
                    path="/placement/companies"
                    element={<Companies />}
                />
                <Route
                    path="/placement/student/:id"
                    element={<ViewStudent />}
                />
                <Route
                    path="/placement/drives"
                    element={<Drives />}
                />
                

                <Route
                    path="/placement/drives/create"
                    element={<CreateDrive />}
                />
                <Route
                    path="/placement/jobs"
                    element={<Jobs />}
                />

                <Route
                    path="/placement/jobs/create"
                    element={<CreateJob />}
                />
                <Route
                    path="/placement/drives/:id"
                    element={<DriveDetail />}
                />
                <Route
                    path="/student/drives"
                    element={<StudentDrives />}
                />

                <Route
                    path="/student/drives/:id"
                    element={<StudentDriveDetail />}
                />
                <Route
                    path="/student/jobs"
                    element={<StudentJobs />}
                />

                <Route
                    path="/student/jobs/:id"
                    element={<StudentJobDetail />}
                />
                <Route
                    path="/student/my-applications"
                    element={<MyApplications />}
                />
                <Route
                    path="/placement/applications"
                    element={<Applications />}
                />
                
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;