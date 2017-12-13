var teamsSheetName = 'Zespoły';
var teams = [];

function Team(rowData) {
  this.ref = rowData[0];
  this.name = rowData[1];
  this.memberCount = 0;
  this.members = [];
  
  this.addMembers(rowData);
}

Team.prototype.log = function() {
  var ui = SpreadsheetApp.getUi();
  
  var logMsg = "REF: " + this.ref
    + "\nNazwa zespołu: " + this.name 
    + "\nLiczba członków zespołu: " + this.memberCount;
  
  this.members.forEach(function(personRef) {
    var person = getPerson(personRef);
    logMsg += "\n - " + person.getPersonName();
  });
  
  ui.alert(logMsg);
}

Team.prototype.addMember = function(perosnRef) {
  var ui = SpreadsheetApp.getUi();
  
  if (isPersonExist(perosnRef)) {
    this.members.push(perosnRef);  
    this.memberCount += 1;
  } else {
    ui.alert("Nie udało się dodać do zespołu" + this.name 
             + "osoby, której REF to " + perosnRef 
             + ". Dana osoba nie istnieje.");
  }
}

Team.prototype.addMembers = function(rowData) {
  var length = rowData.length;
  for (var colIdx = 2; colIdx < length; colIdx += 1) {
    var personRef = rowData[colIdx];
    if (personRef != "") {
      this.addMember(personRef);      
    }
  }
}

function initTeamsData() {
  initPeopleData();
  
  var sheet = document.getSheetByName(teamsSheetName);
  var values = sheet.getDataRange().getValues();
  var length = values.length;
  
  for (var rowIdx = 1; rowIdx < length ; rowIdx += 1) {
    teams.push(new Team(values[rowIdx]));
  }
  
  if (isTeamsLogEnabled) {
    logTeams();
  }
}

function logTeams() {
  teams.forEach(function(team) {
    team.log();
  });
}

function isTeamExist(teamRef) {
  return (teams[teamRef] !== undefined);
}

function getTeam(teamRef) {
  return teams[teamRef];
}