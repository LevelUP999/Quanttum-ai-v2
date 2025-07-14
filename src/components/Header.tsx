import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from './Logo';
import { LogOut, User, Coins, Moon, Sun, StickyNote, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <Logo />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 focus:outline-none"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2 dark:text-white dark:bg-[#1a1a1a]"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-full px-4 py-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-primary">{user?.points || 0}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/notes')}
                  className="flex items-center space-x-2 dark:bg-[#1a1a1a]"
                >
                  <StickyNote className="w-4 h-4 dark:text-white" />
                  <span className='dark:text-white'>Anotações</span>
                </Button>

                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-muted-foreground dark:text-gray-300" />
                  <span className="text-sm font-medium">Olá, {user?.name}!</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-gradient-to-l from-primary to-accent hover:from-primary/90 hover:to-accent/90 dark:border-0 hover:scale-[1.05] transition"
                >
                  <LogOut className="font-semibold text-white w-4 h-4 mr-1" />
                  <span className='font-semibold text-white'>Sair</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-l from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2 dark:text-white dark:bg-[#1a1a1a] w-fit"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-full px-4 py-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-primary">{user?.points || 0}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/notes');
                  }}
                  className="flex items-center space-x-2 dark:bg-[#1a1a1a]"
                >
                  <StickyNote className="w-4 h-4 dark:text-white" />
                  <span className='dark:text-white'>Anotações</span>
                </Button>

                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground dark:text-gray-300" />
                  <span className="text-sm font-medium">Olá, {user?.name}!</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-gradient-to-l from-primary to-accent hover:from-primary/90 hover:to-accent/90 dark:border-0 hover:scale-[1.05] transition"
                >
                  <LogOut className="font-semibold text-white w-4 h-4 mr-1" />
                  <span className='font-semibold text-white'>Sair</span>
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button className="bg-gradient-to-l from-primary to-accent hover:from-primary/90 hover:to-accent/90 w-full">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
