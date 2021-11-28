import mongoose from "mongoose";
import {Person} from "../models/person";

export interface SantaMission extends Pick<Person, 'fullName'>{
    searchId: String;
    target: string;
}

const santaMissionSchema = new mongoose.Schema<SantaMission>({
    fullName: String,
    searchId: String,
    target: String,
});

export const SantaMissionModel = mongoose.model('SantaMission', santaMissionSchema);
