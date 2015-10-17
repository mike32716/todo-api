// variable-playground.js
// pass by reference.  **CONFUSING !!!!!!
// Only works with OBJECTS and ARRAYS.  NOT single values.
// degugger


//*****************************
// OBJECT example
var person = {
	name: 'Mike',
	age: 56
};


function updatePerson(obj) {
	// var obj = {            //This will not modify original
	//     name: 'Mike',
	//     age: 39
	obj.age = 39; // This modifies the original.
}

console.log(person);
updatePerson(person);
console.log(person);


//*************************
// ARRAY expample

var grades = [15, 88];

function addGrade(gradesArr) {
	//gradesArr.push(55);  //this will modigy the original
	gradesArr[12, 33, 99]; //this will not modify as it is a new value.
	debugger;
}


console.log('the original array: ' + grades);
addGrade(grades);
console.log('The NEW array: ' + grades);



//