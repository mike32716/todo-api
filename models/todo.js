//***ToDO.JS
//*************************
//This defines a database module to be returned back to db.js
//special function gets passes the sequelize instance and DataTypes (see below)

module.exports = function(sequelize, DataTypes) {

	return sequelize.define('todo', {

		description: {
				type: DataTypes.STRING,   //use DataTypes when being called by sequelize.import
				allowNull: false,
				validate: {	len: [1, 250] }
		},

		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}

	});
};
