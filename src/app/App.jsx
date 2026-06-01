
import '../styles/global.css'
// <<<<<<< HEAD
// // import { HeaderPage } from '../pages/shared/HeaderPage.jsx'
// // import { WelcomeLine } from '../pages/shared/WelcomeLine.jsx'
// // import { OverviewCard } from '../pages/shared/OverviewCard.jsx'
// // import avatarImgDemo from '../pages/shared/avatarImgDemo.png'
// import { LogIn } from 'lucide-react';


// import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
// import { Sidebar } from '../pages/shared/Sidebar';
// =======
// import { BrowserRouter } from 'react-router';
// >>>>>>> dev
import { AppRoutes } from '../routes/AppRoutes';
import { ThemeProvider } from '../features/theme/ThemeContext.jsx'
import { ThemeToggle } from '../shared/components/ThemeToggle.jsx'

export default function App() {
// <<<<<<< HEAD
//   // const url = avatarImgDemo;
//   return (
//     // <>
//     //   <HeaderPage roleName="Mangaka" avatarUrl={url} />
//     //   <WelcomeLine roleName="Mangaka" />
//     //   <OverviewCard iconName={<LogIn color="#ebbfff" size={50} />} iconColor="#c8b4d1" contentText="Assigned series" valueNum={3} />
//       <>
// =======
  return (
    <ThemeProvider>
{/* >>>>>>> dev */}
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
      <ThemeToggle />
    </ThemeProvider>
  )
}
