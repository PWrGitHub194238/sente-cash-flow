'use strict';

var peopleToOrder = [];

function initCreateOrderForm() {
    initDisplay();
    fillSelectMenus();
    addListeners();
}

function initDisplay() {
    Visibility();
}

function Visibility() {
    hideCheckboxConfigs();
}

function hideCheckboxConfigs() {
    setWhoOrderSelectVisibility(false);
    setIsTeamOrderVisibility(false);
    setIsLocaleOrderVisibility(false);
    setIsFromHistOrderVisibility(false);
}

function setWhoOrderSelectVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("who-order-select-label").classList.remove("hidden");
        document.getElementById("who-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("who-order-select-label").classList.add("hidden");
        document.getElementById("who-order-select-div").classList.add("hidden");
    }
}

function setIsTeamOrderVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("is-team-order-select-label-div").classList.remove("hidden");
        document.getElementById("is-team-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("is-team-order-select-label-div").classList.add("hidden");
        document.getElementById("is-team-order-select-div").classList.add("hidden");
    }
}

function setIsLocaleOrderVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("is-locale-order-select-label").classList.remove("hidden");
        document.getElementById("is-locale-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("is-locale-order-select-label").classList.add("hidden");
        document.getElementById("is-locale-order-select-div").classList.add("hidden");
    }
}

function setIsFromHistOrderVisibility(isVisible) {
    if (isVisible) {
        document.getElementById("is-from-hist-order-select-label").classList.remove("hidden");
        document.getElementById("is-from-hist-order-select-div").classList.remove("hidden");
    } else {
        document.getElementById("is-from-hist-order-select-label").classList.add("hidden");
        document.getElementById("is-from-hist-order-select-div").classList.add("hidden");
    }
}

function fillSelectMenus() {
    fillPeopleSelectMenu();
    setPeopleSelectValue((person) => person.email === myMail);

    fillTeamsSelectMenu();
    fillLocalesSelectMenu();
    fillOrdersSelectMenu();
}

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

function setSelectValue(elementId, array, filterFunction) {
    var arrayLength = array.length;
    for (var i = 0; i < arrayLength; i += 1) {
        if (filterFunction(array[i])) {
            document.getElementById(elementId).value = i;
            return;
        }
    }
}

function getSelectValue(elementId) {
    return document.getElementById(elementId).value;
}

function getPeopleSelectValue() {
    return getSelectValue("who-order-select");
}

function getTeamsSelectValue() {
    return getSelectValue("is-team-order-select");
}

function getArrayElement(array, filterFunction) {
    var arrayLength = array.length;
    for (var i = 0; i < arrayLength; i += 1) {
        if (filterFunction(array[i])) {
            return array[i];
        }
    }
    return null;
}

function fillPeopleSelectMenu() {
    fillSelectMenu("who-order-select", people, 
      function(person) {
        return person.ref;
      }, function(person) {
        return person.fname + " " + person.sname;
      });
}

function setPeopleSelectValue(filterFunction) {
    setSelectValue("who-order-select", people, filterFunction);
}

function fillTeamsSelectMenu() {
    fillSelectMenu("is-team-order-select", teams, 
    function(team) {
      return team.ref;
    }, function(team) {
      return team.name;
    });
}

function fillLocalesSelectMenu() {
    fillSelectMenu("is-locale-order-select", locals,
    function(local) {
      return local.ref;
    }, function(local) {
      return local.name;
    });
}

function fillOrdersSelectMenu() {
    fillSelectMenu("is-from-hist-order-select", orders,
    function(order) {
      return order.ref;
    }, function(order) {
      return order.name;
    });
}

function fillPersonSelectMenu(elementRef, personToOrderRef) {
    var elementId = "order-header-person-select-" + elementRef;
    fillSelectMenu(elementId, people, 
      function(person) {
        return person.ref;
      }, function(person) {
        return person.fname + " " + person.sname;
      });
      setSelectValue(elementId, people, function(person) {
        return person.ref == personToOrderRef;
      });
}

function fillMealSetSelectMenu(elementRef, personToOrderRef) {
    var elementId = "order-header-mealset-select-" + elementRef
    fillSelectMenu(elementId, mealsets,
    function(mealset) {
      return mealset.ref;
    }, function(mealset) {
      return mealset.name;
    });
    setSelectValue(elementId, mealsets, function(mealset) {
        return mealset.ref == 0;
    });
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
function fillMealSelectMenu(personOrderRef, personOrderPosRef, personOrdPos) {
    var elementId =  "order-pos-name-select-" + personOrderRef + "-" + personOrderPosRef;
    var personOrdPosMealRef = personOrdPos.meal.ref;
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

function addListeners() {
    addWhoOrderSelectOnChangeEvent();

    addIsTeamOrderOnChangeEvent();
    addTeamOrderSelectOnChangeEvent();

    addIsLocaleOrderOnChangeEvent();
    addIsFromHistOrderOnChangeEvent();
}

function addWhoOrderSelectOnChangeEvent() {
    addListener("who-order-checkbox-id", "change", function() {
        setWhoOrderSelectVisibility(this.checked);
    });
}

function addIsTeamOrderOnChangeEvent() {
    addListener("is-team-order-checkbox-id", "change", function() {
        setIsTeamOrderVisibility(this.checked);
        fillPeopleToOrderArray(this.checked);
        renderOrderContainer();
    });
}

function addTeamOrderSelectOnChangeEvent() {
    addListener("is-team-order-select", "change", function() {
         fillPeopleToOrderArray(true);
         renderOrderContainer();
    });
}

function fillPeopleToOrderArray(isCheckboxSelected) {
    peopleToOrder = []; 
    if (isCheckboxSelected) {
        var teamRef = getTeamsSelectValue();
        var peopleRefArray = getArrayElement(teams, team => team.ref == teamRef).members;
        peopleRefArray.forEach(function(personRef) {
            peopleToOrder.push({
                person: people[personRef],
                meals: []
            });
        });
    }
}

/* For a given order for a selected person fills person's "meal" array with meals 
   from selected mealset for that person.
   Firsly it gets a meals array for selected person which wants 
   to order (order item number is "orderIndex"). Next we get array of meal REFs from mealset 
   that correspond to given order item (and selected person) and based on it,
   we fill "peopleToOrder" array's ""meals" element with meal's objects.

*/
function fillPeopleToOrderMealArray(orderIndex) {   
    var personMeals = peopleToOrder[orderIndex].meals;
    // Get index of a mealset element in "mealsets" global array, 
    // where index is selected by the user for given person's order.
    // Get array of meal's REFs from that.
    var selectedMealSet = mealsets[getSelectValue("order-header-mealset-select-" + orderIndex)].meals;   
    var arrayLength = selectedMealSet.length;

    // We must keep reference to original array.
    personMeals.length = 0;

    for (var i = 0; i < arrayLength; i += 1) {
        personMeals.push({
            meal: meals[selectedMealSet[i]],
            quantity: 1
        });
    }

}

function addIsLocaleOrderOnChangeEvent() {
    addListener("is-locale-order-checkbox-id", "change", function() {
        setIsLocaleOrderVisibility(this.checked);
    });
}

function addIsFromHistOrderOnChangeEvent() {
    addListener("is-from-hist-order-checkbox-id", "change", function() {
        setIsFromHistOrderVisibility(this.checked);
    });
}

function addListener(elementId, eventName, eventFunction, parent) {
    if (typeof parent == "undefined") {
        document.getElementById(elementId).addEventListener(eventName, eventFunction);
    } else {
        parent.querySelector("#" + elementId).addEventListener(eventName, eventFunction);
    }
}

function renderOrderContainer() {
    var arrayLength = peopleToOrder.length;

    removeChildNodes("orders-container");

    for (var i = 0; i < arrayLength; i += 1) {
        addOrderContainer(i, peopleToOrder[i]);
    }
}

function removeChildNodes(elementId) {
    var parent = document.getElementById(elementId);
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

function addOrderContainer(index, personOrder) {
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

    orderContainerDiv.className = "container subitem create-order order-container";

    orderHeaderContainerDiv.className = "container subsubitem create-order order-header-container";

    orderHeaderXDiv.className = "subsubsubitem create-order order-header-x";
    orderHeaderXDiv.dataset.index = index;
    
    orderHeaderXDiv.id = "order-header-x-" + index;
    orderHeaderXDiv.appendChild(document.createTextNode("X"));
    orderHeaderContainerDiv.appendChild(orderHeaderXDiv);

    orderHeaderPersonDiv.className = "subsubsubitem create-order order-header-person";
    orderHeaderPersonSelect.dataset.index = index;
    orderHeaderPersonSelect.id = "order-header-person-select-" + index;
    orderHeaderPersonSelect.name = "order-header-person-select";
    orderHeaderPersonDiv.appendChild(orderHeaderPersonSelect);
    orderHeaderContainerDiv.appendChild(orderHeaderPersonDiv);

    orderHeaderMealSetDiv.className = "subsubsubitem create-order order-header-mealset";
    orderHeaderMealSetSelect.dataset.index = index;
    orderHeaderMealSetSelect.id = "order-header-mealset-select-" + index;
    orderHeaderMealSetSelect.name = "order-header-mealset-select";
    orderHeaderMealSetDiv.appendChild(orderHeaderMealSetSelect);
    orderHeaderContainerDiv.appendChild(orderHeaderMealSetDiv);

    orderHeaderPriceDiv.className = "subsubsubitem create-order order-header-price";
    orderHeaderXDiv.dataset.index = index;
    orderHeaderPriceDiv.id = "order-header-price-" + index;
    orderHeaderPriceDiv.appendChild(document.createTextNode("16,99"));
    orderHeaderContainerDiv.appendChild(orderHeaderPriceDiv);

    orderContainerDiv.appendChild(orderHeaderContainerDiv);

    orderPosContainerDiv.className = "container subsubitem create-order order-pos-container";
    orderHeaderXDiv.dataset.index = index;
    orderPosContainerDiv.id = "order-pos-container-" + index;

    orderContainerDiv.appendChild(orderPosContainerDiv);

    order.appendChild(orderContainerDiv);
    document.getElementById("orders-container").appendChild(order);

    // After a person for this order item has been changed,
    // refill it's mealset dropdown and fire event upon this dropdown's change.
    addListener(orderHeaderPersonSelect.id, "change", function(e) {
        fillMealSetSelectMenu(index, personOrder.person.ref);
        orderHeaderMealSetSelect.dispatchEvent(new Event('change'));
    });

    // After a mealset for a person's order item has been changed,
    // refill "meals" array of ""peopleToOrder" global array for that order item
    // and rerender order item's positions with meals.
    addListener(orderHeaderMealSetSelect.id, "change", function(e) {
        fillPeopleToOrderMealArray(e.target.dataset.index);
        renderOrderPosContainer(e.target.dataset.index);
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
function renderOrderPosContainer(orderIndex) {
    var personMeals = peopleToOrder[orderIndex].meals;
    var arrayLength = personMeals.length;

    removeChildNodes("order-pos-container-" + orderIndex);

    for (var i = 0; i < arrayLength; i += 1) {
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
function renderOrderPosItem(orderIndex, orderPosIndex, orderPosMeal) {
    // Is the container for multiple "orderPosDiv" containers
    let orderPosContainerDiv = document.getElementById("order-pos-container-" + orderIndex);

    // Is the container for all elements of a single order item's position.
    let orderPosDiv = document.createElement("div");

    // Container for elements that alows a usr to delete/create new position to order's item
    let orderPosXDiv = renderOrderPosXDiv(orderIndex, orderPosIndex);
    // Container for dropdown with meals.
    let { 
        divBlock: orderPosNameDiv, 
        inner: orderPosNameSelect 
    } = renderOrderPosNameDiv(orderIndex, orderPosIndex);

    // Container for input that defines selected meal's quantity.
    let { 
        divBlock: orderPosQuantityDiv, 
        inner: orderPosQuantityInput
    } = renderOrderPosQuantityDiv(orderIndex, orderPosIndex);

    // Container for label that shows the total price of created position.
    let { 
        divBlock: orderPosPriceDiv,
        inner: orderPosPriceSpan 
    } = renderOrderPosPriceDiv(orderIndex, orderPosIndex);
    
    document.createElement("div");
    
    orderPosDiv.className = "container subsubsubitem create-order order-pos-item-container";

    orderPosDiv.appendChild(orderPosXDiv);
    orderPosDiv.appendChild(orderPosNameDiv);
    orderPosDiv.appendChild(orderPosQuantityDiv);
    orderPosDiv.appendChild(orderPosPriceDiv);

    orderPosContainerDiv.appendChild(orderPosDiv);

    // If user changes a selected meal for order item's position
    // reset it's quantity to default value and trigger it's onChange event.
    addListener(orderPosNameSelect.id, "change", function() {
        orderPosQuantityInput.value = 1;
        orderPosQuantityInput.dispatchEvent(new Event('change'));
    });

    addListener(orderPosQuantityInput.id, "change", function() {
        orderPosPriceSpan.innerText = (orderPosQuantityInput.value 
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
function renderOrderPosXDiv(orderIndex, orderPosIndex) {
    var div = document.createElement("div");
    div.className = "subsubsubitem create-order order-pos-x";
    div.dataset.index = orderIndex;
    div.dataset.subindex = orderPosIndex;
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
function renderOrderPosNameDiv(orderIndex, orderPosIndex) {
    let div = document.createElement("div");
    let select = document.createElement("select");
    
    div.className = "subsubsubitem create-order order-pos-name";
    select.dataset.index = orderIndex;
    select.dataset.subindex = orderPosIndex;
    select.id = "order-pos-name-select-" + orderIndex + "-" + orderPosIndex;
    select.name = "order-pos-name-select";
    div.appendChild(select);  

    return { divBlock: div, inner: select }; 
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
function renderOrderPosQuantityDiv(orderIndex, orderPosIndex) {       
    let div = document.createElement("div");
    let input = document.createElement("input");

    div.className = "subsubsubitem create-order order-pos-quantity";
    input.dataset.index = orderIndex;
    input.dataset.subindex = orderPosIndex;
    input.id = "order-pos-quantity-input-" + orderIndex + "-" + orderPosIndex;
    input.name = "order-pos-quantity-input";
    input.type = "number";
    input.min = 1;
    input.value = 1;
    div.appendChild(input);

    return { divBlock: div, inner: input }; 
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
function renderOrderPosPriceDiv(orderIndex, orderPosIndex) {
    let div = document.createElement("div");
    let span = document.createElement("span");

    div.className = "subsubsubitem create-order order-pos-price";
    span.dataset.index = orderIndex;
    span.dataset.subindex = orderPosIndex;
    span.id = "order-pos-price-span" + orderIndex + "-" + orderPosIndex;
    div.appendChild(span);

    return { divBlock: div, inner: span };
}

/*<div class="container subitem create-order order-container">
        <div class="container subsubitem create-order order-header-container">
          <div class="subsubsubitem create-order order-header-x">
            x
          </div>
          <div class="subsubsubitem create-order order-header-person">
            <select name="order-header-person-select">
              <option value="0">Ja</option>
            </select>
          </div>
          <div class="subsubsubitem create-order order-header-mealset">
            <select name="order-header-mealset-select">
              <option value="0">Ja</option>
            </select>
          </div>
          <div class="subsubsubitem create-order order-header-price">
            <span class="order-header-price-span">
              16,99
            </span>
          </div>
        </div>
        <div class="container subsubitem create-order order-pos-container">
          <div class="subsubsubitem create-order order-pos-x">
            x pos
          </div>
          <div class="subsubsubitem create-order order-pos-name">
            pos name
          </div>
          <div class="subsubsubitem create-order order-pos-quantity">
            pos quantity
          </div>
          <div class="subsubsubitem create-order order-pos-price">
            pos price
          </div>
        </div>
      </div>*/