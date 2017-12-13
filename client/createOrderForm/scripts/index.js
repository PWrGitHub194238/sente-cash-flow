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

function addListener(elementId, eventName, eventFunction) {
    document.getElementById(elementId).addEventListener(eventName, eventFunction);
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

    fillPersonSelectMenu(index, personOrder.person.ref);
    fillMealSetSelectMenu(index, personOrder.person.ref);
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