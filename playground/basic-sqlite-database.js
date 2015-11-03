//BASIC-SQLITE-DATABASE
//**************************
var Sequelize = require('sequelize');  //This gets the module
//define type of database and where to store.
var sequelize = new Sequelize(undefined, undefined, undefined, {
									'dialect': 'sqlite',
									'storage': __dirname + '/basic-sqlite-database.sqlite'
								});

//***********************************************************************************************
//***** Define a database model to add to sequelize object  ********* usually in an exports file
var Todo = sequelize.define('todo', {
		description: {
					type: Sequelize.STRING,
					allowNull: false,  // OPTIONAL Must enter a description
					validate: {len: [1, 250] } //must be 1 to 250 characters

		},

		completed: {
					type: Sequelize.BOOLEAN,
					allowNull:false,
					defaultValue: false   // OPTIONAL sets a default
		}
});

//********************************************
// define a user database model
var User = sequelize.define('user', {
					email: Sequelize.STRING		  //shorcut.
});

Todo.belongsTo(User);
User.hasMany(Todo);    //setting up foregn keys



//***********************************************
sequelize.sync({force: false})
	.then(function() {
			console.log('Everything is synced!');

			User.findById(1).then(function(user){

					 user.getTodos({ where: {completed: false} })

			.then(function(todos){
						todos.forEach(function(todo){
 							console.log(todo.toJSON());
					});

				});

			});


			// User.create({
			// 	email: "mike32716@gmail.com"
			// }).then(function(){
			// 		return Todo.create({
			// 		description: 'Clean yard'
			// 	});
			// }).then(function(todo){
			// 		User.findById(1).then(function(user){
			// 			user.addTodo(todo);
			// 		});
			// });


});
