import {connect} from "../database/connect";
import persons from '../realData/persons.json';
import {Person, uniquePersonsArrayType} from "../models/person";
import {isRight} from "fp-ts/Either";
import {PathReporter} from "io-ts/PathReporter";
import {PersonModel} from "../database/personModel";

async function runScript() {
    await connect();
    const result = uniquePersonsArrayType.decode(persons);

    if (!isRight(result)) {
        console.error(PathReporter.report(result));
        process.exit(1);
    }

    await Promise.all(result.right.map(async (person: Person) => {
        await PersonModel.deleteOne({ fullName: person.fullName }).exec();
        const model = new PersonModel(person);
        await model.save();
    }));
    process.exit(0);
}

runScript();