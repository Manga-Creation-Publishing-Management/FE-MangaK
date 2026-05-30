import { Routes, Route, Navigate, Outlet } from 'react-router';
import { SeriesManagement } from "../pages/mangaka/SeriesManagement"
import { Sidebar } from '../pages/shared/Sidebar';
import { TaskManagement } from '../pages/mangaka/TaskManagement';
import { MyTask } from '../pages/assistant/MyTask';
import { SeriesReview } from '../pages/tantouEditor/SeriesReview';
import { PublishingSchedule } from '../pages/editorialBoard/PublishingSchedule';
import { HeaderPage } from '../pages/shared/HeaderPage.jsx';
import { WelcomeLine } from '../pages/shared/WelcomeLine.jsx';
import { OverviewCard } from '../pages/shared/OverviewCard.jsx';
import avatarImgDemo from '../pages/shared/avatarImgDemo.png';
import { LogIn } from 'lucide-react';

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
        <WelcomeLine roleName={displayRole} />
        <OverviewCard iconName={<LogIn color="#ebbfff" size={50} />} iconColor="bg-[#c8b4d1]" contentText="Assigned series" valueNum={3} />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>

      <Route path="/mangaka" element={<Layout roleName="mangaka" />}>
        <Route path="series" element={<SeriesManagement />} />
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


      <Route path="*" element={<Navigate to="/mangaka/series" replace />} />
    </Routes>
  )
}