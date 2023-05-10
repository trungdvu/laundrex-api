import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedPropertyForBookingAndCustomer1683711397503
  implements MigrationInterface
{
  name = 'AddDeletedPropertyForBookingAndCustomer1683711397503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "deteled" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "deteled" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "deteled"`);
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "deteled"`);
  }
}
