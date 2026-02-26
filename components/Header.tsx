'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = saved ?? 'dark'; // ✅ default dark
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

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
          className={`theme-toggle ${theme === 'dark' ? 'theme-toggle-dark' : 'theme-toggle-light'}`}
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          role="switch"
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">
              <span className="theme-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}