import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateStudents, generateDesks } from '@/lib/dummyData';
import { Desk, Student, StudentStatus } from '@/lib/types';
import { ScanFace, ArrowLeft, CheckCircle, AlertTriangle, X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

type Phase = 'empty' | 'desks' | 'students' | 'processing' | 'ready';

const LiveMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state as { year: string; division: string; batch: string; classroom: string } | null;

  const [phase, setPhase] = useState<Phase>('empty');
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [manualRoll, setManualRoll] = useState('');
  const [corrections, setCorrections] = useState(0);

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <ScanFace className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Live Session</span>
            </div>
            {config && (
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                {config.year}-{config.division} {config.batch} · Room {config.classroom}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {phase !== 'ready' && !allConfirmed && (
              <span className="text-xs text-muted-foreground animate-pulse">
                {phase === 'empty' ? 'Initializing...' : phase === 'desks' ? 'Detecting desks...' : phase === 'students' ? 'Scanning students...' : 'Processing...'}
              </span>
            )}
            <Button
              disabled={!allConfirmed}
              onClick={() => navigate('/session/review', {
                state: {
                  desks,
                  corrections,
                  config,
                },
              })}
            >
              Finalize Attendance
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Classroom Map */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Front of Classroom (Teacher's View)
            </p>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-success/40" /> Identified</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-warning/40" /> Unidentified</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-success/70" /> Confirmed</span>
            </div>
          </div>

          {/* Desk grid */}
          <div className="inline-grid grid-cols-4 gap-4">
            {phase === 'empty' ? (
              Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-24 w-28 rounded-lg border border-dashed border-border/60 bg-muted/30 animate-fade-in" />
              ))
            ) : (
              desks.map((desk) => (
                <div
                  key={desk.id}
                  className={cn(
                    'relative h-24 w-28 rounded-lg border transition-all duration-300 animate-scale-in',
                    desk.occupied ? 'border-border bg-card shadow-sm cursor-pointer hover:shadow-md' : 'border-dashed border-border/40 bg-muted/20'
                  )}
                  onClick={() => desk.occupied && phase === 'ready' && setSelectedDesk(desk)}
                >
                  {desk.occupied && desk.student && phase !== 'desks' && (
                    <div className="flex h-full items-center justify-center p-2">
                      <div className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-lg border text-xs font-medium transition-all duration-500',
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

        {/* Right Panel */}
        <div className="w-80 shrink-0 border-l border-border bg-card overflow-auto">
          {selectedDesk?.student ? (
            <div className="p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Student Details</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedDesk(null)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {selectedDesk.student.isIdentified ? (
                <>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="font-medium text-foreground">{selectedDesk.student.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Roll Number</p>
                      <p className="font-medium text-foreground">{selectedDesk.student.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">SRN</p>
                      <p className="font-medium text-foreground">{selectedDesk.student.srn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="text-sm text-muted-foreground">{selectedDesk.student.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                        selectedDesk.student.status === 'confirmed'
                          ? 'bg-success/15 text-success'
                          : 'bg-success/10 text-success'
                      )}>
                        <CheckCircle className="h-3 w-3" />
                        {selectedDesk.student.status === 'confirmed' ? 'Confirmed' : 'Identified'}
                      </span>
                    </div>
                  </div>
                  {selectedDesk.student.status !== 'confirmed' && (
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
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-sm text-muted-foreground text-center">
                Click a student on the map to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="shrink-0 border-t border-border bg-card px-6 py-3">
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
      </div>
    </div>
  );
};

export default LiveMap;
