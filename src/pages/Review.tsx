import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Desk } from '@/lib/types';
import { ScanFace, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Review = () => {
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
  const pct = occupied.length ? Math.round((confirmed.length / occupied.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <ScanFace className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Review Attendance</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              {config?.year}-{config?.division} {config?.batch} · Room {config?.classroom}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">#</th>
                    <th className="pb-3 pr-4 font-medium">Roll No</th>
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">SRN</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {occupied.map((d, i) => (
                    <tr key={d.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 text-muted-foreground">{i + 1}</td>
                      <td className="py-3 pr-4 font-medium text-foreground">{d.student?.rollNumber || '—'}</td>
                      <td className="py-3 pr-4 text-foreground">{d.student?.isIdentified ? d.student.name : 'Unknown'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{d.student?.srn || '—'}</td>
                      <td className="py-3 text-right">
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                          d.student?.status === 'confirmed'
                            ? 'bg-success/15 text-success'
                            : d.student?.status === 'identified'
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                        )}>
                          {d.student?.status === 'confirmed' ? (
                            <><CheckCircle className="h-3 w-3" /> Confirmed</>
                          ) : d.student?.status === 'identified' ? (
                            <><CheckCircle className="h-3 w-3" /> Identified</>
                          ) : (
                            <><AlertTriangle className="h-3 w-3" /> Unidentified</>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg bg-card border border-border/50 p-4">
          <div className="text-sm text-muted-foreground">
            {confirmed.length}/{occupied.length} confirmed · {corrections} corrections · {pct}% attendance
          </div>
          <Button
            onClick={() => navigate('/session/summary', {
              state: { desks, corrections, config },
            })}
          >
            Confirm & Submit
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Review;
