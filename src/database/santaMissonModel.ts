import mongoose from "mongoose";
import {Person} from "../models/person";

export interface SantaMission extends Pick<Person, 'fullName'>{
    searchId: String;
    santaFor: string;
}

const santaMissionSchema = new mongoose.Schema<SantaMission>({
    fullName: String,
    searchId: String,
    santaFor: String,
});

export const SantaMissionModel = mongoose.model('SantaMission', santaMissionSchema);
