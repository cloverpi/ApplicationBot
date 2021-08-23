module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Users', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },
		date: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
	}, {
		timestamps: false,
	});
};