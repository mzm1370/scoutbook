import { Injectable } from '@nestjs/common';
import {
  defineAbilitiesFor,
  type AppAbility,
  type UserRole,
} from '@scoutbook/types';

@Injectable()
export class CaslAbilityFactory {
  createForRole(role: UserRole): AppAbility {
    return defineAbilitiesFor(role);
  }
}
