//SERVER.JS

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;  //if running on Haroku

// A todo is the model = 1 object.  A set of todos is
// called a collection.
var todos =[];
var todoNextId = 1;  //not secure.  Use for counting.

app.use(bodyParser.json());  //access vis request.body


//*****************************************************
app.get('/', function (req, res) {
  res.send('Todo API Root');
})


//******************************************************
// GET /todo
app.get('/todos', function (req, res){
  res.json(todos);   // This will convert array into json
                     // ans send back the api
});


//GET /todos/:id
app.get('/todos/:id',  function (req, res){
    var todoId = parseInt(req.params.id,10);  //parseInt sets string to integet in base 10
                                              //subtracting zero alos worked as it forced it to be an int.
    var matchedTodo;

    todos.forEach(function(todoList) {  //pass in object toodoList in the array todos
        if (todoId === todoList.id){matchedTodo = todoList;}
    });

    if(matchedTodo){res.json(matchedTodo);}

    else {res.status(404).send('Sorry, there is no match for id: ' + req.params.id);
          }   //if NO match

  //res.send('Asking for todo with id of ' + req.params.id);
});

//*******************************************************
//POST /todos

app.post('/todos', function(req, res){
    var body = req.body;  //get the JSON object inputed

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





//*********************************************************
app.listen(PORT, function(){
  console.log('Express listening on port ' + PORT + '!');
});








//
/*  Test DATA
var todos =[
  {
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
},  {
    id: 2,
    description: 'Go to market',
    completed: false
},  {
    id: 3,
    description: 'Clean up the office and GET to work!',
    completed: true
}];

some JSON
{
    "description": "Go to Publix",
    "completed": false
}
*/
