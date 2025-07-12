import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Users, Calculator, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';

const ExamCreation = ({ onBack, onExamCreated }) => {
  const { toast } = useToast();
  const [examNumber, setExamNumber] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerSheets, setAnswerSheets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const generateExamId = () => {
    return 'EX' + Date.now().toString().slice(-6);
  };

  const handleQuestionPaperUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setQuestionPaper(file);
      toast({
        title: "Question paper uploaded",
        description: `${file.name} has been selected.`,
      });
    }
  };

  const handleAnswerSheetsUpload = (event) => {
    const files = Array.from(event.target.files);
    setAnswerSheets(files);
    toast({
      title: "Answer sheets uploaded",
      description: `${files.length} answer sheet(s) selected.`,
    });
  };

  const handleUploadAndProcess = async () => {
    if (!examNumber || !examTitle || !questionPaper || answerSheets.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and upload required files.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Simulate upload to Azure Storage
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploading(false);
      setProcessing(true);

      // Simulate Python API call for processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create new exam object
      const newExam = {
        id: generateExamId(),
        examNumber,
        title: examTitle,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        questionCount: Math.floor(Math.random() * 30) + 10, // Simulated
        answersUploaded: answerSheets.length,
        questionPaper: questionPaper.name,
        answerSheets: answerSheets.map(sheet => sheet.name),
        questions: generateMockQuestions()
      };

      setProcessing(false);
      
      toast({
        title: "Exam processed successfully!",
        description: "The exam has been created and is ready for review.",
      });

      onExamCreated(newExam);
    } catch (error) {
      setUploading(false);
      setProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process the exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateMockQuestions = () => {
    const questions = [];
    const questionCount = Math.floor(Math.random() * 20) + 10;
    
    for (let i = 1; i <= questionCount; i++) {
      questions.push({
        id: i,
        text: `Question ${i}: This is a sample question that would be extracted from the uploaded question paper.`,
        answers: answerSheets.map((_, index) => ({
          studentId: `Student ${index + 1}`,
          answer: `Sample answer ${i} from student ${index + 1}`,
          score: Math.floor(Math.random() * 10) + 1,
          explanation: `This answer demonstrates understanding of the concept with minor areas for improvement.`
        })),
        answerKey: `Expected answer for question ${i} that serves as the grading reference.`
      });
    }
    
    return questions;
  };

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
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create New Exam
        </h1>
        <p className="text-muted-foreground">
          Upload question paper and answer sheets to get started
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exam Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Exam Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="examNumber">Exam Number</Label>
              <Input
                id="examNumber"
                placeholder="e.g., MATH-2024-001"
                value={examNumber}
                onChange={(e) => setExamNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="examTitle">Exam Title</Label>
              <Input
                id="examTitle"
                placeholder="e.g., Mathematics Final Exam"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            File Uploads
          </h2>
          
          <div className="space-y-6">
            {/* Question Paper Upload */}
            <div>
              <Label className="text-base font-medium">Question Paper</Label>
              <div className="upload-area mt-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleQuestionPaperUpload}
                  className="hidden"
                  id="question-paper"
                />
                <label htmlFor="question-paper" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium text-foreground">
                    {questionPaper ? questionPaper.name : 'Click to upload question paper'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </label>
              </div>
            </div>

            {/* Answer Sheets Upload */}
            <div>
              <Label className="text-base font-medium">Answer Sheets</Label>
              <div className="upload-area mt-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleAnswerSheetsUpload}
                  className="hidden"
                  id="answer-sheets"
                />
                <label htmlFor="answer-sheets" className="cursor-pointer">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium text-foreground">
                    {answerSheets.length > 0 
                      ? `${answerSheets.length} answer sheet(s) selected`
                      : 'Click to upload answer sheets'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multiple files supported
                  </p>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Status */}
      {questionPaper && answerSheets.length > 0 && (
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Upload Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center p-3 bg-muted/30 rounded-lg">
              <FileText className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium text-foreground">Question Paper</p>
                <p className="text-sm text-muted-foreground">{questionPaper.name}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-muted/30 rounded-lg">
              <Users className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium text-foreground">Answer Sheets</p>
                <p className="text-sm text-muted-foreground">
                  {answerSheets.length} file(s) uploaded
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUploadAndProcess}
            disabled={uploading || processing}
            className="w-full gradient-primary text-primary-foreground"
          >
            {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {processing && <Calculator className="w-4 h-4 mr-2" />}
            {!uploading && !processing && <Upload className="w-4 h-4 mr-2" />}
            {uploading 
              ? 'Uploading to Azure Storage...'
              : processing 
              ? 'Processing with Python API...'
              : 'Upload & Process Exam'
            }
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ExamCreation;