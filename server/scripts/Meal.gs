var mealsSheetName = 'Dania';
var meals = [];

function Meal(rowData) {
  this.ref = rowData[0];
  this.name = rowData[1];
  this.description = rowData[2];
  this.orderPlaceRef = rowData[3];
  this.price = rowData[4];
}

Meal.prototype.log = function() {
  var ui = SpreadsheetApp.getUi();
  
  var orderPlace = getLocal(this.orderPlaceRef);
  ui.alert(
    "REF: " + this.ref
    + "\nNazwa: " + this.name 
    + "\nOpis: " + this.description 
    + "\nCena: " + this.price
    + "\nMiejsce zamawiania: " + orderPlace.name + " [" + + orderPlace.ref + "]"
    + "\n - Link: " + orderPlace.link
  );
}

function initMealsData() {
  initLocalsData();
  
  var sheet = document.getSheetByName(mealsSheetName);
  var values = sheet.getDataRange().getValues();
  var length = values.length;
  
  for (var rowIdx = 1; rowIdx < length ; rowIdx += 1) {
    meals.push(new Meal(values[rowIdx]));
  }
  
  if (isMealsLogEnabled) {
    logMeals();
  }
}

function logMeals() {
  meals.forEach(function(meal) {
    meal.log();
  });
}

function isMealExist(mealRef) {
  return (meals[mealRef] !== undefined);
}

function getMeal(mealRef) {
  return meals[mealRef];
}