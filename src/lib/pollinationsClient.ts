
export interface StudyRoute {
  id: string;
  title: string;
  subject: string;
  description: string;
  dailyTime: string;
  dedication: string;
  completedActivities: number;
  createdAt: string;
  activities: StudyActivity[];
}

export interface StudyActivity {
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

const POLLINATIONS_API_URL = "https://text.pollinations.ai/openai";

export const pollinationsClient = {
  async generateStudyRoute(
    tema: string,
    tempoDiario: string,
    dificuldade: string
  ): Promise<StudyRoute> {
    const response = await fetch(POLLINATIONS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um assistente educacional especialista em criar rotas de estudo estruturadas e explicações aprofundadas. Crie conteúdos que realmente ensinem com precisão e clareza. Responda APENAS com um JSON válido, sem texto adicional. É OBRIGATÓRIO criar pelo menos 10 atividades detalhadas."
          },
          {
            role: "user",
            content: `Gere uma rota de estudo para aprender ${tema} com duração de ${tempoDiario} minutos por dia e nível de dificuldade ${dificuldade}. Crie PELO MENOS 10 atividades educativas detalhadas e bem estruturadas. Retorne APENAS o JSON neste formato exato:
{
  "id": "rota_${Date.now()}",
  "title": "Título da Rota",
  "subject": "${tema}",
  "description": "Descrição detalhada da rota",
  "dailyTime": "${tempoDiario}",
  "dedication": "${dificuldade}",
  "completedActivities": 0,
  "createdAt": "${new Date().toISOString()}",
  "activities": [
    {
      "id": 1,
      "title": "Título da Atividade",
      "description": "Descrição da atividade",
      "technique": "Pomodoro|Flashcards|Resumo|Prática|Mind Map",
      "duration": "25 min",
      "difficulty": "Fácil|Médio|Difícil",
      "content": "Conteúdo educativo detalhado e aprofundado",
      "exercises": "Lista de exercícios práticos numerados",
      "completed": false
    }
  ]
}

IMPORTANTE: Crie pelo menos 10 atividades variadas, cada uma com conteúdo rico e exercícios práticos.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("Erro ao gerar rota de estudo");
    }

    const data = await response.json();
    
    try {
      const routeData = JSON.parse(data.choices[0].message.content.trim());
      
      // Verificar se tem pelo menos 10 atividades
      if (!routeData.activities || routeData.activities.length < 10) {
        throw new Error("A rota deve ter pelo menos 10 atividades");
      }
      
      return routeData;
    } catch (error) {
      console.error("Erro ao parsear resposta da IA:", error);
      throw new Error("Erro ao processar resposta da IA");
    }
  },

  async generateDetailedExplanation(content: string): Promise<string> {
    const response = await fetch(POLLINATIONS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um professor especialista. Explique de forma didática e aprofundada o conteúdo solicitado. Use exemplos práticos, contextos históricos quando relevante, e detalhes técnicos que facilitem o entendimento. Seja claro, preciso e educativo."
          },
          {
            role: "user",
            content: `Explique de forma detalhada e didática o seguinte conteúdo: ${content}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("Erro ao gerar explicação detalhada");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
};
