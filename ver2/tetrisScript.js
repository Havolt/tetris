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
        if(e == 40){tetrisObj.movePiece = 3}
    }

    //Game takes in tetrisObj.movePiece and does correct command //Code// 37 == Left // 39 == Right // 40 == Down //
    function userCommands(comm, arr){
        let allowMove = true;
        for(let i = 0; i < arr.length; i++){
            if(comm == 1){ if(arr[i].toString().split('').pop() == '0'){allowMove = false}}
            if(comm == 2){ if(arr[i].toString().split('').pop() == '9'){allowMove = false}}
        }
        if(allowMove){
            if(comm == 1){tetrisObj.playerPiece.truePos--};
            if(comm == 2){tetrisObj.playerPiece.truePos++};
            console.log(tetrisObj.playerPiece.truePos)
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


                                            ////Checks if piece is in a resting position/////

    //Will check is piece is in a fixed position
    function restCheck(piece){
        let restTrue = false;
        for(let i = 0; i < piece.trueMap.length; i++){
            if(piece.trueMap[i] + 10 > tetrisObj.mapData.length){
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
        setTimeout(function(){gameEngine(time)}, time);
    }




    

                                        ///// Initializes game /////

(function initApp(){
    creElT('div', 'app', document.body, '', 'app');
    creElT('div', 'tetrisBoard', document.getElementById('app'));
    createMapData(tetrisObj);
    createShapeDataCaller(tetrisObj);
    randomPieceSelect(tetrisObj.nextPiece, tetrisObj.pieceTypes);
    playerPieceSelect(tetrisObj.playerPiece, tetrisObj.nextPiece, tetrisObj.pieceTypes);
    gameEngine(tetrisObj.timer);
    console.log(tetrisObj);
})()


                                        ///// Adds event listener which allows user to control game /////

document.addEventListener('keydown', function(e){
    playerControl(e.keyCode)
})