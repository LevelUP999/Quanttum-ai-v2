
import React from 'react';
import { Youtube, Instagram } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-gray-900 border-t dark:border-gray-700 mt-20 text-foreground dark:text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-muted-foreground dark:text-gray-400 max-w-md">
              Transforme sua forma de estudar com inteligência artificial.
              Planos personalizados e cientificamente comprovados para o seu sucesso.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Recursos</h3>
            <ul className="space-y-2 text-muted-foreground dark:text-gray-400">
              <li>• Revisão Espaçada</li>
              <li>• Técnica Pomodoro</li>
              <li>• Aprendizagem Ativa</li>
              <li>• Gamificação</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Redes Sociais</h3>
            <div className="flex space-x-4">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow opacity-50">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow opacity-50">
                <Instagram className="w-5 h-5 text-pink-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Veja nossas postagens!
            </p>
          </div>
        </div>

        <div className="border-t border-border dark:border-gray-700 mt-8 pt-8 text-center text-muted-foreground dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} Quanttun AI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
