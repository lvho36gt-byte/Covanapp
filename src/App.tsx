/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TextbooksPage } from './pages/TextbooksPage';
import { LearningCornerPage } from './pages/LearningCornerPage';
import { RobotTutorPage } from './pages/RobotTutorPage';
import { GamesCenterPage } from './pages/GamesCenterPage';
import { CreativeLabPage } from './pages/CreativeLabPage';
import { ProgressDashboardPage } from './pages/ProgressDashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { ProjectIntroPage } from './pages/ProjectIntroPage';
import { RobotMascot } from './components/RobotMascot';
import { Bot } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const handleNavigate = (page: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-['Nunito',sans-serif] text-slate-800">
      <div>
        {/* Sticky Header with Role Switcher & Audio Toggle */}
        <Header onNavigate={handleNavigate} currentPage={currentPage} />

        {/* Top Navigation */}
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Main View Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'textbooks' && <TextbooksPage onNavigate={handleNavigate} />}
          {currentPage === 'learning' && <LearningCornerPage onNavigate={handleNavigate} />}
          {currentPage === 'robot-tutor' && <RobotTutorPage />}
          {currentPage === 'games' && <GamesCenterPage />}
          {currentPage === 'creative' && <CreativeLabPage />}
          {currentPage === 'progress' && <ProgressDashboardPage />}
          {currentPage === 'library' && <LibraryPage />}
          {currentPage === 'teacher' && <TeacherDashboardPage />}
          {currentPage === 'parent' && <ParentPortalPage />}
          {currentPage === 'intro' && <ProjectIntroPage onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Floating Robot Helper Quick Button */}
      {currentPage !== 'robot-tutor' && (
        <button
          onClick={() => handleNavigate('robot-tutor')}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group border-2 border-white"
          title="Trò chuyện với Robot Bạn Học AI"
        >
          <span className="text-xl sm:text-2xl animate-wiggle">🤖</span>
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            Hỏi Robot AI
          </span>
        </button>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
