
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-politix-gray-light p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center animate-scale-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-2">Page not found</p>
        <p className="text-gray-500 mb-6">
          The page <span className="font-medium">{location.pathname}</span> you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="inline-flex items-center bg-blue-600 hover:bg-blue-700">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
