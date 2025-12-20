import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Brain, History, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/',
      label: 'Prediction',
      icon: Brain,
      description: 'Single Student'
    },
    {
      path: '/history',
      label: 'History',
      icon: History,
      description: 'Past Predictions'
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Visual Insights'
    },
    {
      path: '/csv-upload',
      label: 'Bulk Upload',
      icon: Upload,
      description: 'CSV Import'
    }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Academic Insight
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered EdTech Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs opacity-80 hidden lg:block">{item.description}</div>
                  </div>
                </Link>
              );
            })}

            {/* Mobile Navigation */}
            <div className="flex sm:hidden gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>

            {/* Demo Notice */}
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l text-xs text-muted-foreground">
              Demo • Academic Analysis
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
