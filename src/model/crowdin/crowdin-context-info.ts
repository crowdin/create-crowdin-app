import { JwtPayload } from '@crowdin/crowdin-apps-functions';

export interface CrowdinContextInfo {
  jwtPayload: JwtPayload;
  crowdinId: string;
  clientId: string;
}
