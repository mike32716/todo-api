//**DB.JS ****
//**************************
// This routine loads all the modules into sequelize and then return
// that database connections to server.js which will call that file.

var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
									'dialect': 'sqlite',
									'storage': __dirname + '/data/dev-todo-api.sqlite'
	            	 });



var db = {};  //Create a new object called db to be used below.


//load in sequelize models from separate files to keep it clean.
db.todo = sequelize.import(__dirname + '/models/todo.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;



module.exports = db;  //export the object that we created.
