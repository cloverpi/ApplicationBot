const Sequelize = require('sequelize');
const dbOptions = require('./config/storageOptions.json');

const sequelize = new Sequelize('database', 'username', 'password', dbOptions);

const Servers = sequelize.import('models/Servers');
const Users = sequelize.import('models/Users');


Servers.updateRowCount = async (id, rowCount) => {
	try {
		await Servers.upsert({id,  rowCount});
	} catch (e) {
		console.error(e);
	}
}

Servers.getRowCount = async (id = '') => {
	try {
		if (id === '' || id == undefined) return 0;
		const data = await Servers.findOne({where: { id }});
		if (data == undefined) return 0;
		if (!data.dataValues) return 0;
		return data.dataValues.rowCount;
	} catch (e) {
		console.error(e);
	}
}

Users.setComplete = async (id, date) => {
	try {
		const data = await Users.upsert({id, date, status: 'COMPLETE'});
	} catch (e) {
		console.error(e);
	}
}

Users.getStatus = async (id) => {
	try {
		if (id === '' || id == undefined) return 'IN_QUEUE';
		const data = await Users.findOne({where: { id }});
		if (data == undefined) return 'IN_QUEUE';
		if (!data.dataValues) return 'IN_QUEUE';
		return data.dataValues.status;
	} catch (e) {
		console.error(e);
	}
}


// !   needs to be fixed.
Users.getDate = async (id) => {
	try {
		if (id === '' || id == undefined) return 0;
		const data = await Users.findOne({where: { id }});
		if (data == undefined) return 0;
		if (!data.dataValues) return 0;
		return data.dataValues.date;
	} catch (e) {
		console.error(e);
	}
}

// Users.prototype.findId = async function() {
// 	return Users.findOne({
// 		where: { id: this.id },
// 	});
// };

module.exports = { Servers, Users };