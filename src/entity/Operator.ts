import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"
import "reflect-metadata"

@Entity()
export class Operator {

    @PrimaryGeneratedColumn()
    id : number

    @Column('varchar', { length: 255 })
    name : string

    @Column('varchar', { length: 255 })
    origin : string

}
