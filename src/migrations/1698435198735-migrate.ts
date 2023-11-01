import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1698435198735 implements MigrationInterface {
    name = 'migrate1698435198735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."problem_language_enum" AS ENUM('python')`);
        await queryRunner.query(`CREATE TABLE "problem" ("id" SERIAL NOT NULL, "pk" character varying NOT NULL, "language" "public"."problem_language_enum" NOT NULL DEFAULT 'python', "typeExperiment" boolean NOT NULL, "crossover" boolean, "name" character varying, "description" character varying, "solution" character varying, "starter_code" character varying, CONSTRAINT "UQ_946344322fd0ba7a36dbd702a12" UNIQUE ("pk", "language"), CONSTRAINT "PK_119b5ca6f3371465bf1f0f90219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."logger_action_enum" AS ENUM('request', 'close', 'expand')`);
        await queryRunner.query(`CREATE TABLE "logger" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "action" "public"."logger_action_enum" NOT NULL, "submission" character varying NOT NULL, "hintId" integer, "studentId" integer, CONSTRAINT "PK_46cad7e44f77ea2fa7da01e7828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."student_conditionvisibility_enum" AS ENUM('control', 'experiment')`);
        await queryRunner.query(`CREATE TYPE "public"."student_conditiontype_enum" AS ENUM('text', 'code')`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "btnText" character varying DEFAULT 'Help', "btnColor" character varying DEFAULT '#002A5C', "conditionVisibility" "public"."student_conditionvisibility_enum" NOT NULL DEFAULT 'experiment', "conditionType" "public"."student_conditiontype_enum" NOT NULL DEFAULT 'text', CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."hint_type_enum" AS ENUM('text', 'code')`);
        await queryRunner.query(`CREATE TYPE "public"."hint_configlevel_enum" AS ENUM('bottom_out', 'hidden')`);
        await queryRunner.query(`CREATE TABLE "hint" ("id" SERIAL NOT NULL, "hint" character varying NOT NULL, "type" "public"."hint_type_enum" NOT NULL DEFAULT 'text', "prev" integer, "next" integer, "problemId" integer, "configLevel" "public"."hint_configlevel_enum" DEFAULT 'bottom_out', CONSTRAINT "PK_8924ac96cb5296b7a69399f0f94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "likert_feedback" integer NOT NULL, "text_feedback" character varying, "hintId" integer, "studentId" integer, CONSTRAINT "UQ_4576886e5f8a1237fc9ff2558e5" UNIQUE ("hintId", "studentId"), CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "problem_students_student" ("problemId" integer NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_e43062bcd2a9ca18948e58d3524" PRIMARY KEY ("problemId", "studentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e996f300b8d506d53b96c25abe" ON "problem_students_student" ("problemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c25697209f12331127e57d0e31" ON "problem_students_student" ("studentId") `);
        await queryRunner.query(`CREATE TABLE "hint_students_student" ("hintId" integer NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_b13d00cdaaaf69f783a56e8dd8a" PRIMARY KEY ("hintId", "studentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4174a538b602ffc50cc6decbab" ON "hint_students_student" ("hintId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f19eeb21522d55b9ee1de88ac" ON "hint_students_student" ("studentId") `);
        await queryRunner.query(`ALTER TABLE "logger" ADD CONSTRAINT "FK_690a1558d088c0713f0ef3a701e" FOREIGN KEY ("hintId") REFERENCES "hint"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "logger" ADD CONSTRAINT "FK_4e9d63d3925321d4c546452e211" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hint" ADD CONSTRAINT "FK_c97a5d09ef6d7f4e865343d0ec0" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_b2a0e81bcca31554334d9152c9d" FOREIGN KEY ("hintId") REFERENCES "hint"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_8876434fdd001990326130ff505" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "problem_students_student" ADD CONSTRAINT "FK_e996f300b8d506d53b96c25abe6" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "problem_students_student" ADD CONSTRAINT "FK_c25697209f12331127e57d0e315" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hint_students_student" ADD CONSTRAINT "FK_4174a538b602ffc50cc6decbab8" FOREIGN KEY ("hintId") REFERENCES "hint"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hint_students_student" ADD CONSTRAINT "FK_0f19eeb21522d55b9ee1de88ac7" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hint_students_student" DROP CONSTRAINT "FK_0f19eeb21522d55b9ee1de88ac7"`);
        await queryRunner.query(`ALTER TABLE "hint_students_student" DROP CONSTRAINT "FK_4174a538b602ffc50cc6decbab8"`);
        await queryRunner.query(`ALTER TABLE "problem_students_student" DROP CONSTRAINT "FK_c25697209f12331127e57d0e315"`);
        await queryRunner.query(`ALTER TABLE "problem_students_student" DROP CONSTRAINT "FK_e996f300b8d506d53b96c25abe6"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_8876434fdd001990326130ff505"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_b2a0e81bcca31554334d9152c9d"`);
        await queryRunner.query(`ALTER TABLE "hint" DROP CONSTRAINT "FK_c97a5d09ef6d7f4e865343d0ec0"`);
        await queryRunner.query(`ALTER TABLE "logger" DROP CONSTRAINT "FK_4e9d63d3925321d4c546452e211"`);
        await queryRunner.query(`ALTER TABLE "logger" DROP CONSTRAINT "FK_690a1558d088c0713f0ef3a701e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f19eeb21522d55b9ee1de88ac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4174a538b602ffc50cc6decbab"`);
        await queryRunner.query(`DROP TABLE "hint_students_student"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c25697209f12331127e57d0e31"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e996f300b8d506d53b96c25abe"`);
        await queryRunner.query(`DROP TABLE "problem_students_student"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP TABLE "hint"`);
        await queryRunner.query(`DROP TYPE "public"."hint_configlevel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."hint_type_enum"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TYPE "public"."student_conditiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."student_conditionvisibility_enum"`);
        await queryRunner.query(`DROP TABLE "logger"`);
        await queryRunner.query(`DROP TYPE "public"."logger_action_enum"`);
        await queryRunner.query(`DROP TABLE "problem"`);
        await queryRunner.query(`DROP TYPE "public"."problem_language_enum"`);
    }

}
