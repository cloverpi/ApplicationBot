const Sequelize = require('sequelize');
const dbOptions = require('./config/storageOptions.json');

const sequelize = new Sequelize('database', 'user', 'password', dbOptions);

const Servers = sequelize.import('models/Servers');
const Users = sequelize.import('models/Users');


const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {

    const dbs = [
        Servers.upsert({id: '662776314515685385',
                        spreadsheetId: 'SPREADSHEETID',
                        rowCount: 1,
                        completedCategoryId: '704421055258820738', 
                        infoChannelId: '704421114348306564',
                        menuMessageId: null,
                        recruitmentOfficerRoleId: '662815957990899743',
                        acceptedApplicationRoleId: '662787368406745107' }),

        Users.upsert({  id: 'gnerf-myzrael',
                        date: 0,
                        status: 'COMPLETE'
                    }),
        
    ]   
	await Promise.all(dbs);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);