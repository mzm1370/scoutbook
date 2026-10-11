import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CaslAbilityFactory } from '@api/auth/casl/casl-ability.factory.js';
import { AuthController } from '@api/auth/auth.controller.js';
import { AuthService } from '@api/auth/auth.service.js';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard.js';
import { PoliciesGuard } from '@api/auth/guards/policies.guard.js';
import { UsersModule } from '@api/users/users.module.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is required');
        }
        return {
          secret,
          signOptions: { expiresIn: '1h' as const },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CaslAbilityFactory,
    PoliciesGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [AuthService, CaslAbilityFactory, PoliciesGuard],
})
export class AuthModule {}
