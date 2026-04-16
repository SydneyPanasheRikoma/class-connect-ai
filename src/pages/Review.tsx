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
        <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <ScanFace className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="font-semibold text-foreground text-sm sm:text-base">Review Attendance</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-medium">
              {config?.year}-{config?.division} {config?.batch} · Room {config?.classroom}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-3 sm:pr-4 font-medium">#</th>
                    <th className="pb-3 pr-3 sm:pr-4 font-medium">Roll No</th>
                    <th className="pb-3 pr-3 sm:pr-4 font-medium hidden sm:table-cell">Name</th>
                    <th className="pb-3 pr-3 sm:pr-4 font-medium hidden sm:table-cell">SRN</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {occupied.map((d, i) => (
                    <tr key={d.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-medium text-foreground">{d.student?.rollNumber || '—'}</td>
                      <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-foreground hidden sm:table-cell">{d.student?.isIdentified ? d.student.name : 'Unknown'}</td>
                      <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-muted-foreground hidden sm:table-cell">{d.student?.srn || '—'}</td>
                      <td className="py-2.5 sm:py-3 text-right">
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium',
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-card border border-border/50 p-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {confirmed.length}/{occupied.length} confirmed · {corrections} corrections · {pct}%
          </div>
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate('/session/summary', { state: { desks, corrections, config } })}
          >
            Confirm & Submit
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Review;
