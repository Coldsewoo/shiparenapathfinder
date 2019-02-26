const getNode = require('./getNode')
var queue = [];
var keys = [];
var InitialStat = require("./info.json");
var InitialLv = InitialStat["total_resources"][1] + 1
var start = new getNode(InitialStat, InitialLv)
var result = {
    highest: InitialLv
}

start.searched = true;
getChildren(start, result);
console.log(start)
queue.push(start);

// const { performance } = require('perf_hooks');

while (queue.length > 0) {
    // var t0 = performance.now();
    let current = queue.shift();
    console.log(queue.length + " " + current.enemyLv + " " + current.check.costChecked + " " + current.check.combatCheck)
    if (current.check.costChecked == true) {
        current.children.forEach(n => {
            if (n.searched == false) {
                let key = getKey(n);
                // console.log(key);
                if (keys.indexOf(key) == -1 && (n.check.combatCheck == true || result.highest - n.enemyLv < 5)) {
                    n.searched = true;
                    getChildren(n, result);
                    keys.push(key);
                    queue.push(n);
                }
            }
        })
    }
    // var t1 = performance.now();
    // console.log("Call to shipCombat took " + (t1 - t0) + " milliseconds.")
}


var end = result[result.highest - 1]
var endLevel;
while (end.parent) {
    if (endLevel == end.enemyLv) {
        end = end.parent;
    } else {
        console.log(endLevel)
        console.log(end)

        endLevel = end.enemyLv
        end = end.parent
    }
}



function getChildren(Node, result) {
    if (Node.check.costChecked == false) {
        // Node is closed
    } else
        if (Node.check.combatCheck == false) {
            // 1. midHull 
            let levelArrMidHullArr = JSON.parse(JSON.stringify(Node.levelArr));
            levelArrMidHullArr["midship"][2] += 1;
            Node.children.push(new getNode(levelArrMidHullArr, Node.enemyLv))

            // 2. midweapon

            let levelArrMidWeaponArr = JSON.parse(JSON.stringify(Node.levelArr));
            if (levelArrMidWeaponArr["midship"][0] <= 45) {
                levelArrMidWeaponArr["midship"][0] += 1;
                Node.children.push(new getNode(levelArrMidWeaponArr, Node.enemyLv))
            }
            //3. leftHull
            let levelArrLeftHullArr = JSON.parse(JSON.stringify(Node.levelArr));
            levelArrLeftHullArr["leftship"][2] += 1;
            Node.children.push(new getNode(levelArrLeftHullArr, Node.enemyLv))

            //4. rightweapon
            let levelArrRightWeaponArr = JSON.parse(JSON.stringify(Node.levelArr));
            levelArrRightWeaponArr["rightship"][0] += 1;
            Node.children.push(new getNode(levelArrRightWeaponArr, Node.enemyLv))

            //5. rightHull
            let levelArrRightHullArr = JSON.parse(JSON.stringify(Node.levelArr));
            levelArrRightHullArr["rightship"][2] += 1;
            Node.children.push(new getNode(levelArrRightHullArr, Node.enemyLv))

            //6. rightwing
            let levelArrRightWingArr = JSON.parse(JSON.stringify(Node.levelArr));
            levelArrRightWingArr["rightship"][3] += 1;
            Node.children.push(new getNode(levelArrRightWingArr, Node.enemyLv))

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
            let nextNode = new getNode(Node.levelArr, Node.enemyLv + 1);
            nextNode.parent = Node;
            Node.children.push(nextNode)
        }
}

function getKey(Node) {
    var key = `${Node.levelArr["midship"][2]}${Node.levelArr["midship"][0]}${Node.levelArr["leftship"][2]}${Node.levelArr["rightship"][0]}${Node.levelArr["rightship"][2]}${Node.levelArr["rightship"][3]}${Node.levelArr["rightship"][3]}${Node.enemyLv}`
    return key;
}