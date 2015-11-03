//BASIC-SQLITE-DATABASE
//**************************

var Sequelize = require('sequelize');  //This gets the module

//define type of database and where to store.
var mikessequelize = new Sequelize(undefined, undefined, undefined, {
									'dialect': 'sqlite',
									'storage': __dirname + '/basic-sqlite-database.sqlite'
								});
//***********************************************************************************************
//***** Define a database model to add to sequelize object  ********* usually in an exports file
var Todo = mikessequelize.define('todo', {
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

//*************************************************************************************************
// Does all the hard work of converting javascript to database language
//force:true will reset the database and load with current data. default=false
//sequelize.sync() returns a Promise for use in .then
mikessequelize.sync({force: false})

	.then(function() {
		console.log('Everything is synced! Got this far!');

		//Todo.findById(5)
        //
		//	.then(function(todo){
		//		if (todo){
		//		console.log(todo.toJSON());
		//	} else {
		//		console.log('Todo NOT found!');
		//	}
		//});
	});



//***********************************************
	Todo.create({
	 	description: 'Take out trash',
	 	completed: true
	 })
		.then(function (){
	 		return Todo.create({
	 			description: 'Clean office',
				completed: false
	 		});
	 	})


		//.then(function() {
		//	return Todo.findById(5)
		//})

		.then(function(){
			return Todo.findAll({
					where: {completed: false,
							description:{$like: '%trash%'}
					}
			});
		})

		//.then (function(todo){    // singlular todo
		//		if(todo) {
		//			console.log(todo.toJSON());
		//		} else{
		//			console.log("Sorry, NO todo!");
		//		}
		//})


		.then(function(tobbys){     //plural todos
	 		if(tobbys){
	 				tobbys.forEach(function (todo){
	 						console.log(todo.toJSON());
	 					});
	 		} else {
	 			console.log('no todo found');
	 		}
	 	})


		.catch(function (e){      //log errors
	 		console.log(e);
	 	});
//***********************************************8
mikessequelize.sync({force: false})

	.then(function() {

			Todo.findById(5).then(function(todo){
				if(todo){
					console.log(todo.toJSON());
				} else{
					console.log('miketodo not found!');
				}
			})
	})

	.catch(function (e){
		console.log(e);
	});
