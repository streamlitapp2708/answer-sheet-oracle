import React, { useState } from 'react';
import ExamDashboard from '../components/ExamDashboard';
import ExamCreation from '../components/ExamCreation';
import ExamViewer from '../components/ExamViewer';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([
    {
      id: 'EX001',
      examNumber: 'MATH-2024-001',
      title: 'Mathematics Final Exam',
      date: '2024-01-15',
      status: 'completed',
      questionCount: 25,
      answersUploaded: 3
    },
    {
      id: 'EX002',
      examNumber: 'PHYS-2024-002',
      title: 'Physics Midterm',
      date: '2024-01-20',
      status: 'in-progress',
      questionCount: 20,
      answersUploaded: 1
    }
  ]);

  const handleCreateNew = () => {
    setCurrentView('create');
  };

  const handleViewExam = (exam) => {
    setSelectedExam(exam);
    setCurrentView('viewer');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedExam(null);
  };

  const handleExamCreated = (newExam) => {
    setExams([...exams, newExam]);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'dashboard' && (
        <ExamDashboard
          exams={exams}
          onCreateNew={handleCreateNew}
          onViewExam={handleViewExam}
        />
      )}
      
      {currentView === 'create' && (
        <ExamCreation
          onBack={handleBackToDashboard}
          onExamCreated={handleExamCreated}
        />
      )}
      
      {currentView === 'viewer' && selectedExam && (
        <ExamViewer
          exam={selectedExam}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
};

export default Index;