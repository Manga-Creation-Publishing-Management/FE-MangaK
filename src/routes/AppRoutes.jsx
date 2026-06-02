import { Routes, Route, Navigate, Outlet } from 'react-router';
import { SeriesManagement } from "../pages/shared/SeriesManagement.jsx"
import { Sidebar } from '../pages/shared/Sidebar';
import { HeaderPage } from '../pages/shared/HeaderPage';
import avatarImgDemo from '../pages/shared/avatarImgDemo.png';
import { TaskManagement } from '../pages/mangaka/TaskManagement';
import { MyTask } from '../pages/assistant/MyTask';
import { SeriesReview } from '../pages/tantouEditor/SeriesReview';
import { PublishingSchedule } from '../pages/editorialBoard/PublishingSchedule';
import { LogIn } from 'lucide-react';
import { SeriesDetail } from '../pages/shared/SeriesDetail.jsx';
import { Dashboard } from '../pages/shared/Dashboard.jsx';
import { HomePage } from '../pages/shared/HomePage.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
const roleDisplayNames = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
  admin: "Admin",
  reader: "Reader"
};

function Layout({ roleName }) {
  const url = avatarImgDemo;
  const displayRole = roleDisplayNames[roleName] || roleName;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar userRole={roleName} />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        <HeaderPage roleName={displayRole} avatarUrl={url} />
        <div className="flex-1 overflow-y-auto p-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/mangaka" element={<Layout roleName="mangaka" />}>
        <Route index element={<Dashboard role={roleDisplayNames.mangaka} />} />
        <Route path="series" element={<SeriesManagement role="mangaka" />} />
        <Route path="series/:id" element={<SeriesDetail />} />
        <Route path="tasks" element={<TaskManagement />} />
      </Route>

      <Route path="/assistant" element={<Layout roleName="assistant" />}>
        <Route path="tasks" element={<MyTask />} />
        {/* <Route path="tasks" element={<TaskManagement />} /> ss*/}
      </Route>

      <Route path="/tantou" element={<Layout roleName="tantou" />}>
        <Route path="series" element={<SeriesReview />} />
        {/* <Route path="tasks" element={<TaskManagement />} /> ss*/}
      </Route>

      <Route path="/editorial" element={<Layout roleName="editorial" />}>
        <Route path="series" element={<SeriesReview />} />
        <Route path="schedule" element={<PublishingSchedule />} />
        {/* <Route path="tasks" element={<TaskManagement />} /> ss*/}
      </Route>


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes >
  )
}