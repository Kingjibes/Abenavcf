
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import CreateSessionPage from '@/pages/CreateSessionPage';
import SessionPage from '@/pages/SessionPage';
import JoinSessionPage from '@/pages/JoinSessionPage';
import ContactPage from '@/pages/ContactPage';
import MainLayout from '@/layouts/MainLayout';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <>
      <Helmet>
        <title>Contact Gain VCF Generator - Easily collect and share contacts</title>
        <meta name="description" content="Create sessions to collect contacts from groups and download them in VCF format. Perfect for WhatsApp groups, events, and communities." />
      </Helmet>
      <Router>
        <div className="bg-background text-foreground">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateSessionPage />} />
              <Route path="/session/:sessionId" element={<SessionPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route path="/join/:sessionId" element={<JoinSessionPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </>
  );
}

export default App;
