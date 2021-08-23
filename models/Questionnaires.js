module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Questionnaires', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },
        serverId: {
            type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		}
	}, {
		timestamps: false,
	});
};