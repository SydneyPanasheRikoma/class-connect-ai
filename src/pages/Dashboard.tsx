import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { recentSessions } from '@/lib/dummyData';
import { ScanFace, Users, CheckCircle, Clock, Plus, LogOut, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAttendance, setShowAttendance] = useState(false);

  const hasUnconfirmed = recentSessions.some(s => !s.confirmed);

  const stats = [
    { label: 'Total Classes', value: '47', icon: Users, color: 'text-primary' },
    { label: 'Avg. Attendance', value: '91.3%', icon: CheckCircle, color: 'text-success' },
    { label: 'Unconfirmed Sessions', value: hasUnconfirmed ? '1' : '0', icon: Clock, color: hasUnconfirmed ? 'text-warning' : 'text-muted-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary">
              <ScanFace className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-foreground">AttendAI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">Dr. Ananya Iyer</span>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-secondary">
                  <s.icon className={cn('h-4 w-4 sm:h-5 sm:w-5', s.color)} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl sm:text-2xl font-semibold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start Session */}
        {hasUnconfirmed ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">You have an unconfirmed session. Please complete it before starting a new one.</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              onClick={() => navigate('/session/live')}
            >
              Resume Session
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full sm:w-auto gap-2"
            onClick={() => navigate('/session/setup')}
          >
            <Plus className="h-4 w-4" />
            Start New Session
          </Button>
        )}

        {/* Recent Sessions */}
        <Card className="border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Recent Sessions</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowAttendance(!showAttendance)}
            >
              {showAttendance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showAttendance ? 'Hide' : 'Show'} Attendance
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Class</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    {showAttendance && (
                      <th className="pb-3 font-medium text-right">Attendance</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 text-foreground text-xs sm:text-sm">{s.date}</td>
                      <td className="py-3 pr-4 text-foreground text-xs sm:text-sm">{s.class}</td>
                      <td className="py-3 pr-4">
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                          s.confirmed
                            ? 'bg-success/15 text-success'
                            : 'bg-warning/15 text-warning'
                        )}>
                          {s.confirmed ? (
                            <><CheckCircle className="h-3 w-3" /> Confirmed</>
                          ) : (
                            <><Clock className="h-3 w-3" /> Pending</>
                          )}
                        </span>
                      </td>
                      {showAttendance && (
                        <td className="py-3 text-right font-medium text-foreground text-xs sm:text-sm">{s.attendance}%</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
