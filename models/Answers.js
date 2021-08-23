module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Answers', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
        },
        questionsId: {
            type: DataTypes.STRING,
        },
        usersId: {
            type: DataTypes.STRING,
        },
        answer: {
            type: DataTypes.TEXT,
        },
	}, {
		timestamps: false,
	});
};