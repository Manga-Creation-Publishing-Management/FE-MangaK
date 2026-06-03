import { Routes, Route, Navigate, Outlet } from 'react-router';
import { SeriesManagement } from "../pages/shared/SeriesManagement.jsx"
import { Sidebar } from '../pages/shared/Sidebar';
import { HeaderPage } from '../pages/shared/HeaderPage';
import avatarImgDemo from '../pages/shared/avatarImgDemo.png';
import { TaskManagement } from '../pages/mangaka/TaskManagement';
import { MyTask } from '../pages/assistant/MyTask';
import { SeriesReview } from '../pages/tantouEditor/SeriesReview';
import { PublishingSchedule } from '../pages/editorialBoard/PublishingSchedule';
import { SeriesDetail } from '../pages/shared/SeriesDetail.jsx';
import { HomePage } from '../pages/shared/HomePage.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { ProfilePage } from '../pages/shared/ProfilePage.jsx';
import { Layout } from '../pages/shared/Layout.jsx';
import { AdminDashboard } from '../pages/admin/AdminDashboard.jsx';

// Dashboards
import { MangakaDashboard } from '../pages/mangaka/MangakaDashboard.jsx';
import { AssistantDashboard } from '../pages/assistant/AssistantDashboard.jsx';
import { TantouDashboard } from '../pages/tantouEditor/TantouDashboard.jsx';
import { EditorialDashboard } from '../pages/editorialBoard/EditorialDashboard.jsx';
import { VotingDataImport } from '../pages/editorialBoard/VotingDataImport.jsx';
import { ReaderDashboard } from '../pages/reader/ReaderDashboard.jsx';


const roleDisplayNames = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
  admin: "Admin",
  reader: "Reader"
};


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />


      <Route path="/mangaka" element={<Layout roleName="mangaka" />}>
        <Route index element={<MangakaDashboard />} />
        <Route path="series" element={<SeriesManagement role="mangaka" />} />
        <Route path="series/:id" element={<SeriesDetail />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/assistant" element={<Layout roleName="assistant" />}>
        <Route index element={<AssistantDashboard />} />
        <Route path="tasks" element={<MyTask />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/tantou" element={<Layout roleName="tantou" />}>
        <Route index element={<TantouDashboard />} />
        <Route path="series" element={<SeriesReview />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/editorial" element={<Layout roleName="editorial" />}>
        <Route index element={<EditorialDashboard />} />
        <Route path="series" element={<SeriesReview />} />
        <Route path="schedule" element={<PublishingSchedule />} />
        <Route path="voting" element={<VotingDataImport />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/admin" element={<Layout roleName="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/reader" element={<Layout roleName="reader" />}>
        <Route index element={<ReaderDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes >
  )
}