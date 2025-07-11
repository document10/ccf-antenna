import "reflect-metadata"
import { DataSource } from "typeorm"
import { Antenna } from "./entity/Antenna"
import {Antenna1752157961095} from "./migration/Antenna1752157961095"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "db1234",
    database: "antene",
    synchronize: true,
    logging: false,
    entities: [Antenna],
    migrations: [Antenna1752157961095],
    subscribers: [],
})
