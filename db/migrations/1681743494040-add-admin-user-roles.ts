import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleEntity } from '../../src/modules/user/entities/role.entity';
import { UserEntity } from '../../src/modules/user/entities/user.entity';

const adminRole = {
  id: 1,
  name: 'Administrator',
  description: '',
} as RoleEntity;

const userRole = {
  id: 2,
  name: 'User',
  description: '',
} as RoleEntity;

export class AddAdminUserRoles1681743494040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.insertRole(queryRunner, adminRole);
    await this.insertRole(queryRunner, userRole);
    await this.updateUsersRole(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.deleteUsersRole(queryRunner);
    await this.deleteRole(queryRunner, adminRole.id);
    await this.deleteRole(queryRunner, userRole.id);
  }

  private async insertRole(queryRunner: QueryRunner, role: RoleEntity) {
    const existed = await queryRunner.manager
      .createQueryBuilder()
      .select('*')
      .from(RoleEntity, 'role')
      .where('role.id = :id', { id: role.id })
      .getOne();

    if (!existed) {
      await queryRunner.manager.insert(RoleEntity, role);
    }
  }

  private async deleteRole(queryRunner: QueryRunner, id: number) {
    await queryRunner.manager.delete(RoleEntity, id);
  }

  private async updateUsersRole(queryRunner: QueryRunner) {
    const nonRoleUsers = await queryRunner.manager
      .createQueryBuilder()
      .select('user.id AS id')
      .from(UserEntity, 'user')
      .where('user.roleId IS NULL')
      .execute();

    return await Promise.all(
      nonRoleUsers.map(({ id }) =>
        queryRunner.manager.update(UserEntity, id, {
          role: { id: userRole.id },
        }),
      ),
    );
  }

  private async deleteUsersRole(queryRunner: QueryRunner) {
    const adminOrUserRoleUsers = await queryRunner.manager
      .createQueryBuilder()
      .select('user.id AS id')
      .from(UserEntity, 'user')
      .where('user.roleId = :adminRoleId', { adminRoleId: adminRole.id })
      .orWhere('user.roleId = :userRoleId', { userRoleId: userRole.id })
      .execute();

    return await Promise.all(
      adminOrUserRoleUsers.map(({ id }) => {
        queryRunner.manager.update(UserEntity, id, {
          role: { id: null },
        });
      }),
    );
  }
}
