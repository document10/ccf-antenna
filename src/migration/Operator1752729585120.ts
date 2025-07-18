import { BaseEntity, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, MigrationInterface, QueryRunner, Table } from "typeorm";
import "reflect-metadata"

export class Operator1752729585120 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`operator\` (
            	\`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	            \`name\` VARCHAR(255) NOT NULL,
                \`origin\` VARCHAR(255) NOT NULL
            );
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`operator\``)
    }
}