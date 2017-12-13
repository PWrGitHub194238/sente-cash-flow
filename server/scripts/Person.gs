var peopleSheetName = 'Osoby';
var people = [];

function Person(rowData) {
  this.ref = rowData[0];
  this.email = rowData[1];
  this.fname = rowData[2];
  this.sname = rowData[3];
  this.totalSpend = rowData[4];
  this.giveTotal = rowData[5];
  this.foundCountTotal = rowData[6];
  this.orderCountTotal = rowData[7];
}

Person.prototype.getPersonName = function() {
 return this.fname + " " + this.sname;
}

Person.prototype.log = function() {
  var ui = SpreadsheetApp.getUi();
  
  ui.alert(
    "REF: " + this.ref
    + "\nE-mail: " + this.email 
    + "\nImię: " + this.fname 
    + "\nNazwisko: " + this.sname
    + "\nWydał w sumie: " + this.totalSpend
    + "\nOddał łącznie: " + this.giveTotal
    + "\nStawiał tyle razy:" + this.foundCountTotal
    + "\nZamawiał tyle razy:" + this.orderCountTotal
  );
}

function initPeopleData() {
  var sheet = document.getSheetByName(peopleSheetName);
  var values = sheet.getDataRange().getValues();
  var length = values.length;
  
  for (var rowIdx = 1; rowIdx < length ; rowIdx += 1) {
    people.push(new Person(values[rowIdx]));
  }
  
  if (isPeopleLogEnabled) {
    logPeople();
  }
}

function logPeople() {
  people.forEach(function(person) {
    person.log();
  });
}

function isPersonExist(personRef) {
  return (people[personRef] !== undefined);
}

function getPerson(personRef) {
  return people[personRef];
}