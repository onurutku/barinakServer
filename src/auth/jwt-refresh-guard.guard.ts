import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
