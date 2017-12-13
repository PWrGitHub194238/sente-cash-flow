var myMail = "t.strzalka@sente.pl";

var people = [
  {
    ref: 0, 
    email: "t.strzalka@sente.pl", 
    fname: "Tomasz",
    sname: "Strzałka",
    totalSpend: 0,
    giveTotal: 0,
    foundCountTotal: 0,
    orderCountTotal: 0
  },
  {
    ref: 1, 
    email: "w.iwanow@sente.pl", 
    fname: "Wojciech",
    sname: "Iwanow",
    totalSpend: 0,
    giveTotal: 0,
    foundCountTotal: 0,
    orderCountTotal: 0
  },
  {
    ref: 2, 
    email: "m.wrobel@sente.pl", 
    fname: "Mariusz",
    sname: "Wróbel",
    totalSpend: 0,
    giveTotal: 0,
    foundCountTotal: 0,
    orderCountTotal: 0
  },
  {
    ref: 3, 
    email: "mat.jawulski@sente.pl", 
    fname: "Mateusz",
    sname: "Jawulski",
    totalSpend: 0,
    giveTotal: 0,
    foundCountTotal: 0,
    orderCountTotal: 0
  },
  {
    ref: 4, 
    email: "p.kuriata@sente.pl", 
    fname: "Paweł",
    sname: "Kuriata",
    totalSpend: 0,
    giveTotal: 0,
    foundCountTotal: 0,
    orderCountTotal: 0
  },
  {
    ref: 5, 
    email: "a.topola@sente.pl", 
    fname: "Anna",
    sname: "Topola",
    totalSpend: 0,
    giveTotal: 0,
    foundCountTotal: 0,
    orderCountTotal: 0
  }
];

var teams = [
  {
    ref: 0,
    name: "ZS4",
    memberCount: 2,
    members: [
      0,
      5
    ]
  },
  {
    ref: 1,
    name: "ZS2",
    memberCount: 2,
    members: [
      3,
      4
    ]
  }
];

var locals = [
  {
    ref: 0,
    name: "Grillburger",
    link: "https://www.grillburger.com.pl/"
  },
  {
    ref: 1,
    name: "Inne",
    link: "https://www.inne.pl/"
  }
];

var meals = [
  {
    ref: 0,
    name: "Ćwiartki ziemniaków ze skórką",
    description: "Pyszne ćwiartki",
    orderPlaceRef: 0,
    price: 4.9
  },
  {
    ref: 1,
    name: "Talarki z ziemniaków",
    description: "Talary",
    orderPlaceRef: 0,
    price: 8
  },
  {
    ref: 2,
    name: "Pierogi z kapustą i grzybami [porcja]",
    description: "8 szt. ok. 320g",
    orderPlaceRef: 0,
    price: 10.3
  },
  {
    ref: 3,
    name: "Pierogi z mięsem [porcja]",
    description: "8 szt. ok. 320g",
    orderPlaceRef: 0,
    price: 11.3
  }
];

var mealsets = [
  {
    ref: 0,
    name: "Zestaw ala Tomek",
    orderPlaceRef: 0,
    mealsCount: 2,
    meals: [
      0,
      2
    ]
  },
  {
    ref: 1,
    name: "Zestaw ala Tomek #2",
    orderPlaceRef: 0,
    mealsCount: 2,
    meals: [
      1,
      3
    ]
  }
];

var orders = [
  {
    ref: 0,
    data: "2017-12-06",
    orderByRef: 1,
    orderForRef: 2,
    mealRef: 0,
    count: 3,
    price: 0,
    toGive: 0
  }
];