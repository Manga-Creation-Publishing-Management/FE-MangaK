
import { useState } from 'react'
import '../styles/global.css'
import { HeaderPage } from '../pages/shared/HeaderPage.jsx'
import { WelcomeLine } from '../pages/shared/WelcomeLine.jsx'
import { OverviewCard } from '../pages/shared/OverviewCard.jsx'
import avatarImgDemo from '../pages/shared/avatarImgDemo.png'
import { LogIn } from 'lucide-react';


import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Sidebar } from '../pages/shared/Sidebar';
import { AppRoutes } from '../routes/AppRoutes';
// >>>>>>> feat/hung/sidebar

export default function App() {
  const url = avatarImgDemo;
  return (
    <>
      <HeaderPage roleName="Mangaka" avatarUrl={url} />
      <WelcomeLine roleName="Mangaka" />
      <OverviewCard iconName={<LogIn color="#ebbfff" size={50} />} iconColor="#c8b4d1" contentText="Assigned series" valueNum={3} />
      
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </>
  )
}
