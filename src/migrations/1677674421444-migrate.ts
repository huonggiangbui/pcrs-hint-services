import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1677674421444 implements MigrationInterface {
    name = 'migrate1677674421444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "likert_feedback" integer NOT NULL, "text_feedback" character varying, "hintId" integer, "studentId" integer, CONSTRAINT "UQ_4576886e5f8a1237fc9ff2558e5" UNIQUE ("hintId", "studentId"), CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hint" DROP COLUMN "feedback"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_b2a0e81bcca31554334d9152c9d" FOREIGN KEY ("hintId") REFERENCES "hint"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_8876434fdd001990326130ff505" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_8876434fdd001990326130ff505"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_b2a0e81bcca31554334d9152c9d"`);
        await queryRunner.query(`ALTER TABLE "hint" ADD "feedback" character varying`);
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
