import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Loader2 } from 'lucide-react';

const AnalyticsView = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        dau: 0,
        retention: 68,
        avgCompletion: 0
    });
    const [chartData, setChartData] = useState([]);
    const [timeRange, setTimeRange] = useState('Last 7 Days');

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // 1. Fetch Students count for DAU placeholder
            const { count: studentCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student');

            // 2. Avg Completion rate
            const { count: totalLessons } = await supabase
                .from('course_lessons')
                .select('*', { count: 'exact', head: true });

            const { count: totalCompletions } = await supabase
                .from('lesson_completions')
                .select('*', { count: 'exact', head: true });

            // This is a rough average across all students/lessons
            // In a real app, it would be per-enrollment
            const completionRate = totalLessons > 0 ? Math.round((totalCompletions / totalLessons) * 100) : 0;

            setStats(prev => ({
                ...prev,
                dau: studentCount || 0,
                avgCompletion: completionRate
            }));

            // 3. Revenue Growth (Last 7 or 30 days)
            const days = timeRange === 'Last 7 Days' ? 7 : 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const { data: enrollments } = await supabase
                .from('enrollments')
                .select(`
                    enrolled_at,
                    courses (price)
                `)
                .gte('enrolled_at', startDate.toISOString())
                .order('enrolled_at', { ascending: true });

            // Group by date
            const revenueByDate = {};
            for (let i = 0; i < days; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (days - 1 - i));
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
                revenueByDate[dateStr] = 0;
            }

            enrollments?.forEach(en => {
                const dateStr = new Date(en.enrolled_at).toLocaleDateString('en-US', { weekday: 'short' });
                if (revenueByDate[dateStr] !== undefined) {
                    revenueByDate[dateStr] += (en.courses?.price || 0);
                }
            });

            const points = Object.keys(revenueByDate).map((key, index) => ({
                label: key,
                value: revenueByDate[key]
            }));

            setChartData(points);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
        );
    }

    // SVG Chart Helpers
    const maxVal = Math.max(...chartData.map(d => d.value), 1000); // Min scale of 1k
    const chartHeight = 300;
    const chartWidth = 800;

    const getX = (index) => (index * (chartWidth / (chartData.length - 1)));
    const getY = (value) => chartHeight - (value / maxVal * chartHeight * 0.8) - 20;

    const linePath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(d.value)}`).join(' ');
    const areaPath = `${linePath} L${getX(chartData.length - 1)},${chartHeight} L0,${chartHeight} Z`;

    return (
        <div className="admin-view">
            <header className="admin-header">
                <h2>Analytics & Reports</h2>
            </header>
            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div>
                        <p>Total Students</p>
                        <h3>{stats.dau.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div>
                        <p>Retention Rate</p>
                        <h3>{stats.retention}%</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div>
                        <p>Avg. Completion</p>
                        <h3>{stats.avgCompletion}%</h3>
                    </div>
                </div>
            </div>
            <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3>Revenue Growth</h3>
                    <select
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>

                <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#002BB9" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#002BB9" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Y-Axis scale lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <g key={i}>
                                <line
                                    x1="0" y1={i * (chartHeight / 4)}
                                    x2={chartWidth} y2={i * (chartHeight / 4)}
                                    stroke="#E2E8F0" strokeDasharray="4 4"
                                />
                                <text x="-40" y={i * (chartHeight / 4) + 5} fill="#64748B" fontSize="11">
                                    ₦{Math.round(maxVal - (i * maxVal / 4)).toLocaleString()}
                                </text>
                            </g>
                        ))}

                        <path d={areaPath} fill="url(#gradient)" />
                        <path d={linePath} fill="none" stroke="#002BB9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {chartData.map((point, i) => (
                            <circle key={i} cx={getX(i)} cy={getY(point.value)} r="4" fill="white" stroke="#002BB9" strokeWidth="2" />
                        ))}
                    </svg>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#64748B', fontSize: '0.8rem' }}>
                        {chartData.map((d, i) => <span key={i}>{d.label}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
