import { useEffect, useState } from 'react';

const USER_ID = 'f185d110-c853-4086-9fac-5375d94c8a4a';
const BASE_URL = 'https://devtrackr-backend-84jw.onrender.com/users';

interface DayData {
    date: string;
    total_contributions: number;
}

function getIntensity(count: number): string {
    if (count === 0) return 'var(--border-main)';
    if (count <= 2) return 'var(--heatmap-1, #9be9a8)';
    if (count <= 5) return 'var(--heatmap-2, #40c463)';
    if (count <= 10) return 'var(--heatmap-3, #30a14e)';
    return 'var(--heatmap-4, #216e39)';
}

function getToday(): string {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

export default function ContributionHeatmap() {
    const [days, setDays] = useState<DayData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalContribs, setTotalContribs] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                // First call aggregate to refresh today's data
                await fetch(`${BASE_URL}/${USER_ID}/aggregate?date=${getToday()}`);

                // Then fetch heatmap
                const year = new Date().getFullYear();
                const res = await fetch(
                    `${BASE_URL}/${USER_ID}/heatmap?start=${year}-01-01&end=${year}-12-31`
                );
                const data = await res.json();
                if (data.days) {
                    setDays(data.days);
                    setTotalContribs(
                        data.days.reduce((sum: number, d: DayData) => sum + d.total_contributions, 0)
                    );
                }
            } catch (err) {
                console.error('Failed to fetch heatmap:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <span className="mono text-xs text-text-faint animate-pulse">loading contributions...</span>
            </div>
        );
    }

    if (days.length === 0) return null;

    // Build the grid: 53 columns (weeks) x 7 rows (days)
    // First, find the starting day of week for Jan 1
    const year = new Date().getFullYear();
    const jan1 = new Date(`${year}-01-01`);
    const startDayOfWeek = jan1.getDay(); // 0=Sun

    // Create a map of date -> contributions
    const dateMap = new Map<string, number>();
    days.forEach((d) => dateMap.set(d.date, d.total_contributions));

    // Build weeks array
    const weeks: (DayData | null)[][] = [];
    let currentWeek: (DayData | null)[] = [];

    // Pad the first week with nulls
    for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null);
    }

    // Fill in all days of the year
    const totalDays = year % 4 === 0 ? 366 : 365;
    for (let d = 0; d < totalDays; d++) {
        const date = new Date(jan1);
        date.setDate(jan1.getDate() + d);
        const dateStr = date.toISOString().split('T')[0];
        const contributions = dateMap.get(dateStr) ?? 0;

        currentWeek.push({ date: dateStr, total_contributions: contributions });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // Push remaining partial week
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const cellSize = 12;
    const gap = 3;
    const radius = 5;
    const svgWidth = weeks.length * (cellSize + gap);
    const svgHeight = 7 * (cellSize + gap);

    const monthLabels: { label: string; x: number }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seenMonths = new Set<number>();

    weeks.forEach((week, wi) => {
        week.forEach((day) => {
            if (day) {
                const month = new Date(day.date).getMonth();
                if (!seenMonths.has(month)) {
                    seenMonths.add(month);
                    monthLabels.push({ label: months[month], x: wi * (cellSize + gap) });
                }
            }
        });
    });

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                <p className="mono text-sm text-text-muted">
                    <span className="text-accent font-semibold">{totalContribs}</span> contributions in {year}
                </p>
                <div className="flex items-center gap-1.5 mono text-xs text-text-faint">
                    <span>less</span>
                    {[0, 2, 5, 10, 15].map((level) => (
                        <svg key={level} width={10} height={10}>
                            <circle cx={5} cy={5} r={4} fill={getIntensity(level)} />
                        </svg>
                    ))}
                    <span>more</span>
                </div>
            </div>
            <p className="mono text-xs text-text-faint mb-6">
                aggregated from GitHub, LeetCode & Codeforces · powered by{' '}
                <a
                    href="https://devtrackr-hci.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                >
                    DevTrackr
                </a>
            </p>

            <div className="overflow-x-auto pb-2">
                <svg width={svgWidth} height={svgHeight + 16} className="block">
                    {/* Month labels */}
                    {monthLabels.map(({ label, x }) => (
                        <text
                            key={label}
                            x={x}
                            y={10}
                            className="fill-text-faint"
                            style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
                        >
                            {label}
                        </text>
                    ))}

                    {/* Circles */}
                    {weeks.map((week, wi) =>
                        week.map((day, di) => {
                            if (!day) return null;
                            const cx = wi * (cellSize + gap) + radius;
                            const cy = di * (cellSize + gap) + radius + 16;
                            return (
                                <circle
                                    key={day.date}
                                    cx={cx}
                                    cy={cy}
                                    r={radius}
                                    fill={getIntensity(day.total_contributions)}
                                    className="transition-colors duration-150"
                                >
                                    <title>
                                        {day.date}: {day.total_contributions} contribution{day.total_contributions !== 1 ? 's' : ''}
                                    </title>
                                </circle>
                            );
                        })
                    )}
                </svg>
            </div>
        </div>
    );
}

