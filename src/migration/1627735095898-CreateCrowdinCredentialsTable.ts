import { MigrationInterface, QueryRunner } from 'typeorm';
import { Table } from 'typeorm/schema-builder/table/Table';

export class CreateCrowdinCredentialsTable1627735095898
  implements MigrationInterface
{
  public static readonly tableName = 'crowdin_credentials';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const options = new Table({
      name: CreateCrowdinCredentialsTable1627735095898.tableName,
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true,
        },
        {
          name: 'access_token',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'refresh_token',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'expire',
          type: 'varchar',
          isNullable: false,
        },
      ],
    });
    await queryRunner.createTable(options, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      CreateCrowdinCredentialsTable1627735095898.tableName,
    );
  }
}
