
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



const CreateRoute = () => {
  const { isAuthenticated, userData, saveUserData } = useAuth();

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
    if (!userData) {
      toast.error('Erro ao acessar os dados do usuário.');
      return;
    }


    if (!formData.subject || !formData.dailyTime || !formData.dedication) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      // Prompt bem estruturado para a API do Pollinations
      const prompt = `Crie um plano de estudos detalhado e estruturado para: "${formData.subject}".
      
INFORMAÇÕES DO USUÁRIO:
- Tempo disponível por dia: ${formData.dailyTime}
- Nível de dedicação: ${formData.dedication}

INSTRUÇÕES PARA O PLANO:
1. Crie um título descritivo para o plano
2. Faça uma descrição motivacional do plano
3. Gere entre 8-12 atividades progressivas e específicas
4. Cada atividade deve ter conteúdo real e prático
5. Distribua técnicas de estudo cientificamente comprovadas
6. Adapte a dificuldade ao nível de dedicação informado

RESPONDA APENAS COM UM JSON VÁLIDO NO SEGUINTE FORMATO:
{
  "title": "Nome específico do plano de estudos",
  "description": "Descrição motivacional e clara do que será aprendido",
  "activities": [
    {
      "id": 1,
      "title": "Título específico da atividade",
      "description": "Descrição detalhada do que será feito",
      "technique": "Técnica Pomodoro|Revisão Espaçada|Aprendizagem Ativa|Mapa Mental",
      "duration": "Tempo estimado (ex: 45 minutos)",
      "difficulty": "Fácil|Médio|Difícil",
      "content": "Conteúdo específico e detalhado para estudar, incluindo tópicos, conceitos chave, exercícios sugeridos e materiais de apoio. Seja muito específico sobre o que o aluno deve fazer.",
      "exercises": "Lista de 3-5 exercícios práticos específicos relacionados ao conteúdo"
    }
  ]
}

IMPORTANTE: Seja muito específico sobre ${formData.subject}. O conteúdo deve ser útil, prático e realmente ensinar sobre o tema solicitado.`;

      console.log('Enviando prompt para Pollinations API:', prompt);

      // Chamada real para a API do Pollinations
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em educação e criação de planos de estudo personalizados. Sempre responda apenas com JSON válido conforme solicitado.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'openai',
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const aiResponse = await response.text();
      console.log('Resposta da API:', aiResponse);

      // Tentar extrair JSON da resposta
      let studyPlan;
      try {
        // Limpar a resposta para extrair apenas o JSON
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          studyPlan = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        console.log('Resposta original:', aiResponse);

        // Fallback com dados baseados no input do usuário
        studyPlan = {
          title: `Plano de Estudos: ${formData.subject}`,
          description: `Plano personalizado para dominar ${formData.subject} com ${formData.dailyTime} diários`,
          activities: [
            {
              id: 1,
              title: `Fundamentos de ${formData.subject}`,
              description: "Estabelecer base sólida nos conceitos fundamentais",
              technique: "Aprendizagem Ativa",
              duration: "45 minutos",
              difficulty: "Fácil",
              content: `Estudar os conceitos básicos e fundamentais de ${formData.subject}. Foque em compreender definições, princípios básicos e como eles se aplicam na prática. Faça resumos e mapas mentais dos principais tópicos.`,
              exercises: `1. Defina os 5 conceitos mais importantes de ${formData.subject}\n2. Crie um glossário com os termos técnicos\n3. Explique com suas palavras cada conceito\n4. Desenhe um mapa mental conectando os conceitos\n5. Faça 10 questões sobre os fundamentos`,
              completed: false
            },
            {
              id: 2,
              title: `Prática Dirigida em ${formData.subject}`,
              description: "Aplicar conhecimentos através de exercícios práticos",
              technique: "Técnica Pomodoro",
              duration: "60 minutos",
              difficulty: "Médio",
              content: `Resolver exercícios práticos e problemas reais relacionados a ${formData.subject}. Use a técnica Pomodoro: 25 min de estudo focado + 5 min de pausa. Concentre-se em aplicar os conceitos aprendidos.`,
              exercises: `1. Resolva 10 exercícios básicos sobre o tema\n2. Explique o raciocínio de cada resolução\n3. Identifique padrões nas soluções\n4. Crie 3 exercícios similares\n5. Teste seus exercícios`,
              completed: false
            },
            {
              id: 3,
              title: `Revisão e Aprofundamento`,
              description: "Consolidar conhecimento e explorar tópicos avançados",
              technique: "Revisão Espaçada",
              duration: "40 minutos",
              difficulty: "Médio",
              content: `Revisar todo o conteúdo estudado anteriormente e explorar aspectos mais avançados de ${formData.subject}. Use técnicas de revisão espaçada para fixar o conhecimento a longo prazo.`,
              exercises: `1. Faça um resumo completo do que aprendeu\n2. Identifique suas principais dificuldades\n3. Busque materiais complementares sobre os pontos difíceis\n4. Explique o conteúdo para alguém ou grave um vídeo\n5. Faça um teste simulado`,
              completed: false
            }
          ]
        };
      }

      if (!userData) {
        toast.error('Erro ao acessar os dados do usuário.');
        return;
      }

      // Garantir que as atividades tenham IDs únicos e estejam completas
      if (studyPlan.activities) {
        studyPlan.activities = studyPlan.activities.map((activity, index) => ({
          ...activity,
          id: index + 1,
          completed: false,
          exercises: activity.exercises || `Exercícios práticos relacionados a ${activity.title}`,
        }));
      }

      // Salvar a rota de estudo
      const newRoute = {
        title: studyPlan.title,
        subject: formData.subject,
        daily_time: formData.dailyTime,
        dedication: formData.dedication,
        activities: studyPlan.activities || [],
        created_at: new Date().toISOString()
      };

      // ✅ Atualiza rotas no JSON Bin via contexto
      const updatedRoutes = [...(userData.routes || []), newRoute];
      await saveUserData({ routes: updatedRoutes });

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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Criar Nova <span className="gradient-text">Rota de Estudo</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Nossa IA criará um plano personalizado e cientificamente estruturado para você
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Brain className="w-6 h-6 text-primary" />
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
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 py-6 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    IA gerando conteúdo personalizado...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Gerar Rota com IA Real
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
