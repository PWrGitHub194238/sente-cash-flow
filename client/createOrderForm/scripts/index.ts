'use strict';

/* Array of objects that keeps tacking all changes in createOrderForm.
   It consists of elements that each represent a single person's order,
   each person might have many meals that he/she wants to order, 
   each with different quantity.

   Example:
   let peopleToOrder = [
    {
        person: { <person> },
        meals: [
            { <meal>, quantity: 0 }
        ]
    }];
*/
interface PersonOrder {
    person: Person,
    meals: PersonOrderMeal[]
}

interface PersonOrderMeal {
    meal: Meal,
    quantity: number
}

let peopleToOrder: PersonOrder[] = [];

/* OnLoad function.
   Initializes all data fir createOrderForm.
*/
function initCreateOrderForm(): void {
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
function initDisplay(): void {
    // Set starting visibility for all page elements.
    initVisibility();
}

/* Set starting visibility for all page elements.
*/
function initVisibility(): void {
    // Hides elements that are related to checkboxes 
    // where their visibility depends on these checkbox's state.
    hideCheckboxConfigs();
}

/* Hides elements that are related to checkboxes.
   If given checkbox has some additional DOM elements
   that should be visible if and only if this checkbox is checked,
   we have to hide them all (by default all checkboxes are disabled).
*/
function hideCheckboxConfigs(): void {
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
function setWhoOrderSelectVisibility(isVisible: boolean): void {
    let div: HTMLDivElement = <HTMLDivElement>document.getElementById("who-order-select-div");
    let divOfLabel: HTMLDivElement = <HTMLDivElement>document.getElementById("who-order-select-label-div");
    if (isVisible) {
        div.classList.remove("hidden");
        divOfLabel.classList.remove("hidden");
    } else {
        div.classList.add("hidden");
        divOfLabel.classList.add("hidden");
    }
}

/* Set visibility for "Is team order" checkbox related DOM elements
   that is DIV containing a dropdown that allow to select a team
   and it's label. Elements that have "hidden" on their class list
   have their "display" attribute set to "none".
*/
function setIsTeamOrderVisibility(isVisible: boolean): void {
    let div: HTMLDivElement = <HTMLDivElement>document.getElementById("is-team-order-select-div");
    let divOfLabel: HTMLDivElement = <HTMLDivElement>document.getElementById("is-team-order-select-label-div");
    if (isVisible) {
        div.classList.remove("hidden");
        divOfLabel.classList.remove("hidden");
    } else {
        div.classList.add("hidden");
        divOfLabel.classList.add("hidden");
    }
}

/* Set visibility for "Is locale order" checkbox related DOM elements
   that is DIV containing a dropdown that allow to select a locale
   and it's label. Elements that have "hidden" on their class list
   have their "display" attribute set to "none".
*/
function setIsLocaleOrderVisibility(isVisible: boolean): void {
    let div: HTMLDivElement = <HTMLDivElement>document.getElementById("is-locale-order-select-div");
    let divOfLabel: HTMLDivElement = <HTMLDivElement>document.getElementById("is-locale-order-select-label-div");
    if (isVisible) {
        div.classList.remove("hidden");
        divOfLabel.classList.remove("hidden");
    } else {
        div.classList.add("hidden");
        divOfLabel.classList.add("hidden");
    }
}

/* Set visibility for "Is from hist order" checkbox related DOM elements
   that is DIV containing a dropdown that allow to select an order
   and it's label. Elements that have "hidden" on their class list
   have their "display" attribute set to "none".
*/
function setIsFromHistOrderVisibility(isVisible: boolean): void {
    let div: HTMLDivElement = <HTMLDivElement>document.getElementById("is-from-hist-order-select-div");
    let divOfLabel: HTMLDivElement = <HTMLDivElement>document.getElementById("is-from-hist-order-select-label-div");
    if (isVisible) {
        div.classList.remove("hidden");
        divOfLabel.classList.remove("hidden");
    } else {
        div.classList.add("hidden");
        divOfLabel.classList.add("hidden");
    }
}

/* Fills dropdowns with initial data.

*/
function fillSelectMenus(): void {
    // Fills "who-order-select" dropdown with data in global "people" array.
    fillPeopleSelectMenu();
    // Sets default person in "who-order-select" dropdown.
    // By default, this person should be the same as one logged into gmail account
    // i.e. it's mail matches.
    setPeopleSelectValue((person: Person) => person.email === myMail);
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
function fillSelectMenu(elementId: string, array: any[], 
    keyFunc: (any) => string, valueFunc: (any) => string): void {
    let options: DocumentFragment = document.createDocumentFragment();
    array.forEach(function(item: any) {
        let option: HTMLOptionElement = document.createElement("option");
        option.value = keyFunc(item);
        option.appendChild(document.createTextNode(valueFunc(item)));
        options.appendChild(option);
    });
    (<HTMLSelectElement>document.getElementById(elementId)).appendChild(options);
}

/* Sets an element from given array as selected option for dropdown with given id.
   It loops through given array and apply filterFunction to each of it's element.
   In case filterFunction returns true for given array's element, it's index is
   set as dropdown's selected <option> "value" attribute.

   elementId - id for <select> tag for which we want to mark given <option> as selected,
   optionArray - group of options of given dropdown,
   filterFunction - callback that determinates whith element from given optionArray
   should be marked as selected for given dropdown. In case callback returns "true" for more 
   than one element from optionArray, the first one will be selected.
*/
function setSelectValue(elementId: string, optionArray: any[], 
    filterFunction: (any) => boolean): void {
    let arrayLength: number = optionArray.length;
    for (let i = 0; i < arrayLength; i += 1) {
        if (filterFunction(optionArray[i])) {
            let selectElement : HTMLSelectElement = <HTMLSelectElement>document.getElementById(elementId);
            selectElement.value = i.toString();
            return;
        }
    }
}

/* Gets a selected value for dropdown element with given id.

*/
function getSelectValue(elementId: string): string {
    let selectElement : HTMLSelectElement = <HTMLSelectElement>document.getElementById(elementId);
    return selectElement.value;
}

/* Gets a selected value for "who-order-select" dropdown.

*/
function getPeopleSelectValue(): string {
    return getSelectValue("who-order-select");
}

/* Gets a selected value for "is-team-order-select" dropdown.

*/
function getTeamsSelectValue(): string {
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
function getArrayElement(array: any[], filterFunction: (any) => boolean): any {
    let arrayLength: number = array.length;
    for (let i = 0; i < arrayLength; i += 1) {
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
function fillPeopleSelectMenu(): void {
    fillSelectMenu("who-order-select", people, 
        function(person) {
            return person.ref;
        }, function(person) {
            return person.fname + " " + person.sname;
        }
    );
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
function setPeopleSelectValue(filterFunction: (Person) => boolean): void {
    setSelectValue("who-order-select", people, filterFunction);
}

/* Fills the "is-team-order-select" dropdown with data from global "teams" array.
  Each <option> for given dropdown will have attribute "value" that corresponds
  to team's REF property and inner text containing name
  of given team returned from the "teams" array.

*/
function fillTeamsSelectMenu(): void {
    fillSelectMenu("is-team-order-select", teams, 
        function(team) {
            return team.ref;
        }, function(team) {
            return team.name;
        }
    );
}

/* Fills the "is-locale-order-select" dropdown with data from global "locals" array.
  Each <option> for given dropdown will have attribute "value" that corresponds
  to local's REF property and inner text containing name
  of given local returned from the "locals" array.

*/
function fillLocalesSelectMenu(): void {
    fillSelectMenu("is-locale-order-select", locals,
        function(local) {
            return local.ref;
        }, function(local) {
            return local.name;
        }
    );
}

/* Fills the "is-from-hist-order-select" dropdown with data from global "orders" array.
  Each <option> for given dropdown will have attribute "value" that corresponds
  to order's REF property and inner text containing name
  of given order returned from the "orders" array.

*/
function fillOrdersSelectMenu(): void {
    fillSelectMenu("is-from-hist-order-select", orders,
        function(order) {
            return order.ref;
        }, function(order) {
            return order.name;
        }
    );
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
function fillPersonSelectMenu(elementRef: number, personToOrderRef?: number): void {
    let elementId: string = "order-header-person-select-" + elementRef;
    fillSelectMenu(elementId, people, 
        function(person) {
            return person.ref;
        }, function(person) {
            return person.fname + " " + person.sname;
        }
    );

    if (typeof personToOrderRef != "undefined") {
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
function fillMealSetSelectMenu(elementRef: number, personToOrderRef?: number): void {
    let elementId: string = "order-header-mealset-select-" + elementRef
    fillSelectMenu(elementId, mealsets,
        function(mealset) {
            return mealset.ref;
        }, function(mealset) {
            return mealset.name;
        }
    );

    if (typeof personToOrderRef != "undefined") {
        setSelectValue(elementId, mealsets, function(mealset) {
            return mealset.ref == 0;
        });
    }
}

/* Fills dynamically created dropdown that stands for a order position's meal selection 
   for given person.

   personOrderRef - index from an element of "peopleToOrder" array, points to an order's item,
   personOrderPosRef - index from a "meals" property of "peopleToOrder" array's element, 
   of an order's position in selected order's item,
   personOrdPosMealRef - REF of a meal from "meals" property of "peopleToOrder" array's element,

   see renderOrderPosContainer(),
   see renderOrderPosItem().

*/
function fillMealSelectMenu(personOrderRef: number, personOrderPosRef: number, 
    personOrdPos?: PersonOrderMeal): void {
    let elementId: string = "order-pos-name-select-" + personOrderRef + "-" + personOrderPosRef;
    let personOrdPosMealRef: number = personOrdPos.meal.ref;
    fillSelectMenu(elementId, meals,
        function(meal) {
            return meal.ref;
        }, function(meal) {
            return meal.name;
        }
    );

    if (typeof personOrdPos != "undefined") {
        setSelectValue(elementId, meals, function(meal) {
            return meal.ref == personOrdPosMealRef;
        });
    }
}

/* Adds all listeners to page.

*/
function addListeners(): void {
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
function addWhoOrderSelectOnChangeEvent(): void {
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
function addIsTeamOrderOnChangeEvent(): void {
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
function addTeamOrderSelectOnChangeEvent(): void {
    addListener("is-team-order-select", "change", function() {
         renderOrderContainer();
    });
}

/* Add listener which triggers when checkbox "is-locale-order-checkbox-id" is clicked.

   Callback updated visibility for "Is locale order" checkbox related DOM elements.

/* For a given order for a selected person fills person's "meal" array with meals 
   from selected mealset for that person.
   Firsly it gets a meals array for selected person which wants 
   to order (order item number is "orderIndex"). Next we get array of meal REFs from mealset 
   that correspond to given order item (and selected person) and based on it,
   we fill "peopleToOrder" array's ""meals" element with meal's objects.

*/
function fillPeopleToOrderMealArray(orderIndex: number): void { 
    let personMeals: PersonOrderMeal[] = peopleToOrder[orderIndex].meals;

    // Get index of a mealset element in "mealsets" global array, 
    // where index is selected by the user for given person's order.
    // Get array of meal's REFs from that.
    let selectedMealSet: number[] = mealsets[getSelectValue("order-header-mealset-select-" + orderIndex)].meals;   
    let arrayLength: number = selectedMealSet.length;

    // We must keep reference to original array.
    personMeals.length = 0;

    for (let i = 0; i < arrayLength; i += 1) {
        personMeals.push({
            meal: meals[selectedMealSet[i]],
            quantity: 1
        });
    }
}


/* Add listener which triggers when checkbox "is-locale-order-checkbox-id" is clicked.
    Callback updated visibility for "Is locale order" checkbox related DOM elements.

*/
function addIsLocaleOrderOnChangeEvent(): void { 
    addListener("is-locale-order-checkbox-id", "change", function() {
        setIsLocaleOrderVisibility(this.checked);
    });
}

/* Add listener which triggers when checkbox "is-from-hist-order-checkbox-id" is clicked.
   Callback updated visibility for "Is from hist order" checkbox related DOM elements.

*/
function addIsFromHistOrderOnChangeEvent(): void { 
    addListener("is-from-hist-order-checkbox-id", "change", function() {
        setIsFromHistOrderVisibility(this.checked);
    });
}

/* Add a listener to an element with a given id.

   elementId - a id of an element to which a new event we want to add,
   eventName - valid event name,
   eventFunction - a callback function to be run when theevent triggers,
   parent - if defined then element with given id will be searched in this given container.

*/
function addListener(elementId: string, eventName: string, 
    eventFunction: EventListenerOrEventListenerObject, parent?: HTMLElement): void { 
    if (typeof parent == "undefined") {
        document.getElementById(elementId).addEventListener(eventName, eventFunction);
    } else {
        parent.querySelector("#" + elementId).addEventListener(eventName, eventFunction);
    }
}

/* Fills "orders-container" div container with data.
   Based on selected team in "is-team-order-select" dropdown
   it fills "peopleToOrder" array with people that is assigned to selected team,
   cleans container before adding new nodes and for each element in resulting "peopleToOrder" array
   adds elements defined in "addOrderContainer" function.

*/
function renderOrderContainer(): void { 
    fillPeopleToOrderArray();
    removeChildNodes("orders-container");
    
    let arrayLength = peopleToOrder.length;  

    for (let i = 0; i < arrayLength; i += 1) {
        renderOrder(i, peopleToOrder[i]);
    }
}

/* Recreates "peopleToOrder" array based on selected team.
  It adds every person that is assigned to the selected team in "is-team-order-select" dropdown
  and initialize their meals to order array.

*/
function fillPeopleToOrderArray(): void { 
    let teamRef: number = parseInt(getTeamsSelectValue());
    let peopleRefArray: number[] = getArrayElement(teams, team => team.ref == teamRef).members;
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
function removeChildNodes(elementId: string): void { 
    let parent: HTMLElement = document.getElementById(elementId);
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
function renderOrder(index: number, personOrder?: PersonOrder): void {
    let order = document.createDocumentFragment();
    let orderContainerDiv = document.createElement("div");
    let orderHeaderContainerDiv = document.createElement("div");
    let orderHeaderXDiv = document.createElement("div");
    let orderHeaderPersonDiv = document.createElement("div");
    let orderHeaderPersonSelect = document.createElement("select");
    let orderHeaderMealSetDiv = document.createElement("div");
    let orderHeaderMealSetSelect = document.createElement("select");
    let orderHeaderPriceDiv = document.createElement("div");
    
    let orderPosContainerDiv = document.createElement("div");

    orderContainerDiv.className = "container subitem create-order order-container";

    orderHeaderContainerDiv.className = "container subsubitem create-order order-header-container";

    orderHeaderXDiv.className = "subsubsubitem create-order order-header-x";
    orderHeaderXDiv.dataset.index = index.toString();
    
    orderHeaderXDiv.id = "order-header-x-" + index;
    orderHeaderXDiv.appendChild(document.createTextNode("X"));
    orderHeaderContainerDiv.appendChild(orderHeaderXDiv);

    orderHeaderPersonDiv.className = "subsubsubitem create-order order-header-person";
    orderHeaderPersonSelect.dataset.index = index.toString();
    orderHeaderPersonSelect.id = "order-header-person-select-" + index;
    orderHeaderPersonSelect.name = "order-header-person-select";
    orderHeaderPersonDiv.appendChild(orderHeaderPersonSelect);
    orderHeaderContainerDiv.appendChild(orderHeaderPersonDiv);

    orderHeaderMealSetDiv.className = "subsubsubitem create-order order-header-mealset";
    orderHeaderMealSetSelect.dataset.index = index.toString();
    orderHeaderMealSetSelect.id = "order-header-mealset-select-" + index;
    orderHeaderMealSetSelect.name = "order-header-mealset-select";
    orderHeaderMealSetDiv.appendChild(orderHeaderMealSetSelect);
    orderHeaderContainerDiv.appendChild(orderHeaderMealSetDiv);

    orderHeaderPriceDiv.className = "subsubsubitem create-order order-header-price";
    orderHeaderXDiv.dataset.index = index.toString();
    orderHeaderPriceDiv.id = "order-header-price-" + index;
    orderHeaderPriceDiv.appendChild(document.createTextNode("16,99"));
    orderHeaderContainerDiv.appendChild(orderHeaderPriceDiv);

    orderContainerDiv.appendChild(orderHeaderContainerDiv);

    orderPosContainerDiv.className = "container subsubitem create-order order-pos-container";
    orderHeaderXDiv.dataset.index = index.toString();
    orderPosContainerDiv.id = "order-pos-container-" + index;

    orderContainerDiv.appendChild(orderPosContainerDiv);

    order.appendChild(orderContainerDiv);
    (<HTMLDivElement>document.getElementById("orders-container")).appendChild(order);

    // After a person for this order item has been changed,
    // refill it's mealset dropdown and fire event upon this dropdown's change.
    addListener(orderHeaderPersonSelect.id, "change", function() {
        fillMealSetSelectMenu(index, personOrder.person.ref);
        orderHeaderMealSetSelect.dispatchEvent(new Event('change'));
    });

    // After a mealset for a person's order item has been changed,
    // refill "meals" array of ""peopleToOrder" global array for that order item
    // and rerender order item's positions with meals.
    addListener(orderHeaderMealSetSelect.id, "change", function() {
        let mealSetIndex: number = parseInt(orderHeaderMealSetSelect.dataset.index);
        fillPeopleToOrderMealArray(mealSetIndex);
        renderOrderPosContainer(mealSetIndex);
    });

    // If a person for which this order item we are creating is given,
    // fill order item's header dropdowns i.e. person dropdown with default <option>
    // set to given person. After that, onChange event of that dropdown will be triggered, 
    // a mealset dropdown will be filled (also with default <option> for that person)
    // and cascadate events upon mealset dropdown's change will be called.
    if (typeof personOrder != "undefined"){     
        fillPersonSelectMenu(index, personOrder.person.ref);
        orderHeaderPersonSelect.dispatchEvent(new Event('change'));
    }
}

/* Fills "order-pos-container-<index>" div container with data.
    Based on selected mealset in "order-header-mealset-select-<index>" dropdown
    it fills "peopleToOrder" array with people that is assigned to selected team,
    cleans container before adding new nodes and for each element in resulting "peopleToOrder" array
    adds elements defined in "addOrderContainer" function.

    orderIndex - index of a order item.
  
 */
function renderOrderPosContainer(orderIndex: number): void {
    let personMeals: PersonOrderMeal[] = peopleToOrder[orderIndex].meals;
    let arrayLength: number = personMeals.length;

    removeChildNodes("order-pos-container-" + orderIndex);

    for (let i = 0; i < arrayLength; i += 1) {
        renderOrderPosItem(orderIndex, i, personMeals[i]);
    }
}

/* It renders a DOM structure for new order's position for person.
    Generated structure allows user to select a meal that person 
    wants to be ordered for he/her.

    Generated structure is as follows:
    [div#orders-container]
     - [0] // orderIndex
      - [0] // orderPosIndex
      - [1] // orderPosIndex
      - [...] // orderPosIndex
     - [...] // orderIndex
    [div#orders-container]
    If "orderPosMeal" is defined, dropdown for a meal will be filled 
    with default value (with meal that matches orderPosMeal.ref).
    orderIndex - index of a order item,
    orderPosIndex - index of the order item's position,
    orderPosMeal - element of "meals" array for one element from "peopleToOrder" array.
    It represents a meal of index "orderPosIndex" for order with index "orderIndex" 
    that is peopleToOrder[orderIndex].meals[orderPosIndex] element.
*/
function renderOrderPosItem(orderIndex: number, orderPosIndex: number, 
    orderPosMeal?: PersonOrderMeal): void {
    // Is the container for multiple "orderPosDiv" containers
    let orderPosContainerDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("order-pos-container-" + orderIndex);

    // Is the container for all elements of a single order item's position.
    let orderPosDiv = document.createElement("div");
    // Container for elements that alows a usr to delete/create new position to order's item
    let orderPosXDiv = renderOrderPosXDiv(orderIndex, orderPosIndex);

    // Container for dropdown with meals.
    let orderPosNameSelect = renderOrderPosNameDiv(orderIndex, orderPosIndex);
    let orderPosNameDiv: HTMLDivElement = <HTMLDivElement>orderPosNameSelect.parentElement;

    // Container for input that defines selected meal's quantity.
    let orderPosQuantityInput = renderOrderPosQuantityDiv(orderIndex, orderPosIndex);
    let orderPosQuantityDiv: HTMLDivElement = <HTMLDivElement>orderPosQuantityInput.parentElement;

    // Container for label that shows the total price of created position.
    let orderPosPriceSpan = renderOrderPosPriceDiv(orderIndex, orderPosIndex);
    let orderPosPriceDiv: HTMLDivElement = <HTMLDivElement>orderPosPriceSpan.parentElement;
    
    orderPosDiv.className = "container subsubsubitem create-order order-pos-item-container";

    orderPosDiv.appendChild(orderPosXDiv);
    orderPosDiv.appendChild(orderPosNameDiv);
    orderPosDiv.appendChild(orderPosQuantityDiv);
    orderPosDiv.appendChild(orderPosPriceDiv);

    orderPosContainerDiv.appendChild(orderPosDiv);

    // If user changes a selected meal for order item's position
    // reset it's quantity to default value and trigger it's onChange event.
    addListener(orderPosNameSelect.id, "change", function() {
        orderPosQuantityInput.value = "1";
        orderPosQuantityInput.dispatchEvent(new Event('change'));
    });

    addListener(orderPosQuantityInput.id, "change", function() {
        orderPosPriceSpan.innerText = (parseInt(orderPosQuantityInput.value) 
            * meals[getSelectValue(orderPosNameSelect.id)].price).toFixed(2);
    });
    
    // If default meal for dropdown is given
    // then fill this dropdown, set it's default value and trigger an event 
    // for it's update. This will cascadate fire updates of quantity and price fields.
    if (typeof orderPosMeal != "undefined") {
        fillMealSelectMenu(orderIndex, orderPosIndex, orderPosMeal);      
        orderPosNameSelect.dispatchEvent(new Event('change'));
    }
}

/* It renders a DOM structure for new order's position for person
    that allows a user to delete/create new position to order's item

    Generated [order-pos-x] in a given structure:
    [div#orders-container]
     - [0] // orderIndex
      - [0] // orderPosIndex
       - [order-pos-x]
     ...
    [div#orders-container]

    orderIndex - index of a order item,
    orderPosIndex - index of the order item's position.
*/
function renderOrderPosXDiv(orderIndex: number, orderPosIndex: number): HTMLDivElement {
    let div = document.createElement("div");
    div.className = "subsubsubitem create-order order-pos-x";
    div.dataset.index = orderIndex.toString();
    div.dataset.subindex = orderPosIndex.toString();
    div.id = "order-pos-x-" + orderIndex + "-" + orderPosIndex;
    div.appendChild(document.createTextNode("X pos"));

    return div;
}

/* It renders a DOM structure for new order's position for person
    that allows a user to select a meal to order from dropdown with meals.

    Generated [order-pos-name] in a given structure:
    [div#orders-container]
     - [0] // orderIndex
      - [0] // orderPosIndex
       - [order-pos-x]
       - [order-pos-name]
     ...
    [div#orders-container]

    orderIndex - index of a order item,
    orderPosIndex - index of the order item's position.
*/
function renderOrderPosNameDiv(orderIndex: number, orderPosIndex: number): HTMLSelectElement {
    let div = document.createElement("div");
    let select = document.createElement("select");
    
    div.className = "subsubsubitem create-order order-pos-name";
    select.dataset.index = orderIndex.toString();
    select.dataset.subindex = orderPosIndex.toString();
    select.id = "order-pos-name-select-" + orderIndex + "-" + orderPosIndex;
    select.name = "order-pos-name-select";
    div.appendChild(select);  

    return select; 
}

/* It renders a DOM structure for new order's position for person
    that allows a user to select meal's quantity that person wiuld like to order in this position.

    Generated [order-pos-quantity] in a given structure:
    [div#orders-container]
     - [0] // orderIndex
      - [0] // orderPosIndex
       - [order-pos-x]
       - [order-pos-name]
       - [order-pos-quantity]
     ...
    [div#orders-container]

    orderIndex - index of a order item,
    orderPosIndex - index of the order item's position.
*/
function renderOrderPosQuantityDiv(orderIndex: number, orderPosIndex: number): HTMLInputElement {
    let div = document.createElement("div");
    let input = document.createElement("input");

    div.className = "subsubsubitem create-order order-pos-quantity";
    input.dataset.index = orderIndex.toString();
    input.dataset.subindex = orderPosIndex.toString();
    input.id = "order-pos-quantity-input-" + orderIndex + "-" + orderPosIndex;
    input.name = "order-pos-quantity-input";
    input.type = "number";
    input.min = "1";
    input.value = "1";
    div.appendChild(input);

    return input; 
}

/* It renders a DOM structure for new order's position for person
    that displays a total price for given order item's  position.

    Generated [order-pos-price] in a given structure:
    [div#orders-container]
     - [0] // orderIndex
      - [0] // orderPosIndex
       - [order-pos-x]
       - [order-pos-name]
       - [order-pos-quantity]
       - [order-pos-price]
     ...
    [div#orders-container]

    orderIndex - index of a order item,
    orderPosIndex - index of the order item's position.
*/
function renderOrderPosPriceDiv(orderIndex: number, orderPosIndex: number): HTMLSpanElement {
    let div = document.createElement("div");
    let span = document.createElement("span");

    div.className = "subsubsubitem create-order order-pos-price";
    span.dataset.index = orderIndex.toString();
    span.dataset.subindex = orderPosIndex.toString();
    span.id = "order-pos-price-span" + orderIndex + "-" + orderPosIndex;
    div.appendChild(span);

    return span;
}