function onCreateOrderBtnClick() {
  var ui = SpreadsheetApp.getUi();
  
  var html = HtmlService.createHtmlOutputFromFile('createOrderForm')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(400)
    .setHeight(300);
  ui.showModalDialog(html," ");
}

function onPayMealBtnClick() {
  
}



function buildUi() {
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Dostępne akcje')
    .addItem('Stawiam', 'stawiamOnClick')
    .addItem('Oddaję', 'oddajeOnClick')
    .addSeparator()
        .addSubMenu(
          ui.createMenu('Osoby')
            .addItem('Dodaj', 'dodajOsobyOnClick')
            .addItem('Usuń', 'usunOsobyOnClick'))
        .addSubMenu(
          ui.createMenu('Szablony operacji')
            .addItem('Dodaj', 'dodajSzablonOnClick')
            .addItem('Usuń', 'usunSzablonOnClick'))
    .addToUi(); 
}