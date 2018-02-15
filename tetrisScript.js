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
    keyFired: false,
    moveTimer : true,
    rotateTimer: true,
    rotateMove : 0,
    connectedPieces: [],
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
        this.makePieces([[1,5,9,13], [4,5,6,7], [2,6,10,14], [8,9,10,11], 'Line', 'orange']);
        //Square
        this.makePieces([[5,6,9,10], [5,6,9,10], [5,6,9,10], [5,6,9,10], 'Square', 'yellow']);
        //L-Shape
        this.makePieces([[0,1,5,9], [2,4,5,6], [1,5,9,10], [4,5,6,8], 'L-Shape', 'red']);
        //J-Shape
        this.makePieces([[1,2,5,9], [4,5,6,10], [1,5,8,9], [0,4,5,6], 'J-Shape', 'cyan']);
        //Tee
        this.makePieces([[1,4,5,6], [1,5,6,9], [4,5,6,9], [1,4,5,9], 'Tee', 'green']);
        //Z-Shape
        this.makePieces([[1,4,5,8], [0,1,5,6], [2,5,6,9], [4,5,9,10], 'Z-Shape', 'amber']);
        //S-Shape
        this.makePieces([[0,4,5,9], [1,2,4,5], [1,5,6,10], [5,6,8,9], 'S-Shape', 'magenta'] );
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
        }
        else{
            this.currPiece.map = chosenPiece[dir];
            this.currPiece.direction = dir;
        }
        this.rotateMove = 0;
    },
    //Places piece on map
    movePiece: function(){
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
    createLocationArr: function(arr, newArr){
        for(let i = 0; i < arr.length; i++){
            if(arr[i] == 1){
                let locMultiplier = Math.floor(((i) / 4)) * 6;
                let currLoc = this.currPiece.location + locMultiplier + i;
                newArr.push(currLoc)
            }
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

        function checkWrap(num){


            let displaceDir = 0;
            
            let checkNewArr = []
            if(num == 0){displaceDir = 1}else if(num == 9){displaceDir = -1};
            for(let i = 0; i < tetrisBoard.pieces.length; i++){
                if(tetrisBoard.currPiece.name == tetrisBoard.pieces[i].name){
                    tetrisBoard.createLocationArr(tetrisBoard.pieces[i][direc], checkNewArr)
                    
                }
                
            }

            let moverVar = 0;            
            
            for(let i = 0; i < checkNewArr.length; i++){
                if(num == 0){
                    let lastPosCheck = checkNewArr[i].toString().split('').pop();
                    if(lastPosCheck.toString().split().pop() == 8){
                        moverVar = 2;
                    }else if(lastPosCheck.toString().split('').pop() == 9 && moverVar != 2){
                        moverVar = 1;
                    }
                }else if(num == 9){
                    let lastPosCheck = checkNewArr[i].toString().split('').pop();
                    if(lastPosCheck.toString().split().pop() == 1){
                        moverVar = -2;
                    }else if(lastPosCheck.toString().split('').pop() == 0 && moverVar != -2){
                        moverVar = -1;
                    }
                }
            }
            tetrisBoard.rotateMove = moverVar;

            
        }
        

        //Check if piece is at edge of screen

        let needCheck = false;
        let needCheckNum;
        for(let i = 0; i < this.currPiece.map.length; i++){
            if(this.currPiece.map[i] == 1){
                let locMultiplier = Math.floor(((i) / 4)) * 6;
                let currLoc = this.currPiece.location + locMultiplier + i;
                let currLocString = currLoc.toString().split('').pop();
                if(currLocString == 0 || currLocString == 9){
                    needCheck = true;
                    needCheckNum = currLocString;
                }
            }
        }
        if(needCheck){checkWrap(needCheckNum);}
        this.currPiece.location += this.rotateMove;
        this.currPiece.userLoc += this.rotateMove;


        //Code stops rotation if in conflict with another piece
        let rotateCheck = [];
        let allowRotate = true;
        for(let i = 0; i < this.pieces.length; i++){
            if(this.currPiece.name == this.pieces[i].name){
                rotateCheck = this.pieces[i][direc];
            }
        }
        for(let i = 0; i < rotateCheck.length; i++){
            if(rotateCheck[i] == 1){
                let locMultiplier = Math.floor(((i) / 4)) * 6;
                let currLoc = this.currPiece.location + locMultiplier + i;
                if(!this.tileArr[currLoc].empty && this.tileArr[currLoc].permanent){allowRotate = false;}
            }
        }


        if(allowRotate){
            for(let i = 0; i < this.pieces.length; i++){
                if(this.pieces[i].name == this.currPiece.name){
                    this.selectPiece([], this.pieces[i], direc  )
                }
            }
        }
        else{
            this.currPiece.location -= this.rotateMove;
            this.currPiece.userLoc -= this.rotateMove;
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
    //Gets data values of locations
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
    //Check to see if there is a full line
    checkCompleteLine: function(){
        for(let i = 0; i < this.tileArr.length/10; i++){
            let lineComplete = true;
            for(let j = 0; j < 10; j++){
                if(this.tileArr[(i*10)+j].empty || !this.tileArr[(i*10)+j].permanent){
                    lineComplete = false;
                }
            }
            if(lineComplete){
                //Remove Line
                for(let j = 0; j < 10; j++){
                    this.tileArr[(i*10)+j].empty = true;
                    this.tileArr[(i*10)+j].permanent = false;
                    this.tileArr[(i*10)+j].classes.pop();

                    for(let k = 0; k < this.connectedPieces.length; k++){
                        for(let l = 0; l < this.connectedPieces[k].length; l++){
                            if(this.connectedPieces[k][l] == (i*10)+j){
                                this.connectedPieces[k].splice(l, 1);
                                l--;
                            }
                            
                        console.log(this.connectedPieces[k].length)
                        }
                        if(this.connectedPieces[k].length == 0){
                            this.connectedPieces.splice(k, 1);
                            k--;
                        }
                    }
                }
                //check if piece can fall
                console.log(this.connectedPieces)
                this.emptySpaceCheck(this.connectedPieces);
            }
        }
    },
    emptySpaceCheck: function(arr){
        for(let i = 0; i < arr.length; i++){
            let allCanMove = true;
            for(let j = 0; j < arr[i].length; j++){
                //Checks if tile under it is empty
                if(this.tileArr[i][j]){
                    if(!this.tileArr[arr[i][j]+10].empty){
                        allCanMove = false;
                        let samePiece = false;
                        for(let k = 0; k < arr[i].length; k++){
                            //Checks if tile under it belongs to same piece
                            if(arr[i][j]+10 == arr[i][k]){samePiece = true}
                        }
                        //Makes piece not move if not same
                        if(samePiece){allCanMove = true}
                    }
                }
            }
            if(allCanMove){
                for(let j = 0; j < arr[i].length; j++){
                    console.log(this.tileArr[arr[i][j]])
                    console.log(arr[i][j]+10 + ' but the maximum number is 179')
                    this.tileArr[arr[i][j]+10].empty = this.tileArr[arr[i][j]].empty;
                    this.tileArr[arr[i][j]+10].permanent = this.tileArr[arr[i][j]].permanent;
                    this.tileArr[arr[i][j]+10].color = this.tileArr[arr[i][j]].color;

                    this.tileArr[arr[i][j]+10].classes.push(this.tileArr[arr[i][j]].classes[this.tileArr[arr[i][j]].classes.length-1]);
                    
                    this.tileArr[arr[i][j]].color = "";
                    this.tileArr[arr[i][j]].permanent = false;
                    this.tileArr[arr[i][j]].empty = true;
                    
                    for(let k = 0; k < this.tileArr[arr[i][j]].classes.length; k++){
                        if(this.tileArr[arr[i][j]].classes[k] != 'tile' && this.tileArr[arr[i][j]].classes[k] != 'firstXTile'){
                            console.log(this.tileArr[arr[i][j]].classes[k])
                            this.tileArr[arr[i][j]].classes.splice(k, 1);
                            k--;
                        }
                    }
                }
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
        this.connectedPieces.push(pce);
        this.checkCompleteLine();
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
        setTimeout(function(){tetrisBoard.intervalCall(tetrisBoard.tileArr);}, 40);
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
        if(tetrisBoard.moveTimer && !tetrisBoard.keyFired){tetrisBoard.eventListenerGate(event)
        tetrisBoard.keyFired = true;}
    })
    document.addEventListener('keyup', function(){
        tetrisBoard.keyFired = false;
    })
    
    setTimeout(function(){
        tetrisBoard.intervalCall(tetrisBoard.tileArr);
    }, 400)
})()