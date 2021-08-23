module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Servers', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },
        spreadsheetId: {
			type: DataTypes.STRING,
        },
        rowCount: {
			type: DataTypes.INTEGER,
        },
        completedCategoryId: {
            type: DataTypes.STRING,
        },
        infoChannelId: {
			type: DataTypes.STRING,
        },
        menuMessageId: {
            type: DataTypes.STRING,
        },
        recruitmentOfficerRoleId: {
            type: DataTypes.STRING,
        },
        acceptedApplicationRoleId: {
            type: DataTypes.STRING,
        },
	}, {
		timestamps: false,
	});
};