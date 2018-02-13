//function for creating elements
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
//Object holds all data
let tetrisBoard = {
    moveTimer : true,
    rotateTimer: true,
    tileArr : [],
    pieces: [],
    currPiece: {name : '', map: '', direction: '', truePos : []},
    makePieces: function(piece){
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
            if(h == 0){newOb.n = newPiece};
            if(h == 1){newOb.e = newPiece};
            if(h == 2){newOb.s = newPiece};
            if(h == 3){newOb.w = newPiece};
        }
        newOb.name = piece[4];
        newOb.color = piece[5];
        this.pieces.push(newOb);
    },
    //Makes pieces basic information
    makePiecesBlueprint: function(){
        //Line
        this.makePieces([[2,6,10,14], [8,9,10,11], [1,5,9,13], [4,5,6,7], 'Line', 'orange']);
        //Square
        this.makePieces([[5,6,9,10], [5,6,9,10], [5,6,9,10], [5,6,9,10], 'Square', 'yellow']);
        //L-Shape
        this.makePieces([[1,5,9,10], [2,4,5,6], [0,1,5,9], [4,5,6,8], 'L-Shape', 'red']);
        //J-Shape
        this.makePieces([[1,5,9,10], [0,4,5,6], [1,2,5,9], [4,5,6,10], 'J-Shape', 'cyan']);
        //Tee
        this.makePieces([[4,5,6,9], [1,4,5,9], [1,5,6,9], [1,4,5,6], 'Tee', 'green']);
        //Z-Shape
        this.makePieces([[2,5,6,9], [4,5,9,10], [1,4,5,8], [0,1,5,6], 'Z-Shape', 'amber']);
        //S-Shape
        this.makePieces([[1,5,6,10], [5,6,8,9], [0,4,5,9], [1,2,4,5], 'S-Shape', 'magenta'] );
    },
    //Picks current Piece
    selectPiece: function(arr, chosenPiece, dir){
        
        if(arr.length > 0){
            let spRand = Math.floor(Math.random()*arr.length);
            let spRand2 = Math.floor(Math.random()*4);
            let spRand3 = Math.floor(Math.random()*7);
            if(spRand2 == 0){this.currPiece.map = arr[spRand].n, this.currPiece.direction = 'n'}
            if(spRand2 == 1){this.currPiece.map = arr[spRand].e, this.currPiece.direction = 'e'}
            if(spRand2 == 2){this.currPiece.map = arr[spRand].s, this.currPiece.direction = 's'}
            if(spRand2 == 3){this.currPiece.map = arr[spRand].w, this.currPiece.direction = 'w'}
            this.currPiece.userLoc = 3;
            this.currPiece.name = arr[spRand].name;
            this.currPiece.color = arr[spRand].color;
            this.currPiece.location = 3;
            console.log(arr[spRand])
        }
        else{
            console.log(dir)
            this.currPiece.map = chosenPiece[dir];
            this.currPiece.direction = dir;
        }
    },
    //Places piece on map
    movePiece: function(){
        //console.log('boop')
        for(let i = 0; i < this.tileArr.length; i++){
            if(i == this.currPiece.location){
                let posRunSmall = 0;
                let posRun = 0;
                for(let j = 0; j < this.currPiece.map.length; j++){
                    if(this.currPiece.map[j] == 1){
                        this.tileArr[i+posRun+j].empty = false;
                        this.tileArr[i+posRun+j].classes.push(this.currPiece.color +'Tile');
                    }
                    posRunSmall++;
                    if(posRunSmall == '4'){posRun += 6; posRunSmall = 0;}
                }
                
            };
        }

    },
    //Guides correct event listeners to right functions
    eventListenerGate: function(e){
        if(e.keyCode == 90 || e.keyCode == 67){
            this.userRotatePiece(e);
        }
        if(e.keyCode == 37 || e.keyCode == 39){
            this.userMovePiece(e);
        }
    },
    //Gives user ability to rotate piece
    userRotatePiece: function(e){
        console.log(this.currPiece);
        //Checkes direction of currPiece and assigns numeric value
        let direc = 0;
        if(this.currPiece.direction == 'e'){direc = 1}
        else if(this.currPiece.direction == 's'){direc = 2}
        else if(this.currPiece.direction == 'w'){direc = 3}
        //Changes value accoring to keypress
        if(e.keyCode == 90){direc--};
        if(e.keyCode == 67){direc++};
        //Changes value to proper number
        if(direc == -1){direc = 3}
        if(direc == 4){direc = 0}
        //Change piece back to direction
        if(direc == 0){direc = 'n'}
        else if(direc == 1){direc = 'e'}
        else if(direc == 2){direc = 's'}
        else if(direc == 3){direc = 'w'}

        for(let i = 0; i < this.pieces.length; i++){
            if(this.pieces[i].name == this.currPiece.name){
                this.selectPiece([], this.pieces[i], direc  )
            }
        }
    },
    //Gives user ability to move piece
    userMovePiece: function(e){

        let allowMoveRight = true;
        let allowMoveLeft = true;
        for(let i = 0; i < tetrisBoard.currPiece.truePos.length; i++){
            let stringOfNum = tetrisBoard.currPiece.truePos[i].toString().split('').pop();
            if(stringOfNum == 9){allowMoveRight = false}
            if(stringOfNum == 0){allowMoveLeft = false}
        }
        for(let i = 0; i < tetrisBoard.currPiece.truePos.length; i++){
            if(!tetrisBoard.tileArr[tetrisBoard.currPiece.truePos[i]+1].empty && tetrisBoard.tileArr[tetrisBoard.currPiece.truePos[i]+1].permanent){
                allowMoveRight = false;
            }
            if(!tetrisBoard.tileArr[tetrisBoard.currPiece.truePos[i]-1].empty && tetrisBoard.tileArr[tetrisBoard.currPiece.truePos[i]-1].permanent){
                allowMoveLeft = false;
            }
        }
        if(e.keyCode == 37 && allowMoveLeft){
            tetrisBoard.currPiece.location--; 
            tetrisBoard.currPiece.userLoc--
        };
        if(e.keyCode == 39 && allowMoveRight){
            tetrisBoard.currPiece.location++; 
            tetrisBoard.currPiece.userLoc++
        };
        tetrisBoard.moveTimer = false;
    },
    getTruePositions: function(){
        tetrisBoard.currPiece.truePos = [];
        for(let i = 0; i < tetrisBoard.currPiece.map.length; i++){
            if(tetrisBoard.currPiece.map[i]){
                let locMultiplier = Math.floor(((i) / 4)) * 6;
                let currLoc = i;
                currLoc += tetrisBoard.currPiece.location;
                currLoc += locMultiplier;
                tetrisBoard.currPiece.truePos.push(currLoc);
            }
        }
    },
    //Fixes pieces into place
    fixPiece: function(pce){
        for(let i = 0; i < pce.length; i++){
            tetrisBoard.tileArr[pce[i]].permanent = true;
            tetrisBoard.tileArr[pce[i]].empty = false;
            tetrisBoard.tileArr[pce[i]].color = tetrisBoard.currPiece.color;
            tetrisBoard.selectPiece(tetrisBoard.pieces);
        }
    },
    //Enacts gravity on pieces
    gravityMove: {runner : 0, gravFunc: function(){
        this.runner++;
        if(this.runner == 10){
            let allowFall = true;
            for(let i = 0; i < tetrisBoard.currPiece.truePos.length; i++){
                if(tetrisBoard.currPiece.truePos[i] > 169){allowFall = false; break;}
                if(!tetrisBoard.tileArr[tetrisBoard.currPiece.truePos[i]+10].empty && tetrisBoard.tileArr[tetrisBoard.currPiece.truePos[i]+10].permanent){
                    allowFall = false;
                }
            }

            if(allowFall){tetrisBoard.currPiece.location += 10}
            else if(!allowFall){tetrisBoard.fixPiece(tetrisBoard.currPiece.truePos)}
            this.runner = 0;
        }
    }},
    //Creates tile positions
    tileInit: function(){
        let xRun = 0;
        let yRun = 0;
        for( let i = 0; i < 180; i++){
            let newTileObj = {}
            newTileObj.classes = ['tile'];
            newTileObj.x = xRun;
            newTileObj.y = yRun;
            if(xRun == 0){newTileObj.classes.push('firstXTile')}
            xRun++;
            if(xRun == 10){xRun = 0; yRun++; };
            
            newTileObj.empty = true;
            newTileObj.color = '';
            newTileObj.permanent = false;
            this.tileArr.push(newTileObj);
        }
        
    },
    //Draws map to screen
    drawMap: function(arr){
        for(let i = 0; i < arr.length; i++){
            creElT('div', arr[i].classes, document.getElementsByClassName('map')[0]);
        }
    },
    //Clears previous position of piece
    clearMap: function(){
        for(let i = 0; i < this.tileArr.length; i++){
            if(this.tileArr[i].permanent == false){
                if(this.tileArr[i].empty == false){
                    this.tileArr[i].classes.pop();
                    this.tileArr[i].empty = true;
                }
            };
        }
    },
    //Recursive function which calls itself every 50ms
    intervalCall: function(arr){
        this.moveTimer = true;
        this.getTruePositions();
        this.gravityMove.gravFunc();
        this.clearMap();
        document.getElementsByClassName('map')[0].innerHTML = '';
        this.movePiece();
        this.drawMap(arr);
        setTimeout(function(){tetrisBoard.intervalCall(tetrisBoard.tileArr);}, 50);
    }
};



//Initialize Application
(function initApp(){
    creElT('div', 'app', document.body, '', 'app');
    creElT('div', 'map', document.getElementById('app'));
    tetrisBoard.makePiecesBlueprint();
    tetrisBoard.tileInit();
    tetrisBoard.drawMap(tetrisBoard.tileArr);
    tetrisBoard.selectPiece(tetrisBoard.pieces);
    document.addEventListener('keydown', function(){
        if(tetrisBoard.moveTimer){tetrisBoard.eventListenerGate(event)}
    })
    setTimeout(function(){
        tetrisBoard.intervalCall(tetrisBoard.tileArr);
    }, 400)
})()