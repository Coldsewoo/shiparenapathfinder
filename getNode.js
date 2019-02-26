var { shipCombat } = require('./shipCombat')
var { costCheck, getTrophyPoint } = require('./ShipArenaData')


function getNode(levelArr, enemyLv) {
    let combination = getCombination(levelArr, enemyLv)
    if (!combination[2]) {
        this.check = combination[1];
        this.searched = true
        this.parent = {}
        this.children = []
    }
    else {
        this.check = combination[2];
        this.stat = {
            trophy: {
                HPtrophy: combination[1]["bonus"][8],
                Dmgtrophy: combination[1]["bonus"][9],
            },
            midShip: {
                Weapon: combination[1]["midship"][0],
                Hull: combination[1]["midship"][2],
            },
            leftShip: {
                Hull: combination[1]["leftship"][2],
            },
            rightShip: {
                Weapon: combination[1]["rightship"][0],
                Hull: combination[1]["rightship"][2],
                Wings: combination[1]["rightship"][3]
            },
        }
        this.enemyLv = enemyLv
        this.levelArr = levelArr
        this.searched = false
        this.parent = []
        this.children = []
    }
    function getCombination(levelArr, enemyLv) {
        var thisArray = levelArr;
        var costChecked = costCheck(thisArray, enemyLv);
        var trophyCombination = getTrophyPoint(thisArray, enemyLv)
        var combination = [];
        var temp = {
            costChecked: costChecked,
            combatCheck: false
        }
        for (let i = 0; i < trophyCombination.length; i++) {
            thisArray["bonus"][8] = trophyCombination[i][0];
            thisArray["bonus"][9] = trophyCombination[i][1];
            var combat1 = shipCombat(thisArray, enemyLv)[0];
            if (combat1[0] == "Null") {
                return temp;
            } else {
                if (combat1 == "Player") {
                    temp.combatCheck = true;
                    combination = shipCombat(thisArray, enemyLv);
                    combination.push(temp);
                    return combination;
                } else {
                    thisArray["bonus"][9] = trophyCombination[i][0];
                    thisArray["bonus"][8] = trophyCombination[i][1];
                    var combat2 = shipCombat(thisArray, enemyLv)[0];
                    if (combat2 == "Player") {
                        temp.combatCheck = true;
                        combination = shipCombat(thisArray, enemyLv);
                        combination.push(temp);
                        return combination;
                    }
                }
            }

        }
        combination = shipCombat(thisArray, enemyLv)

        combination.push(temp);
        return combination;
    }
}


module.exports = getNode