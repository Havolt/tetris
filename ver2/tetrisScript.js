function creElT(type, cls, apnd, inHL, id){
    let newEl = document.createElement(type);
    if(typeof(cls) == 'string'){
        newEl.classList.add(cls);
    }else if(typeof(cls) == 'object'){
        for(let i = 0; i < cls.length; i++){
            newEl.classList.add(cls[i]);
        }
    }
    if(inHL){newEl.innerHTML=inHL}
    if(id){newEl.id = id};
    apnd.appendChild(newEl);
}

let tetrisObj = {timer : 50, playerPiece : {}, nextPiece: {}, moveDownRunner : 10, restedPieces: [], movePiece: 0};
let score = 0;
let highScore = 0;

                                        ////Data Creation Section/////

//Creates Data in tetrisObj of map
function createMapData(obj){
    let newArr = [];
    for(let i = 0; i < 180; i++){
        let arrObj = {};
        arrObj.num = i;
        arrObj.y = Math.floor(i/10);
        arrObj.x = Number(i.toString().split('').pop());
        arrObj.empty = true;
        arrObj.permanent = false;
        arrObj.color = "";
        arrObj.classes = ['tile'];
        if(arrObj.x == 0){arrObj.classes.push('firstTileX')};
        newArr.push(arrObj);
    }
    obj.mapData = newArr;
}

//Accepts passes from createShapeDataCaller to make piece data and place it into tetrisObj.pieceTypes
 function createShapeData(piece, obj){
    let newOb = {}
    for(let h = 0; h < piece.length-1; h++){
        let newPiece = [];
        for(let i = 0; i < 16; i++){
            let sameNum = false;
            for(let j = 0; j < piece[h].length; j++){
                if(piece[h][j] == i){sameNum = true}
            }
            if(sameNum){newPiece.push(1)}
            else{newPiece.push(0)}
        }
        if(h == 0){newOb['0'] = newPiece};
        if(h == 1){newOb['1'] = newPiece};
        if(h == 2){newOb['2'] = newPiece};
        if(h == 3){newOb['3'] = newPiece};
    }
    newOb.name = piece[4];
    newOb.color = piece[5];
    obj.push(newOb);
}

//Calls createShapeData multiple times with different shapes
function createShapeDataCaller(obj){
        let newArr = [];
        tetrisObj.pieceTypes = newArr;
        //Line
        createShapeData([[1,5,9,13], [4,5,6,7], [2,6,10,14], [8,9,10,11], 'Line', 'cyan'], obj.pieceTypes);
        //J-Shape
        createShapeData([[1,2,5,9], [4,5,6,10], [1,5,8,9], [0,4,5,6], 'J-Shape', 'blue'], obj.pieceTypes);
        //L-Shape
        createShapeData([[0,1,5,9], [2,4,5,6], [1,5,9,10], [4,5,6,8], 'L-Shape', 'orange'], obj.pieceTypes);
        //Square
        createShapeData([[5,6,9,10], [5,6,9,10], [5,6,9,10], [5,6,9,10], 'Square', 'yellow'], obj.pieceTypes);
        //S-Shape
        createShapeData([[0,4,5,9], [1,2,4,5], [1,5,6,10], [5,6,8,9], 'S-Shape', 'green'], obj.pieceTypes );
        //Tee
        createShapeData([[1,4,5,6], [1,5,6,9], [4,5,6,9], [1,4,5,9], 'Tee', 'purple'], obj.pieceTypes);
        //Z-Shape
        createShapeData([[1,4,5,8], [0,1,5,6], [2,5,6,9], [4,5,9,10], 'Z-Shape', 'red'], obj.pieceTypes);
}


                                        ////Map Creation Section/////

    //Draws map based on what is in the tetrisObj.mapData
    function drawMap(arr){
        document.getElementsByClassName('tetrisBoard')[0].innerHTML='';
        for(let i = 0; i < arr.length; i++){
            creElT('div', arr[i].classes, document.getElementsByClassName('tetrisBoard')[0]);
        }
    }

                                        ////Player Controlled Piece Section/////

    //Adds player control to game
    function playerControl(e){
        if(e == 37){tetrisObj.movePiece = 1};
        if(e == 39){tetrisObj.movePiece = 2};
        if(e == 40){tetrisObj.movePiece = 3};
        if(e == 90){tetrisObj.movePiece = 4};
        if(e == 67){tetrisObj.movePiece = 5};
    }

    //Game takes in tetrisObj.movePiece and does correct command //Code// 37 == Left // 39 == Right // 40 == Down // 90 == Anti-Clock // 67 == Clock
    function userCommands(comm, arr){
        let allowMove = true;
        let displacement = 0;
        let nextDirection;
        let rotatedArr = [];
        let rotatedArrTrue = [];
        let moveTruePos = 0;
        for(let i = 0; i < arr.length; i++){
            if(comm == 1){ if(arr[i].toString().split('').pop() == '0'){allowMove = false}}
            if(comm == 1){if(tetrisObj.mapData[arr[i]-1].permanent){allowMove = false}}
            if(comm == 2){ if(arr[i].toString().split('').pop() == '9'){allowMove = false}}
            if(comm == 2){if(tetrisObj.mapData[arr[i]+1].permanent){allowMove = false}}
        }

        //Adds and takes away number to get next rotation
        if(comm == 4){
            nextDirection = tetrisObj.playerPiece.direction - 1;
            if(nextDirection < 0){nextDirection = 3};
        }
        if(comm == 5){
            nextDirection = tetrisObj.playerPiece.direction + 1;
            if(nextDirection > 3){nextDirection = 0};
       }


       ////////////////// NEED TO CHECK IF POSITION IS AGAINST WALL IF ROTATING THEN NEED TO CHECK IF ITS ROTATING ONTO NEXT LEVEL //////////
       



       let onLeft = false;
       let onRight = false;

       //Checks if piece is in a position on Right or Left to be checked for rotation overlaps
       if(comm == 4 || comm == 5){
            for(let i = 0; i < arr.length; i++){
                
                if(arr[i].toString().split('').pop() == 8 || arr[i].toString().split('').pop() == 9 ){
                    onRight = true;
                }
                if(arr[i].toString().split('').pop() == 0 || arr[i].toString().split('').pop() == 1){
                    onLeft = true;
                }
            }




            //Obtains the next rotation map and places it into rotatedArr
            for(let i = 0; i < tetrisObj.pieceTypes.length; i++){
                if(tetrisObj.playerPiece.shape == tetrisObj.pieceTypes[i].name){
                    rotatedArr = tetrisObj.pieceTypes[i][nextDirection];
                }
            }
            //Gets true positions of rotated Piece
            for(let i = 0; i < rotatedArr.length; i++){
                    if(rotatedArr[i] == 1){
                        let multiplier = Math.floor(i/4);
                        let levelAdd = 6;
                        levelAdd = levelAdd * multiplier;
                        let tileLoc = tetrisObj.playerPiece.truePos + levelAdd + i; 
                        rotatedArrTrue.push(tileLoc);
                    }
            }

            //Checks if piece on side overlaps to next level on rotation
            if(onLeft || onRight){
                for(let i = 0; i < rotatedArrTrue.length; i++){
                    
                    if(onLeft){
                        if(rotatedArrTrue[i].toString().split('').pop() == 8){displacement = 2};
                        if(rotatedArrTrue[i].toString().split('').pop() == 9 && displacement != 2){displacement = 1};
                    }
                    if(onRight){
                        if(rotatedArrTrue[i].toString().split('').pop() == 1){displacement = -2};
                        if(rotatedArrTrue[i].toString().split('').pop() == 0 && displacement != -2){displacement = -1};
                    }
                    
                }
            }
            //Assigns new values to pieces dependant on displacement var
            if((onLeft || onRight) && displacement){
                for(let i = 0; i < rotatedArrTrue.length; i++){
                    rotatedArrTrue[i] = rotatedArrTrue[i] + displacement;
                }
            }



            //Checks if pieces it rotates into are taken up
            for(let i = 0; i < rotatedArrTrue.length; i++){
                if(tetrisObj.mapData[rotatedArrTrue[i]].permanent){allowMove = false}
            }
        }

        
        if(allowMove){
            if(comm == 1){tetrisObj.playerPiece.truePos--};
            if(comm == 2){tetrisObj.playerPiece.truePos++};
            if(comm == 3){tetrisObj.moveDownRunner = 0};
            if(comm == 4 || comm == 5){removeEmptyTiles(tetrisObj.playerPiece.trueMap, tetrisObj.mapData);}
            if(comm == 4 || comm == 5){tetrisObj.playerPiece.map = rotatedArr}
            if(comm == 4 || comm == 5){tetrisObj.playerPiece.truePos += displacement}
            if(comm == 4 || comm == 5){tetrisObj.playerPiece.trueMap = rotatedArrTrue}
            if(comm == 4 || comm == 5){tetrisObj.playerPiece.direction = nextDirection}
            //if(comm == 4 || comm == 5){console.log(tetrisObj.playerPiece)}
        }
    } 

    //Selects new piece at random for nextPiece section  //Direction // 0 == N // 1 == E // 2 == S// 3 == W // 
    function randomPieceSelect(obj, pieces){
        let randPiece = Math.floor(Math.random() * pieces.length);
        let randPieceDir = Math.floor(Math.random() * 4);
        obj.direction = randPieceDir;
        obj.shape = pieces[randPiece].name;
        obj.map = pieces[randPiece][randPieceDir+''];
        obj.color = pieces[randPiece].color;
        obj.userPos = 3;
        obj.truePos = 3;
    }

    //Gets playerPiece from nextPiece section
    function playerPieceSelect(player, next, pieces){
        player.direction = next.direction;
        player.shape = next.shape;
        player.map = next.map;
        player.trueMap = [];
        player.color = next.color;
        player.userPos = 3;
        player.truePos = 3;
        randomPieceSelect(next, pieces); 
    }

    //Gives real location data to Piece
    function realLocationData(piece){
        piece.trueMap = [];
        for(let i = 0; i < piece.map.length; i++){
            if(piece.map[i] == 1){
                let multiplier = Math.floor(i/4);
                let levelAdd = 6;
                levelAdd = levelAdd * multiplier;
                let tileLoc = piece.truePos + levelAdd + i; 
                piece.trueMap.push(tileLoc);
            }
        }
    }

    //Pass precise values of pieces to mapData
    function passPosToMap(piece, map){
        for(let i = 0; i < piece.trueMap.length; i++){
            map[piece.trueMap[i]].color = piece.color;
            map[piece.trueMap[i]].classes.push(piece.color + 'Tile');
            map[piece.trueMap[i]].empty = false;
        }
    }

    //Move truePos down a level after certain amount of time
    function movePieceDown(runner){
        tetrisObj.moveDownRunner--;
        if(runner == 0){ removeEmptyTiles(tetrisObj.playerPiece); tetrisObj.playerPiece.truePos += 10; tetrisObj.moveDownRunner = 10; };
    }

    //Erases previous blocks filled by tetris pieces
    function removeEmptyTiles(arr, map){
        for(let i = 0; i < arr.length; i++){
                if(map[arr[i]].permanent == false){
                map[arr[i]].color = "";
                map[arr[i]].empty = true;
                for(let j = 0; j < map[arr[i]].classes.length; j++){
                    if(map[arr[i]].classes[j] != 'tile' && map[arr[i]].classes[j] != 'firstTileX'){map[arr[i]].classes.splice(j, 1); j--;}
                }
            }
        }
    }

    //What happens when Piece is in a resting position
    function pieceAtRest(){
        lockPiece(tetrisObj.playerPiece.trueMap, tetrisObj.mapData);
        addRestedPiece(tetrisObj.playerPiece.trueMap, tetrisObj.restedPieces);
        checkLines(tetrisObj.mapData);
        playerPieceSelect(tetrisObj.playerPiece, tetrisObj.nextPiece, tetrisObj.pieceTypes);
    }

    //Lock Piece into position
    function lockPiece(arr, map){
        for(let i = 0; i < arr.length; i++){
            map[arr[i]].permanent = true;
        }
    }

    //Add piece to restedPieces Array
    function addRestedPiece(arr, restedArr){
        let newArr = [];
        for(let i = 0; i < arr.length; i++){
            newArr.push(arr[i]);
        }
        restedArr.push(newArr);
    }


                                            /////Checks if piece is in a resting position/////

    //Will check is piece is in a fixed position
    function restCheck(piece){
        let restTrue = false;
        for(let i = 0; i < piece.trueMap.length; i++){
            if(piece.trueMap[i] + 10 > tetrisObj.mapData.length-1){
                restTrue = true;
            }
            else if(tetrisObj.mapData[piece.trueMap[i]+10].permanent){
                restTrue = true;
            }
        }
        if(restTrue){
            pieceAtRest();
            tetrisObj.moveDownRunner = 10;
        }
    }


                                            /////Section deals with lines of complete tetris/////

    //Checks to see what lines are filled in and passes information on to removeLines()
    function checkLines(map){
        let completeRowTiles = [];
        let rowArr = [];
        let nextSameY = true;
        let allFilled = true;
        for(let i = 0; i < map.length; i++){
            rowArr.push(map[i]);
            if(map[i].permanent == false){allFilled = false}
            if(map[i+1]){
                if(map[i+1].y != map[i].y){nextSameY = false}
            }else if(!map[i+1]){nextSameY = false}
            if(!nextSameY && allFilled){
                for(let j = 0; j < rowArr.length; j++){completeRowTiles.push(rowArr[j])}
            }
            if(!nextSameY){allFilled = true; nextSameY = true; rowArr = []}
        }
        if(completeRowTiles.length){ 
            removeLines(completeRowTiles);
            let addPoints = completeRowTiles.length * 10;
            addPoints = addPoints * Number(completeRowTiles.length.toString().split('').shift())
            score += addPoints;
            console.log(score)
        }
    }

    //Removes completed lines from game
    function removeLines(arr){
        for(let i = 0; i < arr.length; i++){
            arr[i].color = '';
            arr[i].empty = true;
            arr[i].permanent = false;
            for(let j = 0; j < arr[i].classes.length; j++){
                if(arr[i].classes[j] != 'tile' && arr[i].classes[j] != 'firstTileX'){
                    arr[i].classes.splice(j, 1);
                    j--;
                }
            }
        }
        for(let i = 0; i < arr.length; i++){
            for(let j = 0; j < tetrisObj.restedPieces.length; j++){
                for(let k = 0; k < tetrisObj.restedPieces[j].length; k++){
                    if(arr[i].num == tetrisObj.restedPieces[j][k]){
                        tetrisObj.restedPieces[j].splice(k, 1);
                        k--;
                    }
                }
            }
            for(let i = 0; i < tetrisObj.restedPieces.length; i++){
                if(tetrisObj.restedPieces[i].length < 1){
                    tetrisObj.restedPieces.splice(i, 1);
                    i--;
                }
            }
        }
        dropBlocks(arr);
    };

    //Drop Blocks Above taken Line down
    function dropBlocks(rowArr){
        let dropAmt = rowArr.length / 10;
        let dropLevels = [];
        let dropAbv;

        //Cycle through rowArr and add levels of removed lines to it
        for(let i = 0; i < rowArr.length; i++){
            if(i % 10 == 0){dropLevels.push(rowArr[i].y)};
        }
        dropLevels = dropLevels.reverse();

        
        for(let i = 0; i < dropLevels.length; i++){
            for(let j = tetrisObj.mapData.length-1; j >= 0; j--){
                if(tetrisObj.mapData[j].y < dropLevels[i]){
                    

                    tetrisObj.mapData[j+10].color = tetrisObj.mapData[j].color;
                    tetrisObj.mapData[j+10].empty = tetrisObj.mapData[j].empty;
                    tetrisObj.mapData[j+10].permanent = tetrisObj.mapData[j].permanent;
                    tetrisObj.mapData[j+10].classes = [];
                    for(let k = 0; k < tetrisObj.mapData[j].classes.length; k++){
                        tetrisObj.mapData[j+10].classes.push(tetrisObj.mapData[j].classes[k]);
                    }

                    for(let k = 0; k < tetrisObj.restedPieces.length; k++){
                        for(let l = 0; l < tetrisObj.restedPieces[k].length; l++){
                            if(tetrisObj.mapData[j].num == tetrisObj.restedPieces[k][l]){
                                tetrisObj.restedPieces[k][l] += 10;
                            }
                        }
                    }

                    
                    
                }
            }
            for(let k = i; k < dropLevels.length; k++){
                dropLevels[k] = dropLevels[k] + 1;
            }
        }
        
        gravity(tetrisObj.restedPieces, tetrisObj.mapData);
        
    }

    //Enacts gravity on floating blocks 
    function gravity(restArr, mapArr){
        
        for(i = mapArr.length-1; i >= 0; i--){
            for(let j = 0; j < restArr.length; j++){
                for(let k = 0; k < restArr[j].length; k++){
                    if(mapArr[i].num == restArr[j][k]){


                        let possibleGrav = true;

                        for(l = 0; l < restArr[j].length; l++){
                            let samePiece = false;
                            for(let m = 0; m < restArr[j].length; m++){
                                if(restArr[j][l]+10 == restArr[j][m]){samePiece = true;}
                            }
                            if(mapArr[restArr[j][l]+10]){
                                if(mapArr[restArr[j][l]+10].permanent && !samePiece){possibleGrav = false}
                            }else{possibleGrav = false}
                            
                        }
                        if(possibleGrav){
                            console.log(restArr[j]);
                        }
                        
                    }
                }
            }
        }
    }


                                        /////Scoreboard Section/////

    function drawScoreBoard(){
        creElT('div', 'scoreboard', document.getElementById('app'), '0');
    }

    function updateScoreBoard(sb){
        sb.innerHTML = score;
    }



                                        /////Recursive Function with setTimeout/////

    function gameEngine(time){
        if(tetrisObj.movePiece){
            userCommands(tetrisObj.movePiece, tetrisObj.playerPiece.trueMap);
            tetrisObj.movePiece = 0;
        }
        if(tetrisObj.moveDownRunner == 0){
            restCheck(tetrisObj.playerPiece, tetrisObj.moveDownRunner);
        }
        removeEmptyTiles(tetrisObj.playerPiece.trueMap, tetrisObj.mapData);
        movePieceDown(tetrisObj.moveDownRunner);
        realLocationData(tetrisObj.playerPiece, tetrisObj.mapData);
        passPosToMap(tetrisObj.playerPiece, tetrisObj.mapData);
        drawMap(tetrisObj.mapData);
        updateScoreBoard(document.getElementsByClassName('scoreboard')[0])
        setTimeout(function(){gameEngine(time)}, time);
    }




    

                                        ///// Initializes game /////

(function initApp(){
    creElT('div', 'app', document.body, '', 'app');
    creElT('div', 'tetrisBoard', document.getElementById('app'));
    createMapData(tetrisObj);
    createShapeDataCaller(tetrisObj);
    drawScoreBoard();
    randomPieceSelect(tetrisObj.nextPiece, tetrisObj.pieceTypes);
    playerPieceSelect(tetrisObj.playerPiece, tetrisObj.nextPiece, tetrisObj.pieceTypes);
    gameEngine(tetrisObj.timer);
    console.log(tetrisObj);
})()


                                        ///// Adds event listener which allows user to control game /////

document.addEventListener('keydown', function(e){
    playerControl(e.keyCode)
})