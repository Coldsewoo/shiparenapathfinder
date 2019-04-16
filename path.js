const getNode = require('./lib/getNode')
var queue = [];
var keys = {};


String.prototype.checkIfValid = function (object, currLv) {
  return (!object[this.valueOf()] || (object[this.valueOf()].enemyLv && object[this.valueOf()].enemyLv != currLv))
}

// Initial settings
var InitialStat = require("./lib/info.json");
var InitialLv = InitialStat["total_resources"][1] + 1
var keyInit = `${InitialStat["midship"][0]}/${InitialStat["midship"][2]}/${InitialStat["leftship"][2]}/${InitialStat["rightship"][0]}/${InitialStat["rightship"][2]}/${InitialStat["rightship"][3]}`
var start = new getNode(keyInit, InitialLv)
var result = {
  highest: InitialLv
}
start.searched = true;
getChildren(start, result);
queue.push(start);


//string : key // object : keys
// keys[key] exists and enemylv is not equal to its lv



//todo : keycheck
// 1. do not include current enemy lv in key
// 2. keys -> Object rather than array
// 3. if duplicated, check the key has higher nenmy lv, if so, dont check current
// keys[key] = {
//     key : key,
//     enemyLv : current.enemyLv
// }


while (queue.length > 0) {
  let current = queue.shift();
  var rightShipHit = current.rightShipHit;
  rightShipHit = rightShipHit.join("")
  console.log(result.highest + " " + current.enemyLv + " " + queue.length + " " + Object.keys(keys).length + " " + current.key + " " + current.check.costChecked + " " + current.check.combatCheck + " " + rightShipHit)
  var currKey = current.key;
  if (keys[currKey] && current.enemyLv < keys[currKey].enemyLv) {
    continue;
  }

  if (current.check.costChecked == true) {
    current.children.forEach(n => {
      if (n.searched == false) {
        let key = n.key;
        if (!keys[key] || n.enemyLv > keys[key].enemyLv) {
          n.searched = true;
          getChildren(n, result);
          if (!keys[key]) {
            keys[key] = {
              enemyLv: n.enemyLv
            }
          } else if (keys[key].enemyLv < n.enemyLv) {
            keys[key].enemyLv = n.enemyLv
          }
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
    var WeaponB = keyArrB[3]
    var leftWeaponA = keyArrA[0]
    var leftWeaponB = keyArrB[0]

    var rightShipHitA = a.rightShipHit;
    rightShipHitA = parseInt(rightShipHitA.join(""))
    var rightShipHitB = b.rightShipHit;
    rightShipHitB = parseInt(rightShipHitB.join(""))



    //enemy lv
    if (levelA < levelB) return 1;
    if (levelA > levelB) return -1;


    //rightshipAttack (012 first) 
    if (rightShipHitA < rightShipHitB) return 1;
    if (rightShipHitA > rightShipHitB) return -1;


    // true -> false
    if (checkA < checkB) return -1;
    if (checkB > checkA) return 1;

    //right wing lv
    if (wingA < wingB) return 1;
    if (wingA > wingB) return -1;

    //right weapon
    if (WeaponA < WeaponB) return 1;
    if (WeaponA > WeaponB) return -1;

    //midWeapon
    if (leftWeaponA < leftWeaponB) return -1;
    if (leftWeaponA > leftWeaponB) return 1;


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
  end = end.parent
}



function getChildren(Node, result) {
  var key = Node.key;
  var enemyLv = Node.enemyLv;
  var rightShipHit = Node.rightShipHit;
  rightShipHit = rightShipHit.join("")
  var keyArr = key.split(/\//g);


  if (Node.check.costChecked == false) {
    // Node is closed
  } else
  if (Node.check.combatCheck == false) {
    //todo : if rightShipHit is not 0,1,2 -> focus on left,mid hull and right hull,wing
    // or focus on mid weapon and right weapon
    if (rightShipHit == "012") {
      //4. rightweapon
      let levelArrRightWeaponKey = upgradeOnce(key, 3)
      if (levelArrRightWeaponKey.checkIfValid(keys, enemyLv)) {
        Node.children.push(new getNode(levelArrRightWeaponKey, enemyLv))
      }
      // 2. midweapon
      let levelArrMidWeaponKey = upgradeOnce(key, 0)
      let weaponLevel = levelArrMidWeaponKey.split(/\//g)[0]
      if (parseInt(weaponLevel) <= 35) {
        if (levelArrMidWeaponKey.checkIfValid(keys, enemyLv)) {
          Node.children.push(new getNode(levelArrMidWeaponKey, enemyLv))
        }
      }
      let levelArrRightHullKey = upgradeOnce(key, 4)
      if (levelArrRightHullKey.checkIfValid(keys, enemyLv)) {
        Node.children.push(new getNode(levelArrRightHullKey, enemyLv))
      }
    } else if (rightShipHit == "011") {
      //6. rightwing
      let levelArrRightWingKey = upgradeOnce(key, 5)
      if (levelArrRightWingKey.checkIfValid(keys, enemyLv)) {
        Node.children.push(new getNode(levelArrRightWingKey, enemyLv))
      }
      // righthull : mid or left + 10?
      var midHull = parseInt(keyArr[1])
      var leftHull = parseInt(keyArr[2]);
      var rightHull = parseInt(keyArr[4]);

      //3. leftHull
      let levelArrLeftHullKey = upgradeOnce(key, 2)

      // // 1. midHull 
      let levelArrMidHullKey = upgradeOnce(levelArrLeftHullKey, 1)
      if (levelArrMidHullKey.checkIfValid(keys, enemyLv)) {
        Node.children.push(new getNode(levelArrMidHullKey, enemyLv))
      }

      //5. rightHull
      let levelArrRightHullKey = upgradeOnce(key, 4)
      if (levelArrRightHullKey.checkIfValid(keys, enemyLv)) {
        Node.children.push(new getNode(levelArrRightHullKey, enemyLv))
      }
    } else {
      // //4. rightweapon
      // let levelArrRightWeaponKey = upgradeOnce(key, 3)
      // if (levelArrRightWeaponKey.checkIfValid(keys, enemyLv)) {
      //     Node.children.push(new getNode(levelArrRightWeaponKey, enemyLv))
      // }
      // // 2. midweapon
      // let levelArrMidWeaponKey = upgradeOnce(key, 0)
      // let weaponLevel = levelArrMidWeaponKey.split(/\//g)[0]
      // if (parseInt(weaponLevel) <= 35) {
      //     if (levelArrMidWeaponKey.checkIfValid(keys, enemyLv)) {
      //         Node.children.push(new getNode(levelArrMidWeaponKey, enemyLv))
      //     }
      // }
      // let levelArrRightHullKey = upgradeOnce(key, 4)
      // if (levelArrRightHullKey.checkIfValid(keys, enemyLv)) {
      //     Node.children.push(new getNode(levelArrRightHullKey, enemyLv))
      // }
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