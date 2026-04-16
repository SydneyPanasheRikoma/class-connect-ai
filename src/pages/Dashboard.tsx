import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { recentSessions } from '@/lib/dummyData';
import { ScanFace, Users, CheckCircle, Clock, Plus, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Classes', value: '47', icon: Users, color: 'text-primary' },
    { label: 'Avg. Attendance', value: '91.3%', icon: CheckCircle, color: 'text-success' },
    { label: 'Pending Confirmations', value: '2', icon: Clock, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ScanFace className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">AttendAI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Dr. Ananya Iyer</span>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start Session */}
        <Button
          size="lg"
          className="w-full sm:w-auto gap-2"
          onClick={() => navigate('/session/setup')}
        >
          <Plus className="h-4 w-4" />
          Start New Session
        </Button>

        {/* Recent Sessions */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Class</th>
                    <th className="pb-3 font-medium text-right">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 text-foreground">{s.date}</td>
                      <td className="py-3 pr-4 text-foreground">{s.class}</td>
                      <td className="py-3 text-right font-medium text-foreground">{s.attendance}%</td>
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
