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

let tetrisObj = {timer : 800, playerPiece : {}, nextPiece: {}};

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
        player.color = next.color;
        player.userPos = 3;
        player.truePos = 3;
        randomPieceSelect(next, pieces); 
    }

    //Sends piece data to tetrisObj.mapData
    function pieceDataToMap(piece, map){
        
        for(let i = 0; i < piece.map.length; i++){
            if(piece.map[i] == 1){
                let multiplier = Math.floor(i/4);
                let levelAdd = 6;
                levelAdd = levelAdd * multiplier;
                let tileLoc = piece.truePos + levelAdd + i; 
                console.log(map[tileLoc]);
                map[tileLoc].color = piece.color;
                map[tileLoc].empty = false;
                map[tileLoc].classes.push(piece.color + 'Tile');
            }
        }
    }


                                        /////Recursive Function with setTimeout/////

    function gameEngine(time){
        pieceDataToMap(tetrisObj.playerPiece, tetrisObj.mapData);
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

document.addEventListener('keydown', function(e){console.log(e)})