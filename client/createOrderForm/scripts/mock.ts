var myMail : string = "t.strzalka@sente.pl";

interface Person {
  ref: number, 
  email: string, 
  fname: string, 
  sname: string, 
  totalSpend: number, 
  giveTotal: number, 
  foundCountTotal: number, 
  orderCountTotal: number
}

var people : Person[] = [
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

interface Team {
  ref: number,
  name: string,
  memberCount: number,
  members: number[]
}

var teams : Team[] = [
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

interface Locale {
  ref: number,
  name: string,
  link: string
}

var locals : Locale[] = [
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

interface Meal {
  ref: number,
  name: string,
  description: string,
  orderPlaceRef: number,
  price: number
}

var meals: Meal[] = [
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

interface MealSet {
  ref: number,
  name: string,
  orderPlaceRef: number,
  mealsCount: number,
  meals: number[]
}

var mealsets: MealSet[] = [
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

interface Order {
  ref: number,
  data: string,
  orderByRef: number,
  orderForRef: number,
  mealRef: number,
  count: number,
  price: number,
  toGive: number
}

var orders : Order[] = [
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