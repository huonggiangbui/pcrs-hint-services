import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1698804359566 implements MigrationInterface {
    name = 'migrate1698804359566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logger" DROP COLUMN "action"`);
        await queryRunner.query(`DROP TYPE "public"."logger_action_enum"`);
        await queryRunner.query(`ALTER TABLE "feedback" ALTER COLUMN "likert_feedback" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" ALTER COLUMN "likert_feedback" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."logger_action_enum" AS ENUM('request', 'close', 'expand')`);
        await queryRunner.query(`ALTER TABLE "logger" ADD "action" "public"."logger_action_enum" NOT NULL`);
    }

}
