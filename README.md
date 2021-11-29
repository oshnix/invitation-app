# Secret santa application
## Description

Application for generating targets for secret santa from persons list.  
Targets are generated using **Hamiltonian path** algorithm.

You will need a server with Mongo database to run this application.  

## Setup
Before running start script you'll need to complete the following steps:
* Create database and user for it.
* Create `src/realData` directory and `people.json` file inside it.
  * Refer to the `src/people.example.json` file for the schema
* Create `.env` file. Refer to `.env.example` for schema 
* Run `npm run putDataToDB` script first. Then `npm run generateSantaMissions` to generate all the missions
* Run `npm run generateMissionsUrl` to get urls for all the participants. 
* Start up the server and check the url
  * You may want to daemonize the server, I suggest using systemd service for this.

