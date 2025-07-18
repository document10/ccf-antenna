import "reflect-metadata"
import { AppDataSource } from "./data-source"
import { Antenna } from "./entity/Antenna"
//note: this file purely exists for migrations, it is useless otherwise
AppDataSource.initialize().then(async () => {

    const antenna = new Antenna()
    // antenna.latitude = 40.7128
    // antenna.longitude = -74.0060
    // antenna.range = 100.0
    // antenna.operators = "Operator1, Operator2"
    // antenna.generation = "5G"
    // antenna.active = true
    // await AppDataSource.manager.save(antenna)
    // AppDataSource.manager.getRepository(Antenna)
    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
