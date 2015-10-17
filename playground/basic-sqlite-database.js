//BASIC-SQLITE-DATABASE
//**************************

var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
									'dialect': 'sqlite',
									'storage': __dirname + '/basic-sqlite-database.sqlite'
								});


//***** Define a database model *********
var Todo = sequelize.define('todo', {
		description: {
			type: Sequelize.STRING,
			allowNull: false,  //Must enter a description
			validate: {
					len: [1, 250]  //must be 1 to 250 characters
				}
		},
		completed: {
			type: Sequelize.BOOLEAN,
			allowNull:false,
			defaultValue: false   //sets a default
		}
});



// Does all the hard word of converting javascript to database language
//force:true will reset the datbase and load with current data. default=false
sequelize.sync({
	force: false
}).then(function() {
		console.log('Everything is synced! Got this far!');

		Todo.findById(2).then(function(todo){
					if (todo){
									console.log(todo.toJSON());
					 } else {
					 	console.log('Todo NOT found!');
					 }
			});
});


	// Todo.create({
	// 	description: 'Take out trash'//,
	// 	//completed: true
	// }).then(function (todo){
	// 		return Todo.create({
	// 			description: 'Clean office'
	// 		});
	// }).then(function(){
	// 	//	return Todo.findById(1)   //loog for id 1
	// 			return Todo.findAll({
	// 					where: {
	// 						description: {
	// 							$like: '%Publix%'
	// 						}
	// 					}
	// 			});
	// }).then(function(todos){
	// 		if(todos){
	// 				todos.forEach(function (todo){
	// 						console.log(todo.toJSON());
	// 					});
	//
	// 		} else {
	// 			console.log('no todo found');
	// 		}
	//
	// }).catch(function (e){        //log errors
	// 		console.log(e);
	// });
