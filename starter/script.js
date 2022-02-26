'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? movements.slice().sort(function (a, b) {
        return a - b;
      })
    : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html1 = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}\u20AC</div>
        </div>
        </div>
       `;
    containerMovements.insertAdjacentHTML('afterbegin', html1);
  });
};

/////******Total in, out and interest ***********/
const calcDisplaySummary = function (acc) {
  const totaldeposits = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (arg, val) {
      return arg + val;
    }, 0);

  document.querySelector(
    '.summary__value--in'
  ).textContent = `${totaldeposits}\u20AC `;

  const totalwithdrawl = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (arg, val) {
      return arg + val;
    }, 0);

  document.querySelector('.summary__value--out').textContent = `${Math.abs(
    totalwithdrawl
  )}\u20AC `;

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (dep) {
      return (dep * acc.interestRate) / 100;
    })
    .filter(function (int, i, arr) {
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    });
  document.querySelector(
    '.summary__value--interest'
  ).textContent = `${interest}\u20AC`;
};

//////*******Display Balance */
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (accu, curr) {
    return accu + curr;
  }, 0);
  labelBalance.textContent = `${acc.balance}\u20AC `;
};

console.log(accounts);
//*****ADd UserNAme to accounts */

const addusername = function (acc) {
  acc.forEach(function (accn) {
    accn.username = accn.owner
      .toLowerCase()
      .split(' ')
      .map(function (val) {
        return val[0];
      })
      .join('');
  });
};

addusername(accounts);

console.log(accounts);
const updateUI = function (acc) {
  //To display transactions
  displayMovements(acc.movements);
  //To display balance
  calcDisplayBalance(acc);
  //To display summary
  calcDisplaySummary(acc);
};
let currentAccount;
document.querySelector('.login__btn').addEventListener('click', function (e) {
  //This button rarr is in form field which submits the function .To prevent default action we used preventdefault for that key
  //Form element in html has a peculiar use even though we are not adding any enter event
  //For form if some one click enter inside any element(User/Pin) it will clicks the event
  e.preventDefault();

  //accounts is array and currentAccount is object
  //We already know array.find will return a value inside that array which satisfies the equation
  currentAccount = accounts.find(function (acc) {
    return acc.username === document.querySelector('.login__input--user').value;
  });
  console.log(currentAccount);
  if (
    currentAccount?.pin ===
    Number(document.querySelector('.login__input--pin').value)
  ) {
    //We can use optional chaining to verify username if it exists we can move to pin ?.
    document.querySelector('.app').style.opacity = 1;
    document.querySelector('.welcome').textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    document.querySelector('.login__input--user').value =
      document.querySelector('.login__input--pin').value = '';
    document.querySelector('.wrongunamepin').style.display = 'none';
    //we know  assignment operator = works from right so both pin and input value will be empty string
    document.querySelector('.login__input--pin').blur();
    document.querySelector('.login__input--user').blur();

    updateUI(currentAccount);
  } else {
    document.querySelector('.app').style.opacity = 0;
    document.querySelector('.login__input--user').value =
      document.querySelector('.login__input--pin').value = '';
    document.querySelector('.login__input--pin').blur();
    document.querySelector('.login__input--user').blur();
    document.querySelector('.welcome').textContent = '';
    document.querySelector('.wrongunamepin').style.display = 'block';
  }
});

document
  .querySelector('.form__btn--transfer')
  .addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(document.querySelector('.form__input--amount').value);
    const receipentACC = accounts.find(function (acc) {
      return document.querySelector('.form__input--to').value === acc.username;
    });
    document.querySelector('.form__input--to').value = '';
    document.querySelector('.form__input--amount').value = '';
    if (
      amount > 0 &&
      receipentACC &&
      currentAccount.balance >= amount &&
      receipentACC?.username !== currentAccount.username
    ) {
      //Doing the transfer
      currentAccount.movements.push(-amount);
      receipentACC.movements.push(amount);
    }
    updateUI(currentAccount);
  });
document
  .querySelector('.form__btn--loan')
  .addEventListener('click', function (e) {
    e.preventDefault();
    // const value = document.querySelector('.form__input--loan-amount').value;
    // const amount = currentAccount.movements.some(function (mov) {
    //   return (
    //     mov > 0.1 * document.querySelector('.form__input--loan-amount').value
    //   );
    // });
    // if (amount && value > 0) {
    //   currentAccount.movements.push(value);
    // }

    // console.log(currentAccount);
    // updateUI(currentAccount);
    // value = '';

    const amount = Number(
      document.querySelector('.form__input--loan-amount').value
    );
    if (
      amount > 0 &&
      currentAccount.movements.some(function (mov) {
        return mov >= amount * 0.1;
      })
    ) {
      currentAccount.movements.push(amount);
    }
    updateUI(currentAccount);
    document.querySelector('.form__input--loan-amount').value = '';
  });

document
  .querySelector('.form__btn--close')
  .addEventListener('click', function (e) {
    e.preventDefault();

    if (
      document.querySelector('.form__input--user').value ===
        currentAccount.username &&
      Number(document.querySelector('.form__input--pin').value) ===
        currentAccount.pin
    ) {
      const index = accounts.findIndex(function (mov) {
        return mov.username === currentAccount.name;
      });

      accounts.splice(index, 1);
      document.querySelector('.form__input--user').value =
        document.querySelector('.form__input--pin').value = '';
      document.querySelector('.app').style.opacity = 0;
      console.log(accounts);
    }
  });
let sorted = false;
document.querySelector('.btn--sort').addEventListener('click', function () {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*******SIMPLE ARRAY METHODS **********/

let arr = ['a', 'b', 'c', 'd', 'e'];

//Same as slice method in string will not mutate the original method
//slice will have two arguments startnumber and end number(End number's thing wont be included)
//diference of two numbers will give length of array
console.log(arr.slice(0, 1));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
//shallowcopy
console.log(arr.slice());
console.log([...arr]);

//SPLICE
//It changes the original array, it effects or mutate
//Splice will be used to remove last element, or to delete something
//In splice 2nd number is delete count
console.log(arr.splice(1, 2));
console.log(arr);
console.log(arr.splice(-1));
console.log(arr);

//reverse
//It  mutates the array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//Concat
//It does not mutate original arrays
//Is to join two arrays
//Here arr and arr2 we are joining
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//Join method
//it wont mutate the orginal array
console.log(arr.join('-'));
console.log(arr);

/*;
const arrstr = '1 2 3 4 5'
console.log(arrex.slice(0,1));
console.log(arrex.splice(1,2));
console.log(arrex);
console.log(arrex.concat(arr));
console.log([...arrex,...arr]);
console.log(arrex.join('>'));
(arrex.push(8));
(arrex.unshift(1));
console.log(arrex);
arrex.shift();
arrex.pop();
console.log(arrex);
console.log(arrstr.split(' '));*/

//at method for arrays

const arrat = [23, 11, 64];
//Usually to retrieve elements
console.log(arrat[0]);
//In es6 a new feauture saying at
console.log(arrat.at(0));

//To get last element
console.log(arrat.slice(-1)[0]);
console.log(arrat[arrat.length - 1]);

//Using at method
console.log(arrat.at(-1));

//At method also works in string
const strsu = 'Sudeesh is a very good boy';
console.log(strsu.at(3));

//For each loop of arrays

const movements1 = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, move] of movements.entries()) {
  if (move > 0) {
    console.log(`Movement${i}: You deposited ${move}`);
  } else {
    console.log(`Movement${i}: You withdrew ${Math.abs(move)}`);
  }
}
//Same by using foreach method
//We already know in for of loop to pass it should be iterables
//For each is method for arrays
console.log(`*****forEach method*****`);
movements1.forEach(function (move, i, arr) {
  if (move > 0) {
    console.log(`Movement${i}: You deposited ${move} ${arr}`);
  } else {
    console.log(`Movement${i}: You withdrew ${Math.abs(move)}`);
  }
});

//Here things to be noted we are using it only for arrays
//And 1st argument of function will be elements of array, 2nd will be the index of array element and 3rd will be all elemetns of array
//And function is call back method it will be executed by foreach hif=gher order function

//FOREACH METHOD for maps and sets

const currencies1 = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
//Forof loop method
for (const [i, v] of [...currencies1.entries()]) {
  console.log(`${i}:${v}`);
}
//For each method for map
//Using for each loop it is bit more easy like arrays it will have 3 iterations
//1)function argument is value 2)function argument is key/property 3)function argument is all values

currencies1.forEach(function (val, key, allval) {
  console.log(`${key}:${val}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (i, _, map) {
  console.log(i);
});
//for of method for sets
for (const [s, e] of currenciesUnique.entries()) {
  console.log(s + 1, e);
}

//In sets there wont be any index or key so no use of it

//Coding challenge -1

const dogsJulia = [9, 16, 6, 8, 3];
const dogsKate = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  //This will give a copied array or duplicate array
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  console.log(dogsJuliaCorrected);
  const dogsSorted = [...dogsJuliaCorrected, ...dogsKate];
  dogsSorted.forEach(function (val, i) {
    if (val >= 3) {
      console.log(`Dog number ${i + 1} is an adult and is ${val} years old `);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });
};
checkDogs(dogsJulia, dogsKate);

//
/**********Map Method Of Data tranformation */
const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];
//We know map method of arrays will return a new Array so we have to store it in a variable
const eurToUsd = 1.1;
// const movementsUSD= movements2.map(function(mov){
//   return mov*eurToUsd
// })
//Using Arrow method
const movementsUSD = movements2.map(mov => mov * eurToUsd);
console.log(movementsUSD);
//In map method a new array is automatically created

let movementsUSDfor = [];
for (const mov of movements2) {
  movementsUSDfor.push(mov * eurToUsd);
}

console.log(movementsUSDfor);
//In for of/For each method a new array has to be created and we push the values

const movementsDescription = movements2.map(function (mov, i) {
  // if(mov>0){
  //   return `Movement ${i+1}: You deposited ${mov}`
  // }else{
  //   return `Movement ${i+1}: You Withdrew ${Math.abs(mov)}`
  // }
  return `Movement ${
    i + 1
  }: You ${mov > 0 ? 'deposited' : 'Withdrew'}${Math.abs(mov)} `;
});

console.log(movementsDescription);

const username = function (user) {
  return user
    .toLowerCase()
    .split(' ')
    .map(function (mov) {
      return mov[0];
    })
    .join('');
};
//Maps will create new array and to modify something in an array or to create a new tab inside an array we should always use foeeach method

console.log(accounts);
//const accounts = [account1, account2, account3, account4];

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);
let depo = [];
for (const dep of movements) {
  if (dep > 0) {
    depo.push(dep);
  }
}
console.log(depo);

//Withdrawls using filter method

const withdrawls = movements.filter(function (val, i) {
  return val < 0;
});
console.log(withdrawls);

///********Reduce Method */

const balance = movements.reduce(function (acc, curr, i, arr) {
  return acc + curr;
}, 0);
//In reduce method we should mention the initial value of accumalator

console.log(balance);
let sum = 0;
for (const sumof of movements) {
  sum = sum + sumof;
}
console.log(sum);

const maximumValue = movements.reduce(function (acc, val) {
  return acc > val ? acc : val;
}, movements[0]);
console.log(maximumValue);

//One thing to be noted is in reduce method the return will be always a accumalater

//Coding Challenge 2

const calcAverageHumanAge = function (ages) {
  const humanage = ages.map(function (val) {
    if (val <= 2) {
      return 2 * val;
    } else if (val > 2) {
      return 16 + val * 4;
    }
  });
  console.log(humanage);
  const adults = humanage.filter(function (val) {
    return val >= 18;
  });
  console.log(adults);

  const filteredHumanageAVg = adults.reduce(function (acc, val, i, arr) {
    return acc + val / arr.length;
  }, 0);

  console.log(filteredHumanageAVg);
};
const avg1 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
const avg2 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

//[36, 32, 76, 48, 28]

const totalDepositsUSD = movements1
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * eurToUsd;
  })
  .reduce(function (acc, val) {
    return acc + val;
  }, 0);

console.log(totalDepositsUSD);
//In arrow function

const totalDepositsUSD1 = movements1
  .filter(mov => mov > 0)
  .map(val => val * eurToUsd)
  .reduce((acc, val) => acc + val, 0);
console.log(totalDepositsUSD1);

//Coding Challenge 3

const calcAverageHumanAge1 = arr =>
  arr
    .map(dat => {
      if (dat <= 2) {
        return dat * 2;
      } else {
        return 16 + dat * 4;
      }
    })
    .filter(adult => adult >= 18)
    .reduce((arg, num, i, arr) => arg + num / arr.length, 0);

const avg3 = calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]);
const avg4 = calcAverageHumanAge1([16, 6, 10, 5, 6, 1, 4]);
console.log(avg3, avg4);

/////******************Find Method ******************/

console.log(movements1);

const findmov = movements1.find(function (mov) {
  return mov < 0;
});
console.log(findmov);

//To find object inside array //
console.log(accounts);
const jdacc = accounts.find(function (acc) {
  return acc.owner === 'Jessica Davis';
});
console.log(jdacc);

for (const jdacc of accounts) {
  if (jdacc.owner === 'Jessica Davis') {
    console.log(jdacc);
  }
}
console.log(accounts);

//*************FInd Index Method ***********/
console.log(movements1);

const index1 = movements1.findIndex(function (mov) {
  return mov < -500;
});
console.log(index1); //answer is 0
//Even though the movements1 array has so many values which are higher than 100 it will return index of first element which satisfies the condition

//*************Some Method ***********/
//Some method is similar to includes, includes checks for that particular value asked where as some method will check each element
const movsome = movements1.some(function (mov) {
  return mov > 0;
});
//Some function will check all elements in array passed
console.log(movsome);

//**********EVERY METHOD ************/
const evr = account4.movements.every(function (mov) {
  return mov > 0;
});
console.log(evr);

/****************Flat Method ****************/
//Flat method flattens the nested array it removes neated and will store it in an array, It wont effect original array

const arrimp = [[1, 2, 3], [4, 5, 6], 7, 8];
const flatarr = arrimp.flat();
console.log(flatarr);

//FOr deep nesting we have to mention he nested removal count, by default it will be 1
const arrnest = [[1, [2, 3]], [[4, 5], 6], 7, 8];
const arrnesrem = arrnest.flat(2);
console.log(arrnesrem);

//Finding out total movements sum in all accounts
//We want all movemets arrays but array is object so we can use map method

const accountMovements = accounts.map(function (acc) {
  return acc.movements;
});
console.log(accountMovements);
//ACcount movements has array of arrays we can use flat method

const allMovements = accountMovements.flat();
console.log(allMovements);
//We can use reduce method to get the sum
const overalBalance = allMovements.reduce(function (acc, mov) {
  return acc + mov;
}, 0);
console.log(overalBalance);

//In one step using chaining method

const overalBalance1 = accounts
  .map(function (acc) {
    return acc.movements;
  })
  .flat()
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
console.log(overalBalance1);

//Flat map method combines flat and map methods

const overalBalance2 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
console.log(overalBalance2);

/*********SORT METHOD **************/

const arrayfriends = ['Sudeesh', 'Ramu', 'Kaka', 'Bharath'];
arrayfriends.sort();
console.log(arrayfriends);
//But for numbers this is not possible directly since it treats numbers as strings

console.log(movements1);

movements1.sort();
console.log(movements1);
//The above wont result in proper sorting we have to use call back function

//Ascending
movements1.sort(function (a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
});

//Instead of above we can use another logic
movements1.sort(function (a, b) {
  return a - b;
});
console.log(movements1);

//Here 1 and 2 are not important what we are saying to javascript is if its a negative value switch the elements if not keep it in there original position

//descending
movements1.sort(function (a, b) {
  if (b > a) {
    return 1;
  }
  if (b < a) {
    return -1;
  }
});
movements1.sort(function (a, b) {
  return b - a;
});
console.log(movements1);
console.log(movements1);

//How to create arrays and filling Arrays
//Previously
const arrraa = [1, 2, 3, 4, 5, 6, 7, 8];
//or
console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8));
//In both above methods we have literally wrote the value in array, We are learning how to generate it

const x = new Array(7);
console.log(x);

const xmap = x.map(function (val) {
  return (val = 5);
}); //It results in an array with 7 empty spaces we cant use any other methods except fill method

//Empty and fill method
// x.fill(3);
// console.log(x);
x.fill(3, 1, 4);
console.log(x);

//We can use fill method to any array not only for empty array

arrraa.fill(2, 2, 3);
console.log(arrraa);
//*************Array.from() function */

//Here Array is function and from( is call back function
const y = Array.from({ length: 7 }, function () {
  return 1;
});
console.log(y);

const z = Array.from({ length: 7 }, function (_, i) {
  return i + 1;
});
//Here val argument/property is never read so to escape from that we can use _
console.log(z);

//Assignment::To generate random number from 1 to 100
const random = Array.from({ length: 100 }, function () {
  return Math.trunc(Math.random() * 100 + 1);
});
//console.log(random);

document
  .querySelector('.balance__value')
  .addEventListener('click', function () {
    const movementsUI = Array.from(
      document.querySelectorAll('.movements__value'),
      function (el) {
        return Number(el.textContent.replace('\u20AC', ''));
      }
    );
    console.log(movementsUI);
  });
console.log(movements1);

//Array methods practice
//1.
const bankDepositSum = accounts
  .map(function (acc) {
    return acc.movements;
  })
  .flat()
  .filter(function (mov) {
    return mov > 0;
  })
  .reduce(function (acc, dep) {
    return acc + dep;
  }, 0);
console.log(bankDepositSum);
//2.
//I want to count how many deposists there have been with atleast 1000 dollars

// const numDeposits1000 = accounts
//   .flatMap(function (acc) {
//     return acc.movements;
//   })
//   .filter(function (mov) {
//     return mov >= 1000;
//   }).length;

//Using reduce method

const numDeposits1000 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (acc, val) {
    return val >= 1000 ? acc + 1 : acc;
  }, 0);
//Here first acc is 0 if value > 1000 evrytime and it will add a single count
console.log(numDeposits1000);

// //++ operator
let a = 10;
console.log(a++); //Here it will be 10
console.log(a); //Here it will be 11
// //Because it will increse value but ++ operator will always result in same value
// //To overcome this we shud use ++a

//exercise 3
//To create an object which should have sum of deposits and sum of withdrawls

const { deposits10, withdrawls10 } = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(
    function (acc, val) {
      val > 0 ? (acc.deposits10 += val) : (acc.withdrawls10 += val);
      return acc;
    },
    { deposits10: 0, withdrawls10: 0 }
  );
console.log(deposits10, withdrawls10);

//4.
//Here you are asked to create a function which will title case
//Means there are few words which should not capitalize, remaining shud be capitalize

const titleCase = function (str) {
  const capitalize = function (str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return exceptions.includes(word) ? word : capitalize(word);
    })
    .join(' ');

  return capitalize(titleCase);
};

console.log(titleCase('Hi How are you how do you do and so on'));
console.log(titleCase('Sudeesh is very good boy and he is very HARDWORKING'));
console.log(titleCase('AND YOU knoW about me already how i will DEAL'));
console.log(titleCase('HELLO How come you are but the or in and'));

//CODING CHALLENGE -4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
const foodPortion = dogs.forEach(function (obj) {
  obj.recommendFood = Math.trunc(obj.weight ** 0.75 * 28);
  return obj.recommendFood;
});
console.log(dogs);

// const dogsOwners = dogs
//   .map(function (obj) {
//     return obj.owners;
//   })
//   .flat();

const sarahDog = dogs.find(function (obj) {
  return obj.owners.includes('Sarah');
});

console.log(sarahDog);
console.log(
  `Sarah's Dog is eating too ${
    sarahDog.curFood > sarahDog.recommendFood ? 'much' : 'little'
  }`
);

const ownersEatTooMuch = dogs
  .filter(function (obj) {
    return obj.curFood > obj.recommendFood;
  })
  .map(function (obj) {
    return obj.owners;
  })
  .flat();

const ownersEatTooLittle = dogs
  .filter(function (obj) {
    return obj.curFood < obj.recommendFood;
  })
  .map(function (obj) {
    return obj.owners;
  })
  .flat();

console.log(ownersEatTooMuch, ownersEatTooLittle);

console.log(
  `${ownersEatTooMuch.join(
    ' and '
  )}'s dogs eat too much!"  "${ownersEatTooLittle.join(
    ' and '
  )}'s dogs eat too little!"`
);

const finding = dogs.some(function (obj) {
  return obj.curFood === obj.recommendFood;
});

console.log(finding);

const finding1 = dogs.some(function (obj) {
  return (
    obj.curFood > 0.9 * obj.recommendFood &&
    obj.curFood < 1.1 * obj.recommendFood
  );
});

console.log(finding1);

const finding2 = dogs.filter(function (obj) {
  return (
    obj.curFood > 0.9 * obj.recommendFood &&
    obj.curFood < 1.1 * obj.recommendFood
  );
});

console.log(finding2);

const dogsSorted = dogs.slice(' ').sort(function (a, b) {
  return a.recommendFood - b.recommendFood;
});

console.log(dogsSorted);
