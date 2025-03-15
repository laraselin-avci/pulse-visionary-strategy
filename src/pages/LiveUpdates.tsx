
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const LiveUpdates = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Updates</h1>
        <p className="text-gray-600">Real-time regulatory information and updates</p>
      </div>

      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="text-center py-8">
          <h2 className="text-lg font-medium mb-2">Live Updates Coming Soon</h2>
          <p className="text-gray-600">
            This feature is currently under development. Check back soon for real-time regulatory updates and alerts.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LiveUpdates;
