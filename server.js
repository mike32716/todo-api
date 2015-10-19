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
  res.send('Todo API Root');
})


//******************************************************
// GET /todos?completed=true&q=Tobby
app.get('/todos', function(req, res) {
  var queryParams = req.query; //this is URL parameters
  var filteredTodos = todos;

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
  // This will convert array into json and send back the api
});


//GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10); //parseInt sets string to integet in base 10. Subtracting zero alos worked as it forced it to be an int.

  var matchedTodo = _.findWhere(todos, {
    id: todoId
  }); //This is underscore which is a shortcut for everything below.

  /*    var matchedTodo;
      todos.forEach(function(todoList) {  //pass in object toodoList in the array todos
          if (todoId === todoList.id){matchedTodo = todoList;}
      });
  */


  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send('Sorry, there is no match for id: ' + req.params.id);
  } //if NO match

  //res.send('Asking for todo with id of ' + req.params.id);
});




//*******************************************************
//*******************************************************
//  POST/todos
//*******************************************************
app.post('/todos', function(req, res) {
  var body = req.body; //get the JSON object inputed
  //use pick to filter only the fields you want from the entry.
  body = _.pick(body, 'description', 'completed');
  // OR can combine> var body = _.pick(req.body, 'description', 'completed');

//call create on db.todo
//respond with 200 and value of todo.  call . to json
//fails then send back res.status(400).json(e)
db.todo.create(body).then(function(todo){
      res.json(todo.toJSON());
      }, function (e) {
         res.status(400).json(e);
      });



});


/*
  // using Underscore to validate imput.  If not a bool OR not a string OR string is just spaces THEN
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send('wrong data');
  }


  //set body.description to be trimmed value.
  body.description = body.description.trim();

  todo = body;
  todo.id = todoNextId;
  todos.push(todo);
  todoNextId = todoNextId + 1;
  // or you can do it this way like he did.
  //  body.id = todoNextId++;  //assigns id THEN incriments
  //  todos.push(body);


  res.json(body);
  //  console.log('description: ' + body.description);
});
*/



//***********************************************************
// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10); //parseInt sets string to integet in base 10. Subtracting zero alos worked as it forced it to be an int.
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  }); //This is underscore which is a shortcut for everything below.

  if (matchedTodo) {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  } //if find id then delete it/
  else {
    res.status(404).send('Sorry, there is no match for id: ' + req.params.id);
  } //if NO match

  //res.send('Asking for todo with id of ' + req.params.id);
});




//************************************************************
//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed'); //Like POST this gets JSON data
  var todoId = parseInt(req.params.id, 10); //parseInt sets string to integet in base 10. Subtracting zero alos worked as it forced it to be an int.
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  }); //This is underscore which is a shortcut for everything below.
  if (!matchedTodo) {
    return res.status(404).send("ID not found!");
  }

  var validAttributes = {};
  // test completed field
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) { //if exists AND is true or false
    validAttributes.completed = body.completed; // assign it to the temporart object variable
  } else if (body.hasOwnProperty('completed')) { // if exists but is NOT boolean then error
    return res.status(400).send('wrong data for completed field!');
  }


  //test description field
  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description.trim(); // assign it to the temporart object variable
  } else if (body.hasOwnProperty('description')) { // if exists but is NOT a string or is spaces.
    return res.status(400).send('wrong data for description field!');
  }

  //here we update it  _.extend({name: 'moe'}, {age: 50});
  _.extend(matchedTodo, validAttributes); //second overrides first
  res.json(matchedTodo);
});
//*********************************************************



//**checks for database named db and creates if not there.
//** then start the server.
db.sequelize.sync().then(function(){
    app.listen(PORT, function() {
      console.log('Express listening on port ' + PORT + '!');
    });






})

//*********************************************************
