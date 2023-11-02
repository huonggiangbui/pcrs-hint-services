import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1698947381210 implements MigrationInterface {
    name = 'migrate1698947381210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "configLevel"`);
        await queryRunner.query(`DROP TYPE "public"."hint_configlevel_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."hint_configlevel_enum" AS ENUM('bottom_out', 'hidden')`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "configLevel" "public"."hint_configlevel_enum" DEFAULT 'bottom_out'`);
    }

}
