import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'integration_credentials' })
export class IntegrationCredentials {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'api_key' })
  apiKey: string;

  @Column({ name: 'crowdin_id' })
  crowdinId: string;
}
