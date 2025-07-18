import "reflect-metadata"
import { DataSource } from "typeorm"
import { Antenna } from "./entity/Antenna"
import {Antenna1752729643425} from "./migration/Antenna1752729643425"
import { Operator } from "./entity/Operator"
import { Operator1752729585120 } from "./migration/Operator1752729585120"
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "db1234",
    database: "antene",
    synchronize: true,
    logging: false,
    entities: [Antenna,Operator],
    migrations: [Antenna1752729643425,Operator1752729585120],
    subscribers: [],
})
