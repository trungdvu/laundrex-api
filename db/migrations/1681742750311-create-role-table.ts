import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTable1681742750311 implements MigrationInterface {
  name = 'CreateRoleTable1681742750311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "avatar" character varying DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "roleId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
