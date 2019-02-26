const { getShipStat, getShipPlusOneStat, enemyShipData, shipCost, Number, getTrophyPoint } = require("./ShipArenaData");

// var shipData = require('./info.json');



// shipData["midship"][2] = 61;
// shipData["rightship"][0] = 95;
// shipData["rightship"][2] = 75;
// shipData["rightship"][3] = 105;
// shipData["bonus"][8] = 77;
// shipData["bonus"][9] = 85;





function shipCombat(shipInfo, enemyLevel) {
    var TimeResult = [];
    var winner;
    var levelArrInit = shipInfo;
    var enemyLevelInit = enemyLevel;
    var { leftShipInfo, midShipInfo, rightShipInfo, enemyStat } = getShipInfo(levelArrInit, enemyLevelInit)
    var AttackTime = enemyStat.Speed * 10

    TimeResult.push([1, (AttackTime / rightShipInfo.Speed).ROUNDUP(4), AttackTime, 10, AttackTime, 10, 0])
    NextAttackTime(AttackTime / rightShipInfo.Speed, AttackTime, 10, AttackTime, 10, 0)
    winner = HPRemaining(TimeResult)


    function getShipInfo(levelArr, EnemyLevel) {
        var leftShipInfo = new getShipStat(levelArr["leftship"])
        var midShipInfo = new getShipStat(levelArr["midship"])
        var rightShipInfo = new getShipStat(levelArr["rightship"])
        var enemyStat = new enemyShipData(EnemyLevel)
        return {
            leftShipInfo,
            midShipInfo,
            rightShipInfo,
            enemyStat
        }
    }

    function HPRemaining(TimeResult) {
        var midShipHP = midShipInfo.HP;
        var leftShipHP = leftShipInfo.HP;
        var rightShipHP = rightShipInfo.HP;
        var AIShipArmor = enemyStat.Armor;
        var AIShipHP = enemyStat.HP;
        var PlayerDamageTaken = enemyStat.Damage;
        var AIArmorDamageTakenByReflect = PlayerDamageTaken * 0.28 / (1 + enemyStat.Absorption)
        var rightShipRegen = rightShipInfo.RegenHP;
        var midShipDamage = midShipInfo.Damage * midShipInfo.ArmorPenetrat / (1 + enemyStat.Absorption);
        var rightShipDamageDIZero = rightShipInfo.Damage * rightShipInfo.ArmorPenetrat;
        var rightShipDamageDIOne = rightShipInfo.Damage * rightShipInfo.ArmorPenetrat * 1.27;
        var rightShipDamageDITwo = rightShipInfo.Damage * rightShipInfo.ArmorPenetrat * 1.54;
        var leftShipHitTaken = 0;
        var midShipHitTaken = 0;
        var rightShipHitTaken = 0;
        var leftShipHit = [0, 0, 0];
        var midShipHit = [0, 0, 0];
        var rightShipHit = [0, 0, 0];
        for (let i = 0; i < TimeResult.length; i++) {
            var rightshipHPbefore = rightShipHP;
            if (TimeResult[i][0] === 1) {
                AIShipArmor -= midShipDamage; // First Hit
                leftShipHit[0] += 1
            } else if (TimeResult[i][0] === 3) {
                if (midShipHP > 0) {
                    // Right Ship First Hit
                    let damageToArmor = rightShipDamageDIZero / (1 + enemyStat.Absorption)
                    if (AIShipArmor > damageToArmor) {
                        AIShipArmor -= damageToArmor;
                        rightShipHP += rightShipRegen
                        if (rightShipHP > rightShipInfo.HP) rightShipHP = rightShipInfo.HP;
                        rightShipHit[0] += 1;
                    } else {
                        let rightDamageToHP = Math.max(damageToArmor - AIShipArmor, 0) * (1 + enemyStat.Absorption) / rightShipInfo.ArmorPenetrat
                        AIShipArmor = 0;
                        AIShipHP -= rightDamageToHP;
                        rightShipHP += rightShipRegen + rightDamageToHP * rightShipInfo.Leech
                        if (rightShipHP > rightShipInfo.HP) rightShipHP = rightShipInfo.HP;
                        rightShipHit[0] += 1;
                    }
                } else if (leftShipHP > 0) {
                    let damageToArmor = rightShipDamageDIOne / (1 + enemyStat.Absorption)
                    if (AIShipArmor > damageToArmor) {
                        AIShipArmor -= damageToArmor;
                        rightShipHP += rightShipRegen
                        if (rightShipHP > rightShipInfo.HP) rightShipHP = rightShipInfo.HP;
                        rightShipHit[1] += 1;
                    } else {
                        let rightDamageToHP = Math.max(damageToArmor - AIShipArmor, 0) * (1 + enemyStat.Absorption) / rightShipInfo.ArmorPenetrat
                        AIShipArmor = 0;
                        AIShipHP -= rightDamageToHP;
                        rightShipHP += rightShipRegen + rightDamageToHP * rightShipInfo.Leech
                        if (rightShipHP > rightShipInfo.HP) rightShipHP = rightShipInfo.HP;
                        rightShipHit[1] += 1;
                    }
                } else {
                    let damageToArmor = rightShipDamageDITwo / (1 + enemyStat.Absorption)
                    if (AIShipArmor > damageToArmor) {
                        AIShipArmor -= damageToArmor;
                        rightShipHP += rightShipRegen
                        if (rightShipHP > rightShipInfo.HP) rightShipHP = rightShipInfo.HP;
                        rightShipHit[2] += 1;
                    } else {
                        let rightDamageToHP = Math.max(damageToArmor - AIShipArmor, 0) * (1 + enemyStat.Absorption) / rightShipInfo.ArmorPenetrat
                        AIShipArmor = 0;
                        AIShipHP -= rightDamageToHP;
                        rightShipHP += rightShipRegen + rightDamageToHP * rightShipInfo.Leech
                        if (rightShipHP > rightShipInfo.HP) rightShipHP = rightShipInfo.HP;
                        rightShipHit[2] += 1;
                    }

                }
            } else if (TimeResult[i][0] === 4) {
                if (midShipHP > 0) {
                    midShipHP -= PlayerDamageTaken;
                    if (AIShipArmor > AIArmorDamageTakenByReflect) {
                        AIShipArmor -= AIArmorDamageTakenByReflect;
                    } else {
                        let midReflectToAI = Math.max(AIArmorDamageTakenByReflect - AIShipArmor, 0) * (1 + enemyStat.Absorption);
                        AIShipArmor = 0;
                        AIShipHP -= midReflectToAI;
                    }
                    midShipHitTaken += 1;
                } else if (leftShipHP > 0) {
                    leftShipHP -= PlayerDamageTaken;
                    if (AIShipArmor > AIArmorDamageTakenByReflect) {
                        AIShipArmor -= AIArmorDamageTakenByReflect;
                    } else {
                        let leftReflectToAI = Math.max(AIArmorDamageTakenByReflect - AIShipArmor, 0) * (1 + enemyStat.Absorption);
                        AIShipArmor = 0;
                        AIShipHP -= leftReflectToAI;
                    }
                    leftShipHitTaken += 1;
                } else {
                    rightShipHP -= PlayerDamageTaken;
                    if (AIShipArmor > AIArmorDamageTakenByReflect) {
                        AIShipArmor -= AIArmorDamageTakenByReflect;
                    } else {
                        let rightReflectToAI = Math.max(AIArmorDamageTakenByReflect - AIShipArmor, 0) * (1 + enemyStat.Absorption);
                        AIShipArmor = 0;
                        AIShipHP -= rightReflectToAI;
                    }
                    rightShipHitTaken += 1;
                }
            }
            if (rightShipHP < 0 && AIShipHP > 0) {
                // let winner = ["AI", shipInfo, leftShipHit, midShipHit, rightShipHit]
                let winner = ["AI", shipInfo]
                return winner;
            } else if (rightShipHP > 0 && AIShipHP < 0) {
                // let winner = ["Player", shipInfo, leftShipHit, midShipHit, rightShipHit]
                let winner = ["Player", shipInfo]
                return winner;
            }
        }
    }

    function NextAttackTime(rightShipTime, rightAttackTimer, AIShipTime, AIAttackTimer, Selected, Index) {
        let result = []
        var InitialTimer = {
            rightShip: AttackTime / rightShipInfo.Speed,
            AIShip: 10
        }
        let rightW, AIAG;
        if (rightAttackTimer > 0) rightW = 0;
        else rightW = AttackTime;

        if (AIAttackTimer > 0) AIAG = 0;
        else AIAG = AttackTime;

        rightAttackTimer = (rightAttackTimer - (rightShipInfo.Speed * Selected.ROUNDUP(4)) + rightW).ROUNDUP(2);
        AIAttackTimer = (AIAttackTimer - (enemyStat.Speed * Selected.ROUNDUP(4)) + AIAG).ROUNDUP(2)

        var caseOne = 4;
        var caseTwo = 3;
        var caseThree = 4;
        var caseFour = 4;
        Index += 1;
        if (Index <= 80) {
            if (rightShipTime - 10 < 10 && rightShipTime - 10 > 0) {
                //attacker = AI
                rightShipTime = rightShipTime - 10
                AIShipTime = 10;
                Selected = rightShipTime;
                result.push(caseOne, rightShipTime.ROUNDUP(4), rightAttackTimer.ROUNDUP(4), AIShipTime.ROUNDUP(4), AIAttackTimer.ROUNDUP(4), Selected.ROUNDUP(4), Index)
                TimeResult.push(result)
                NextAttackTime(rightShipTime, rightAttackTimer, AIShipTime, AIAttackTimer, Selected, Index)
            } else if (rightShipTime - 10 < 0) {
                //attacker = player
                AIShipTime = 10 - rightShipTime
                rightShipTime = InitialTimer.rightShip
                Selected = AIShipTime
                result.push(caseTwo, rightShipTime.ROUNDUP(4), rightAttackTimer.ROUNDUP(4), AIShipTime.ROUNDUP(4), AIAttackTimer.ROUNDUP(4), Selected.ROUNDUP(4), Index)
                TimeResult.push(result)
                NextAttackTime(rightShipTime, rightAttackTimer, AIShipTime, AIAttackTimer, Selected, Index)
            } else if (AIShipTime < 10) {
                //attacker = AI
                rightShipTime = rightShipTime - AIShipTime;
                if (AIAttackTimer <= 0) AIShipTime = (AIAttackTimer + AttackTime) / enemyStat.Speed
                Selected = AIShipTime
                result.push(caseThree, rightShipTime.ROUNDUP(4), rightAttackTimer.ROUNDUP(4), AIShipTime.ROUNDUP(4), AIAttackTimer.ROUNDUP(4), Selected.ROUNDUP(4), Index)
                TimeResult.push(result)
                NextAttackTime(rightShipTime, rightAttackTimer, AIShipTime, AIAttackTimer, Selected, Index)
            } else {
                //attacker = AI
                rightShipTime = rightShipTime - 10
                AIShipTime = 10;
                Selected = AIShipTime;
                result.push(caseFour, rightShipTime.ROUNDUP(4), rightAttackTimer.ROUNDUP(4), AIShipTime.ROUNDUP(4), AIAttackTimer.ROUNDUP(4), Selected.ROUNDUP(4), Index)
                TimeResult.push(result)
                NextAttackTime(rightShipTime, rightAttackTimer, AIShipTime, AIAttackTimer, Selected, Index)
            }

        } else {
            result.push(null, null, null, null, null, null, Index)
            TimeResult.push(result);
        }
    }
    if (winner == undefined) return ["Null"]
    else return winner;

}





module.exports = {
    shipCombat
}