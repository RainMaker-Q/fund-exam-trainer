import { NavLink, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  {
    to: '/',
    end: true,
    label: '首页',
    match: (path: string) => path === '/',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
      </svg>
    ),
  },
  {
    to: '/overview/kemu1',
    label: '科一',
    match: (path: string) =>
      path.startsWith('/overview/kemu1') ||
      path.startsWith('/quiz/kemu1') ||
      (path.startsWith('/point/') && path.includes('1-')),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5V6a2 2 0 0 1 2-2h8l6 6v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v6h6" />
      </svg>
    ),
  },
  {
    to: '/overview/kemu2',
    label: '科二',
    match: (path: string) =>
      path.startsWith('/overview/kemu2') || path.startsWith('/quiz/kemu2'),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    to: '/wrong',
    label: '错题本',
    match: (path: string) => path.startsWith('/wrong') || path.startsWith('/quiz/wrong'),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    ),
  },
] as const;

function topTitle(pathname: string) {
  if (pathname === '/') return '首页';
  if (pathname.startsWith('/overview/kemu1')) return '科一考点';
  if (pathname.startsWith('/overview/kemu2')) return '科二考点';
  if (pathname.startsWith('/wrong')) return '错题本';
  if (pathname.startsWith('/quiz/wrong')) return '错题重练';
  if (pathname.startsWith('/quiz/')) return '练习';
  if (pathname.startsWith('/point/')) return '考点详情';
  return '基金从业';
}

export default function Layout() {
  const { pathname } = useLocation();
  const title = topTitle(pathname);
  const isQuiz = pathname.startsWith('/quiz/');

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 text-base text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur safe-top">
        <div className="flex h-12 items-center justify-between px-4">
          <h1 className="truncate text-[17px] font-semibold tracking-tight text-slate-800">
            {title}
          </h1>
          <span className="shrink-0 text-xs font-medium text-indigo-600">基金从业</span>
        </div>
      </header>

      <main
        className={`flex-1 px-4 pt-4 ${
          isQuiz
            ? 'pb-[calc(8.5rem+env(safe-area-inset-bottom,0px))]'
            : 'pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]'
        }`}
      >
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="主导航"
      >
        <ul className="grid grid-cols-4">
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            return (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  end={'end' in tab ? tab.end : undefined}
                  className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 pt-1.5 text-[11px] font-medium transition active:scale-95 active:opacity-80 ${
                    active ? 'text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{tab.icon}</span>
                  {tab.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
