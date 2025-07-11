"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Antenna_1 = require("./entity/Antenna");
var Antenna_Migration_1 = require("./migration/Antenna_Migration");
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
    migrations: [Antenna_Migration_1.Antenna_Migration],
    subscribers: [],
});
