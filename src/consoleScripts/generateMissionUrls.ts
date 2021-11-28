import {connect} from "../database/connect";
import {SantaMissionModel} from "../database/santaMissonModel";
import {PersonModel} from "../database/personModel";
import {validateGeneratedMissions} from "../common/validateGenetaredMissions";
import {shuffle} from "../common/shuffle";

async function runScript() {
    await connect();
    const santaMissions = await SantaMissionModel.find().exec();
    const persons = await PersonModel.find().exec();

    validateGeneratedMissions(persons, santaMissions);

    /*
        Just in case the records are extracted in the same order they've been put into the collection.
        Shuffle will prevent the admin from determining the hamiltonian path sequence
     */
    shuffle(santaMissions).forEach(mission => {
        console.log(`${mission.fullName} = ${process.env.SERVER_HOSTNAME}/target?searchId=${mission.searchId}`);
    });
    process.exit(0);
}

runScript();