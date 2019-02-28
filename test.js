
Number.prototype.ROUNDUP = function (i) {
    let demical = Math.pow(10, i)
    let num = this.valueOf() * demical;
    if (num < 0) num = Math.floor(num);
    else num = Math.ceil(num)
    return num / demical;
}

Number.prototype.ROUNDDOWN = function (i) {
    let demical = Math.pow(10, i)
    let num = this.valueOf() * demical;
    if (num < 0) num = Math.ceil(num);
    else num = Math.floor(num)
    return Math.floor(num) / demical;
}

Number.prototype.ROUND = function (i) {
    let demical = Math.pow(10, i)
    let num = this.valueOf() * demical;
    return Math.round(num) / demical;
}

// a = [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];


// a.sort(function (x, y) {
//     // true values first
//     return (x === y) ? 0 : x ? -1 : 1;
//     // false values first
//     // return (x === y)? 0 : x? 1 : -1;
// });

// console.log(a);


String.prototype.checkIfValid = function (object, currLv) {
    // console.log(this.valueOf())
    return (!object[this.valueOf()] || (object[this.valueOf()].enemyLv && object[this.valueOf()].enemyLv != currLv))
}

var testString = "30/60/60/95/75/90";
var keys = {
    "30/60/60/95/75/90": {
        enemyLv: 395
    }
}

var anotherKey = "31/60/60/95/75/90";


console.log(testString.checkIfValid(anotherKey, 395))