import OAuth2, { OAuth2Config } from './oauth2';

export type JwtOAuth2Config = OAuth2Config & {
  privateKey?: string;
  privateKeyFile?: string;
  authCode?: string;
  refreshToken?: string;
  loginUrl?: string;
  username?: string;
};

export class JwtOAuth2 extends OAuth2 {
  constructor(config: OAuth2Config) {
    super(config);
  }

  public jwtAuthorize(innerToken: string): Promise<any> {
    return super._postParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: innerToken,
    });
  }
}
