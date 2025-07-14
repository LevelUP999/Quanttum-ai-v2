
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Loader2, Sparkles, Brain, Target } from 'lucide-react';
import { pollinationsClient } from '@/lib/pollinationsClient';



const CreateRoute = () => {
  const { user, updateUser } = useAuth();
  const isAuthenticated = !!user;


  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    dailyTime: '',
    dedication: ''
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const generateStudyPlan = async () => {
    if (!user) {
      toast.error('Erro ao acessar os dados do usuário.');
      return;
    }

    if (!formData.subject || !formData.dailyTime || !formData.dedication) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      // Use diretamente a função do pollinationsClient
      const newRoute = await pollinationsClient.generateStudyRoute(
        `${formData.subject}`,
        formData.dailyTime,
        formData.dedication
      );

      const updatedRoutes = [...(user.routes || []), newRoute];
      await updateUser({ routes: updatedRoutes });

      toast.success('Rota de estudo criada com IA! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao gerar plano de estudos:', error);
      toast.error('Erro ao conectar com a IA. Tente novamente em alguns segundos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:via-black dark:to-violet-900 dark:from-violet-900 dark:text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 px-2 sm:px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Criar Nova <span className="gradient-text">Rota de Estudo</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Nossa IA criará um plano personalizado e cientificamente estruturado para você
            </p>
          </div>


          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Brain className={`w-6 h-6 text-primary ${isLoading ? "animate-spin" : "animate-none"}`} />
                <span>Personalize seu Aprendizado</span>
              </CardTitle>
              <CardDescription>
                Preencha as informações abaixo para gerar seu plano de estudos personalizado
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-base font-medium">
                  O que você quer estudar? <strong className="text-violet-600">*</strong>
                </Label>
                <Textarea
                  id="subject"
                  placeholder="Ex: Matemática para ENEM, Programação em Python, Inglês para conversação..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="min-h-[100px] text-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyTime" className="text-base font-medium">
                  Quanto tempo disponível por dia? <strong className="text-violet-600">*</strong>
                </Label>
                <Select value={formData.dailyTime} onValueChange={(value) => setFormData({ ...formData, dailyTime: value })}>
                  <SelectTrigger className='text-black'>
                    <SelectValue placeholder="Selecione o tempo disponível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 minutos">30 minutos</SelectItem>
                    <SelectItem value="1 hora">1 hora</SelectItem>
                    <SelectItem value="1,5 horas">1,5 horas</SelectItem>
                    <SelectItem value="2 horas">2 horas</SelectItem>
                    <SelectItem value="3 horas">3 horas</SelectItem>
                    <SelectItem value="4+ horas">4+ horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dedication" className="text-base font-medium">
                  Nível de dedicação <strong className="text-violet-600">*</strong>
                </Label>
                <Select value={formData.dedication} onValueChange={(value) => setFormData({ ...formData, dedication: value })}>
                  <SelectTrigger className='text-black'>
                    <SelectValue placeholder="Selecione seu nível de dedicação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixo">Baixo - Estudo casual</SelectItem>
                    <SelectItem value="médio">Médio - Comprometimento regular</SelectItem>
                    <SelectItem value="alto">Alto - Máximo desempenho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-primary">IA Real em Ação:</h3>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• <strong>Conteúdo Personalizado:</strong> Gerado especificamente para você</li>
                      <li>• <strong>Exercícios Práticos:</strong> Atividades reais e aplicáveis</li>
                      <li>• <strong>Técnicas Científicas:</strong> Pomodoro, revisão espaçada e mais</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={generateStudyPlan}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 py-5 sm:py-6 text-base sm:text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Brain className="w-5 h-5 mr-2 animate-spin" />
                    Gerando conteúdo...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Gerar Rota com IA
                  </>
                )}
              </Button>


              <p className="text-xs text-muted-foreground text-center">
                * Todos os campos são obrigatórios
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateRoute;
