"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Antenna_1 = require("./entity/Antenna");
var Antenna1752157961095 = require("./migration/Antenna1752157961095");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "db1234",
    database: "antene",
    synchronize: true,
    logging: false,
    entities: [Antenna_1.Antenna],
    migrations: [Antenna1752157961095.Antenna1752157961095],
    subscribers: [],
});
