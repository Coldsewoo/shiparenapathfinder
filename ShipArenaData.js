
const shipData = require('./data.json')
const shipInfo = require('./info.json')


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


function getShipStat(shipUpgradeLevel) {
    let weapon = shipUpgradeLevel[0];
    let reactor = shipUpgradeLevel[1];
    let hull = shipUpgradeLevel[2];
    let wings = shipUpgradeLevel[3];
    let bonus = shipInfo["bonus"]
    let orbTier = bonus[1];
    let orbLv = bonus[2];
    let orbBonus = (0.02 * Math.pow(orbTier, 2) + orbLv / 100 * (0.08 * orbTier + 0.04) * 0.4) * bonus[0]

    this.Weapon = shipData["Effect Damage"][weapon];
    this.Reactor = shipData["Effect Shield"][reactor];
    this.Hull = shipData["Effect Health"][hull];
    this.Wings = (10 + 0.8 * wings) * (1 + Math.floor(wings / 5) / 20);


    this.Speed = this.Wings;
    this.Armor = this.Reactor;
    this.HP = (this.Hull * (1 + bonus[8] / 100) * (1 + bonus[7]) * (1 + orbBonus) * (1 + bonus[3])).ROUNDDOWN(2);
    this.Damage = this.Weapon * (1 + bonus[9] / 100) * (1 + bonus[6]) * (1 + bonus[5]) * (1 + orbBonus) * (1 + bonus[3]) * (1 + bonus[4]);

    this.ArmorPenetrat = 1.425;
    this.RegenHP = (this.HP * 0.055).ROUND(2);
    this.Leech = 0.415;
    this.Absorption = 0;
    this.Reflection = 0.28;
}



function getShipPlusOneStat(shipUpgradeLevel) {
    let weapon = shipUpgradeLevel[0] + 1;
    let reactor = shipUpgradeLevel[1] + 1;
    let hull = shipUpgradeLevel[2] + 1;
    let wings = shipUpgradeLevel[3] + 1;
    let bonus = shipInfo["bonus"]
    let orbTier = bonus[1];
    let orbLv = bonus[2];
    let orbBonus = (0.02 * Math.pow(orbTier, 2) + orbLv / 100 * (0.08 * orbTier + 0.04) * 0.4) * bonus[0]


    this.Weapon = shipData["Effect Damage"][weapon];
    this.Reactor = shipData["Effect Shield"][reactor];
    this.Hull = shipData["Effect Health"][hull];
    this.Wings = (10 + 0.8 * wings) * (1 + Math.floor(wings / 5) / 20);


    this.Speed = this.Wings;
    this.Armor = this.Reactor;
    this.HP = (this.Hull * (1 + bonus[8] / 100) * (1 + bonus[7]) * (1 + orbBonus) * (1 + bonus[3])).ROUNDDOWN(2); //2자리까지 math.floor말고
    this.Damage = this.Weapon * (1 + bonus[9] / 100) * (1 + bonus[6]) * (1 + bonus[5]) * (1 + orbBonus) * (1 + bonus[3]) * (1 + bonus[4]);

    this.ArmorPenetrat = 1.425;
    this.RegenHP = (this.HP * 0.055).ROUND(2);
    this.Leech = 0.415;
    this.Absorption = 0.02;
    this.Reflection = 0.28;
}



function enemyShipData(level) {
    this.Weapon = shipData["Enemydamage"][level];
    this.Reactor = shipData["Enemyshield"][level];
    this.Hull = shipData["Enemyhealth"][level]
    this.Wings = shipData["Enemyspeed"][level];
    this.Speed = this.Wings;
    this.Armor = this.Reactor;
    this.HP = this.Hull;
    this.Damage = this.Weapon;
    this.ArmorPenetrat = 1;
    this.RegenHP = 0;
    this.Leech = 0;
    this.Absorption = (level - 1) * 0.02;
    this.Reflection = 0;
}

function getTrophyPoint(levelArr, enemyLv) {
    let baseLineLevel = levelArr["total_resources"][0]
    let leftLv = levelArr["leftship"];
    let midLv = levelArr["midship"];
    let rightLv = levelArr["rightship"];
    let Total_Ultinum_Gained = Math.max(shipData["Cum Ult Reward"][enemyLv - 1] - shipData["Cum Ult Reward"][baseLineLevel], 0) + levelArr["total_resources"][4]
    let Total_iMatter_Gained = Math.max(shipData["Cum I-Mat Reward"][enemyLv - 1] - shipData["Cum I-Mat Reward"][baseLineLevel], 0) + levelArr["total_resources"][2]
    let Total_PCore_Gained = 2.5 * Math.max(shipData["Cum Ult Reward"][enemyLv - 1] - shipData["Cum Ult Reward"][baseLineLevel], 0) + levelArr["total_resources"][3]
    let testUltinumIndex = Math.floor(Math.sqrt((Total_Ultinum_Gained - 20) / 20) + 1)
    let testIMatterIndex = Math.floor(Math.sqrt((Total_iMatter_Gained - 20) / 20) + 1)
    let testPCoreIndex = Math.floor(Math.sqrt((Total_PCore_Gained - 20) / 20) + 1)
    let testUltinumTrophy = shipData["Cum Tfy Reward"][testUltinumIndex]
    let testImatterTrophy = shipData["Cum Tfy Reward"][testIMatterIndex]
    let testPCoreTrophy = shipData["Cum Tfy Reward"][testPCoreIndex]
    let testSeriesTrophy = shipData["Cum Tfy Reward"][enemyLv - 1] * 2

    let midShipPower = shipData["Cum Ship Pwr"][midLv[0]] + shipData["Cum Ship Pwr"][midLv[2]] + 80;
    let leftShipPower = shipData["Cum Ship Pwr"][leftLv[2]] + 80;
    let rightShipPower = shipData["Cum Ship Pwr"][rightLv[0]] + shipData["Cum Ship Pwr"][rightLv[2]] + shipData["Cum Ship Pwr"][rightLv[3]] + 80;
    let droneShipPower = 825;
    let totalShipPower = midShipPower + leftShipPower + rightShipPower + droneShipPower;
    let testShipPowerTrophyIndex = Math.floor(Math.sqrt((totalShipPower - 25) / 5) + 1)
    let testShipPowerTrophy = shipData["Cum Tfy Reward"][testShipPowerTrophyIndex]


    var TrophyPointGained = testSeriesTrophy + testShipPowerTrophy + testUltinumTrophy + testImatterTrophy + testPCoreTrophy;


    function getTrophyCombination(trophyPoint) {
        var trophyPointAvailable = trophyPoint
        var levelMax = Math.floor((-1 + Math.sqrt(4 / 5 * trophyPointAvailable - 3)) / 2)
        if (levelMax > 100) levelMax = 100;
        //combination : levelmax +- 5?
        // e.g levelmax = 50 -> 54 53 52 51 50
        var maxIteration = Math.max(Math.min(101 - levelMax, 7), 0);
        var trophyCombination = [];
        return getCombination(trophyCombination, trophyPointAvailable, levelMax, maxIteration);

        function getCombination(arr, trophyPoint, levelMax, iteration) {
            for (let i = 0; i < iteration; i++) {
                let levelSet = (levelMax + i > 100) ? 100 : (levelMax + i);
                let trophyPointRemaining = trophyPoint - (5 * ((levelSet * ((levelSet + 1) / 2))))
                let trophyLv = Math.floor((-1 + Math.sqrt(2 / 5 * trophyPointRemaining - 3)))
                if (trophyLv > 100) trophyLv = 100;
                let temp = [levelSet, trophyLv]
                arr.push(temp)
            }
            return arr;
        }

    }
    return getTrophyCombination(TrophyPointGained);
}

function costCheck(levelArr, enemyLv) {
    var { Total_Ultinum_Cost,
        Total_iMatter_Cost,
        Curr_Total_Ultinum_Cost,
        Curr_Total_iMatter_Cost
    } = shipCost(levelArr, enemyLv);
    let currentCleared = levelArr["total_resources"][1]

    let currentUltinum = levelArr["current_resources"][0]
    let currentIMatter = levelArr["current_resources"][1]
    //max(current cleard + 1 -  enemyLv -1, 0) + current on hand - (cost - currcost)
    let UltinumCheck = Math.max(shipData["Cum Ult Reward"][enemyLv - 1] - shipData["Cum Ult Reward"][currentCleared + 2], 0) + currentUltinum - (Total_Ultinum_Cost - Curr_Total_Ultinum_Cost)
    let ImatterCheck = Math.max(shipData["Cum I-Mat Reward"][enemyLv - 1] + shipData["Cum I-Mat Reward"][currentCleared + 2], 0) + currentIMatter - (Total_iMatter_Cost - Curr_Total_iMatter_Cost)
    if (UltinumCheck < 0 || ImatterCheck < 0) return false
    else return true;

    function shipCost(levelArr, enemyLv) {
        let leftLv = levelArr["leftship"];
        let midLv = levelArr["midship"];
        let rightLv = levelArr["rightship"];
        let currleftLv = levelArr["Currleftship"];
        let currmidLv = levelArr["Currmidship"];
        let currrightLv = levelArr["Currrightship"];
        let baseLineLevel = levelArr["total_resources"][0]
        let HPTrophyLevel = levelArr["bonus"][8]
        let DamageTrophyLevel = levelArr["bonus"][9]



        let Left_Ultinum_Cost = shipData["Cum Ult"][leftLv[0]] + shipData["Cum Ult"][leftLv[1]] + shipData["Cum Ult"][leftLv[2]] + shipData["Cum Ult"][leftLv[3]];
        let Middle_Ultinum_Cost = shipData["Cum Ult"][midLv[0]] + shipData["Cum Ult"][midLv[1]] + shipData["Cum Ult"][midLv[2]] + shipData["Cum Ult"][midLv[3]];
        let Right_Ultinum_Cost = shipData["Cum Ult"][rightLv[0]] + shipData["Cum Ult"][rightLv[1]] + shipData["Cum Ult"][rightLv[2]] + shipData["Cum Ult"][rightLv[3]];
        let Drone_Ultinum_Cost = 0;
        let Total_Ultinum_Cost = Left_Ultinum_Cost + Middle_Ultinum_Cost + Right_Ultinum_Cost + Drone_Ultinum_Cost;
        let Total_Ultinum_Gained = Math.max(shipData["Cum Ult Reward"][enemyLv - 1] - shipData["Cum Ult Reward"][baseLineLevel], 0) + levelArr["total_resources"][4]
        let Left_iMatter_Cost = shipData["Cum I-Mat"][leftLv[0]] + shipData["Cum I-Mat"][leftLv[1]] + shipData["Cum I-Mat"][leftLv[2]] + shipData["Cum I-Mat"][leftLv[3]];
        let Middle_iMatter_Cost = shipData["Cum I-Mat"][midLv[0]] + shipData["Cum I-Mat"][midLv[1]] + shipData["Cum I-Mat"][midLv[2]] + shipData["Cum I-Mat"][midLv[3]];
        let Right_iMatter_Cost = shipData["Cum I-Mat"][rightLv[0]] + shipData["Cum I-Mat"][rightLv[1]] + shipData["Cum I-Mat"][rightLv[2]] + shipData["Cum I-Mat"][rightLv[3]];
        let Drone_iMatter_Cost = 180000;
        let Total_iMatter_Cost = Left_iMatter_Cost + Middle_iMatter_Cost + Right_iMatter_Cost + Drone_iMatter_Cost;
        let Total_iMatter_Gained = Math.max(shipData["Cum I-Mat Reward"][enemyLv - 1] - shipData["Cum I-Mat Reward"][baseLineLevel], 0) + levelArr["total_resources"][2]

        let Curr_Left_Ultinum_Cost = shipData["Cum Ult"][currleftLv[0]] + shipData["Cum Ult"][currleftLv[1]] + shipData["Cum Ult"][currleftLv[2]] + shipData["Cum Ult"][currleftLv[3]];
        let Curr_Middle_Ultinum_Cost = shipData["Cum Ult"][currmidLv[0]] + shipData["Cum Ult"][currmidLv[1]] + shipData["Cum Ult"][currmidLv[2]] + shipData["Cum Ult"][currmidLv[3]];
        let Curr_Right_Ultinum_Cost = shipData["Cum Ult"][currrightLv[0]] + shipData["Cum Ult"][currrightLv[1]] + shipData["Cum Ult"][currrightLv[2]] + shipData["Cum Ult"][currrightLv[3]];
        let Curr_Drone_Ultinum_Cost = 0;
        let Curr_Total_Ultinum_Cost = Curr_Left_Ultinum_Cost + Curr_Middle_Ultinum_Cost + Curr_Right_Ultinum_Cost + Curr_Drone_Ultinum_Cost;

        let Curr_Left_iMatter_Cost = shipData["Cum I-Mat"][currleftLv[0]] + shipData["Cum I-Mat"][currleftLv[1]] + shipData["Cum I-Mat"][currleftLv[2]] + shipData["Cum I-Mat"][currleftLv[3]];
        let Curr_Middle_iMatter_Cost = shipData["Cum I-Mat"][currmidLv[0]] + shipData["Cum I-Mat"][currmidLv[1]] + shipData["Cum I-Mat"][currmidLv[2]] + shipData["Cum I-Mat"][currmidLv[3]];
        let Curr_Right_iMatter_Cost = shipData["Cum I-Mat"][currrightLv[0]] + shipData["Cum I-Mat"][currrightLv[1]] + shipData["Cum I-Mat"][currrightLv[2]] + shipData["Cum I-Mat"][currrightLv[3]];
        let Curr_Drone_iMatter_Cost = 180000;
        let Curr_Total_iMatter_Cost = Curr_Left_iMatter_Cost + Curr_Middle_iMatter_Cost + Curr_Right_iMatter_Cost + Curr_Drone_iMatter_Cost;


        let Total_PCore_Gained = 2.5 * Math.max(shipData["Cum Ult Reward"][enemyLv - 1] - shipData["Cum Ult Reward"][baseLineLevel], 0) + levelArr["total_resources"][3]

        let testUltinumIndex = Math.floor(Math.sqrt((Total_Ultinum_Gained - 20) / 20) + 1)
        let testIMatterIndex = Math.floor(Math.sqrt((Total_iMatter_Gained - 20) / 20) + 1)
        let testPCoreIndex = Math.floor(Math.sqrt((Total_PCore_Gained - 20) / 20) + 1)
        let testUltinumTrophy = shipData["Cum Tfy Reward"][testUltinumIndex]
        let testImatterTrophy = shipData["Cum Tfy Reward"][testIMatterIndex]
        let testPCoreTrophy = shipData["Cum Tfy Reward"][testPCoreIndex]
        let testSeriesTrophy = shipData["Cum Tfy Reward"][enemyLv - 1] * 2

        let midShipPower = shipData["Cum Ship Pwr"][midLv[0]] + shipData["Cum Ship Pwr"][midLv[2]] + 80;
        let leftShipPower = shipData["Cum Ship Pwr"][leftLv[2]] + 80;
        let rightShipPower = shipData["Cum Ship Pwr"][rightLv[0]] + shipData["Cum Ship Pwr"][rightLv[2]] + shipData["Cum Ship Pwr"][rightLv[3]] + 80;
        let droneShipPower = 825;
        let totalShipPower = midShipPower + leftShipPower + rightShipPower + droneShipPower;
        let testShipPowerTrophyIndex = Math.floor(Math.sqrt((totalShipPower - 25) / 5) + 1)
        let testShipPowerTrophy = shipData["Cum Tfy Reward"][testShipPowerTrophyIndex]

        let TrophyPointGained = testSeriesTrophy + testShipPowerTrophy + testUltinumTrophy + testImatterTrophy + testPCoreTrophy;
        let TrophyPointUsed = (5 * ((DamageTrophyLevel * (DamageTrophyLevel + 1) / 2))) + (5 * ((HPTrophyLevel * (HPTrophyLevel + 1) / 2)))

        return {
            Total_Ultinum_Cost,
            Total_Ultinum_Gained,
            Total_iMatter_Cost,
            Total_iMatter_Gained,
            Total_PCore_Gained,
            totalShipPower,
            TrophyPointGained,
            TrophyPointUsed,
            Curr_Total_Ultinum_Cost,
            Curr_Total_iMatter_Cost
        }
    }
}

module.exports = {
    getShipStat,
    getShipPlusOneStat,
    enemyShipData,
    costCheck,
    getTrophyPoint,
    Number
}

