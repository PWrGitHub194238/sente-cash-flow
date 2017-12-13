// Referencja do obecnie otwatego dokumentu
var document = SpreadsheetApp.getActiveSpreadsheet();

var isPeopleLogEnabled = false;
var isMealsLogEnabled = false;
var isTeamsLogEnabled = false;
var isLocalsLogEnabled = false;
var isOrdersLogEnabled = true
var isMealSetsLogEnabled = false;

///////////////////////////        MENU        ///////////////////////////////

function myFunction1() {
 MailApp.sendEmail("t.strzalka@sente.pl",
                   "t.strzalka@sente.pl",
                   "TPS report status",
                   "What is the status of those TPS reports?");
}


/* Tworzy menu do uzupełniania formularza:
*  - Dostępne akcje
*   - Stawiam - umożliwia stworzenie nowej zależności
*/
function onOpen() {
  initTeamsData();
  initOrdersData();
}
