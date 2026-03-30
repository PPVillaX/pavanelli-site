import { getAnalyticsSummary, getProjectEngagement, getConversionFunnel } from '@/lib/analytics';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const resolvedParams = await searchParams;
  const days = parseInt(resolvedParams.days || '30');

  const [summary, engagement, funnel] = await Promise.all([
    getAnalyticsSummary(days),
    getProjectEngagement(days),
    getConversionFunnel(days),
  ]);

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-brand-graphite mb-8">Analytics</h1>
      <AnalyticsDashboard summary={summary} engagement={engagement} funnel={funnel} days={days} />
    </div>
  );
}
