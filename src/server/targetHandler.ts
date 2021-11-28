import express from 'express';
import {connect} from "../database/connect";
import {SantaMissionModel} from "../database/santaMissonModel";

const ERROR_MESSAGE = 'Required parameter is missing or incorrect, ask for URL once more';

const app = express();

app.get('/target', async (req, res) => {
    const { searchId } = req.query;

    if (!searchId || typeof searchId !== 'string') {
        res.status(404).send(ERROR_MESSAGE);
        return;
    }

    const santaMission = await SantaMissionModel.findOne({ searchId }).exec();

    if (santaMission === null) {
        res.status(404).send(ERROR_MESSAGE);
        return;
    }

    res.status(200).send(`Цель вашей миссии - ${santaMission.target}`)
});

connect().then(() => {
    app.listen(8080);
})

