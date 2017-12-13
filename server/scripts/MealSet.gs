var mealsetsSheetName = 'Zestawy';
var mealsets = [];

function MealSet(rowData) {
  this.ref = rowData[0];
  this.name = rowData[1];
  this.orderPlaceRef = rowData[2];
  this.mealsCount = 0;
  this.meals = [];
  
  this.addMeals(rowData);
}

MealSet.prototype.log = function() {
  var ui = SpreadsheetApp.getUi();
  
  var orderPlace = getLocal(this.orderPlaceRef);
  
  var logMsg = "REF: " + this.ref
    + "\nNazwa zestawu: " + this.name 
    + "\nMiejsce zamawiania: " + orderPlace.name + " [" + + orderPlace.ref + "]"
    + "\nLiczba dań: " + this.mealsCount;
  
  this.meals.forEach(function(mealRef) {
    var meal = getMeal(mealRef);
    logMsg += "\n - " + meal.name;
  });
  
  ui.alert(logMsg);
}

MealSet.prototype.addMeal = function(mealRef) {
  var ui = SpreadsheetApp.getUi();
  
  if (isMealExist(mealRef)) {
    this.meals.push(mealRef);  
    this.mealsCount += 1;
  } else {
    ui.alert("Nie udało się dodać do zestawu" + this.name 
             + "posiłku, którego REF to " + mealRef 
             + ". Dany posiłek nie istnieje.");
  }
}

MealSet.prototype.addMeals = function(rowData) {
  var length = rowData.length;
  for (var colIdx = 3; colIdx < length; colIdx += 1) {
    var mealRef = rowData[colIdx];
    if (mealRef !== "") {
      this.addMeal(mealRef);      
    }
  }
}

function initMealSetsData() {
  initMealsData();
  
  var sheet = document.getSheetByName(mealsetsSheetName);
  var values = sheet.getDataRange().getValues();
  var length = values.length;
  
  for (var rowIdx = 1; rowIdx < length ; rowIdx += 1) {
    mealsets.push(new MealSet(values[rowIdx]));
  }
  
  if (isMealSetsLogEnabled) {
    logMealSets();
  }
}

function logMealSets() {
  mealsets.forEach(function(mealset) {
    mealset.log();
  });
}

function isMealSetExist(mealRef) {
  return (mealsets[mealRef] !== undefined);
}

function getMealSet(mealRef) {
  return mealsets[mealRef];
}