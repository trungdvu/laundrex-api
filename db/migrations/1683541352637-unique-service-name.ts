import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueServiceName1683541352637 implements MigrationInterface {
  name = 'UniqueServiceName1683541352637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service" ADD CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service" DROP CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca"`,
    );
  }
}
