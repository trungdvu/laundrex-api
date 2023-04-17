import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleEntity } from '../../src/modules/user/entities/role.entity';

export class CreateUniqueRoleName1681751039093 implements MigrationInterface {
  name = 'CreateUniqueRoleName1681751039093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name")`,
    );

    const roles = await queryRunner.manager
      .createQueryBuilder()
      .select('*')
      .from(RoleEntity, 'role')
      .execute();

    await Promise.all(
      roles.map(({ id, name }) =>
        queryRunner.manager.update(RoleEntity, id, {
          name: name.toLowerCase(),
        }),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "UQ_ae4578dcaed5adff96595e61660"`,
    );
  }
}
