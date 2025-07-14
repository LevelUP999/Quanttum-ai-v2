import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validateForm = (type: 'login' | 'register') => {
    const newErrors: { [key: string]: string } = {};

    if (type === 'register') {
      if (!registerForm.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (!registerForm.email.trim()) newErrors.email = 'Email é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(registerForm.email)) newErrors.email = 'Email inválido';
      if (registerForm.password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    } else {
      if (!loginForm.email.trim()) newErrors.email = 'Email é obrigatório';
      if (!loginForm.password.trim()) newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm('login')) return;

    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm('register')) return;

    setIsLoading(true);
    try {
      await register(registerForm.email, registerForm.password, registerForm.name);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo!",
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente com dados diferentes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black flex items-center justify-center p-4 text-foreground transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <Logo size="lg" className="justify-center" />
          </Link>
        </div>

        <Card className="shadow-2xl border border-border bg-card text-card-foreground">
          <CardHeader className="text-center">
            <div className='flex justify-center gap-3'>
              <CardTitle className="text-2xl font-bold">Bem-vindo de volta!</CardTitle>
              <span className='animate-leftright text-2xl'>👋</span>
            </div>
            <CardDescription>Entre na sua conta ou crie uma nova para começar</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className={`dark:text-black ${errors.email ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.email && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className={`dark:text-black ${errors.password ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.password && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isLoading}
                  >
                    <Loader2 className={`mr-2 h-4 w-4 animate-spin transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
                    Entrar
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className={`dark:text-black ${errors.name ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className={`dark:text-black ${errors.email ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.email && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className={`dark:text-black ${errors.password ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.password && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {errors.password}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Mínimo de 6 caracteres
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Conta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                ← Voltar para o início
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
