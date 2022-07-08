
var mainboard =
    [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];

var newest = [5, 5];
var score = 0;


var color_scale = chroma.scale(['#FCF4D9', '#8ED2C9', '#00AAA0','#FF7A5A','#FFB85F','#462066']);


function drawGrid() {
    // var mb = document.getElementById('maingrid');
    // mb.innerHTML = "";

    document.getElementById("score").innerHTML = score;
    for (var i = 0; i < mainboard.length; i++) {
        for (var j = 0; j < mainboard[i].length; j++) {
            var el = document.getElementById(i + "" + j);
            if (mainboard[i][j] !== 0) { el.innerHTML = "<div class=\"cellno\">" + mainboard[i][j] + "</div>"; }
            else { el.innerHTML = "<div class=\"cellno\"></div>"; }

            el.setAttribute('style', 'background-color:rgb(' + color_scale(getScale(mainboard[i][j])).rgb().toString() + ')');
        }
    }
    console.log(newest);
    if (newest[0] !== 5) {
        document.getElementById(newest[0] + "" + newest[1]).firstChild.classList.add('newest');
    }

}

function restart(){
    mainboard =
    [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];

    newest = [5, 5];
    score = 0;
    drawGrid();
    spawnRandom(); spawnRandom(); //initial;
    drawGrid(); //initial;
}

function getScale(n) {

    switch (n) {
        case 0: return 0;
        case 2: return 0.995;
        case 4: return 0.954;
        case 8: return 0.923;
        case 16: return 0.892;
        case 32: return 0.75;
        case 64: return 0.7;
        case 128: return 0.65;
        case 256: return 0.6;
        case 512: return 0.5;
        case 1024: return 0.45;
        case 2048: return 0.40;
        case 4096: return 0.35;
        case 8192: return 0.3;
        default: return 0.2;
    }
}

function spawnRandom() {

    var randpool = [];
    var randnum = [2, 4];
    for (var i = 0; i < mainboard.length; i++) {
        for (var j = 0; j < mainboard[i].length; j++) {
            if (mainboard[i][j] === 0)
                randpool.push([i, j]);
        }
    }

    if (randpool.length === 0) {
        alert("You lost!\n Final score: "+score);
        restart();
        return; //<===================================GAME ENDING CONDITION

    }
    var randindex = Math.floor(Math.random() * randpool.length);
    var numindex = Math.floor(Math.random() * randnum.length);

    mainboard[randpool[randindex][0]][randpool[randindex][1]] = randnum[numindex];
    var x = [randpool[randindex][1]];
    var y = [randpool[randindex][0]];
    newest = [];
    newest.push(y);
    newest.push(x);
}

document.onkeydown = checkKey; // INPUT CHECK <==================================================

function delay(t, v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // document.getElementById("maingrid").classList.add('maingrid-up');
        // delay(200).then(()=>{document.getElementById("maingrid").classList.remove('maingrid-up')});
        advanceTurn('UP');
    }
    else if (e.keyCode == '40') {
        // document.getElementById("maingrid").classList.add('maingrid-down');
        // delay(200).then(()=>{document.getElementById("maingrid").classList.remove('maingrid-down')});
        advanceTurn('DOWN');

    }
    else if (e.keyCode == '37') {
        // document.getElementById("maingrid").classList.add('maingrid-left');
        // delay(200).then(()=>{document.getElementById("maingrid").classList.remove('maingrid-left')});
        advanceTurn('LEFT');
    }
    else if (e.keyCode == '39') {
        // document.getElementById("maingrid").classList.add('maingrid-right');
        // delay(200).then(()=>{document.getElementById("maingrid").classList.remove('maingrid-right')});
        advanceTurn('RIGHT');
    }
}

function removeElementsWithValue(arr, val) { //FUNCTION TO REMOVE EMPTY CELLS
    var i = arr.length;
    while (i--) {
        if (arr[i] === val) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

function applyTurn(col) {

    var ccol = removeElementsWithValue(col, 0);

    for (var i = 0; i < ccol.length; i++) {
        if (ccol[i] > 0 && ccol[i] == ccol[i + 1]) {
            ccol[i] = ccol[i] + ccol[i + 1];
            ccol[i + 1] = 0;
            score = score + col[i];            
        }
    }

    var ccol = removeElementsWithValue(ccol, 0);

    for (var i = ccol.length; i < 5; i++) {
        ccol.push(0);
    }
    return ccol;
}

function saveArray(old) {

    var newar = [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];

    for (var i = 0; i < old.length; i++) {
        for (var j = 0; j < old[i].length; j++) {
            newar[i][j] = parseInt(old[i][j]); //just wanna copy the value man
        }
    }

    return newar;
}


function advanceTurn(dir) {

    
    var saveboard = saveArray(mainboard);
    console.log('saveboard: \n');
    console.log(saveboard);

    if (dir === 'UP') {
        var firstcol = [mainboard[0][0], mainboard[1][0], mainboard[2][0], mainboard[3][0]];
        var secondcol = [mainboard[0][1], mainboard[1][1], mainboard[2][1], mainboard[3][1]];
        var thirdcol = [mainboard[0][2], mainboard[1][2], mainboard[2][2], mainboard[3][2]];
        var fourthcol = [mainboard[0][3], mainboard[1][3], mainboard[2][3], mainboard[3][3]];

        new1col = applyTurn(firstcol);
        new2col = applyTurn(secondcol);
        new3col = applyTurn(thirdcol);
        new4col = applyTurn(fourthcol);

        //reapply
        mainboard[0][0] = new1col[0];
        mainboard[1][0] = new1col[1];
        mainboard[2][0] = new1col[2];
        mainboard[3][0] = new1col[3];

        mainboard[0][1] = new2col[0];
        mainboard[1][1] = new2col[1];
        mainboard[2][1] = new2col[2];
        mainboard[3][1] = new2col[3];

        mainboard[0][2] = new3col[0];
        mainboard[1][2] = new3col[1];
        mainboard[2][2] = new3col[2];
        mainboard[3][2] = new3col[3];

        mainboard[0][3] = new4col[0];
        mainboard[1][3] = new4col[1];
        mainboard[2][3] = new4col[2];
        mainboard[3][3] = new4col[3];
    }

    if (dir === 'DOWN') {
        var firstcol = [mainboard[0][0], mainboard[1][0], mainboard[2][0], mainboard[3][0]].reverse();
        var secondcol = [mainboard[0][1], mainboard[1][1], mainboard[2][1], mainboard[3][1]].reverse();
        var thirdcol = [mainboard[0][2], mainboard[1][2], mainboard[2][2], mainboard[3][2]].reverse();
        var fourthcol = [mainboard[0][3], mainboard[1][3], mainboard[2][3], mainboard[3][3]].reverse();

        new1col = applyTurn(firstcol);
        new2col = applyTurn(secondcol);
        new3col = applyTurn(thirdcol);
        new4col = applyTurn(fourthcol);

        //reapply
        mainboard[3][0] = new1col[0];
        mainboard[2][0] = new1col[1];
        mainboard[1][0] = new1col[2];
        mainboard[0][0] = new1col[3];

        mainboard[3][1] = new2col[0];
        mainboard[2][1] = new2col[1];
        mainboard[1][1] = new2col[2];
        mainboard[0][1] = new2col[3];

        mainboard[3][2] = new3col[0];
        mainboard[2][2] = new3col[1];
        mainboard[1][2] = new3col[2];
        mainboard[0][2] = new3col[3];

        mainboard[3][3] = new4col[0];
        mainboard[2][3] = new4col[1];
        mainboard[1][3] = new4col[2];
        mainboard[0][3] = new4col[3];
    }

    if (dir === 'LEFT') {
        var firstcol = [mainboard[0][0], mainboard[0][1], mainboard[0][2], mainboard[0][3]];
        var secondcol = [mainboard[1][0], mainboard[1][1], mainboard[1][2], mainboard[1][3]];
        var thirdcol = [mainboard[2][0], mainboard[2][1], mainboard[2][2], mainboard[2][3]];
        var fourthcol = [mainboard[3][0], mainboard[3][1], mainboard[3][2], mainboard[3][3]];

        new1col = applyTurn(firstcol);
        new2col = applyTurn(secondcol);
        new3col = applyTurn(thirdcol);
        new4col = applyTurn(fourthcol);

        //reapply
        mainboard[0][0] = new1col[0];
        mainboard[0][1] = new1col[1];
        mainboard[0][2] = new1col[2];
        mainboard[0][3] = new1col[3];

        mainboard[1][0] = new2col[0];
        mainboard[1][1] = new2col[1];
        mainboard[1][2] = new2col[2];
        mainboard[1][3] = new2col[3];

        mainboard[2][0] = new3col[0];
        mainboard[2][1] = new3col[1];
        mainboard[2][2] = new3col[2];
        mainboard[2][3] = new3col[3];

        mainboard[3][0] = new4col[0];
        mainboard[3][1] = new4col[1];
        mainboard[3][2] = new4col[2];
        mainboard[3][3] = new4col[3];
    }

    if (dir === 'RIGHT') {
        var firstcol = [mainboard[0][0], mainboard[0][1], mainboard[0][2], mainboard[0][3]].reverse();
        var secondcol = [mainboard[1][0], mainboard[1][1], mainboard[1][2], mainboard[1][3]].reverse();
        var thirdcol = [mainboard[2][3], mainboard[2][2], mainboard[2][1], mainboard[2][0]];
        var fourthcol = [mainboard[3][0], mainboard[3][1], mainboard[3][2], mainboard[3][3]].reverse();

        new1col = applyTurn(firstcol);
        new2col = applyTurn(secondcol);
        new3col = applyTurn(thirdcol);
        new4col = applyTurn(fourthcol);

        mainboard[0][3] = new1col[0];
        mainboard[0][2] = new1col[1];
        mainboard[0][1] = new1col[2];
        mainboard[0][0] = new1col[3];

        mainboard[1][3] = new2col[0];
        mainboard[1][2] = new2col[1];
        mainboard[1][1] = new2col[2];
        mainboard[1][0] = new2col[3];

        mainboard[2][3] = new3col[0];
        mainboard[2][2] = new3col[1];
        mainboard[2][1] = new3col[2];
        mainboard[2][0] = new3col[3];

        mainboard[3][3] = new4col[0];
        mainboard[3][2] = new4col[1];
        mainboard[3][1] = new4col[2];
        mainboard[3][0] = new4col[3];
    }

    console.log('mainboard: \n');
    console.log(mainboard);
    var comparison = compareArrays(saveboard, mainboard);
    console.log(comparison);
    if (!comparison) spawnRandom();
    drawGrid();
}

function compareArrays(arr1, arr2) {

    if (arr1.length != arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) return false;

        for (var j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) {
                return false;
            }
        }
    }
    return true;
}


drawGrid();
spawnRandom(); spawnRandom(); //initial;
drawGrid(); //initial;
