module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Questions', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },
        questionnairesId: {
            type: DataTypes.STRING,
        },
        question: {
            type: DataTypes.TEXT,
        },
        pos: {
            type: DataTypes.INTEGER,
        },
	}, {
		timestamps: false,
	});
};