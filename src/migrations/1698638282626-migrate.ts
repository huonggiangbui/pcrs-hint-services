import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1698638282626 implements MigrationInterface {
    name = 'migrate1698638282626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "btnText"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "btnColor"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "btnColor" character varying DEFAULT '#002A5C'`);
        await queryRunner.query(`ALTER TABLE "student" ADD "btnText" character varying DEFAULT 'Help'`);
    }

}
