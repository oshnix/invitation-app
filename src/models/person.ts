import * as t from 'io-ts';
import {uniq} from "ramda";
import {Context} from "io-ts";
import {isRight} from "fp-ts/Either";

export const personType = t.type({
    fullName: t.string,
    shouldNotBeSantaFor: t.array(t.string)
});
export type Person = t.TypeOf<typeof personType>;

export const personsArrayType = t.array(personType);
export type PersonsArray = t.TypeOf<typeof personsArrayType>;

const isUniquePersonsArray = (personsArray: PersonsArray) => uniq(personsArray.map(({ fullName }) => fullName)).length === personsArray.length;

export const uniquePersonsArrayType = new t.Type<PersonsArray, PersonsArray, PersonsArray>(
    'uniquePersonsArray',
    (personsArray: unknown): personsArray is PersonsArray => Array.isArray(personsArray) && personsArray.every((person) => isRight(personType.decode(person))),
    (input: PersonsArray, context: Context) => isUniquePersonsArray(input) ? t.success(input) : t.failure(input, context),
    t.identity,
);

