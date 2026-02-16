import React from 'react';

const AnalyticsView = () => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Analytics & Reports</h2>
        </header>
        <div className="stats-grid">
            <div className="stat-card glass-card">
                <div>
                    <p>Daily Active Users</p>
                    <h3>1,420</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <div>
                    <p>Retention Rate</p>
                    <h3>68%</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <div>
                    <p>Avg. Completion</p>
                    <h3>45%</h3>
                </div>
            </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Revenue Growth</h3>
                <select style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Year to Date</option>
                </select>
            </div>

            {/* Custom SVG Line Chart */}
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <line
                            key={i}
                            x1="0"
                            y1={i * 75}
                            x2="800"
                            y2={i * 75}
                            stroke="#E2E8F0"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Y-Axis Labels */}
                    <text x="-10" y="15" fill="#64748B" fontSize="12">$4k</text>
                    <text x="-10" y="90" fill="#64748B" fontSize="12">$3k</text>
                    <text x="-10" y="165" fill="#64748B" fontSize="12">$2k</text>
                    <text x="-10" y="240" fill="#64748B" fontSize="12">$1k</text>
                    <text x="-10" y="300" fill="#64748B" fontSize="12">$0</text>

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#002BB9" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#002BB9" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area Path */}
                    <path
                        d="M0,300 
                           L0,250 
                           L100,220 
                           L200,260 
                           L300,180 
                           L400,200 
                           L500,140 
                           L600,100 
                           L700,50 
                           L800,80 
                           L800,300 Z"
                        fill="url(#gradient)"
                    />

                    {/* Line Path */}
                    <path
                        d="M0,250 
                           L100,220 
                           L200,260 
                           L300,180 
                           L400,200 
                           L500,140 
                           L600,100 
                           L700,50 
                           L800,80"
                        fill="none"
                        stroke="#002BB9"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {[
                        { x: 0, y: 250 }, { x: 100, y: 220 }, { x: 200, y: 260 },
                        { x: 300, y: 180 }, { x: 400, y: 200 }, { x: 500, y: 140 },
                        { x: 600, y: 100 }, { x: 700, y: 50 }, { x: 800, y: 80 }
                    ].map((point, i) => (
                        <circle
                            key={i}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="white"
                            stroke="#002BB9"
                            strokeWidth="2"
                        />
                    ))}
                </svg>

                {/* X-Axis Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#64748B', fontSize: '0.8rem' }}>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                </div>
            </div>
        </div>
    </div>
);

export default AnalyticsView;
