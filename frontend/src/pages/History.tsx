import { motion } from 'framer-motion';
import { History as HistoryIcon, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePredictionHistory } from '@/contexts/PredictionHistoryContext';
import { format } from 'date-fns';

const History = () => {
  const { predictions, clearHistory } = usePredictionHistory();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Average':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'At-Risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return '';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Neutral':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Negative':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <HistoryIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Prediction History
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View and manage all previously analyzed students with detailed risk assessments
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Student Records
                </CardTitle>
                <CardDescription>
                  {predictions.length} {predictions.length === 1 ? 'record' : 'records'} in total
                </CardDescription>
              </div>
              {predictions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {predictions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <HistoryIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Predictions Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Make your first prediction to start building your student risk assessment history
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead className="text-center">Marks</TableHead>
                        <TableHead className="text-center">Attendance</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead>Key Factors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictions.map((prediction, index) => (
                        <motion.tr
                          key={prediction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {format(new Date(prediction.timestamp), 'MMM dd, yyyy')}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(prediction.timestamp), 'hh:mm a')}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold">{prediction.marks}</span>
                            <span className="text-muted-foreground text-xs">/100</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold">{prediction.attendance}%</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(prediction.risk)}>
                              {prediction.risk}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSentimentColor(prediction.sentiment)}>
                              {prediction.sentiment}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {prediction.reasons.slice(0, 2).map((reason, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-muted px-2 py-1 rounded"
                                >
                                  {reason}
                                </span>
                              ))}
                              {prediction.reasons.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{prediction.reasons.length - 2} more
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Prediction history is stored locally in your browser
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default History;
