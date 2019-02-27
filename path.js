const getNode = require('./getNode')
var queue = [];
var keys = [];

// Initial settings
var InitialStat = require("./info.json");
var InitialLv = InitialStat["total_resources"][1] + 1
// var keyInit = `${InitialLv}/${InitialStat["midship"][0]}/${InitialStat["midship"][2]}/${InitialStat["leftship"][2]}/${InitialStat["rightship"][0]}/${InitialStat["rightship"][2]}/${InitialStat["rightship"][3]}`
var keyInit = `${InitialStat["midship"][0]}/${InitialStat["midship"][2]}/${InitialStat["leftship"][2]}/${InitialStat["rightship"][0]}/${InitialStat["rightship"][2]}/${InitialStat["rightship"][3]}/${InitialLv}`
var start = new getNode(keyInit, InitialLv)
var result = {
    highest: InitialLv
}
start.searched = true;
getChildren(start, result);
queue.push(start);


// const { performance } = require('perf_hooks');
while (queue.length > 0) {
    // var t0 = performance.now();
    let current = queue.shift();
    console.log(result.highest + " " + current.enemyLv + " " + queue.length + " " + keys.length + " " + current.key + " " + current.check.costChecked + " " + current.check.combatCheck)
    // console.log(current)
    // console.log(queue.length + " " + current.enemyLv + " " + current.check.costChecked + " " + current.check.combatCheck)
    if (current.check.costChecked == true) {
        current.children.forEach(n => {
            if (n.searched == false) {
                let key = n.key;
                if (keys.indexOf(key) == -1) {
                    n.searched = true;
                    getChildren(n, result);
                    keys.push(key);
                    queue.push(n);
                }
            }
        })
    }

    if (queue.length > 500) {
        queue = queue.filter(e => e.check.costChecked == true)
            .sort((a, b) => sortQueue(a, b))

        // if (queue.length > 20000) {
        //     queue = queue.filter(e => (e.enemyLv >= result.highest - 5) || e.check.combatCheck == true)
        // }
        // var t1 = performance.now();
        // console.log("Call to shipCombat took " + (t1 - t0) + " milliseconds.")
    }


    function sortQueue(a, b) {
        var keyArrA = a.key.split(/\//g)
        var keyArrB = b.key.split(/\//g)
        var wingA = keyArrA[5]
        var wingB = keyArrB[5]
        var checkA = a.check.combatCheck
        var checkB = b.check.combatCheck
        var levelA = parseInt(a.enemyLv);
        var levelB = parseInt(b.enemyLv);
        var HullA = keyArrA[4]
        var HullB = keyArrB[4]
        var HullDiffA = Math.abs(keyArrA[1] - keyArrA[2])
        var HullDiffB = Math.abs(keyArrB[1] - keyArrB[2])
        var WeaponA = keyArrA[3]
        var WeaponB = keyArrA[3]

        // Compare keys

        // true -> false
        if (checkA < checkB) return -1;
        if (checkB > checkA) return 1;

        //enemy lv
        if (levelA < levelB) return 1;
        if (levelA > levelB) return -1;

        //right wing lv
        if (wingA < wingB) return 1;
        if (wingA > wingB) return -1;

        //right weapon
        if (WeaponA < WeaponB) return 1;
        if (WeaponA > WeaponB) return -1;

        //hull difference btw left and mid
        if (HullDiffA < HullDiffB) return -1;
        if (HullDiffA > HullDiffB) return 1;

        //right hull lv
        if (HullA < HullB) return -1;
        if (HullA > HullB) return 1;


        return 0;
    }

}

var end = result[result.highest]
while (end.parent) {
    console.log(end);
    end = end.parent
}



function getChildren(Node, result) {
    // console.log(Node.parent)
    var key = Node.key;
    var enemyLv = Node.enemyLv;
    // console.log(key)

    if (Node.check.costChecked == false) {
        // Node is closed
    } else
        if (Node.check.combatCheck == false) {
            //6. rightwing
            let levelArrRightWingKey = upgradeOnce(key, 5)
            if (keys.indexOf(levelArrRightWingKey) == -1) {
                Node.children.push(new getNode(levelArrRightWingKey, enemyLv))
            }
            //4. rightweapon
            let levelArrRightWeaponKey = upgradeOnce(key, 3)
            if (keys.indexOf(levelArrRightWeaponKey) == -1) {
                Node.children.push(new getNode(levelArrRightWeaponKey, enemyLv))
            }
            //3. leftHull
            let levelArrLeftHullKey = upgradeOnce(key, 2)
            if (keys.indexOf(levelArrLeftHullKey) == -1) {
                Node.children.push(new getNode(levelArrLeftHullKey, enemyLv))
            }

            // 1. midHull 
            let levelArrMidHullKey = upgradeOnce(key, 1)
            if (keys.indexOf(levelArrMidHullKey) == -1) {
                Node.children.push(new getNode(levelArrMidHullKey, enemyLv))
            }
            //5. rightHull
            let levelArrRightHullKey = upgradeOnce(key, 4)
            if (keys.indexOf(levelArrRightHullKey) == -1) {
                Node.children.push(new getNode(levelArrRightHullKey, enemyLv))
            }
            // 2. midweapon
            let levelArrMidWeaponKey = upgradeOnce(key, 0)
            let weaponLevel = levelArrMidWeaponKey.split(/\//g)[0]
            if (parseInt(weaponLevel) <= 35) {
                if (keys.indexOf(levelArrMidWeaponKey) == -1) {
                    Node.children.push(new getNode(levelArrMidWeaponKey, enemyLv))
                }
            }




            Node.children.forEach(child => {
                child.parent = Node
            })
        } else {
            // valid combination and combat win -> lv up and go to next level
            if (Node.enemyLv > result.highest) {
                result[Node.enemyLv] = Node;
                result.highest = Node.enemyLv
                console.log(result.highest);
            }

            let nextNode = new getNode(key, enemyLv + 1);
            nextNode.parent = Node;
            Node.children.push(nextNode)
        }
}


//index 0, enemyLv, 1: midweapon , 2 : midhull, 3: lefthull, 4:rightweapon, 5:righthull, 6:rightwing
function upgradeOnce(key, index) {
    var keyarray = key.split(/\//g);
    keyarray[index] = Number(keyarray[index]) + 1;
    keyarray = keyarray.join('/');
    return keyarray
}


