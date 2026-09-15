import { Outlet, useLocation } from 'react-router-dom';
import {
  SidebarInset,
  SidebarProvider,
} from '@scoutbook/ui/components/sidebar';
import { TooltipProvider } from '@scoutbook/ui/components/tooltip';
import { AppHeader } from '../components/app-header';
import { AppSidebar } from '../components/app-sidebar';

function crumbForPath(pathname: string) {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/features/new')) return 'Features / New';
  if (pathname.match(/^\/features\/\d+/)) return 'Features / Detail';
  if (pathname.startsWith('/features')) return 'Features';
  return 'Workspace';
}

export function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader crumb={crumbForPath(pathname)} />
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
