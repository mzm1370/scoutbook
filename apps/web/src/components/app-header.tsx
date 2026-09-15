import { ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@scoutbook/ui/components/avatar';
import { Badge } from '@scoutbook/ui/components/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@scoutbook/ui/components/dropdown-menu';
import { Separator } from '@scoutbook/ui/components/separator';
import { SidebarTrigger } from '@scoutbook/ui/components/sidebar';
import { useAuth } from '../auth/AuthContext';

function initials(email: string) {
  const local = email.split('@')[0] ?? email;
  return local.slice(0, 2).toUpperCase();
}

export function AppHeader({ crumb }: { crumb?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="truncate text-sm text-muted-foreground">
          {crumb ?? 'Workspace'}
        </p>
      </div>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50">
            <Avatar size="sm">
              <AvatarFallback>{initials(user.email)}</AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 sm:grid">
              <span className="truncate text-sm font-medium leading-none">
                {user.email}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">{user.role}</span>
            </div>
            <ChevronsUpDown className="hidden size-4 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1.5">
                <span className="truncate text-sm font-medium">{user.email}</span>
                <Badge variant="secondary" className="w-fit">
                  {user.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </header>
  );
}
