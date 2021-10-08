import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'crowdin_credentials' })
export class CrowdinCredentials {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column()
  expire: string;
}
