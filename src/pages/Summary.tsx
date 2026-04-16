import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Desk } from '@/lib/types';
import { ScanFace, CheckCircle2, ArrowLeft } from 'lucide-react';

const Summary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { desks, corrections, config } = (location.state || {}) as {
    desks: Desk[];
    corrections: number;
    config: { year: string; division: string; batch: string; classroom: string };
  };

  if (!desks) {
    navigate('/dashboard');
    return null;
  }

  const occupied = desks.filter(d => d.occupied && d.student);
  const confirmed = occupied.filter(d => d.student?.status === 'confirmed');
  const unresolved = occupied.filter(d => d.student?.status !== 'confirmed');
  const pct = occupied.length ? Math.round((confirmed.length / occupied.length) * 100) : 0;

  const stats = [
    { label: 'Total Desks Detected', value: occupied.length },
    { label: 'Students Identified', value: confirmed.length },
    { label: 'Unresolved Cases', value: unresolved.length },
    { label: 'Manual Corrections', value: corrections },
    { label: 'Attendance', value: `${pct}%` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <ScanFace className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="font-semibold text-foreground text-sm sm:text-base">Session Summary</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-success" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Session Complete</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {config?.year}-{config?.division} {config?.batch} · Room {config?.classroom}
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="divide-y divide-border/50 p-0">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4">
                <span className="text-xs sm:text-sm text-muted-foreground">{s.label}</span>
                <span className="text-base sm:text-lg font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </span>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </main>
    </div>
  );
};

export default Summary;
