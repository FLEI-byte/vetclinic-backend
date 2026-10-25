import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVetClinicTables1792919338627 implements MigrationInterface {
  name = 'CreateVetClinicTables1792919338627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "employees" (
                "id" SERIAL NOT NULL,
                "phone" character varying(13) NOT NULL,
                "last_name" character varying(30) NOT NULL,
                "first_name" character varying(30) NOT NULL,
                "patronymic" character varying(30) NOT NULL,
                "position" character varying(50) NOT NULL,
                "email" character varying(255) NOT NULL,
                CONSTRAINT "UQ_cbc362d1c574464a63d3acc3ead" UNIQUE ("phone"),
                CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"),
                CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "appointments" (
                "id" SERIAL NOT NULL,
                "appointment_date" TIMESTAMP NOT NULL,
                "purpose" text NOT NULL,
                "exam_results" text,
                "diagnosis" character varying(255),
                "total" numeric(10, 2) NOT NULL,
                "medical_card_id" integer NOT NULL,
                "employee_id" integer NOT NULL,
                CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" SERIAL NOT NULL,
                "phone" character varying(13) NOT NULL,
                "last_name" character varying(30) NOT NULL,
                "first_name" character varying(30) NOT NULL,
                "patronymic" character varying(30) NOT NULL,
                "birth_date" date NOT NULL,
                "email" character varying(255) NOT NULL,
                CONSTRAINT "UQ_aa22377d7d3e794ae4cd39cd9e5" UNIQUE ("phone"),
                CONSTRAINT "UQ_b48860677afe62cd96e12659482" UNIQUE ("email"),
                CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "medical_cards" (
                "id" SERIAL NOT NULL,
                "nickname" character varying(50) NOT NULL,
                "species" character varying(50) NOT NULL,
                "breed" character varying(50) NOT NULL,
                "sex" character varying(10) NOT NULL,
                "birth_date" date NOT NULL,
                "created_date" date NOT NULL DEFAULT ('now'::text)::date,
                "client_id" integer NOT NULL,
                CONSTRAINT "PK_0a5fe330790fd6e28620012c0e0" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "appointments"
            ADD CONSTRAINT "FK_269973a27cf3edf2842ad3201f3" FOREIGN KEY ("medical_card_id") REFERENCES "medical_cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "appointments"
            ADD CONSTRAINT "FK_f4e3a19c74dac65a223368fa9a0" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "medical_cards"
            ADD CONSTRAINT "FK_b161f05f3a941bb051641c54cc1" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "medical_cards" DROP CONSTRAINT "FK_b161f05f3a941bb051641c54cc1"
        `);
    await queryRunner.query(`
            ALTER TABLE "appointments" DROP CONSTRAINT "FK_f4e3a19c74dac65a223368fa9a0"
        `);
    await queryRunner.query(`
            ALTER TABLE "appointments" DROP CONSTRAINT "FK_269973a27cf3edf2842ad3201f3"
        `);
    await queryRunner.query(`
            DROP TABLE "medical_cards"
        `);
    await queryRunner.query(`
            DROP TABLE "clients"
        `);
    await queryRunner.query(`
            DROP TABLE "appointments"
        `);
    await queryRunner.query(`
            DROP TABLE "employees"
        `);
  }
}
