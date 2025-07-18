import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinTable, Relation, ForeignKey } from "typeorm"
import { Operator } from "./Operator"
import "reflect-metadata"

@Entity()
export class Antenna {

    @PrimaryGeneratedColumn()
    id : number

    @Column('decimal', { precision: 20, scale: 10 })
    latitude : number

    @Column('decimal', { precision: 20, scale: 10 })
    longitude : number

    @Column('int')
    range : number

    @Column('int')
    operatorId : number

    @Column('varchar', { length: 255 })
    generation : string

    @Column('boolean',{ default: true })
    active : boolean

}
