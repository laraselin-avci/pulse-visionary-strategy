
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InsightsList } from '@/components/dashboard/AlertsList';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Insights = () => {
  const { alerts: insights } = useDashboardData();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-600">Track and analyze regulatory insights that impact your business</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">All Regulatory Insights</h2>
        <InsightsList insights={insights} />
      </div>
    </MainLayout>
  );
};

export default Insights;
