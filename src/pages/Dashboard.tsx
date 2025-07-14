import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Trophy, Target, Plus, LogOut, Brain, Scale } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabaseClient } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (authLoading) return;

      if (!authLoading && !user) {
        navigate('/login');
        return;
      }


      try {
        toast.success(`Bem-vindo de volta, ${user.name}!`);
        const userData = await supabaseClient.getUser(user.email);
        if (userData?.routes) {
          setRoutes(userData.routes);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar seus dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authLoading, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Você está indo muito bem! 🚀",
      "Mais um dia, mais um passo! 💪",
      "Vamos conquistar mais um objetivo hoje? ⭐",
      "Seu futuro agradece pelo esforço de hoje! 🎯",
      "Cada minuto estudado é um investimento em você! 💎"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Brain className='animate-spin text-violet-600'></Brain>
        <p>Carregando seus dados...</p>
      </div>
    );
  }

  const totalActivities = routes.reduce((acc, route) => acc + route.activities.length, 0);
  const completedActivities = routes.reduce((acc, route) => acc + route.completedActivities, 0);
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:via-black dark:to-violet-900 dark:from-violet-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className='flex gap-3'>
              <h1 className="text-4xl font-bold mb-2 dark:text-white">Olá, {user?.name}!</h1>
              <span className='animate-leftright text-4xl'>👋</span>
            </div>
            <p className="text-xl text-muted-foreground mb-2">{getMotivationalMessage()}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rotas de Estudo</p>
                  <p className="text-3xl font-bold text-primary">{routes.length}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pontos</p>
                  <p className="text-3xl font-bold text-accent">{user?.points || 0}</p>
                </div>
                <Trophy className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progresso Total</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(progressPercentage)}%</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <Progress value={progressPercentage} className="mt-4" />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Suas Rotas de Estudo
          </h2>

          <Link to="/create-route" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover-lift">
              <Plus className="w-5 h-5 mr-2" />
              Nova Rota
            </Button>
          </Link>
        </div>


        {routes.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Nenhuma rota criada ainda</CardTitle>
              <CardDescription className="text-lg mb-6">
                Crie sua primeira rota de estudo personalizada e comece a transformar sua forma de aprender!
              </CardDescription>
              <Link to="/create-route">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeira Rota
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="hover-lift cursor-pointer border-0 shadow-lg">
                <Link to={`/study-route/${route.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{route.title}</span>
                      <Badge variant="secondary">{route.dedication}</Badge>
                    </CardTitle>
                    <CardDescription>{route.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {route.dailyTime} por dia
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(route.completedActivities / route.activities.length) * 100 || 0
                              }%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {route.completedActivities}/{route.activities.length} atividades
                        </span>
                        <span>{new Date(route.created_at).toLocaleDateString()}</span>
                      </div>

                      <Button className="text-white w-full mt-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-[1.05] transition dark:border-0" variant="outline">
                        Continuar Estudos
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
