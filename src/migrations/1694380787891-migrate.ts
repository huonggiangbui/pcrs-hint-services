import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1694380787891 implements MigrationInterface {
    name = 'migrate1694380787891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "configTitle"`);
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "configDescription"`);
        await queryRunner.query(`ALTER TABLE "problem" DROP CONSTRAINT "UQ_946344322fd0ba7a36dbd702a12"`);
        await queryRunner.query(`ALTER TYPE "public"."problem_language_enum" RENAME TO "problem_language_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."problem_language_enum" AS ENUM('python')`);
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "language" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "language" TYPE "public"."problem_language_enum" USING "language"::"text"::"public"."problem_language_enum"`);
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "language" SET DEFAULT 'python'`);
        await queryRunner.query(`DROP TYPE "public"."problem_language_enum_old"`);
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "configLevel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "problem" ADD CONSTRAINT "UQ_946344322fd0ba7a36dbd702a12" UNIQUE ("pk", "language")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problem" DROP CONSTRAINT "UQ_946344322fd0ba7a36dbd702a12"`);
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "configLevel" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."problem_language_enum_old" AS ENUM('sql')`);
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "language" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "language" TYPE "public"."problem_language_enum_old" USING "language"::"text"::"public"."problem_language_enum_old"`);
        await queryRunner.query(`ALTER TABLE "problem" ALTER COLUMN "language" SET DEFAULT 'sql'`);
        await queryRunner.query(`DROP TYPE "public"."problem_language_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."problem_language_enum_old" RENAME TO "problem_language_enum"`);
        await queryRunner.query(`ALTER TABLE "problem" ADD CONSTRAINT "UQ_946344322fd0ba7a36dbd702a12" UNIQUE ("pk", "language")`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "configDescription" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "configTitle" character varying NOT NULL`);
    }

}
