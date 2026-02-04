import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard
 * ------------------------------------------------
 * Thin wrapper around the built-in Passport `AuthGuard('jwt')` so that we can
 * reference it declaratively with `@UseGuards(JwtAuthGuard)`.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
