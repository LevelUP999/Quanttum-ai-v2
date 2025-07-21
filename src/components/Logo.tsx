
import React from 'react';
import { toast } from '@/hooks/use-toast';

const easterEgg = () => {
  toast({
    title: "🚀 EasterEGG 😂",
    description: "Site criado por Gustavo Rodrigues Cunha & Matheus César Pereira de Vasconcelos",
  });
}

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  textVisible?: boolean;
}

const Logo = ({ className = '', size = 'md', textVisible = true }: LogoProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 animate-float ${className}`} onClick={() => { easterEgg() }}>
      <div className={`relative ${sizes[size]}`}>
        {/* Brain icon */}
        <svg className="w-full h-full text-violet-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C7.58 2 4 5.58 4 10C4 12.03 4.76 13.87 6 15.28V15.5C6 16.88 7.12 18 8.5 18H9V19.5C9 20.33 9.67 21 10.5 21H13.5C14.33 21 15 20.33 15 19.5V18H15.5C16.88 18 18 16.88 18 15.5V15.28C19.24 13.87 20 12.03 20 10C20 5.58 16.42 2 12 2ZM12 4C15.31 4 18 6.69 18 10C18 11.54 17.39 12.91 16.38 13.92C16.14 14.16 16 14.5 16 14.86V15.5C16 15.78 15.78 16 15.5 16H14C13.45 16 13 16.45 13 17V19.5C13 19.78 12.78 20 12.5 20H11.5C11.22 20 11 19.78 11 19.5V17C11 16.45 10.55 16 10 16H8.5C8.22 16 8 15.78 8 15.5V14.86C8 14.5 7.86 14.16 7.62 13.92C6.61 12.91 6 11.54 6 10C6 6.69 8.69 4 12 4Z" fill="currentColor" />
          {/* Rocket on top */}
          <path d="M13.25 7C12.84 7 12.5 7.34 12.5 7.75C12.5 8.16 12.84 8.5 13.25 8.5C13.66 8.5 14 8.16 14 7.75C14 7.34 13.66 7 13.25 7Z" fill="currentColor" />
          <path d="M13 5.5L12 9L14 9L13 5.5Z" fill="currentColor" />
          <path d="M14.5 6.5L13 4.5L11.5 6.5L13 8.5L14.5 6.5Z" fill="currentColor" />
        </svg>
        
        {/* Small animation effect */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-quanttun-lightBlue rounded-full animate-pulse-gentle"></div>
      </div>
      
      {textVisible && (
        <div className={`font-bold ${textSizes[size]} text-gray-800 flex`}>
          <span className="text-quanttun-purple dark:text-white">Quanttun</span>
          <span className="gradient-text ml-0.5">AI</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
