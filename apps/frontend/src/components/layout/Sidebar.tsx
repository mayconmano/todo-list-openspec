import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Home, CheckSquare, User, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { to: '/minha-conta', label: 'Minha Conta', icon: User },
];

const COLLAPSED_KEY = 'sidebar_collapsed';

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSED_KEY) === 'true';
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_KEY, String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-card border border-border shadow-sm"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Abrir menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed md:static inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-200',
          collapsed ? 'w-[60px]' : 'w-[240px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className={[
          'flex items-center h-14 border-b border-border px-3 shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        ].join(' ')}>
          {!collapsed && (
            <span className="text-base font-semibold tracking-tight">✦ Todo</span>
          )}
          <button
            className="hidden md:flex items-center justify-center p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                ].join(' ')
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={[
          'border-t border-border py-3 px-2 flex items-center shrink-0',
          collapsed ? 'flex-col gap-2' : 'gap-2',
        ].join(' ')}>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
            title="Sair"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
