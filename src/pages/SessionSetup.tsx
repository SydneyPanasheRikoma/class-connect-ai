import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cascadeData } from '@/lib/dummyData';
import { ScanFace, ArrowLeft, Play } from 'lucide-react';

const SessionSetup = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState('');
  const [division, setDivision] = useState('');
  const [batch, setBatch] = useState('');
  const [classroom, setClassroom] = useState('');

  const handleYearChange = (v: string) => {
    setYear(v);
    setDivision('');
    setBatch('');
    setClassroom('');
  };

  const handleDivisionChange = (v: string) => {
    setDivision(v);
    setBatch('');
    setClassroom('');
  };

  const handleBatchChange = (v: string) => {
    setBatch(v);
    if (year && division) {
      const key = `${year}-${division}-${v}`;
      setClassroom(cascadeData.classrooms[key] || '');
    }
  };

  const canStart = year && division && batch && classroom;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ScanFace className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Start Session</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Select Class</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select value={year} onValueChange={handleYearChange}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {cascadeData.academicYears.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Division</Label>
              <Select value={division} onValueChange={handleDivisionChange} disabled={!year}>
                <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
                <SelectContent>
                  {cascadeData.divisions.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Batch</Label>
              <Select value={batch} onValueChange={handleBatchChange} disabled={!division}>
                <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {cascadeData.batches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {classroom && (
              <div className="rounded-lg bg-secondary p-4 animate-fade-in">
                <p className="text-sm text-muted-foreground">Assigned Classroom</p>
                <p className="text-xl font-semibold text-foreground">Room {classroom}</p>
              </div>
            )}

            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!canStart}
              onClick={() => navigate('/session/live', { state: { year, division, batch, classroom } })}
            >
              <Play className="h-4 w-4" />
              Start Session
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SessionSetup;
