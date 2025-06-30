
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Brain, Clock, Target, Trophy, Zap, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 text-black dark:text-white">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transforme sua forma de
              <span className="gradient-text block">estudar com IA</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Planos de estudo personalizados e gamificados usando técnicas
              cientificamente comprovadas. Você está no controle do seu aprendizado!
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-8 py-4 text-lg font-semibold hover-lift w-full sm:w-auto"
                >
                  Começar Gratuitamente
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold hover-lift w-full sm:w-auto text-black"
                onClick={document.querySelector(".functionalTutorialSpray")?.scrollIntoView({ behavior: "smooth" });}
              >
                Ver Como Funciona
              </Button>
            </div>
          </div>

          <div className="mt-16 animate-float functionalTutorialSpray">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">IA Avançada</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">Personalizado</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">Gamificado</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">Eficiente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Técnicas <span className="gradient-text">Cientificamente Comprovadas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nossa IA utiliza métodos validados pela neurociência para maximizar sua retenção e aprendizado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Revisão Espaçada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Revisões programadas no momento ideal para fortalecer sua memória de longo prazo
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Técnica Pomodoro</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Sessões de estudo focadas com pausas estratégicas para manter alta concentração
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Aprendizagem Ativa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Exercícios interativos e práticos que engajam seu cérebro no processo de aprendizagem
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Você está indo muito bem! 🚀
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Cada pequeno passo conta. Vamos conquistar mais um objetivo hoje?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">+10.000</h3>
                <p className="opacity-90">Estudantes ativos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">85%</h3>
                <p className="opacity-90">Taxa de sucesso</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">3x</h3>
                <p className="opacity-90">Mais eficiência</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para <span className="gradient-text">revolucionar</span> seus estudos?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de estudantes que já transformaram sua forma de aprender
          </p>

          <Link to="/login">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-12 py-6 text-xl font-semibold hover-lift"
            >
              Criar Conta Gratuita
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
