import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { Table } from 'typeorm/schema-builder/table/Table';
import { CreateCrowdinCredentialsTable1627735095898 } from './1627735095898-CreateCrowdinCredentialsTable';

export class CreateIntegrationCredentialsTable1627887598372
  implements MigrationInterface
{
  private readonly tableName = 'integration_credentials';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const options = new Table({
      name: this.tableName,
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true,
        },
        {
          name: 'api_key',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'crowdin_id',
          type: 'varchar',
          isNullable: false,
        },
      ],
    });
    await queryRunner.createTable(options, true);
    const foreignKey = new TableForeignKey({
      columnNames: ['crowdin_id'],
      referencedColumnNames: ['id'],
      referencedTableName: CreateCrowdinCredentialsTable1627735095898.tableName,
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey(this.tableName, foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
