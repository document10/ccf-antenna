import { BaseEntity, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, MigrationInterface, QueryRunner, Table } from "typeorm";
import "reflect-metadata"

export class Antenna1752729643425 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`antenna\` (
                \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                \`latitude\` DECIMAL(20,10) NOT NULL,
                \`longitude\` DECIMAL(20,10) NOT NULL,
                \`range\` INT NOT NULL,
                \`operator\` INT NOT NULL,
                \`generation\` VARCHAR(255) NOT NULL,
                \`active\` BOOLEAN NOT NULL DEFAULT true,
                FOREIGN KEY (operator) REFERENCES operator(id)
            )
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`antenna\``)
    }
}