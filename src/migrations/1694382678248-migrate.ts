import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1694382678248 implements MigrationInterface {
    name = 'migrate1694382678248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "configLevel" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "configLevel" SET NOT NULL`);
    }

}
