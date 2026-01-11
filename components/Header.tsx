'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(saved as 'light' | 'dark');
    applyTheme(saved as 'light' | 'dark');
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="site-header">
      <div className="container">
        <nav className="main-nav">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/teams" className={`nav-link ${pathname === '/teams' ? 'active' : ''}`}>
            Teams
          </Link>
        </nav>
        <button
          id="theme-toggle"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label="Toggle dark mode"
        >
          <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  );
}
