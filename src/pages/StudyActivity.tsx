
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import {
  CheckCircle,
  Clock,
  Brain,
  Target,
  ArrowLeft,
  BookOpen,
  PenTool,
  Lightbulb,
  Trophy,
  Play
} from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  description: string;
  technique: string;
  duration: string;
  difficulty: string;
  content: string;
  exercises: string;
  completed: boolean;
}

interface StudyRoute {
  id: string;
  title: string;
  subject: string;
  dailyTime: string;
  dedication: string;
  activities: number;
  completedActivities: number;
  createdAt: string;
  studyPlan: {
    title: string;
    description: string;
    activities: Activity[];
  };
}

const StudyActivity = () => {
  const { isAuthenticated, userData, saveUserData, updateUserPoints } = useAuth();

  const { routeId, activityId } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState<StudyRoute | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const [isStudying, setIsStudying] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }

    const foundRoute = (userData.routes as StudyRoute[]).find((r) => r.id === routeId);
    if (!foundRoute) {
      navigate('/dashboard');
      return;
    }

    const foundActivity = foundRoute.studyPlan.activities.find(
      (a) => a.id === parseInt(activityId || '0')
    );

    if (!foundActivity) {
      navigate(`/study-route/${routeId}`);
      return;
    }

    setRoute(foundRoute);
    setActivity(foundActivity);

    const savedNotes = userData?.notes?.[`${routeId}_${activityId}`];

    if (savedNotes) {
      setUserNotes(savedNotes);
    }
  }, [routeId, activityId, isAuthenticated, userData, navigate]);
  const startStudySession = () => {
    setIsStudying(true);
    setStudyStartTime(new Date());
    toast.success('Sessão de estudo iniciada! Foco total! 🎯');
  };

  const completeActivity = async () => {
    if (!route || !activity) return;

    const updatedRoute = { ...route };
    const activityToUpdate = updatedRoute.studyPlan.activities.find(a => a.id === activity.id);

    if (activityToUpdate && !activityToUpdate.completed) {
      activityToUpdate.completed = true;
      updatedRoute.completedActivities = Number(updatedRoute.completedActivities) +1;

      if (userData) {
        const key = `${routeId}_${activityId}`;
        const updatedNotes = {
          ...(userData.notes || {}),
          [key]: userNotes,
        };

        // 👇 Junta todas as mudanças antes de salvar
        const updatedUserData = {
          ...userData,
          routes: userData.routes.map((r: StudyRoute) =>
            r.id === updatedRoute.id ? updatedRoute : r
          ),
          notes: updatedNotes,
        };

        await saveUserData(updatedUserData);
      }

      setRoute(updatedRoute);
      setActivity(activityToUpdate);

      // Calcular pontos baseado na dificuldade e tempo estudado
      let points = activity.difficulty === 'Difícil' ? 15 : activity.difficulty === 'Médio' ? 10 : 5;

      if (studyStartTime) {
        const studyTime = (new Date().getTime() - studyStartTime.getTime()) / (1000 * 60); // em minutos
        if (studyTime >= 25) points += 5; // Bonus por sessão longa
      }

      updateUserPoints(Number(points));

      toast.success(`Atividade concluída! +${points} pontos! 🏆`);

      setTimeout(() => {
        navigate(`/study-route/${routeId}`);
      }, 2000);
    }
  };

  const saveNotes = async () => {
    if (userData) {
      const key = `${routeId}_${activityId}`;
      const updatedNotes = {
        ...(userData.notes || {}),
        [key]: userNotes,
      };

      await saveUserData({ ...userData, notes: updatedNotes });
    }

    toast.success('Notas salvas! 📝');
  };

  const getTechniqueIcon = (technique: string) => {
    if (technique.includes('Pomodoro')) return <Clock className="w-4 h-4" />;
    if (technique.includes('Revisão')) return <Brain className="w-4 h-4" />;
    if (technique.includes('Mapa')) return <Lightbulb className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getTechniqueColor = (technique: string) => {
    if (technique.includes('Pomodoro')) return 'bg-red-100 text-red-800';
    if (technique.includes('Revisão')) return 'bg-blue-100 text-blue-800';
    if (technique.includes('Mapa')) return 'bg-purple-100 text-purple-800';
    return 'bg-green-100 text-green-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Difícil') return 'bg-red-100 text-red-800';
    if (difficulty === 'Médio') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (!route || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Carregando atividade...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(`/study-route/${routeId}`)}
          className="mb-6 hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Rota
        </Button>

        {/* Activity Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-4xl font-bold">{activity.title}</h1>
            {activity.completed && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Concluída
              </Badge>
            )}
          </div>

          <p className="text-xl text-muted-foreground mb-4">{activity.description}</p>

          <div className="flex flex-wrap gap-3">
            <Badge className={getTechniqueColor(activity.technique)}>
              {getTechniqueIcon(activity.technique)}
              <span className="ml-1">{activity.technique}</span>
            </Badge>
            <Badge className={getDifficultyColor(activity.difficulty)}>
              {activity.difficulty}
            </Badge>
            <Badge variant="outline">
              <Clock className="w-4 h-4 mr-1" />
              {activity.duration}
            </Badge>
          </div>
        </div>

        {/* Study Session Control */}
        {!activity.completed && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sessão de Estudo</h3>
                  <p className="text-muted-foreground">
                    {isStudying ? 'Estudo em andamento!' : 'Pronto para começar?'}
                  </p>
                </div>
                <Button
                  onClick={startStudySession}
                  disabled={isStudying}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isStudying ? 'Estudando...' : 'Iniciar Estudo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  Conteúdo para Estudo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {activity.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="w-5 h-5 mr-2 text-accent" />
                  Exercícios Práticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {activity.exercises}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes and Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="w-5 h-5 mr-2 text-primary" />
                  Suas Anotações
                </CardTitle>
                <CardDescription>
                  Registre suas descobertas, dúvidas e insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Digite suas anotações aqui..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button onClick={saveNotes} variant="outline" className="w-full">
                  Salvar Anotações
                </Button>
              </CardContent>
            </Card>

            {/* Completion Card */}
            {!activity.completed && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Trophy className="w-5 h-5 mr-2" />
                    Finalizar Atividade
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Marque como concluída quando terminar todo o conteúdo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={completeActivity}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Concluída
                  </Button>
                </CardContent>
              </Card>
            )}

            {activity.completed && (
              <Card className="bg-gradient-to-r from-primary to-accent text-white border-0">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Atividade Concluída!</h3>
                  <p className="opacity-90">
                    Parabéns pelo seu progresso! Continue assim.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudyActivity;