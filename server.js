//SERVER.JS
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var db = require ('./db.js');   //load database connection and model
var bcrypt = require('bcryptjs');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000; //if running on Haroku

// A todo is the model = 1 object.  A set of todos is
// called a collection.
var todos = [];
var todoNextId = 1; //not secure.  Use for counting.

app.use(bodyParser.json()); //access vis request.body


//*****************************************************
app.get('/', function(req, res) {
  res.send('You are in the Todo API Root');
})



//***********************************************************************************
//***********************************************************************************
// GET /todos?completed=true&q=Tobby
//***********************************************************************************
app.get('/todos', middleware.requireAuthentication, function(req, res) {
    var query = req.query; //this is URL parameters
    var where = { userId: req.user.get('id') };  //only get the user's todos
    //console.log(query.q, query.completed);

    if (query.hasOwnProperty("completed") && query.completed === 'true'){
        where.completed = true;
    } else if ( query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }

    if (query.hasOwnProperty("q") && query.q.length > 0){
        where.description = {$like: '%' + query.q + '%' };
    }

    db.todo.findAll({where: where})     // Todo.findAll({where: { completed: false, description:{$like: '%trash%'} }

        .then(function (todos){
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    })

});





//***********************************************************************************
//***********************************************************************************
//  GET /todos/:id
//***********************************************************************************
app.get('/todos/:id', middleware.requireAuthentication, function(request, response) {

      var todoId = parseInt(request.params.id, 10); //parseInt sets string to integet in base 10. Subtracting zero also worked as it forced it to be an int.
      var onlineUserId = request.user.get('id');  //only get the user's todos }

       //db.todo.findById(todoId)  //switch to find one
         db.todo.findOne({
                where: {
                        id: todoId,
                        userId: onlineUserId
                }
         })

          .then(function(todo){     // && is a double check of above.  don't need second part.
            if (!!todo && (onlineUserId === todo.userId)){    // THIS IS NEW!  BANG BANG your a Boolean.  if is  0, null, undef = false.  Else it is true
                    response.json(todo.toJSON());
             } else {
               //console.log(todo.userId);
               //console.log(onlineUserId);
              response.status(404).send('Sorry, there is no match for id: ' + request.params.id);
             }
        }, function (e) {
            response.status(500).send();  //server crashed or database connection failed.
        });

});




//*****************************************************************************
//*****************************************************************************
//  POST /todos
//*****************************************************************************
app.post('/todos', middleware.requireAuthentication, function(request, response) {
  var body = request.body; //get the JSON object inputed
  //use pick to filter only the fields you want from the entry.
  body = _.pick(body, 'description', 'completed');
  // OR can combine> var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body)
        .then(function(todo){
                // response.json(todo.toJSON());
                // see middleware js req.user
                request.user.addTodo(todo).then(function() {
                    return todo.reload();
                }).then(function(todo){
                   response.json(todo.toJSON());
                });

                }, function (e) {
                 response.status(400).json(e);
                 });

});




//*****************************************************************************
//*****************************************************************************
// DELETE /todos/:id
//*****************************************************************************
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
    var todoId = parseInt(req.params.id, 10); //parseInt sets string to integet in base 10. Subtracting zero alos worked as it forced it to be an int.
    var onlineUserId = req.user.get('id');  //Andrew did not use variables and put this below.

    db.todo.destroy({
        where: { id: todoId,
                  userId: onlineUserId }   // also checkif userId = the onlineUserId
    })
    .then(function (rowsDeleted) {

            if (rowsDeleted === 0) {
                res.status(404).json({
                 error: "no todo with id"
             });
             } else {
                  res.status(204).send();
                }

    }, function (e) {
        response.status(500).send();  //server crashed or database connection failed.
    });



});





//*****************************************************************************
//*****************************************************************************
//  PUT/todos/:id
//*****************************************************************************
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
  var body = _.pick(req.body, 'description', 'completed'); //Like POST this gets JSON data
  var todoId = parseInt(req.params.id, 10); //parseInt sets string to integer in base 10. Subtracting zero also worked as it forced it to be an int.
  var onlineUserId = req.user.get('id');
  var attributes = {};

    if (body.hasOwnProperty('completed')) {  //if exists
        attributes.completed = body.completed; // assign it to the temporart object variable
    }


    if (body.hasOwnProperty('description')) {
        attributes.description = body.description; // assign it to the temporart object variable
    }

    // Above assigns desired changes to attributes object.  Next see if id exists and PUT.
  //  db.todo.findById(todoId)  //same as first on.  findone with wehre clause
    db.todo.findOne({
           where: {
                   id: todoId,
                   userId: onlineUserId
           }
    })
        .then(function(todo){
            if (todo && todo.userId == onlineUserId  ) {
                todo.update(attributes)

                .then(function(todo) {
                    res.json(todo.toJSON());
                }, function (e) {
                    res.status(400).json(e);
                });

            } else {
                res.status(404).send();  //if id not exist send back a 404.
            }
        }, function (){
               res.status(500).send();  //if server broke send error
        });




});


//*****************************************************************************
//*****************************************************************************
//  POST /users
//*****************************************************************************
app.post('/users', function(request, response) {
    var body = request.body; //get the JSON object inputed
    //use pick to filter only the fields you want from the entry.
    body = _.pick(body, 'email', 'password');

    db.user.create(body)
        .then(function(user){
            response.json(user.toPublicJSON());
        }, function (e) {
            response.status(400).json(e);
        });

});



//*****************************************************************************
//*****************************************************************************
//  POST /users/login
//*****************************************************************************
app.post('/users/login', function(request, response) {
    var body = request.body; //get the JSON object inputed
    //use pick to filter only the fields you want from the entry.
    body = _.pick(body, 'email', 'password');

    //here is where we put in our own custom sequelize method
    db.user.authenticate(body).then(function(user){

      var token = user.generateToken('authentication');
      if (token) {
          response.header('Auth', token).json(user.toPublicJSON());
        } else {
          response.status(401).send();
        }
    }, function (){
        response.status(401).send();
    });

});






//*****************************************************************************
//*****************************************************************************
//**checks for database named db and creates if not there.
//** then start the server.  Uses a PROMISE
//*****************************************************************************

db.sequelize.sync({force: true}).then(function(){
    app.listen(PORT, function() {
      console.log('Express listening on port ' + PORT + '!');
    });

})

//*********************************************************
