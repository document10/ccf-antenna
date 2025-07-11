import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
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

    @Column('varchar', { length: 255 })
    operators : string

    @Column('varchar', { length: 255 })
    generation : string

    @Column('boolean',{ default: true })
    active : boolean

}
