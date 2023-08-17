import { MigrationInterface, QueryRunner } from 'typeorm';

export class VerifyUserEmail1692281915600 implements MigrationInterface {
  name = 'VerifyUserEmail1692281915600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token" ("userId" uuid NOT NULL, "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_94f168faad896c0786646fa3d4a" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "verified" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verified"`);
    await queryRunner.query(`DROP TABLE "token"`);
  }
}
