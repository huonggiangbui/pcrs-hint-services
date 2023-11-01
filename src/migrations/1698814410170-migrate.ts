import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1698814410170 implements MigrationInterface {
    name = 'migrate1698814410170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logger" ADD "revealed" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logger" DROP COLUMN "revealed"`);
    }

}
