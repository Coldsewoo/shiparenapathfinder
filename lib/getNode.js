var { shipCombat } = require('./shipCombat')
var { costCheck, getTrophyPoint } = require('./ShipArenaData')
var initInfoJSON = require('./info.json')
var enemyLvinit = initInfoJSON["total_resources"][1] + 1
//todo
/*
what I thought the node must have are
1. cost check
2.combat result
3. upgrade infor
4. parent
5.children(made when the node is current)
 */

var InitialStat = require("./info.json");
var InitialLv = InitialStat["total_resources"][1] + 1

var key = `${InitialLv}/${InitialStat["midship"][0]}/${InitialStat["midship"][2]}/${InitialStat["leftship"][2]}/${InitialStat["rightship"][0]}/${InitialStat["rightship"][2]}/${InitialStat["rightship"][3]}`

// var node = new getNode(key);

// var keyarray = key.split(/\//g)
// var keywithmidweapon = keyarray.slice()
// keywithmidweapon[2] = Number(keywithmidweapon[0]) + 1
// keywithmidweapon = keywithmidweapon.join('/')
// var nodetwo = new getNode(keywithmidweapon)




function getNode(key, enemyLevel) {
    // console.log(key)
    // console.log(enemyLevel)
    let keyArr = key.split(/\//g)
    let levelArr = JSON.parse(JSON.stringify(initInfoJSON));
    let enemyLv = enemyLevel
    levelArr["midship"][0] = Number(keyArr[0]);
    levelArr["midship"][2] = Number(keyArr[1]);
    levelArr["leftship"][2] = Number(keyArr[2]);
    levelArr["rightship"][0] = Number(keyArr[3]);
    levelArr["rightship"][2] = Number(keyArr[4]);
    levelArr["rightship"][3] = Number(keyArr[5]);
    // keyArr[6] = enemyLv;
    key = keyArr.join("/")

    let combination = getCombination(levelArr, enemyLv)
    // console.log(combination)
    if (!combination[3]) {
        this.check = combination[1];
        this.rightShipHit = combination[2];
        this.searched = true
        this.parent = {}
        this.children = []
    }
    else {
        this.key = key;
        this.check = combination[3]; //costcheck and combatcheck
        this.rightShipHit = combination[2];
        this.enemyLv = enemyLv
        this.searched = false
        this.parent = []
        this.children = []
    }

    function getCombination(levelArr, enemyLv) {
        var thisArray = JSON.parse(JSON.stringify(levelArr))
        var costChecked = costCheck(thisArray, enemyLv);
        var trophyCombination = getTrophyPoint(thisArray, enemyLv)
        var combination = shipCombat(thisArray, enemyLv);
        var temp = {
            costChecked: costChecked,
            combatCheck: false,
            trophy: []
        }
        for (let i = 0; i < trophyCombination.length; i++) {
            levelArr["bonus"][8] = trophyCombination[i][0];
            levelArr["bonus"][9] = trophyCombination[i][1];
            var combatone = shipCombat(levelArr, enemyLv);
            var combat1 = combatone[0]
            if (combat1 == "Null") {
                return temp;
            } else {
                thisArray["bonus"][9] = trophyCombination[i][0];
                thisArray["bonus"][8] = trophyCombination[i][1];
                var combattwo = shipCombat(thisArray, enemyLv);
                if (combattwo[0] == "Null") {
                    return temp;
                }
                var combat2 = combattwo[0]
                if (combat2 == "Player") {
                    temp.combatCheck = true;
                    temp.trophy.push(trophyCombination[i][0], trophyCombination[i][1])
                    combination = shipCombat(thisArray, enemyLv);
                    combination.push(temp);
                    return combination;
                }
            }
            var rightShipHitOne = combatone[2].join("");
            var rightShipHitTwo = combattwo[2].join("");
            // console.log(rightShipHitOne + " " + rightShipHitTwo)
            if (rightShipHitOne == "012" || rightShipHitTwo == "012") {
                combination[2] = [0, 1, 2]
            }
        }

        if (combination[0] == "AI") {
            temp.trophy.push(thisArray["bonus"][8], thisArray["bonus"][9])
            combination.push(temp);
        }
        // console.log(combination)
        return combination;
    }
}





// var Node = getNode("30/64/64/95/86/99/436", 436)
// console.log(Node)



module.exports = getNode