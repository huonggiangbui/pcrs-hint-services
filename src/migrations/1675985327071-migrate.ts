import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1675985327071 implements MigrationInterface {
    name = 'migrate1675985327071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint" DROP CONSTRAINT "FK_4ae0ec941fe6052e39fc68c10ec"`);
        await queryRunner.query(`CREATE TABLE "hint_students_student" ("hintId" integer NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_b13d00cdaaaf69f783a56e8dd8a" PRIMARY KEY ("hintId", "studentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4174a538b602ffc50cc6decbab" ON "hint_students_student" ("hintId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f19eeb21522d55b9ee1de88ac" ON "hint_students_student" ("studentId") `);
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "submission"`);
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "studentId"`);
        await queryRunner.query(`CREATE TYPE "public"."hint_author_enum" AS ENUM('instructor', 'openai')`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "author" "public"."hint_author_enum" NOT NULL DEFAULT 'instructor'`);
        await queryRunner.query(`ALTER TABLE "logger" ADD "submission" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "prompt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "configMore" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hint_students_student" ADD CONSTRAINT "FK_4174a538b602ffc50cc6decbab8" FOREIGN KEY ("hintId") REFERENCES "hint"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hint_students_student" ADD CONSTRAINT "FK_0f19eeb21522d55b9ee1de88ac7" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint_students_student" DROP CONSTRAINT "FK_0f19eeb21522d55b9ee1de88ac7"`);
        await queryRunner.query(`ALTER TABLE "hint_students_student" DROP CONSTRAINT "FK_4174a538b602ffc50cc6decbab8"`);
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "configMore" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hint" ALTER COLUMN "prompt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "logger" DROP COLUMN "submission"`);
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "author"`);
        await queryRunner.query(`DROP TYPE "public"."hint_author_enum"`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "studentId" integer`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "submission" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f19eeb21522d55b9ee1de88ac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4174a538b602ffc50cc6decbab"`);
        await queryRunner.query(`DROP TABLE "hint_students_student"`);
        await queryRunner.query(`ALTER TABLE "hint" ADD CONSTRAINT "FK_4ae0ec941fe6052e39fc68c10ec" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
