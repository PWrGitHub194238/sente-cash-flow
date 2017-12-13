var localsSheetName = 'Lokale';
var locals = [];

function Local(rowData) {
  this.ref = rowData[0];
  this.name = rowData[1];
  this.link = rowData[2];
}

Local.prototype.log = function() {
  var ui = SpreadsheetApp.getUi();
  
  ui.alert(
    "REF: " + this.ref
    + "\nNazwa: " + this.name 
    + "\nLink: " + this.link
  );
}

function initLocalsData() {
  var sheet = document.getSheetByName(localsSheetName);
  var values = sheet.getDataRange().getValues();
  var length = values.length;
  
  for (var rowIdx = 1; rowIdx < length ; rowIdx += 1) {
    locals.push(new Local(values[rowIdx]));
  }
  
  if (isLocalsLogEnabled) {
    logLocals();
  }
}

function logLocals() {
  locals.forEach(function(local) {
    local.log();
  });
}

function isLocalExist(localRef) {
  return (locals[localRef] !== undefined);
}

function getLocal(localRef) {
  return locals[localRef];
}