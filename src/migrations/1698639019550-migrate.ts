import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1698639019550 implements MigrationInterface {
    name = 'migrate1698639019550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" ALTER COLUMN "likert_feedback" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" ALTER COLUMN "likert_feedback" SET NOT NULL`);
    }

}
