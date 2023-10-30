import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1698637043152 implements MigrationInterface {
    name = 'migrate1698637043152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "typeExperiment" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "typeExperiment" SET NOT NULL`);
    }

}
