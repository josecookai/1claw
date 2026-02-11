import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

export interface GithubProfile {
  id: string;
  email: string;
  displayName?: string;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      callbackURL: process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:3001/api/v1/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { id: string; emails?: Array<{ value: string }>; displayName?: string; username?: string },
    done: (err: null, profile: GithubProfile) => void,
  ): Promise<void> {
    const email = profile.emails?.[0]?.value ?? `${profile.id}@github.oauth`;
    const payload: GithubProfile = {
      id: profile.id,
      email,
      displayName: profile.displayName ?? profile.username,
    };
    done(null, payload);
  }
}
