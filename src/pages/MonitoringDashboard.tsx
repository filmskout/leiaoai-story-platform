import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  ExternalLink,
  Database,
  Globe,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MonitoringStats {
  totalCompanies: number;
  totalTools: number;
  totalFundings: number;
  recentUpdates: number;
  dataCompleteness: number;
  lastUpdateCheck: string;
}

interface CompanyUpdate {
  id: string;
  company_name: string;
  update_type: string;
  old_value: string;
  new_value: string;
  source: string;
  update_date: string;
  verified: boolean;
}

interface MonitoringJob {
  id: string;
  job_type: string;
  target_type: string;
  last_run: string;
  next_run: string;
  status: string;
  results: any;
}

export default function MonitoringDashboard() {
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<CompanyUpdate[]>([]);
  const [monitoringJobs, setMonitoringJobs] = useState<MonitoringJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load basic stats
      const [companiesResult, toolsResult, fundingsResult, updatesResult, jobsResult] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact' }),
        supabase.from('tools').select('id', { count: 'exact' }),
        supabase.from('fundings').select('id', { count: 'exact' }),
        supabase.from('company_updates').select('*').order('update_date', { ascending: false }).limit(10),
        supabase.from('monitoring_jobs').select('*').order('next_run', { ascending: true })
      ]);

      // Calculate data completeness
      const companiesWithDescriptions = await supabase
        .from('companies')
        .select('id', { count: 'exact' })
        .not('description', 'is', null)
        .not('description', 'eq', '');

      const toolsWithDescriptions = await supabase
        .from('tools')
        .select('id', { count: 'exact' })
        .not('description', 'is', null)
        .not('description', 'eq', '');

      const totalRecords = (companiesResult.count || 0) + (toolsResult.count || 0);
      const completeRecords = (companiesWithDescriptions.count || 0) + (toolsWithDescriptions.count || 0);
      const dataCompleteness = totalRecords > 0 ? Math.round((completeRecords / totalRecords) * 100) : 0;

      setStats({
        totalCompanies: companiesResult.count || 0,
        totalTools: toolsResult.count || 0,
        totalFundings: fundingsResult.count || 0,
        recentUpdates: updatesResult.data?.length || 0,
        dataCompleteness,
        lastUpdateCheck: new Date().toISOString()
      });

      setRecentUpdates(updatesResult.data || []);
      setMonitoringJobs(jobsResult.data || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'funding':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'valuation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'description':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'website':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Companies Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Track data integrity and updates across the platform</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              AI companies in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTools}</div>
            <p className="text-xs text-muted-foreground">
              AI tools and models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Completeness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.dataCompleteness}%</div>
            <p className="text-xs text-muted-foreground">
              Records with descriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentUpdates}</div>
            <p className="text-xs text-muted-foreground">
              Last 10 updates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="updates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring Jobs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Company Updates</CardTitle>
              <CardDescription>
                Latest changes detected across companies and tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentUpdates.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No recent updates found. All data appears to be current.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {recentUpdates.map((update) => (
                    <div key={update.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getUpdateTypeColor(update.update_type)}>
                            {update.update_type}
                          </Badge>
                          <span className="font-medium">{update.company_name}</span>
                          {update.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div><strong>From:</strong> {update.old_value}</div>
                          <div><strong>To:</strong> {update.new_value}</div>
                          <div><strong>Source:</strong> 
                            <a 
                              href={update.source} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-1 text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 inline" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(update.update_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Jobs</CardTitle>
              <CardDescription>
                Automated jobs that track updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monitoringJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="font-medium">{job.job_type.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">
                          Target: {job.target_type}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Last run: {new Date(job.last_run).toLocaleDateString()}</div>
                      <div>Next run: {new Date(job.next_run).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Important notifications and issues requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats && stats.dataCompleteness < 80 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Data completeness is below 80%. Consider running the content generation script.
                    </AlertDescription>
                  </Alert>
                )}
                
                {stats && stats.recentUpdates === 0 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      No recent updates detected. Consider running the automated update tracker.
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All monitoring systems are operational and running as expected.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
