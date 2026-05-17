import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

export interface EntraTokenPayload {
  oid: string;       // Object ID (unique user identifier in Entra)
  email: string;
  name: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  tid: string;        // Tenant ID
}

@Injectable()
export class EntraValidationService {
  private jwksClient: jwksClient.JwksClient;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('ENTRA_CLIENT_ID', '');

    // Microsoft's JWKS endpoint for multi-tenant (common)
    this.jwksClient = jwksClient({
      jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
      rateLimit: true,
    });
  }

  /**
   * Validates a Microsoft Entra ID token and returns the decoded payload.
   * Uses JWKS to verify the token signature against Microsoft's public keys.
   */
  async validateToken(idToken: string): Promise<EntraTokenPayload> {
    try {
      // Decode the token header to get the key ID (kid)
      const decoded = jwt.decode(idToken, { complete: true });
      if (!decoded || !decoded.header?.kid) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Fetch the signing key from Microsoft's JWKS endpoint
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const signingKey = key.getPublicKey();

      // Verify the token signature and claims
      const payload = jwt.verify(idToken, signingKey, {
        algorithms: ['RS256'],
        audience: this.clientId,
        issuer: new RegExp('^https://login\\.microsoftonline\\.com/.+/v2\\.0$') as any,
      }) as any;

      // Extract email from various possible claims
      const email =
        payload.email ||
        payload.preferred_username ||
        payload.upn;

      if (!email) {
        throw new UnauthorizedException(
          'Token does not contain an email claim',
        );
      }

      return {
        oid: payload.oid,
        email: email.toLowerCase(),
        name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
        preferred_username: payload.preferred_username,
        given_name: payload.given_name,
        family_name: payload.family_name,
        tid: payload.tid,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error('Entra token validation error:', error.message);
      throw new UnauthorizedException('Invalid or expired Entra ID token');
    }
  }
}
