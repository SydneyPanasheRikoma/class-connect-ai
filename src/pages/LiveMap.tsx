import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateStudents, generateDesks } from '@/lib/dummyData';
import { Desk, Student, StudentStatus } from '@/lib/types';
import { ScanFace, ArrowLeft, CheckCircle, AlertTriangle, X, Save, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type Phase = 'empty' | 'desks' | 'students' | 'processing' | 'ready';

const LiveMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const config = location.state as { year: string; division: string; batch: string; classroom: string } | null;

  const [phase, setPhase] = useState<Phase>('empty');
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [manualRoll, setManualRoll] = useState('');
  const [corrections, setCorrections] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const students = generateStudents();
    const allDesks = generateDesks(students);

    const timers = [
      setTimeout(() => { setDesks(allDesks); setPhase('desks'); }, 800),
      setTimeout(() => {
        setDesks(prev => prev.map(d => d.student ? { ...d, student: { ...d.student, status: 'neutral' as StudentStatus } } : d));
        setPhase('students');
      }, 1800),
      setTimeout(() => {
        setDesks(prev => prev.map(d => {
          if (!d.student) return d;
          const status: StudentStatus = d.student.isIdentified ? 'identified' : 'unidentified';
          return { ...d, student: { ...d.student, status } };
        }));
        setPhase('ready');
      }, 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const confirmStudent = useCallback((deskId: string) => {
    setDesks(prev => prev.map(d =>
      d.id === deskId && d.student
        ? { ...d, student: { ...d.student, status: 'confirmed' as StudentStatus } }
        : d
    ));
    setSelectedDesk(null);
  }, []);

  const assignRoll = useCallback((deskId: string, roll: string) => {
    setDesks(prev => prev.map(d =>
      d.id === deskId && d.student
        ? {
            ...d,
            student: {
              ...d.student,
              rollNumber: roll,
              status: 'confirmed' as StudentStatus,
              isIdentified: true,
              manuallyAssigned: true,
            },
          }
        : d
    ));
    setCorrections(c => c + 1);
    setManualRoll('');
    setSelectedDesk(null);
  }, []);

  const occupiedDesks = desks.filter(d => d.occupied);
  const identified = occupiedDesks.filter(d => d.student?.isIdentified && d.student.status !== 'unidentified');
  const unidentified = occupiedDesks.filter(d => !d.student?.isIdentified || d.student?.status === 'unidentified');
  const confirmed = occupiedDesks.filter(d => d.student?.status === 'confirmed');
  const allConfirmed = occupiedDesks.length > 0 && confirmed.length === occupiedDesks.length;
  const pct = occupiedDesks.length ? Math.round((confirmed.length / occupiedDesks.length) * 100) : 0;

  const getSquareClasses = (student?: Student) => {
    if (!student || phase === 'desks') return 'bg-muted';
    switch (student.status) {
      case 'neutral': return 'bg-muted';
      case 'identified': return 'bg-success/15 border-success/40';
      case 'unidentified': return 'bg-warning/15 border-warning/40';
      case 'confirmed': return 'bg-success/25 border-success/60';
      default: return 'bg-muted';
    }
  };

  // Detail panel content (shared between mobile sheet and desktop sidebar)
  const DetailPanel = () => {
    if (!selectedDesk?.student) return null;
    const student = selectedDesk.student;

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Student Details</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedDesk(null)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {student.isIdentified ? (
          <>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{student.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Roll Number</p>
                <p className="font-medium text-foreground">{student.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SRN</p>
                <p className="font-medium text-foreground">{student.srn}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="text-sm text-muted-foreground">{student.confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  student.status === 'confirmed' ? 'bg-success/15 text-success' : 'bg-success/10 text-success'
                )}>
                  <CheckCircle className="h-3 w-3" />
                  {student.status === 'confirmed' ? 'Confirmed' : 'Identified'}
                </span>
              </div>
            </div>
            {student.status !== 'confirmed' && (
              <Button className="w-full" onClick={() => confirmStudent(selectedDesk.id)}>
                Confirm Identity
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="rounded-lg bg-warning/10 p-3">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Unidentified Student</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                The AI could not identify this student. Please assign a roll number manually.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Enter Roll Number</p>
              <Input
                placeholder="e.g. FYA16"
                value={manualRoll}
                onChange={(e) => setManualRoll(e.target.value)}
              />
            </div>
            <Button
              className="w-full gap-2"
              disabled={!manualRoll}
              onClick={() => assignRoll(selectedDesk.id, manualRoll)}
            >
              <Save className="h-4 w-4" />
              Assign & Confirm
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <ScanFace className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <span className="font-semibold text-foreground text-sm sm:text-base truncate">Live Session</span>
            </div>
            {config && (
              <span className="hidden sm:inline rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                {config.year}-{config.division} {config.batch} · Room {config.classroom}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {phase !== 'ready' && !allConfirmed && (
              <span className="hidden sm:inline text-xs text-muted-foreground animate-pulse">
                {phase === 'empty' ? 'Initializing...' : phase === 'desks' ? 'Detecting desks...' : phase === 'students' ? 'Scanning students...' : 'Processing...'}
              </span>
            )}
            <Button
              size={isMobile ? 'sm' : 'default'}
              disabled={!allConfirmed}
              onClick={() => navigate('/session/review', { state: { desks, corrections, config } })}
            >
              Finalize
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile session info */}
      {config && isMobile && (
        <div className="bg-secondary/50 px-3 py-2 text-xs text-muted-foreground text-center border-b border-border">
          {config.year}-{config.division} {config.batch} · Room {config.classroom}
          {phase !== 'ready' && (
            <span className="ml-2 animate-pulse">
              · {phase === 'empty' ? 'Initializing...' : phase === 'desks' ? 'Detecting desks...' : phase === 'students' ? 'Scanning...' : 'Processing...'}
            </span>
          )}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Classroom Map */}
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Front of Classroom
            </p>
            <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-success/40" /> Identified</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-warning/40" /> Unidentified</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-success/70" /> Confirmed</span>
            </div>
          </div>

          {/* Desk grid */}
          <div className={cn(
            'inline-grid gap-2 sm:gap-4',
            isMobile ? 'grid-cols-4' : 'grid-cols-4'
          )}>
            {phase === 'empty' ? (
              Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={cn(
                  'rounded-lg border border-dashed border-border/60 bg-muted/30 animate-fade-in',
                  isMobile ? 'h-16 w-[calc((100vw-48px)/4)]' : 'h-24 w-28'
                )} />
              ))
            ) : (
              desks.map((desk) => (
                <div
                  key={desk.id}
                  className={cn(
                    'relative rounded-lg border transition-all duration-300 animate-scale-in',
                    isMobile ? 'h-16 w-[calc((100vw-48px)/4)]' : 'h-24 w-28',
                    desk.occupied ? 'border-border bg-card shadow-sm cursor-pointer hover:shadow-md' : 'border-dashed border-border/40 bg-muted/20'
                  )}
                  onClick={() => desk.occupied && phase === 'ready' && setSelectedDesk(desk)}
                >
                  {desk.occupied && desk.student && phase !== 'desks' && (
                    <div className="flex h-full items-center justify-center p-1 sm:p-2">
                      <div className={cn(
                        'flex items-center justify-center rounded-lg border text-[10px] sm:text-xs font-medium transition-all duration-500',
                        isMobile ? 'h-10 w-10' : 'h-14 w-14',
                        getSquareClasses(desk.student)
                      )}>
                        {phase === 'ready' || phase === 'students' ? (
                          desk.student.isIdentified && desk.student.status !== 'neutral'
                            ? <span className="text-foreground">{desk.student.rollNumber}</span>
                            : desk.student.status === 'unidentified'
                              ? <span className="text-warning">?</span>
                              : null
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Desktop Right Panel */}
        {!isMobile && (
          <div className="w-80 shrink-0 border-l border-border bg-card overflow-auto">
            {selectedDesk?.student ? (
              <div className="p-5">
                <DetailPanel />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <p className="text-sm text-muted-foreground text-center">
                  Click a student on the map to view details
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Bottom Sheet */}
        {isMobile && selectedDesk?.student && (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl shadow-lg max-h-[70vh] overflow-auto animate-fade-in">
            <div className="p-4">
              <DetailPanel />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary */}
      <div className="shrink-0 border-t border-border bg-card px-3 sm:px-6 py-2.5 sm:py-3">
        {isMobile ? (
          <div>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full flex items-center justify-between text-sm"
            >
              <span className="font-semibold text-foreground">{pct}%</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{confirmed.length}/{occupiedDesks.length} confirmed</span>
                <ChevronUp className={cn('h-3.5 w-3.5 transition-transform', showSummary && 'rotate-180')} />
              </div>
            </button>
            {showSummary && (
              <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-xs animate-fade-in">
                <div><span className="text-muted-foreground">Desks: </span><span className="font-medium text-foreground">{occupiedDesks.length}</span></div>
                <div><span className="text-muted-foreground">Identified: </span><span className="font-medium text-success">{identified.length}</span></div>
                <div><span className="text-muted-foreground">Unidentified: </span><span className="font-medium text-warning">{unidentified.length}</span></div>
                <div><span className="text-muted-foreground">Corrections: </span><span className="font-medium text-foreground">{corrections}</span></div>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
            <div className="flex gap-6">
              <div><span className="text-muted-foreground">Desks: </span><span className="font-medium text-foreground">{occupiedDesks.length}</span></div>
              <div><span className="text-muted-foreground">Identified: </span><span className="font-medium text-success">{identified.length}</span></div>
              <div><span className="text-muted-foreground">Unidentified: </span><span className="font-medium text-warning">{unidentified.length}</span></div>
              <div><span className="text-muted-foreground">Confirmed: </span><span className="font-medium text-foreground">{confirmed.length}</span></div>
              <div><span className="text-muted-foreground">Corrections: </span><span className="font-medium text-foreground">{corrections}</span></div>
            </div>
            <div className="text-lg font-semibold text-foreground">{pct}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMap;
