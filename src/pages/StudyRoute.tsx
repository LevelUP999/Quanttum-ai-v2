import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import {
  CheckCircle,
  Circle,
  Clock,
  Brain,
  Target,
  Sparkles,
  ArrowLeft,
  Trophy,
  BookOpen,
  ExternalLink
} from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  description: string;
  technique: string;
  duration: string;
  difficulty: string;
  content: string;
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

const StudyRoute = () => {
  const { id } = useParams();
  const { isAuthenticated, userData, saveUserData, updateUserPoints } = useAuth();

  const navigate = useNavigate();
  const [route, setRoute] = useState<StudyRoute | null>(null);


  useEffect(() => {
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }

    // Busca rota com base no ID, usando rotas da conta logada
    const foundRoute = (userData.routes as StudyRoute[])?.find((r) => r.id === id);

    if (foundRoute) {
      setRoute(foundRoute);
    } else {
      navigate('/dashboard');
    }
  }, [id, isAuthenticated, userData, navigate]);


  const completeActivity = async (activityId: number) => {
    if (!route || !userData) return;

    const updatedRoute = { ...route };
    const activity = updatedRoute.studyPlan.activities.find(a => a.id === activityId);

    if (activity && !activity.completed) {
      activity.completed = true;
      updatedRoute.completedActivities += 1;

      // Atualiza lista de rotas do usuário
      const updatedRoutes = userData.routes.map((r: StudyRoute) =>
        r.id === updatedRoute.id ? updatedRoute : r
      );

      await saveUserData({ routes: updatedRoutes });
      setRoute(updatedRoute);

      // Pontuação
      const points = activity.difficulty === 'Difícil' ? 15 : activity.difficulty === 'Médio' ? 10 : 5;
      updateUserPoints(Number(points));

      toast.success(`Atividade concluída! +${points} pontos! 🎉`);
    }
  };


  const getTechniqueIcon = (technique: string) => {
    if (technique.includes('Pomodoro')) return <Clock className="w-4 h-4" />;
    if (technique.includes('Revisão')) return <Brain className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getTechniqueColor = (technique: string) => {
    if (technique.includes('Pomodoro')) return 'bg-red-100 text-red-800';
    if (technique.includes('Revisão')) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Difícil') return 'bg-red-100 text-red-800';
    if (difficulty === 'Médio') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Carregando rota de estudo...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercentage = Math.round((route.completedActivities / route.activities) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-6 hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        {/* Route Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{route.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{route.studyPlan.description}</p>

          {/* Progress Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{progressPercentage}%</div>
                  <p className="text-sm text-muted-foreground">Progresso</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">{route.completedActivities}</div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{route.activities}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">{route.dailyTime}</div>
                  <p className="text-sm text-muted-foreground">Por dia</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-white rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activities */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-primary" />
            Atividades do Plano
          </h2>

          {route.studyPlan.activities.map((activity, index) => (
            <Card
              key={activity.id}
              className={`hover-lift transition-all duration-300 ${activity.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{activity.title}</span>
                        {activity.completed && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getTechniqueColor(activity.technique)}>
                      {getTechniqueIcon(activity.technique)}
                      <span className="ml-1">{activity.technique}</span>
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

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/study-activity/${route.id}/${activity.id}`)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Estudar Conteúdo
                    </Button>

                    {!activity.completed && (
                      <Button
                        size="sm"
                        onClick={() => completeActivity(activity.id)}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Marcar como Completa
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {activity.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completion Message */}
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
