import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { GoogleProfile } from './strategies/google.strategy';
import type { GithubProfile } from './strategies/github.strategy';

const WEB_APP_URL = process.env.WEB_APP_URL ?? 'http://localhost:3002';

@Controller('v1/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.auth.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request & { user?: GoogleProfile }, @Res() res: Response) {
    const profile = req.user;
    if (!profile?.email) {
      return res.redirect(`${WEB_APP_URL}/login?error=oauth_failed`);
    }
    const { token, userId } = await this.auth.oauthLogin(profile.email, profile.id, 'google');
    return res.redirect(`${WEB_APP_URL}/auth/callback?token=${token}&userId=${userId}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Guard redirects to GitHub
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request & { user?: GithubProfile }, @Res() res: Response) {
    const profile = req.user;
    if (!profile?.email) {
      return res.redirect(`${WEB_APP_URL}/login?error=oauth_failed`);
    }
    const { token, userId } = await this.auth.oauthLogin(profile.email, profile.id, 'github');
    return res.redirect(`${WEB_APP_URL}/auth/callback?token=${token}&userId=${userId}`);
  }
}
