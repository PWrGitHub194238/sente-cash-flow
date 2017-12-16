/* Array of objects that keeps tacking all changes in createOrderForm.
   It consists of elements that each represent a single person's order,
   each person might have many meals that he/she wants to order, 
   each with different quantity.

   Example:
   var peopleToOrder = [
    {
        person: { <person> },
        meals: [
            { <meal>, quantity: 0 }
        ]
    }];
*/
var peopleToOrder = [];

/* OnLoad function.
   Initializes all data fir createOrderForm.
*/
function initCreateOrderForm() {
    // Creates starting DOM, sets attributes and classes for DOM elements if necessary.
    initDisplay();
    // Fills all remaining visible dropdowns on page.
    fillSelectMenus();
    // Binds listeners to selected DOM elements.
    addListeners();
}

/* Creates starting DOM.
   It sets attributes and classes for DOM elements if necessary.
*/
function initDisplay() {
    // Set starting visibility for all page elements.
    initVisibility();
}

/* Set starting visibility for all page elements.
*/
function initVisibility() {
    // Hides elements that are related to checkboxes 
    // where their visibility depends on these checkbox's state.
    hideCheckboxConfigs();
}

/* Hides elements that are related to checkboxes.
   If given checkbox has some additional DOM elements
   that should be visible if and only if this checkbox is checked,
   we have to hide them all (by default all checkboxes are disabled).
*/
function hideCheckboxConfigs() {
    // Set visibility for "Who order" checkbox related DOM elements.
    setWhoOrderSelectVisibility(false);
    // Set visibility for "Is team order" checkbox related DOM elements.
    setIsTeamOrderVisibility(false);
    // Set visibility for "Is locale order" checkbox related DOM elements.
    setIsLocaleOrderVisibility(false);
    // Set visibility for "Is from hist order" checkbox related DOM elements.
    setIsFromHistOrderVisibility(false);
}

/* Set visibility for "Who order" checkbox related DOM elements
   that is DIV containing a dropdown that allow to select a peron
   and it's label. Elements that have "hidden" on their class list
   have their "display" attribute set to "none".
*/
function setWhoOrderSelectVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("who-order-select-label").classList.remove("hidden");
        document.getElementById("who-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("who-order-select-label").classList.add("hidden");
        document.getElementById("who-order-select-div").classList.add("hidden");
    }
}

/* Set visibility for "Is team order" checkbox related DOM elements
   that is DIV containing a dropdown that allow to select a team
   and it's label. Elements that have "hidden" on their class list
   have their "display" attribute set to "none".
*/
function setIsTeamOrderVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("is-team-order-select-label-div").classList.remove("hidden");
        document.getElementById("is-team-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("is-team-order-select-label-div").classList.add("hidden");
        document.getElementById("is-team-order-select-div").classList.add("hidden");
    }
}

/* Set visibility for "Is locale order" checkbox related DOM elements
   that is DIV containing a dropdown that allow to select a locale
   and it's label. Elements that have "hidden" on their class list
   have their "display" attribute set to "none".
*/
function setIsLocaleOrderVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("is-locale-order-select-label").classList.remove("hidden");
        document.getElementById("is-locale-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("is-locale-order-select-label").classList.add("hidden");
        document.getElementById("is-locale-order-select-div").classList.add("hidden");
    }
}

/* Set visibility for "Is from hist order" checkbox related DOM elements
   that is DIV containing a dropdown that allow to select an order
   and it's label. Elements that have "hidden" on their class list
   have their "display" attribute set to "none".
*/
function setIsFromHistOrderVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("is-from-hist-order-select-label").classList.remove("hidden");
        document.getElementById("is-from-hist-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("is-from-hist-order-select-label").classList.add("hidden");
        document.getElementById("is-from-hist-order-select-div").classList.add("hidden");
    }
}

/* Fills dropdowns with initial data.

*/
function fillSelectMenus() {
    // Fills "who-order-select" dropdown with data in global "people" array.
    fillPeopleSelectMenu();
    // Sets default person in "who-order-select" dropdown.
    // By default, this person should be the same as one logged into gmail account
    // i.e. it's mail matches.
    setPeopleSelectValue((person) => person.email === myMail);
    // Fills "is-team-order-select" dropdown with data in global "teams" array.
    fillTeamsSelectMenu();
    // Fills "is-locale-order-select" dropdown with data in global "locals" array.
    fillLocalesSelectMenu();
    // Fills "is-from-hist-order-select" dropdown with data in global "orderSets" array.
    fillOrdersSelectMenu();
}

/* Fill dropdown with given id with given array.
   For each element of given array it creates an option which "value" attribute 
   and inner text of <option> element are determinated by given callbacks.
   It appends all generated options to element with given id as children.

   elementId - id for <select> tag to which we want to add new <option> elements,
   array - each element from array will be added as separated <option> for given dropdown,
   keyFunc - callback function that determinates which field from array's item
   should be passed as "value" attribute for <option> tag.
   valueFunc - callback function that determinates which field from array's item
   should be passed as inner text for <option> tag.
*/
function fillSelectMenu(elementId, array, keyFunc, valueFunc) {
    var options = document.createDocumentFragment();
    array.forEach(function (item) {
        var option = document.createElement("option");
        option.value = keyFunc(item);
        option.appendChild(document.createTextNode(valueFunc(item)));
        options.appendChild(option);
    });
    document.getElementById(elementId).appendChild(options);
}

/* Sets an element from given array as selected option for dropdown with given id.
   It loops through given array and apply filterFunction to each of it's element.
   In case filterFunction returns true for given array's element, it's index is
   set as dropdown's selected <option> "value" attribute.

   elementId - id for <select> tag for which we want to mark given <option> as selected,
   optionarray - group of options of given dropdown,
   filterFunction - callback that determinates whith element from given optionarray
   should be marked as selected for given dropdown. In case callback returns "true" for more 
   than one element from optionarray, the first one will be selected.
*/
function setSelectValue(elementId, optionarray, filterFunction) {
    var arrayLength = optionarray.length;
    for (var i = 0; i < arrayLength; i += 1) {
        if (filterFunction(optionarray[i])) {
            document.getElementById(elementId).value = i;
            return;
        }
    }
}

/* Gets a selected value for dropdown element with given id.

*/
function getSelectValue(elementId) {
    return document.getElementById(elementId).value;
}

/* Gets a selected value for "who-order-select" dropdown.

*/
function getPeopleSelectValue() {
    return getSelectValue("who-order-select");
}

/* Gets a selected value for "is-team-order-select" dropdown.

*/
function getTeamsSelectValue() {
    return getSelectValue("is-team-order-select");
}

/* Returns an element from the given array, determinated by filterFunction callback.
   It loops through given array and apply filterFunction to each of it's element.
   In case filterFunction returns true for given array's element, it is returned.
   If there is no element in the given array, null is returned.

   array - an array to be checked for element's existance,
   filterFunction - callback witch determinants what circumstances array's element 
   have to satisfy to be returned.

*/
function getArrayElement(array, filterFunction) {
    var arrayLength = array.length;
    for (var i = 0; i < arrayLength; i += 1) {
        if (filterFunction(array[i])) {
            return array[i];
        }
    }
    return null;
}

/* Fills the "who-order-select" dropdown with data from global "people" array.
  Each <option> for given dropdown will have attribute "value" that corresponds
  to person's REF property and inner text containing both name and surename
  of given person returned from the "people" array.

*/
function fillPeopleSelectMenu() {
    fillSelectMenu("who-order-select", people, 
      function(person) {
        return person.ref;
      }, function(person) {
        return person.fname + " " + person.sname;
      });
}

/* Sets a given element as selected for the "who-order-select" dropdown.
   It loops through global "poeple" array and apply filterFunction for each one.
   First element in a given array passed to filterFunction, 
   couses it to return "true" will be marked as sleected.

   Example:
   setPeopleSelectValue((person) => person.email === myMail);

   filterFunction - callback witch determinants an element from an array 
   which will be marked as selected for given dropdown.

*/
function setPeopleSelectValue(filterFunction) {
    setSelectValue("who-order-select", people, filterFunction);
}

/* Fills the "is-team-order-select" dropdown with data from global "teams" array.
  Each <option> for given dropdown will have attribute "value" that corresponds
  to team's REF property and inner text containing name
  of given team returned from the "teams" array.

*/
function fillTeamsSelectMenu() {
    fillSelectMenu("is-team-order-select", teams, 
    function(team) {
      return team.ref;
    }, function(team) {
      return team.name;
    });
}

/* Fills the "is-locale-order-select" dropdown with data from global "locals" array.
  Each <option> for given dropdown will have attribute "value" that corresponds
  to local's REF property and inner text containing name
  of given local returned from the "locals" array.

*/
function fillLocalesSelectMenu() {
    fillSelectMenu("is-locale-order-select", locals,
    function(local) {
      return local.ref;
    }, function(local) {
      return local.name;
    });
}

/* Fills the "is-from-hist-order-select" dropdown with data from global "orders" array.
  Each <option> for given dropdown will have attribute "value" that corresponds
  to order's REF property and inner text containing name
  of given order returned from the "orders" array.

*/
function fillOrdersSelectMenu() {
    fillSelectMenu("is-from-hist-order-select", orders,
    function(order) {
      return order.ref;
    }, function(order) {
      return order.name;
    });
}

/* Fills dynamically created dropdown that stands for person 
   for which order given by elementRef is generated.
   If personToOrderRef is given, <option> with this value
   will be set as default (if this funtion call is caoused by selecting a team 
   from "is-team-order-select" dropdown, each generated dropdown will have selected 
   each team's member by default).

   elementRef - ID value from an element of "peopleToOrder" array,
   personToOrderRef - REF of a person that will be set as default selected value 
   of newly generqated dropdown.

   see renderOrderContainer().

*/
function fillPersonSelectMenu(elementRef, personToOrderRef) {
    var elementId = "order-header-person-select-" + elementRef;
    fillSelectMenu(elementId, people, 
        function(person) {
            return person.ref;
        }, function(person) {
            return person.fname + " " + person.sname;
        }
    );

    if (personToOrderRef !== undefined) {
        setSelectValue(elementId, people, function(person) {
            return person.ref == personToOrderRef;
        });
    }
}

/* Fills dynamically created dropdown that stands for person's meal set 
   for which order given by elementRef is generated.

   TODO

   elementRef - ID value from an element of "peopleToOrder" array,
   personToOrderRef - TODO

   see renderOrderContainer().

*/
function fillMealSetSelectMenu(elementRef, personToOrderRef) {
    var elementId = "order-header-mealset-select-" + elementRef
    fillSelectMenu(elementId, mealsets,
        function(mealset) {
            return mealset.ref;
        }, function(mealset) {
            return mealset.name;
        }
    );

    if (personToOrderRef !== undefined) {
        setSelectValue(elementId, mealsets, function(mealset) {
            return mealset.ref == 0;
        });
    }
}

/* Adds all listeners to page.

*/
function addListeners() {
    // Runs callback if "checked" attribute of checkbox "who-order-checkbox-id" is changed.
    addWhoOrderSelectOnChangeEvent();

    // Runs callback if "checked" attribute of checkbox "is-team-order-checkbox-id" is changed.
    addIsTeamOrderOnChangeEvent();
    // Runs callback if selected <option> of "is-team-order-select" is changed.
    addTeamOrderSelectOnChangeEvent();

    // Runs callback if "checked" attribute of checkbox "is-locale-order-checkbox-id" is changed.
    addIsLocaleOrderOnChangeEvent();
    
    // Runs callback if "checked" attribute of checkbox "is-from-hist-order-checkbox-id" is changed.
    addIsFromHistOrderOnChangeEvent();
}

/* Add listener which triggers when checkbox "who-order-checkbox-id" is clicked.

   Callback updated visibility for "Who order" checkbox related DOM elements.

*/
function addWhoOrderSelectOnChangeEvent() {
    addListener("who-order-checkbox-id", "change", function() {
        setWhoOrderSelectVisibility(this.checked);
    });
}

/* Add listener which triggers when checkbox "who-order-checkbox-id" is clicked.

   Callback updated visibility for "Is team order" checkbox related DOM elements
   and, if checkbox state is changed from unchecked to checked, fills "peopleToOrder" array 
   with people in selected team and re-render content of "orders-container" div container, 
   based on data in that array.

*/
function addIsTeamOrderOnChangeEvent() {
    addListener("is-team-order-checkbox-id", "change", function() {
        setIsTeamOrderVisibility(this.checked);
        if (this.checked) {
            renderOrderContainer();
        }    
    });
}

/* Add listener which triggers when selected option of dropdown "is-team-order-select changes.

   Callback fills "peopleToOrder" array with people in selected team 
   and re-render content of "orders-container" div container, based on data in that array.

*/
function addTeamOrderSelectOnChangeEvent() {
    addListener("is-team-order-select", "change", function() {
         renderOrderContainer();
    });
}

/* Add listener which triggers when checkbox "is-locale-order-checkbox-id" is clicked.

   Callback updated visibility for "Is locale order" checkbox related DOM elements.

*/
function addIsLocaleOrderOnChangeEvent() {
    addListener("is-locale-order-checkbox-id", "change", function() {
        setIsLocaleOrderVisibility(this.checked);
    });
}

/* Add listener which triggers when checkbox "is-from-hist-order-checkbox-id" is clicked.

   Callback updated visibility for "Is from hist order" checkbox related DOM elements.

*/
function addIsFromHistOrderOnChangeEvent() {
    addListener("is-from-hist-order-checkbox-id", "change", function() {
        setIsFromHistOrderVisibility(this.checked);
    });
}

/* Add a listener to an element with a given id.

   elementId - a id of an element to which a new event we want to add,
   eventName - valid event name,
   eventFunction - a callback function to be run when theevent triggers.

*/
function addListener(elementId, eventName, eventFunction) {
    document.getElementById(elementId).addEventListener(eventName, eventFunction);
}

/* Fills "orders-container" div container with data.
   Based on selected team in "is-team-order-select" dropdown
   it fills "peopleToOrder" array with people that is assigned to selected team,
   cleans container before adding new nodes and for each element in resulting "peopleToOrder" array
   adds elements defined in "addOrderContainer" function.

*/
function renderOrderContainer() {
    fillPeopleToOrderArray();
    removeChildNodes("orders-container");
    
    var arrayLength = peopleToOrder.length;  

    for (var i = 0; i < arrayLength; i += 1) {
        renderOrder(i, peopleToOrder[i]);
    }
}

/* Recreates "peopleToOrder" array based on selected team.
  It adds every person that is assigned to the selected team in "is-team-order-select" dropdown
  and initialize their meals to order array.

*/
function fillPeopleToOrderArray() {
    var teamRef = getTeamsSelectValue();
    var peopleRefArray = getArrayElement(teams, team => team.ref == teamRef).members;
    peopleToOrder = [];
    peopleRefArray.forEach(function(personRef) {
        peopleToOrder.push({
            person: people[personRef],
            meals: []
        });
    });
}

/* Removes all nested nodes of DOM element with given elementId.

*/
function removeChildNodes(elementId) {
    var parent = document.getElementById(elementId);
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

/* It renders a DOM structure for new order.
   Generated structure allows user to select a person for witch a new order would be created,
   person's predefined order (from global "mealsets" array) or add custom order positions.

   If "personOrder" is defined, dropdowns for person and perosn's mealset are filled 
   with default values (with person matches personOrder.person and a mealset 
   that is most likely to be chosen).

*/
function renderOrder(index, personOrder) {
    var order = document.createDocumentFragment();
    var orderContainerDiv = document.createElement("div");
    var orderHeaderContainerDiv = document.createElement("div");
    var orderHeaderXDiv = document.createElement("div");
    var orderHeaderPersonDiv = document.createElement("div");
    var orderHeaderPersonSelect = document.createElement("select");
    var orderHeaderMealSetDiv = document.createElement("div");
    var orderHeaderMealSetSelect = document.createElement("select");
    var orderHeaderPriceDiv = document.createElement("div");

    var orderPosContainerDiv = document.createElement("div");
    var orderPosXDiv = document.createElement("div");
    var orderPosNameDiv = document.createElement("div");
    var orderPosQuantityDiv = document.createElement("div");
    var orderPosPriceDiv = document.createElement("div");
    

    orderContainerDiv.className = "container subitem create-order order-container";

    orderHeaderContainerDiv.className = "container subsubitem create-order order-header-container";

    orderHeaderXDiv.className = "subsubsubitem create-order order-header-x";
    orderHeaderXDiv.id = "order-header-x-" + index;
    orderHeaderXDiv.appendChild(document.createTextNode("X"));
    orderHeaderContainerDiv.appendChild(orderHeaderXDiv);

    orderHeaderPersonDiv.className = "subsubsubitem create-order order-header-person";
    orderHeaderPersonSelect.id = "order-header-person-select-" + index;
    orderHeaderPersonSelect.name = "order-header-person-select";
    orderHeaderPersonDiv.appendChild(orderHeaderPersonSelect);
    orderHeaderContainerDiv.appendChild(orderHeaderPersonDiv);

    orderHeaderMealSetDiv.className = "subsubsubitem create-order order-header-mealset";
    orderHeaderMealSetSelect.id = "order-header-mealset-select-" + index;
    orderHeaderMealSetSelect.name = "order-header-mealset-select";
    orderHeaderMealSetDiv.appendChild(orderHeaderMealSetSelect);
    orderHeaderContainerDiv.appendChild(orderHeaderMealSetDiv);

    orderHeaderPriceDiv.className = "subsubsubitem create-order order-header-price";
    orderHeaderPriceDiv.id = "order-header-price-" + index;
    orderHeaderPriceDiv.appendChild(document.createTextNode("16,99"));
    orderHeaderContainerDiv.appendChild(orderHeaderPriceDiv);


    orderContainerDiv.appendChild(orderHeaderContainerDiv);


    /*orderPosContainerDiv.className = "container subsubitem create-order order-pos-container";

    orderPosXDiv.className = "subsubsubitem create-order order-pos-x";
    orderPosXDiv.appendChild(document.createTextNode("X pos"));
    orderPosContainerDiv.appendChild(orderPosXDiv);
    orderPosNameDiv.className = "subsubsubitem create-order order-pos-name";
    orderPosNameDiv.appendChild(document.createTextNode("pos name"));
    orderPosContainerDiv.appendChild(orderPosNameDiv);
    orderPosQuantityDiv.className = "subsubsubitem create-order order-pos-quantity";
    orderPosQuantityDiv.appendChild(document.createTextNode("pos quantity"));
    orderPosContainerDiv.appendChild(orderPosQuantityDiv);
    orderPosPriceDiv.className = "subsubsubitem create-order order-pos-price";
    orderPosPriceDiv.appendChild(document.createTextNode("pos price"));
    orderPosContainerDiv.appendChild(orderPosPriceDiv);

    orderContainerDiv.appendChild(orderPosContainerDiv);
*/
    order.appendChild(orderContainerDiv);

    document.getElementById("orders-container").appendChild(order);

    if (personOrder !== undefined) {
        fillPersonSelectMenu(index, personOrder.person.ref);
        fillMealSetSelectMenu(index, personOrder.person.ref);
    }
}