import {connect} from "../database/connect";
import {PersonModel} from "../database/personModel";
import { v4 as uuidv4 } from 'uuid';
import {Person, PersonsArray, uniquePersonsArrayType} from "../models/person";
import {SantaMission, SantaMissionModel} from "../database/santaMissonModel";
import {uniq, without} from "ramda";
import {isRight} from "fp-ts/Either";
import {shuffle} from "../common/shuffle";

type HamiltonianPathReturnValue = Array<Omit<SantaMission, 'searchId'>> | null;

function hamiltonianPath(
    personsByFullNames: Record<string, Person>,
    personsNamesList: Array<string>,
    person: Person,
    visited: Array<string>
): HamiltonianPathReturnValue {
    const restrictedPersons: Array<string> = uniq(person.shouldNotBeSantaFor.concat(visited));
    const options = shuffle(without(restrictedPersons, personsNamesList));

    if (visited.length + 1 === personsNamesList.length) {
        return person.shouldNotBeSantaFor.includes(visited[0]) ? null : [{
            fullName: person.fullName,
            target: visited[0],
        }];
    }

    if (options.length === 0) {
        return null;
    }

    return options.reduce((acc: HamiltonianPathReturnValue, item) => {
        if (acc !== null) {
            return acc;
        }

        const result = hamiltonianPath(
            personsByFullNames,
            personsNamesList,
            personsByFullNames[item],
            [...visited, person.fullName]
        );

        return result === null ? result : [
            ...result,
            {
                fullName: person.fullName,
                target: item,
            },
        ];
    }, null);
}

function generateSantaMissions(personsList: PersonsArray): Array<SantaMission> {
    const personsByFullName = personsList.reduce((acc: Record<string, Person>, item) => ({
        ...acc,
        [item.fullName]: item
    }), {});
    const personNames = personsList.map(({ fullName }) => fullName);

    const result = hamiltonianPath(personsByFullName, personNames, shuffle(personsList)[0], []);
    if (!result) {
        console.error('Hamiltonian path cannot be generated!');
        process.exit(1);
    }

    return result.map(item => ({
        ...item,
        searchId: uuidv4(),
    }));
}


async function runScript() {
    await connect();
    const personsListDecodeResult = uniquePersonsArrayType.decode(await PersonModel.find().exec());
    if (!isRight(personsListDecodeResult)) {
        console.error('Database data is corrupted');
        process.exit(1);
    }
    const santaMissions = generateSantaMissions(personsListDecodeResult.right);
    await Promise.all(santaMissions.map(async santaMission => {
        await SantaMissionModel.deleteMany({ fullName: santaMission.fullName }).exec();
        const santaMissionModel = new SantaMissionModel(santaMission);
        return santaMissionModel.save();
    }));
    process.exit(0);
}
runScript();