import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueCustomerUsername1683541827797 implements MigrationInterface {
  name = 'UniqueCustomerUsername1683541827797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" RENAME COLUMN "usernane" TO "username"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" ADD CONSTRAINT "UQ_cb485a32c0e8b9819c08c1b1a1b" UNIQUE ("username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" DROP CONSTRAINT "UQ_cb485a32c0e8b9819c08c1b1a1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" RENAME COLUMN "username" TO "usernane"`,
    );
  }
}
