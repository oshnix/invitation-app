import mongoose from "mongoose";
import {Person} from "../models/person";

const personSchema = new mongoose.Schema<Person>({
    fullName: String,
    shouldNotBeSantaFor: [String],
});

export const PersonModel = mongoose.model('Person', personSchema);

