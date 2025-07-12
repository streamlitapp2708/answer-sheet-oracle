import React, { useState } from 'react';
import { ArrowLeft, Calculator, RefreshCw, FileText, Users, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/use-toast';

const ExamViewer = ({ exam, onBack }) => {
  const { toast } = useToast();
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [recalculating, setRecalculating] = useState(false);
  const [recalculatingQuestion, setRecalculatingQuestion] = useState(null);

  // Mock questions if not provided
  const questions = exam.questions || [];

  const handleRecalculateAll = async () => {
    setRecalculating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRecalculating(false);
    toast({
      title: "Scores recalculated",
      description: "All question scores have been recalculated successfully.",
    });
  };

  const handleRecalculateQuestion = async (questionId) => {
    setRecalculatingQuestion(questionId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRecalculatingQuestion(null);
    toast({
      title: "Question recalculated",
      description: `Question ${questionId} scores have been updated.`,
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'score-excellent';
    if (score >= 6) return 'score-good';
    if (score >= 4) return 'score-average';
    return 'score-poor';
  };

  const currentQuestion = questions.find(q => q.id === selectedQuestion);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {exam.title}
            </h1>
            <p className="text-muted-foreground">
              Exam ID: {exam.examNumber} • {exam.questionCount} Questions • {exam.answersUploaded} Answer Sheets
            </p>
          </div>
          
          <Button
            onClick={handleRecalculateAll}
            disabled={recalculating}
            className="gradient-primary text-primary-foreground"
          >
            {recalculating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4 mr-2" />
            )}
            {recalculating ? 'Recalculating...' : 'Recalculate All'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Questions</p>
              <p className="text-2xl font-bold text-foreground">{questions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Students</p>
              <p className="text-2xl font-bold text-foreground">{exam.answersUploaded}</p>
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success/10 rounded-lg">
              <Target className="w-6 h-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
              <p className="text-2xl font-bold text-foreground">
                {questions.length > 0 
                  ? (questions.reduce((sum, q) => 
                      sum + q.answers.reduce((qSum, a) => qSum + a.score, 0) / q.answers.length, 0
                    ) / questions.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Calculator className="w-6 h-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold text-foreground">
                {questions.length * 10}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Questions List */}
        <Card className="lg:col-span-1 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Questions
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {questions.map((question) => (
              <div
                key={question.id}
                className={`question-card cursor-pointer ${
                  selectedQuestion === question.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedQuestion(question.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    Q{question.id}
                  </span>
                  <div className="flex items-center space-x-1">
                    {question.answers.map((answer, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${getScoreColor(answer.score).replace('score-', 'bg-')}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Question Details */}
        <Card className="lg:col-span-3 p-6">
          {currentQuestion ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Question {currentQuestion.id}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRecalculateQuestion(currentQuestion.id)}
                  disabled={recalculatingQuestion === currentQuestion.id}
                >
                  {recalculatingQuestion === currentQuestion.id ? (
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Calculator className="w-4 h-4 mr-1" />
                  )}
                  Recalculate
                </Button>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-2">Question:</h4>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-foreground">{currentQuestion.text}</p>
                </div>
              </div>

              {/* Answer Key */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-2">Answer Key:</h4>
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <p className="text-foreground">{currentQuestion.answerKey}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Student Answers */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Student Answers:</h4>
                <div className="space-y-4">
                  {currentQuestion.answers.map((answer, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="font-medium">
                            {answer.studentId}
                          </Badge>
                          <Badge className={getScoreColor(answer.score)}>
                            {answer.score}/10
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Answer:
                        </p>
                        <div className="answer-highlight">
                          <p className="text-foreground">{answer.answer}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Explanation:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {answer.explanation}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Select a question
              </h3>
              <p className="text-muted-foreground">
                Choose a question from the list to view details and answers
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Results Summary */}
      {questions.length > 0 && (
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Results Summary
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-medium text-foreground">Student</th>
                  {questions.map(q => (
                    <th key={q.id} className="text-center py-2 px-2 font-medium text-foreground">
                      Q{q.id}
                    </th>
                  ))}
                  <th className="text-center py-2 px-4 font-medium text-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: exam.answersUploaded }, (_, studentIndex) => (
                  <tr key={studentIndex} className="border-b border-border">
                    <td className="py-2 px-4 font-medium text-foreground">
                      Student {studentIndex + 1}
                    </td>
                    {questions.map(q => (
                      <td key={q.id} className="text-center py-2 px-2">
                        <Badge className={getScoreColor(q.answers[studentIndex]?.score || 0)}>
                          {q.answers[studentIndex]?.score || 0}
                        </Badge>
                      </td>
                    ))}
                    <td className="text-center py-2 px-4">
                      <Badge variant="secondary" className="font-bold">
                        {questions.reduce((sum, q) => sum + (q.answers[studentIndex]?.score || 0), 0)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExamViewer;