import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Clock,
  Trophy,
  CheckCircle,
  Circle,
  BookOpen,
  ExternalLink,
  Brain,
} from 'lucide-react';

const StudyRoute = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, loading: authLoading } = useAuth();
  const [route, setRoute] = useState<any | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Aguarda rotas carregarem
    if (!user.routes || user.routes.length === 0) {
      console.log("Rotas ainda não carregadas ou estão vazias.");
      return;
    }

    console.log("Rotas disponíveis:", user.routes.map(r => r.id));
    console.log("ID da rota da URL:", routeId);

    const foundRoute = user.routes.find((r: any) => String(r.id) === String(routeId));

    if (foundRoute) {
      setRoute(foundRoute);
    } else {
      console.warn("Rota não encontrada com o ID:", routeId);
      toast.error("Rota não encontrada.");
      navigate('/dashboard');
    }
  }, [authLoading, user, routeId, navigate]);





  const toggleActivityCompleted = async (activityId: number) => {
    if (!user || !route) return;

    const activity = route.activities.find((a: any) => a.id === activityId);
    if (!activity) return;

    const isCompleted = activity.completed;

    const updatedRoute = {
      ...route,
      activities: route.activities.map((a: any) =>
        a.id === activityId ? { ...a, completed: !isCompleted } : a
      ),
      completedActivities: route.completedActivities + (isCompleted ? -1 : 1),
    };

    const updatedRoutes = user.routes.map((r: any) =>
      r.id === route.id ? updatedRoute : r
    );

    const basePoints = activity.difficulty === 'Difícil' ? 30 : activity.difficulty === 'Médio' ? 20 : 10;
    const updatedPoints = (user.points || 0) + (isCompleted ? -basePoints : basePoints);

    await updateUser({
      routes: updatedRoutes,
      points: Math.max(updatedPoints, 0),
    });

    setRoute(updatedRoute);

    toast.success(isCompleted
      ? `Atividade desmarcada (-${basePoints} pontos)`
      : `Atividade concluída! +${basePoints} pontos 🎉`
    );
  };

  const getTechniqueColor = (technique: string) => {
    const lower = technique.toLowerCase();
    if (lower.includes('pomodoro')) return 'bg-red-100 text-red-800';
    if (lower.includes('revisão')) return 'bg-blue-100 text-blue-800';
    if (lower.includes('resumo')) return 'bg-purple-100 text-purple-800';
    return 'bg-green-100 text-green-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase();
    if (lower.includes('difícil')) return 'bg-red-100 text-red-800';
    if (lower.includes('médio')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (authLoading || !route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Brain className='animate-spin text-violet-600'></Brain>
        <p>Carregando seus dados...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando rota de estudo...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const completedCount = route.activities.filter((a: any) => a.completed).length;
  const progressPercentage = Math.round((completedCount / route.activities.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:via-black dark:to-violet-900 dark:from-violet-900 dark:text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-6 hover-lift dark:bg-[#1a1a1a]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">{route.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
            {route.description || route.subject}
          </p>


          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">

                <div>
                  <div className="text-3xl font-bold text-primary mb-1">{progressPercentage}%</div>
                  <p className="text-sm text-muted-foreground">Progresso</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-1">
                    {route.completedActivities}
                  </div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {route.activities.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-1">
                    {route.dailyTime || '—'}
                  </div>
                  <p className="text-sm text-muted-foreground">Por dia</p>
                </div>
              </div>

              <div className="mt-6">
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activities */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center flex-wrap gap-2">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            Atividades do Plano
          </h2>


          {route.activities.map((activity: any, index: number) => (
            <Card key={activity.id} className={`hover-lift transition-all duration-300 ${activity.completed ? 'bg-green-50 border-green-200' : 'bg-white dark:bg-[#0f0f0f]'}`}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-muted-foreground">{index + 1}</div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{activity.title}</span>
                        {activity.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getTechniqueColor(activity.technique)}>
                      {activity.technique}
                    </Badge>
                    <Badge className={getDifficultyColor(activity.difficulty)}>
                      {activity.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {activity.duration}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/study-activity/${route.id}/${activity.id}`)}
                      className="dark:bg-[#1a1a1a] w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Estudar Conteúdo
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => toggleActivityCompleted(activity.id)}
                      className={`bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 w-full sm:w-auto ${activity.completed ? 'opacity-70' : ''}`}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {activity.completed ? 'Desmarcar como CONCLUIDO' : 'Marcar como CONCLUIDO'}
                    </Button>
                  </div>

                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground line-clamp-2">{activity.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {progressPercentage === 100 && (
          <Card className="mt-8 bg-gradient-to-r from-primary to-accent text-white border-0">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">Parabéns! 🎉</h3>
              <p className="text-xl opacity-90">
                Você concluiu toda a rota de estudo! Seu futuro agradece pelo esforço dedicado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StudyRoute;
