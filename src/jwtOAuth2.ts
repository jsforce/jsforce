import OAuth2, { OAuth2Config } from './oauth2';

/**
 * @deprecated
 */
export class JwtOAuth2 extends OAuth2 {
  constructor(config: OAuth2Config) {
    console.warn(
      'JwtOAuth2 is deprecated and will be removed in next stable release, please use OAuth2 instead.',
    );
    super(config);
  }

  public jwtAuthorize(innerToken: string): Promise<any> {
    return super._postParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: innerToken,
    });
  }
}
