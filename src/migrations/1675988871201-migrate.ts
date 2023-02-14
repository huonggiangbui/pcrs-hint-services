import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1675988871201 implements MigrationInterface {
    name = 'migrate1675988871201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "configFeedback"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "btnColor" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "btnColor"`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "configFeedback" boolean NOT NULL`);
    }

}
