import { Outlet, useLocation } from 'react-router-dom';
import {
  SidebarInset,
  SidebarProvider,
} from '@scoutbook/ui/components/sidebar';
import { TooltipProvider } from '@scoutbook/ui/components/tooltip';
import { AppHeader } from '@web/components/app-header';
import { AppSidebar } from '@web/components/app-sidebar';

function crumbForPath(pathname: string) {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/features/new')) return 'Features / New';
  if (pathname.match(/^\/features\/\d+/)) return 'Features / Detail';
  if (pathname.startsWith('/features')) return 'Features';
  if (pathname.startsWith('/board')) return 'Board';
  if (pathname.startsWith('/lifecycle')) return 'Lifecycle';
  if (pathname.startsWith('/graph')) return 'Graph';
  if (pathname.startsWith('/decisions')) return 'Decisions Needed';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'Workspace';
}

export function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-w-0 overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-x-hidden">
          <AppHeader crumb={crumbForPath(pathname)} />
          <div className="flex w-full min-w-0 max-w-full flex-1 flex-col gap-4 overflow-x-hidden p-3 sm:gap-6 sm:p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
