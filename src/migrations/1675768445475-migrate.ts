import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1675768445475 implements MigrationInterface {
    name = 'migrate1675768445475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."problem_language_enum" AS ENUM('sql')`);
        await queryRunner.query(`CREATE TABLE "problem" ("id" SERIAL NOT NULL, "pk" character varying NOT NULL, "language" "public"."problem_language_enum" NOT NULL DEFAULT 'sql', "name" character varying NOT NULL, "description" character varying NOT NULL, "solution" character varying, "starter_code" character varying, CONSTRAINT "UQ_946344322fd0ba7a36dbd702a12" UNIQUE ("pk", "language"), CONSTRAINT "PK_119b5ca6f3371465bf1f0f90219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."logger_action_enum" AS ENUM('request', 'follow-up', 'close', 'expand')`);
        await queryRunner.query(`CREATE TABLE "logger" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "action" "public"."logger_action_enum" NOT NULL, "hintId" integer, "studentId" integer, CONSTRAINT "PK_46cad7e44f77ea2fa7da01e7828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."student_condition_enum" AS ENUM('control', 'experiment')`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "condition" "public"."student_condition_enum" NOT NULL DEFAULT 'control', "btnText" character varying NOT NULL, CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."hint_type_enum" AS ENUM('text', 'code')`);
        await queryRunner.query(`CREATE TYPE "public"."hint_configlevel_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "hint" ("id" SERIAL NOT NULL, "type" "public"."hint_type_enum" NOT NULL DEFAULT 'text', "prompt" character varying NOT NULL, "hint" character varying NOT NULL, "submission" character varying NOT NULL, "feedback" character varying, "studentId" integer, "problemId" integer, "configTitle" character varying NOT NULL, "configDescription" character varying NOT NULL, "configLevel" "public"."hint_configlevel_enum" DEFAULT '1', "configMore" boolean NOT NULL, "configFeedback" boolean NOT NULL, CONSTRAINT "PK_8924ac96cb5296b7a69399f0f94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "problem_students_student" ("problemId" integer NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_e43062bcd2a9ca18948e58d3524" PRIMARY KEY ("problemId", "studentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e996f300b8d506d53b96c25abe" ON "problem_students_student" ("problemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c25697209f12331127e57d0e31" ON "problem_students_student" ("studentId") `);
        await queryRunner.query(`ALTER TABLE "logger" ADD CONSTRAINT "FK_690a1558d088c0713f0ef3a701e" FOREIGN KEY ("hintId") REFERENCES "hint"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "logger" ADD CONSTRAINT "FK_4e9d63d3925321d4c546452e211" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hint" ADD CONSTRAINT "FK_4ae0ec941fe6052e39fc68c10ec" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hint" ADD CONSTRAINT "FK_c97a5d09ef6d7f4e865343d0ec0" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "problem_students_student" ADD CONSTRAINT "FK_e996f300b8d506d53b96c25abe6" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "problem_students_student" ADD CONSTRAINT "FK_c25697209f12331127e57d0e315" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problem_students_student" DROP CONSTRAINT "FK_c25697209f12331127e57d0e315"`);
        await queryRunner.query(`ALTER TABLE "problem_students_student" DROP CONSTRAINT "FK_e996f300b8d506d53b96c25abe6"`);
        await queryRunner.query(`ALTER TABLE "hint" DROP CONSTRAINT "FK_c97a5d09ef6d7f4e865343d0ec0"`);
        await queryRunner.query(`ALTER TABLE "hint" DROP CONSTRAINT "FK_4ae0ec941fe6052e39fc68c10ec"`);
        await queryRunner.query(`ALTER TABLE "logger" DROP CONSTRAINT "FK_4e9d63d3925321d4c546452e211"`);
        await queryRunner.query(`ALTER TABLE "logger" DROP CONSTRAINT "FK_690a1558d088c0713f0ef3a701e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c25697209f12331127e57d0e31"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e996f300b8d506d53b96c25abe"`);
        await queryRunner.query(`DROP TABLE "problem_students_student"`);
        await queryRunner.query(`DROP TABLE "hint"`);
        await queryRunner.query(`DROP TYPE "public"."hint_configlevel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."hint_type_enum"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TYPE "public"."student_condition_enum"`);
        await queryRunner.query(`DROP TABLE "logger"`);
        await queryRunner.query(`DROP TYPE "public"."logger_action_enum"`);
        await queryRunner.query(`DROP TABLE "problem"`);
        await queryRunner.query(`DROP TYPE "public"."problem_language_enum"`);
    }

}
