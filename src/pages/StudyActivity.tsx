import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { useAuth } from '@/contexts/AuthContext';
import { pollinationsClient } from '@/lib/pollinationsClient';
import { toast } from 'sonner';

import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  Lightbulb,
  StickyNote,
  Loader2,
  CheckCircle,
  Clock,
  Trophy,
  BookOpen,
  PenTool
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const StudyActivity = () => {
  const { routeId, activityId } = useParams();
  const navigate = useNavigate();

  const { user, updateUser, loading: authLoading } = useAuth();

  const [route, setRoute] = useState<any | null>(null);
  const [activity, setActivity] = useState<any | null>(null);
  const [note, setNote] = useState('');
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (!routeId || !activityId) {
      toast.error('IDs inválidos');
      navigate('/dashboard');
      return;
    }

    const foundRoute = user.routes?.find((r: any) => r.id === routeId);
    if (!foundRoute) {
      toast.error('Rota não encontrada');
      navigate('/dashboard');
      return;
    }

    const foundActivity = foundRoute.activities.find((a: any) => a.id === parseInt(activityId));
    if (!foundActivity) {
      toast.error('Atividade não encontrada');
      navigate(`/study-route/${routeId}`);
      return;
    }

    setRoute(foundRoute);
    setActivity(foundActivity);

    const noteKey = `${routeId}_${activityId}`;
    const existingNote = user.notes?.find((n: any) => n.key === noteKey);
    if (existingNote) setNote(existingNote.content);
  }, [authLoading, user, routeId, activityId, navigate]);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setStudyStartTime(new Date());
    setIsRunning(true);
    toast.success('Sessão de estudo iniciada!');
  };

  const pauseTimer = () => setIsRunning(false);
  const stopTimer = () => {
    setIsRunning(false);
    setTimer(0);
    setStudyStartTime(null);
  };

  const saveNotes = async () => {
    if (!user || !route || !activity) return;
    const noteKey = `${routeId}_${activityId}`;
    const updatedNotes = [
      ...(user.notes?.filter((n: any) => n.key !== noteKey) || []),
      { key: noteKey, content: note }
    ];
    await updateUser({ notes: updatedNotes });
    toast.success('Anotação salva!');
  };

  const generateExplanation = async () => {
    if (!activity) return;
    setLoadingExplanation(true);
    try {
      const result = await pollinationsClient.generateDetailedExplanation(activity.content);
      setDetailedExplanation(result);
    } catch (e) {
      toast.error('Erro ao gerar explicação');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleCompletion = async (complete: boolean) => {
    if (!user || !route || !activity) return;

    const updatedRoute = {
      ...route,
      activities: route.activities.map((a: any) =>
        a.id === activity.id ? { ...a, completed: complete } : a
      ),
      completedActivities: route.completedActivities + (complete ? 1 : -1)
    };

    const updatedRoutes = user.routes.map((r: any) =>
      r.id === route.id ? updatedRoute : r
    );

    const basePoints = activity.difficulty === 'Difícil' ? 30 : activity.difficulty === 'Médio' ? 20 : 10;
    let bonus = 0;
    if (studyStartTime) {
      const minutes = (new Date().getTime() - studyStartTime.getTime()) / 60000;
      if (minutes >= 25) bonus = 5;
    }
    const totalPoints = basePoints + bonus;

    await updateUser({ routes: updatedRoutes, points: (user.points || 0) + (complete ? totalPoints : -totalPoints) });

    toast.success(complete ? `Atividade concluída! +${totalPoints} pontos` : `Atividade desmarcada. -${totalPoints} pontos`);

    setRoute(updatedRoute);
    setActivity(updatedRoute.activities.find((a: any) => a.id === activity.id));
    stopTimer();

    if (complete) {
      setTimeout(() => navigate(`/study-route/${route.id}`), 1500);
    }
  };

  if (!route || !activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <BookOpen className='animate-pulse text-violet-600 w-8 h-8 mb-2' />
        <p>Carregando atividade...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:via-black dark:to-violet-900 dark:from-violet-900 dark:text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(`/study-route/${route.id}`)} className="mb-6 dark:bg-[#1a1a1a]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Rota
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{activity.title}</CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 sm:gap-4">
                <Badge className="bg-purple-100 text-purple-800">{activity.technique}</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">{activity.difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="w-4 h-4 mr-1" />
                  {activity.duration}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Conteúdo</CardTitle>
                <Button onClick={generateExplanation} disabled={loadingExplanation} variant="outline">
                  {loadingExplanation ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
                  Explicação
                </Button>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{activity.content}</p>
                {detailedExplanation && (
                  <div className="mt-4 p-4 bg-violet-100 dark:bg-violet-900 rounded-lg prose prose-violet dark:prose-invert max-w-none">
                    <h4 className="font-semibold mb-4">Explicação Detalhada por IA</h4>
                    <ReactMarkdown
                      children={detailedExplanation}
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercícios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{activity.exercises}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cronômetro de Estudo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-mono font-bold mb-4">{formatTime(timer)}</div>
                <div className="flex justify-center gap-2">
                  <Button onClick={startTimer} disabled={isRunning} size="sm"><Play className="w-4 h-4" /></Button>
                  <Button onClick={pauseTimer} disabled={!isRunning} size="sm" variant="outline"><Pause className="w-4 h-4" /></Button>
                  <Button onClick={stopTimer} size="sm" variant="outline"><Square className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anotações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[150px] dark:text-black mb-4" />
                <Button onClick={saveNotes} className="w-full" variant="outline">
                  <StickyNote className="w-4 h-4 mr-2" />
                  Salvar Anotação
                </Button>
              </CardContent>
            </Card>

            <Card className={activity.completed ? 'bg-green-100' : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  {activity.completed ? 'Atividade Concluída!' : 'Finalizar Atividade'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleCompletion(!activity.completed)}
                  className="w-full"
                  variant={activity.completed ? 'outline' : 'default'}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {activity.completed ? 'Desmarcar Conclusão' : 'Marcar como Concluída'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudyActivity;
