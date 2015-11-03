//**DB.JS ****
//**************************
// This routine loads all the modules into sequelize and then return
// that database connection to server.js which will call that file.
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';

var mikesequelize;

if (env === 'production'){
	mikesequelize = new Sequelize(process.env.DATABASE_URL,
		{dialect: 'postgres'})
	} else {
		mikesequelize = new Sequelize(undefined, undefined, undefined, {
			'dialect': 'sqlite',
			'storage': __dirname + '/data/dev-todo-api.sqlite'
			});
}


var db = {};  //Create a new OBJECT  called db to be used below and exported


//load in database definition model from separate files to keep it clean.
db.todo = mikesequelize.import(__dirname + '/models/todo.js');
db.user = mikesequelize.import(__dirname + '/models/user.js');  //add user section

db.sequelize = mikesequelize;  //set equal to the sequelize instance created above.

db.Sequelize = Sequelize; //set to the require Sequelize module.  not sure why.

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);    // assign relationships

module.exports = db;  //export the object that we created.
