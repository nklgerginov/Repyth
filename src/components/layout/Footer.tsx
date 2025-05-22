import React from 'react';
import { Laptop, Github, Twitter, Linkedin } from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../../config';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Laptop className="h-6 w-6 text-primary-500" />
            <span className="text-lg font-bold">{APP_NAME}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">v{APP_VERSION}</span>
          </div>
          
          <div className="flex space-x-4 items-center">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;