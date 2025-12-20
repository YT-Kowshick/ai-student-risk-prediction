import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { usePredictionHistory } from '@/contexts/PredictionHistoryContext';
import { predictRisk } from '@/services/api';

interface BulkResult {
  total: number;
  successful: number;
  failed: number;
  atRiskCount: number;
  results: Array<{
    marks: number;
    attendance: number;
    feedback: string;
    risk: string;
    sentiment: string;
    reasons: string[];
    success: boolean;
    error?: string;
  }>;
}

const BulkUpload = () => {
  const { addPrediction } = usePredictionHistory();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResult(null);
        toast.success('CSV file loaded successfully');
      } else {
        toast.error('Please select a valid CSV file');
      }
    }
  };

  const parseCSV = (text: string): Array<{ marks: number; attendance: number; feedback: string }> => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const marksIdx = headers.indexOf('marks');
    const attendanceIdx = headers.indexOf('attendance');
    const feedbackIdx = headers.indexOf('feedback');

    if (marksIdx === -1 || attendanceIdx === -1 || feedbackIdx === -1) {
      throw new Error('CSV must contain marks, attendance, and feedback columns');
    }

    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        marks: parseFloat(values[marksIdx]),
        attendance: parseFloat(values[attendanceIdx]),
        feedback: values[feedbackIdx]?.trim() || ''
      };
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      const text = await file.text();
      const students = parseCSV(text);

      const bulkResult: BulkResult = {
        total: students.length,
        successful: 0,
        failed: 0,
        atRiskCount: 0,
        results: []
      };

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        setProgress(((i + 1) / students.length) * 100);

        try {
          const data = await predictRisk({
            marks: student.marks,
            attendance: student.attendance,
            feedback: student.feedback,
          });

          // Add to history
          addPrediction({
            marks: student.marks,
            attendance: student.attendance,
            feedback: student.feedback,
            risk: data.risk,
            sentiment: data.sentiment,
            reasons: data.reasons
          });

          bulkResult.results.push({
            ...student,
            risk: data.risk,
            sentiment: data.sentiment,
            reasons: data.reasons,
            success: true
          });

          bulkResult.successful++;
          if (data.risk === 'At-Risk') {
            bulkResult.atRiskCount++;
          }

        } catch (error) {
          bulkResult.results.push({
            ...student,
            risk: '',
            sentiment: '',
            reasons: [],
            success: false,
            error: error instanceof Error ? error.message : 'Failed'
          });
          bulkResult.failed++;
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResult(bulkResult);
      toast.success(`Processed ${bulkResult.successful} students successfully!`);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg">
              <Upload className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Bulk CSV Upload
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a CSV file to predict risk levels for multiple students at once
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                CSV format: marks,attendance,feedback (one student per row)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Input */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {file ? file.name : 'Click to upload CSV file'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or drag and drop
                    </p>
                  </div>
                </label>
              </div>

              {/* CSV Example */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Example CSV format:</p>
                <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`marks,attendance,feedback
65,72,Good performance
35,50,Poor attendance
85,95,Excellent student`}
                </pre>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Predict
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    Processing: {Math.round(progress)}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Processing Complete
                  </CardTitle>
                  <CardDescription>
                    Results summary and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{result.total}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Success</p>
                      <p className="text-2xl font-bold text-green-600">{result.successful}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">At-Risk</p>
                      <p className="text-2xl font-bold text-red-600">{result.atRiskCount}</p>
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-yellow-600">{result.failed}</p>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {result.results.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-lg flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Student {idx + 1}: Marks {item.marks}, Attendance {item.attendance}%
                          </p>
                          {item.success && (
                            <div className="flex gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={
                                  item.risk === 'Good'
                                    ? 'bg-green-100 text-green-800'
                                    : item.risk === 'Average'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {item.risk}
                              </Badge>
                              <Badge variant="outline">{item.sentiment}</Badge>
                            </div>
                          )}
                        </div>
                        {item.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      All results have been automatically added to your prediction history
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Bulk predictions powered by AI • Process hundreds of students in minutes
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default BulkUpload;
