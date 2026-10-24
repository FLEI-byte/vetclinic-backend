import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserBio1792245234818 implements MigrationInterface {
    name = 'AddUserBio1792245234818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "bio" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "bio"
        `);
    }

}
