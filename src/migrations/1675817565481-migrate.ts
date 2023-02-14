import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1675817565481 implements MigrationInterface {
    name = 'migrate1675817565481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "btnText" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "btnText" SET NOT NULL`);
    }

}
