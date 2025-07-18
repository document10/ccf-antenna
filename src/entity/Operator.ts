import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation, JoinColumn } from "typeorm"
import "reflect-metadata"
import { Antenna } from "./Antenna"

@Entity()
export class Operator {

    @PrimaryGeneratedColumn()
    id : number

    @Column('varchar', { length: 255 })
    name : string

    @Column('varchar', { length: 255 })
    origin : string

}
