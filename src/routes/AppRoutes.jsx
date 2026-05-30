import { Routes, Route, Navigate } from 'react-router';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

// Auth pages
import { HomePage } from '@/pages/auth/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

// Mangaka pages
import { MangakaDashboard } from '@/pages/mangaka/MangakaDashboard';
import { ChapterPublishing } from '@/pages/mangaka/ChapterPublishing';

// Assistant pages
import { AssistantDashboard } from '@/pages/assistant/AssistantDashboard';

// Tantou Editor pages
import { TantouDashboard } from '@/pages/tantouEditor/TantouDashboard';

// Editorial Board pages
import { EditorialDashboard } from '@/pages/editorialBoard/EditorialDashboard';
import { VotingDataImport } from '@/pages/editorialBoard/VotingDataImport';

// Reader pages
import { ReaderDashboard } from '@/pages/reader/ReaderDashboard';

// Shared pages
import { IncomePage } from '@/pages/shared/IncomePage';
import { LeaderboardPage } from '@/pages/shared/LeaderboardPage';
import { ProfilePage } from '@/pages/shared/ProfilePage';

// Feature components
import { SeriesDetails } from '@/features/series/SeriesDetails';
import { SeriesManagement } from '@/features/series/SeriesManagement';
import { ChapterDetails } from '@/features/chapters/ChapterDetails';
import { TaskManagement } from '@/features/tasks/TaskManagement';
import { TaskDetails } from '@/features/tasks/TaskDetails';
import { AssistantTasks } from '@/features/tasks/AssistantTasks';
import { PublishingSchedule } from '@/features/schedule/PublishingSchedule';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />

      {/* Mangaka */}
      <Route path="/mangaka" element={
        <DashboardLayout role="mangaka">
          <MangakaDashboard />
        </DashboardLayout>
      } />
      <Route path="/mangaka/series" element={
        <DashboardLayout role="mangaka">
          <SeriesManagement />
        </DashboardLayout>
      } />
      <Route path="/mangaka/series/:id" element={
        <DashboardLayout role="mangaka">
          <SeriesDetails />
        </DashboardLayout>
      } />
      <Route path="/mangaka/tasks" element={
        <DashboardLayout role="mangaka">
          <TaskManagement />
        </DashboardLayout>
      } />
      <Route path="/mangaka/series/:id/tasks" element={
        <DashboardLayout role="mangaka">
          <TaskManagement />
        </DashboardLayout>
      } />
      <Route path="/mangaka/series/:seriesId/chapter/:chapterId" element={
        <DashboardLayout role="mangaka">
          <ChapterDetails />
        </DashboardLayout>
      } />
      <Route path="/mangaka/series/:seriesId/chapter/:chapterId/publish" element={
        <DashboardLayout role="mangaka">
          <ChapterPublishing />
        </DashboardLayout>
      } />
      <Route path="/mangaka/income" element={
        <DashboardLayout role="mangaka">
          <IncomePage />
        </DashboardLayout>
      } />
      <Route path="/mangaka/tracking" element={
        <DashboardLayout role="mangaka">
          <LeaderboardPage />
        </DashboardLayout>
      } />
      <Route path="/mangaka/profile" element={
        <DashboardLayout role="mangaka">
          <ProfilePage />
        </DashboardLayout>
      } />

      {/* Assistant */}
      <Route path="/assistant" element={
        <DashboardLayout role="assistant">
          <AssistantDashboard />
        </DashboardLayout>
      } />
      <Route path="/assistant/tasks" element={
        <DashboardLayout role="assistant">
          <AssistantTasks />
        </DashboardLayout>
      } />
      <Route path="/assistant/tasks/:id" element={
        <DashboardLayout role="assistant">
          <TaskDetails />
        </DashboardLayout>
      } />
      <Route path="/assistant/income" element={
        <DashboardLayout role="assistant">
          <IncomePage />
        </DashboardLayout>
      } />
      <Route path="/assistant/profile" element={
        <DashboardLayout role="assistant">
          <ProfilePage />
        </DashboardLayout>
      } />

      {/* Tantou Editor */}
      <Route path="/tantou" element={
        <DashboardLayout role="tantou">
          <TantouDashboard />
        </DashboardLayout>
      } />
      <Route path="/tantou/series" element={
        <DashboardLayout role="tantou">
          <SeriesManagement />
        </DashboardLayout>
      } />
      <Route path="/tantou/series/:id" element={
        <DashboardLayout role="tantou">
          <SeriesDetails />
        </DashboardLayout>
      } />
      <Route path="/tantou/series/:seriesId/chapter/:chapterId" element={
        <DashboardLayout role="tantou">
          <ChapterDetails />
        </DashboardLayout>
      } />
      <Route path="/tantou/income" element={
        <DashboardLayout role="tantou">
          <IncomePage />
        </DashboardLayout>
      } />
      <Route path="/tantou/tracking" element={
        <DashboardLayout role="tantou">
          <LeaderboardPage />
        </DashboardLayout>
      } />
      <Route path="/tantou/profile" element={
        <DashboardLayout role="tantou">
          <ProfilePage />
        </DashboardLayout>
      } />

      {/* Editorial Board */}
      <Route path="/editorial" element={
        <DashboardLayout role="editorial">
          <EditorialDashboard />
        </DashboardLayout>
      } />
      <Route path="/editorial/series" element={
        <DashboardLayout role="editorial">
          <SeriesManagement />
        </DashboardLayout>
      } />
      <Route path="/editorial/series/:id" element={
        <DashboardLayout role="editorial">
          <SeriesDetails />
        </DashboardLayout>
      } />
      <Route path="/editorial/schedule" element={
        <DashboardLayout role="editorial">
          <PublishingSchedule />
        </DashboardLayout>
      } />
      <Route path="/editorial/voting" element={
        <DashboardLayout role="editorial">
          <VotingDataImport />
        </DashboardLayout>
      } />
      <Route path="/editorial/series/:seriesId/chapter/:chapterId" element={
        <DashboardLayout role="editorial">
          <ChapterDetails />
        </DashboardLayout>
      } />
      <Route path="/editorial/tracking" element={
        <DashboardLayout role="editorial">
          <LeaderboardPage />
        </DashboardLayout>
      } />
      <Route path="/editorial/profile" element={
        <DashboardLayout role="editorial">
          <ProfilePage />
        </DashboardLayout>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <DashboardLayout role="admin">
          <AdminDashboard />
        </DashboardLayout>
      } />
      <Route path="/admin/profile" element={
        <DashboardLayout role="admin">
          <ProfilePage />
        </DashboardLayout>
      } />

      {/* Reader */}
      <Route path="/reader" element={
        <DashboardLayout role="reader">
          <ReaderDashboard />
        </DashboardLayout>
      } />
      <Route path="/reader/profile" element={
        <DashboardLayout role="reader">
          <ProfilePage />
        </DashboardLayout>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
