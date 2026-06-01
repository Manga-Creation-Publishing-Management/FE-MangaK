import { Routes, Route, Navigate, Outlet } from 'react-router';
import {SeriesManagement} from "../pages/mangaka/SeriesManagement"
import { Sidebar } from '../pages/shared/Sidebar';
import { HeaderPage } from '../pages/shared/HeaderPage';
import avatarImgDemo from '../pages/shared/avatarImgDemo.png';
import { TaskManagement } from '../pages/mangaka/TaskManagement';
import { MyTask } from '../pages/assistant/MyTask';
import { SeriesReview } from '../pages/tantouEditor/SeriesReview';
import { PublishingSchedule } from '../pages/editorialBoard/PublishingSchedule';


function Layout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar userRole="mangaka" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderPage roleName="ass" avatarUrl={avatarImgDemo} />
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>

      <Route path="/mangaka" element={<Layout />}>
        <Route path="series" element={<SeriesManagement />} />
        <Route path="tasks" element={<TaskManagement />} />
      </Route>

      <Route path="/assistant" element={<Layout />}>
        <Route path="tasks" element={<MyTask />} />
        {/* <Route path="tasks" element={<TaskManagement />} /> ss*/}
      </Route>
      
      <Route path="/tantou" element={<Layout />}>
        <Route path="series" element={<SeriesReview />} />
        {/* <Route path="tasks" element={<TaskManagement />} /> ss*/}
      </Route>
      
      <Route path="/editorial" element={<Layout />}>
        <Route path="series" element={<SeriesReview />} />
        <Route path="schedule" element={<PublishingSchedule />} />
        {/* <Route path="tasks" element={<TaskManagement />} /> ss*/}
      </Route>


      <Route path="*" element={<Navigate to="/mangaka/series" replace />} />
    </Routes>
  )
}