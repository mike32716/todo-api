//SERVER.JS
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var db = require ('./db.js');   //load database connection and model

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
app.get('/todos', function(req, res) {
    var query = req.query; //this is URL parameters
    var where = {};

    console.log(query.q, query.completed);

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


 //  }
// if quiery is the length greater than zero?


    /*.then(function(){
        return Todo.findAll({
            where: {completed: false,
                description:{$like: '%trash%'}
            }
        });
    })

    db.todo.findById(todoId)
        .then(function(todo){
            if (!!todo){    // THIS IS NEW!  BANG BANG your a Boolean.  if is  0, null, undef = false.  Else it is true
                response.json(todo.toJSON());
            } else {
                response.status(404).send('Sorry, there is no match for id: ' + request.params.id);
            }
        }, function (e) {
            response.status(500).send();  //server crashed or database connection failed.
        });*/



    /*var filteredTodos = todos;
      //if hasOwnProperty && completed === 'true'
      if (queryParams.hasOwnProperty("completed") && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {
          completed: true
        });
      } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {
          completed: false
        });
      }

      //toLowerCase converts everything to lower case before search so you get all letters A=a
      if (queryParams.hasOwnProperty("q") && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(someQ) {
          return someQ.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
      }

      res.json(filteredTodos); // retrun filtered params.  If not filtered return all.
      // This will convert array into json and send back the api*/
//    });



//***********************************************************************************
//***********************************************************************************
//  GET /todos/:id
//***********************************************************************************
app.get('/todos/:id', function(request, response) {

      var todoId = parseInt(request.params.id, 10); //parseInt sets string to integet in base 10. Subtracting zero also worked as it forced it to be an int.

      db.todo.findById(todoId)
          .then(function(todo){
            if (!!todo){    // THIS IS NEW!  BANG BANG your a Boolean.  if is  0, null, undef = false.  Else it is true
                    response.json(todo.toJSON());
             } else {
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
app.post('/todos', function(request, response) {
  var body = request.body; //get the JSON object inputed
  //use pick to filter only the fields you want from the entry.
  body = _.pick(body, 'description', 'completed');
  // OR can combine> var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body)
        .then(function(todo){
                 response.json(todo.toJSON());
                }, function (e) {
                 response.status(400).json(e);
                 });

});




//*****************************************************************************
//*****************************************************************************
// DELETE /todos/:id
//*****************************************************************************
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10); //parseInt sets string to integet in base 10. Subtracting zero alos worked as it forced it to be an int.


    db.todo.destroy({
        where: { id: todoId }
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
app.put('/todos/:id', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed'); //Like POST this gets JSON data
  var todoId = parseInt(req.params.id, 10); //parseInt sets string to integer in base 10. Subtracting zero also worked as it forced it to be an int.

  var attributes = {};

    if (body.hasOwnProperty('completed')) {  //if exists
        attributes.completed = body.completed; // assign it to the temporart object variable
    }


    if (body.hasOwnProperty('description')) {
        attributes.description = body.description; // assign it to the temporart object variable
    }

    // Above assigns desired changes to attributes object.  Next see if id exists and PUT.
    db.todo.findById(todoId)

        .then(function(todo){
            if (todo) {
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
//**checks for database named db and creates if not there.
//** then start the server.  Uses a PROMISE
//*****************************************************************************

db.sequelize.sync({force: false}).then(function(){
    app.listen(PORT, function() {
      console.log('Express listening on port ' + PORT + '!');
    });

})

//*********************************************************
