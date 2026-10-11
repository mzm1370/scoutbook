import { createMongoAbility } from '@casl/ability';
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import {
  defineAbilitiesFor,
  type AppAbility,
  type AppAction,
  type AppSubject,
} from '@scoutbook/types';
import { useAuth } from '@web/auth/AuthContext';

const AbilityContext = createContext<AppAbility | null>(null);

function emptyAbility(): AppAbility {
  return createMongoAbility<[AppAction, AppSubject]>([]);
}

export function AbilityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const ability = useMemo(
    () => (user ? defineAbilitiesFor(user.role) : emptyAbility()),
    [user],
  );

  return (
    <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  );
}

export function useAbility(): AppAbility {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error('useAbility must be used within AbilityProvider');
  }
  return ability;
}
