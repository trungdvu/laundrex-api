import { isEmpty } from 'lodash';
import { SERVICE_UNIT } from 'src/constants/common.constant';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const services = [
  {
    name: 'Laundering 70',
    price: 15000,
    unit: SERVICE_UNIT.KILOGRAM,
  },
  {
    name: 'Sneakers cleaning',
    price: 40000,
    unit: SERVICE_UNIT.ITEM,
  },
];

export class AddServiceData1683704193758 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      services.map(async (s) => {
        const existedService = await queryRunner.manager
          .createQueryBuilder()
          .select('*')
          .from(ServiceEntity, 'service')
          .where('service.name = :name', { name: s.name })
          .getRawOne();

        if (isEmpty(existedService)) {
          return queryRunner.manager.insert(ServiceEntity, s);
        }
        return queryRunner.manager.update(ServiceEntity, existedService.id, {
          ...s,
        });
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
