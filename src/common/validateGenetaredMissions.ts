import {Person} from "../models/person";
import {SantaMission} from "../database/santaMissonModel";
import {uniq} from "ramda";

function logErrorAndExit(errorText: string): never {
    console.error(errorText);
    process.exit(1);
}

export function validateGeneratedMissions(persons: Array<Person>, santaMissions: Array<SantaMission>): void | never {
    if (santaMissions.length !== persons.length) {
        logErrorAndExit('Santa missions amount not equal to persons amount');
    }

    persons.forEach(person => {
        const santaMission = santaMissions.find(mission => mission.fullName === person.fullName);

        if (!santaMission) {
            logErrorAndExit(`${person.fullName} doesn't have a mission`);
        }

        const ownMissionTarget = persons.find(p => p.fullName === santaMission.target);

        if (!ownMissionTarget) {
            logErrorAndExit(`Cannot find target ${santaMission.target} in persons list`);
        }

        if (person.shouldNotBeSantaFor.includes(ownMissionTarget.fullName)) {
            logErrorAndExit(`${person.fullName} cannot be santa for ${ownMissionTarget.fullName}`);
        }

        const targetInMission = santaMissions.find(mission => mission.fullName === person.fullName);

        if (!targetInMission) {
            logErrorAndExit(`${person.fullName} is not a mission's target`);
        }
    });

    const searchIds = santaMissions.map(({ searchId }) => searchId);
    if (searchIds.length !== uniq(searchIds).length) {
        logErrorAndExit('Search ids collision');
    }
}
