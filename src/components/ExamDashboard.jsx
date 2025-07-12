import React from 'react';
import { Plus, FileText, Clock, CheckCircle, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const ExamDashboard = ({ exams, onCreateNew, onViewExam }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'score-excellent';
      case 'in-progress':
        return 'score-average';
      default:
        return 'score-poor';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Exam Checker Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and review your examination papers
            </p>
          </div>
          <Button 
            onClick={onCreateNew}
            className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Exam
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Exams</p>
              <p className="text-2xl font-bold text-foreground">{exams.length}</p>
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {exams.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-foreground">
                {exams.filter(e => e.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Answers</p>
              <p className="text-2xl font-bold text-foreground">
                {exams.reduce((sum, exam) => sum + exam.answersUploaded, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Exams Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Recent Exams
        </h2>
        
        {exams.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No exams found
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first exam entry
            </p>
            <Button onClick={onCreateNew} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Exam
            </Button>
          </Card>
        ) : (
          <div className="exam-grid">
            {exams.map((exam) => (
              <Card key={exam.id} className="exam-card cursor-pointer" onClick={() => onViewExam(exam)}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {exam.examNumber}
                    </p>
                  </div>
                  <span className={`score-badge ${getStatusColor(exam.status)}`}>
                    {getStatusIcon(exam.status)}
                    <span className="ml-1 capitalize">{exam.status}</span>
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="font-medium text-foreground">{exam.questionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Answers Uploaded:</span>
                    <span className="font-medium text-foreground">{exam.answersUploaded}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">{exam.date}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewExam(exam);
                  }}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDashboard;