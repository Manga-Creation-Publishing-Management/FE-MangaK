import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Sidebar } from '../pages/shared/Sidebar';
import { AppRoutes } from '../routes/AppRoutes';

export default function App() {
  return (
    <>
      <BrowserRouter>

        <AppRoutes/>
      </BrowserRouter>
    </>
  )
}