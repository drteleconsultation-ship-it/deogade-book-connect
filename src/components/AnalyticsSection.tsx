import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Globe, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

interface VisitRow {
  visited_at: string;
  country_code: string | null;
  country_name: string | null;
}

type TimeRange = 'today' | 'yesterday' | 'last24h' | 'last7d';

const AnalyticsSection: React.FC = () => {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState<TimeRange>('last7d');

  useEffect(() => {
    const fetchVisits = async () => {
      // Fetch last 7 days of data (covers all ranges)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('page_visits')
        .select('visited_at, country_code, country_name')
        .gte('visited_at', sevenDaysAgo.toISOString())
        .order('visited_at', { ascending: true });

      if (!error && data) {
        setVisits(data);
      }
      setLoading(false);
    };

    fetchVisits();
  }, []);

  const filteredVisits = useMemo(() => {
    const now = new Date();
    return visits.filter((v) => {
      const visitDate = new Date(v.visited_at);
      switch (activeRange) {
        case 'today': {
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return visitDate >= startOfDay;
        }
        case 'yesterday': {
          const startYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return visitDate >= startYesterday && visitDate < startToday;
        }
        case 'last24h': {
          const h24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          return visitDate >= h24;
        }
        case 'last7d':
        default: {
          const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return visitDate >= d7;
        }
      }
    });
  }, [visits, activeRange]);

  // Country stats
  const countryStats = useMemo(() => {
    const map: Record<string, { code: string; name: string; count: number }> = {};
    filteredVisits.forEach((v) => {
      const code = v.country_code || 'Unknown';
      const name = v.country_name || 'Unknown';
      if (!map[code]) map[code] = { code, name, count: 0 };
      map[code].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [filteredVisits]);

  // Daily chart data
  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredVisits.forEach((v) => {
      const day = new Date(v.visited_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [filteredVisits]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  const countryFlag = (code: string) => {
    if (!code || code === 'Unknown') return '🌍';
    return code
      .toUpperCase()
      .split('')
      .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
      .join('');
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollAnimationWrapper variant="fade-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Website Analytics</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Visitor Statistics</h2>
            <p className="text-muted-foreground mt-2">Real-time visitor tracking for our clinic website</p>
          </div>
        </ScrollAnimationWrapper>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeRange} onValueChange={(v) => setActiveRange(v as TimeRange)}>
            <ScrollAnimationWrapper variant="fade-up" delay={100}>
              <TabsList className="grid grid-cols-4 w-full mb-6">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                <TabsTrigger value="last24h">Last 24h</TabsTrigger>
                <TabsTrigger value="last7d">Last 7 Days</TabsTrigger>
              </TabsList>
            </ScrollAnimationWrapper>

            {/* Shared content for all tabs */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Total visitors card */}
              <ScrollAnimationWrapper variant="fade-up" delay={200}>
                <Card className="md:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Visitors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-12 bg-muted animate-pulse rounded" />
                    ) : (
                      <p className="text-4xl font-bold text-primary">{filteredVisits.length}</p>
                    )}
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>

              {/* Bar Chart */}
              <ScrollAnimationWrapper variant="fade-up" delay={300}>
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Visitors Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-40 bg-muted animate-pulse rounded" />
                    ) : chartData.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No visits in this period</p>
                    ) : (
                      <div className="flex items-end gap-2 h-40">
                        {chartData.map((d) => (
                          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs font-medium text-foreground">{d.count}</span>
                            <div
                              className="w-full bg-primary/80 rounded-t-md transition-all duration-500 min-h-[4px]"
                              style={{ height: `${(d.count / maxCount) * 120}px` }}
                            />
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{d.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            </div>

            {/* Country-wise breakdown */}
            <ScrollAnimationWrapper variant="fade-up" delay={400}>
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Visitors by Country
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                      ))}
                    </div>
                  ) : countryStats.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No country data available</p>
                  ) : (
                    <div className="space-y-3">
                      {countryStats.map((c) => (
                        <div key={c.code} className="flex items-center gap-3">
                          <span className="text-xl">{countryFlag(c.code)}</span>
                          <span className="flex-1 font-medium text-foreground">{c.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${(c.count / filteredVisits.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-primary min-w-[2rem] text-right">{c.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
