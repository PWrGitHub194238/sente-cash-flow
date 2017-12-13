var ordersSheetName = 'Zamówienia';
var orders = [];

function Order(rowData) {
  this.ref = rowData[0];
  this.data = rowData[1];
  this.orderByRef = rowData[2];
  this.orderForRef = rowData[3];
  this.mealSetRef = rowData[4];
  this.count = rowData[5];
  this.price = 0;
  this.toGive = 0;
  
  this.calcOrderPrice(this.mealSetRef);
}

Order.prototype.calcOrderPrice = function() {
  var mealSet = getMealSet(this.mealSetRef);

  mealSet.meals.forEach(function(mealRef) {
    var meal = getMeal(mealRef);
    this.price += meal.price * this.count;
  }.bind(this));
  
  this.toGive = this.price;
}

Order.prototype.log = function() {
  var ui = SpreadsheetApp.getUi();
  
  var personThatOrdered = getPerson(this.orderByRef);
  var debtor = getPerson(this.orderForRef);
  var mealSet = getMealSet(this.mealSetRef);
  
  var mealSetLogMsg = "";
  
  mealSet.meals.forEach(function(mealRef) {
    var meal = getMeal(mealRef);
    mealSetLogMsg += "\n - " + meal.name;
  });
  
  ui.alert(
    "REF: " + this.ref
    + "\nData zamówienia: " + this.data 
    + "\nZamówione przez: " + personThatOrdered.getPersonName() + " ["  + personThatOrdered.ref + "]"
    + "\nZamówione dla: " + debtor.getPersonName() + " ["  + debtor.ref + "]"
    + "\nZamówiono: " + mealSet.name + " ["  + mealSet.ref + "]"
    + mealSetLogMsg
    + "\nIle sztuk: " + this.count
    + "\nKoszt: " + this.price
    + "\nJeszcze do oddania: " + this.toGive
  );
}

function initOrdersData() {
  initMealSetsData();
  
  var sheet = document.getSheetByName(ordersSheetName);
  var values = sheet.getDataRange().getValues();
  var length = values.length;
  
  for (var rowIdx = 1; rowIdx < length ; rowIdx += 1) {
    orders.push(new Order(values[rowIdx]));
  }
  
  if (isOrdersLogEnabled) {
    logOrders();
  }
}

function logOrders() {
  orders.forEach(function(order) {
    order.log();
  });
}

function isOrderExist(orderRef) {
  return (orders[orderRef] !== undefined);
}

function getOrder(orderRef) {
  return orders[orderRef];
}