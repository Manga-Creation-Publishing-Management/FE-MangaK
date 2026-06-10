import { Routes, Route, Navigate, Outlet } from 'react-router';
import { SeriesManagement } from "../pages/shared/SeriesManagement.jsx"
import { TaskManagement } from '../pages/mangaka/TaskManagement';
import { MyTask } from '../pages/assistant/MyTask';
import { SeriesReview } from '../pages/tantouEditor/SeriesReview';
import { PublishingSchedule } from '../pages/editorialBoard/PublishingSchedule';
import { SeriesApproval } from '../pages/editorialBoard/SeriesApproval';
import { SeriesDetail } from '../pages/shared/SeriesDetail.jsx';
import { HomePage } from '../pages/shared/HomePage.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { ChapterDetail } from '../pages/mangaka/ChapterDetail.jsx';
import { ProfilePage } from '../pages/shared/ProfilePage.jsx';
import { Layout } from '../pages/shared/Layout.jsx';
import { AdminDashboard } from '../pages/admin/AdminDashboard.jsx';
import { MangakaDashboard } from '../pages/mangaka/MangakaDashboard.jsx';
import { AssistantDashboard } from '../pages/assistant/AssistantDashboard.jsx';
import { TantouDashboard } from '../pages/tantouEditor/TantouDashboard.jsx';
import { EditorialDashboard } from '../pages/editorialBoard/EditorialDashboard.jsx';
import { ReaderDashboard } from '../pages/reader/ReaderDashboard.jsx';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { PublicRoute } from '../features/auth/components/PublicRoute';
import { LeaderboardPage } from '../pages/shared/LeaderboardPage.jsx';

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

      {/* Guest/Anonymous Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>


      {/* Mangaka Routes */}
      <Route element={<ProtectedRoute allowedRole="mangaka" />}>
        <Route path="/mangaka" element={<Layout roleName="mangaka" />}>
          <Route index element={<MangakaDashboard />} />
          <Route path="series" element={<SeriesManagement role="mangaka" />} />
          <Route path="series/:id" element={<SeriesDetail />} />
          <Route path="chapter/:chapterId" element={<ChapterDetail />} />
          <Route path="tasks" element={<TaskManagement />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Assistant Routes */}
      <Route element={<ProtectedRoute allowedRole="assistant" />}>
        <Route path="/assistant" element={<Layout roleName="assistant" />}>
          <Route index element={<AssistantDashboard />} />
          <Route path="tasks" element={<MyTask />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Tantou Editor Routes */}
      <Route element={<ProtectedRoute allowedRole="tantou" />}>
        <Route path="/tantou" element={<Layout roleName="tantou" />}>
          <Route index element={<TantouDashboard />} />
          <Route path="series" element={<SeriesReview />} />
          <Route path="series/:id" element={<SeriesDetail />} />
          <Route path="chapter/:chapterId" element={<ChapterDetail />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Editorial Board Routes */}
      <Route element={<ProtectedRoute allowedRole="editorialBoard" />}>
        <Route path="/editorialBoard" element={<Layout roleName="editorialBoard" />}>
          <Route index element={<EditorialDashboard />} />
          <Route path="series" element={<SeriesApproval />} />
          <Route path="series/:id" element={<SeriesDetail />} />
          <Route path="chapter/:chapterId" element={<ChapterDetail />} />
          <Route path="schedule" element={<PublishingSchedule />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<Layout roleName="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Reader Routes */}
      <Route element={<ProtectedRoute allowedRole="reader" />}>
        <Route path="/reader" element={<Layout roleName="reader" />}>
          <Route index element={<ReaderDashboard />} />
          <Route path="series/:id" element={<SeriesDetail />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes >
  )
}