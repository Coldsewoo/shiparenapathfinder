const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listGuildInfo);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function listGuildInfo(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1fE1Ju9pkbmtWVZP3OrVyb8ElwC0Rb5CkENMbVkCFTA4',
        range: 'ShipArena!B1:O28',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        var rows = res.data.values;
        var shipInfo = {};

        if (rows.length) {
            var bonusInfo = [];
            bonusInfo.push(Number(rows[0][2].substring(0, rows[0][2].length - 1)));
            bonusInfo.push(Number(rows[1][1]))
            bonusInfo.push(Number(rows[1][2]))
            bonusInfo.push(Number(rows[2][2].substring(0, rows[2][2].length - 1)) / 100);
            bonusInfo.push(Number(rows[3][2].substring(0, rows[3][2].length - 1)) / 100);
            bonusInfo.push(Number(rows[4][2].substring(0, rows[4][2].length - 1)) / 100);
            bonusInfo.push(Number(rows[5][2].substring(0, rows[5][2].length - 1)) / 100);
            bonusInfo.push(Number(rows[6][2].substring(0, rows[6][2].length - 1)) / 100);
            bonusInfo.push(Number(rows[7][1]));  //trophy
            bonusInfo.push(Number(rows[8][1]));

            var availableResources = [];
            availableResources.push(Number(rows[18][1].replace(/,/g, "")))
            availableResources.push(Number(rows[19][1].replace(/,/g, "")))


            var totalResources = [];
            totalResources.push(Number(rows[22][1].replace(/,/g, "")))  //baseline cleared
            totalResources.push(Number(rows[22][3].replace(/,/g, ""))) //current best cleared
            totalResources.push(Number(rows[24][1].replace(/,/g, "")))
            totalResources.push(Number(rows[25][1].replace(/,/g, "")))
            totalResources.push(Number(rows[26][1].replace(/,/g, "")))
            totalResources.push(Number(rows[27][1].replace(/,/g, "")))

            var leftShip = [];
            leftShip.push(Number(rows[19][6]))
            leftShip.push(Number(rows[20][6]))
            leftShip.push(Number(rows[21][6]))
            leftShip.push(Number(rows[22][6]))

            var midShip = [];
            midShip.push(Number(rows[19][8]))
            midShip.push(Number(rows[20][8]))
            midShip.push(Number(rows[21][8]))
            midShip.push(Number(rows[22][8]))

            var rightShip = [];
            rightShip.push(Number(rows[19][10]))
            rightShip.push(Number(rows[20][10]))
            rightShip.push(Number(rows[21][10]))
            rightShip.push(Number(rows[22][10]))


            var CurrleftShip = [];
            CurrleftShip.push(Number(rows[7][6]))
            CurrleftShip.push(Number(rows[8][6]))
            CurrleftShip.push(Number(rows[9][6]))
            CurrleftShip.push(Number(rows[10][6]))

            var CurrmidShip = [];
            CurrmidShip.push(Number(rows[7][7]))
            CurrmidShip.push(Number(rows[8][7]))
            CurrmidShip.push(Number(rows[9][7]))
            CurrmidShip.push(Number(rows[10][7]))

            var CurrrightShip = [];
            CurrrightShip.push(Number(rows[7][8]))
            CurrrightShip.push(Number(rows[8][8]))
            CurrrightShip.push(Number(rows[9][8]))
            CurrrightShip.push(Number(rows[10][8]))



            shipInfo["bonus"] = bonusInfo;
            shipInfo["current_resources"] = availableResources;
            shipInfo["total_resources"] = totalResources;
            shipInfo["leftship"] = leftShip;
            shipInfo["midship"] = midShip;
            shipInfo["rightship"] = rightShip;
            shipInfo["Currleftship"] = CurrleftShip;
            shipInfo["Currmidship"] = CurrmidShip;
            shipInfo["Currrightship"] = CurrrightShip;


            var jsonPath = path.resolve(__dirname, "info.json");
            fs.writeFileSync(jsonPath, JSON.stringify(shipInfo, null, 2))
        } else {
            console.log('No data found.');
        }
    });
}


// 0Level
// 1Ultinum
// 2Cum Ult
// 3I-Matter
// 4Cum I-Mat
// 5Effect Shield
// 6Correction Shield
// 7Effect Health
// 8Effect Damage
// 9Effect Wings
// 10Regen
// 11Leech
// 12Shield Pen
// 13Reflection
// 141Shield Absorb
// 15Deadly Inc
// 16Enemyhealth
// 17Enemyshield
// 18Effectiveshield
// 19Enemydamage
// 20Enemyspeed
// 21I-Mat (Drone)
// 22Cum I-Mat (Drone)
// 23Ult Reward
// 24Cum Ult Reward
// 25I-Mat Reward
// 26Cum I-Mat Reward
// 27AP Reward
// 28Ship Upg Pwr
// 29Cum Ship Pwr
// 30Tfy Reward
// 31Cum Tfy Reward