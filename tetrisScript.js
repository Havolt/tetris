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

let tetrisBoard = {
    tileArr : [],
    pieces: [],
    makePieces: function(piece){
        let newOb = {}
        for(let h = 0; h < piece.length; h++){
            let newPiece = [];
            for(let i = 0; i < 16; i++){
                let sameNum = false;
                for(let j = 0; j < piece[h].length; j++){
                    console.log('sap')
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
        this.pieces.push(newOb);
    },
    makePiecesBlueprint: function(){
        this.makePieces([[2,6,10,14], [8,9,10,11], [1,5,9,13], [4,5,6,7]]);
    },
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
            this.tileArr.push(newTileObj);
        }
        
    },
    drawMap: function(arr){
        for(let i = 0; i < arr.length; i++){
            creElT('div', arr[i].classes, document.getElementsByClassName('map')[0]);
        }
    },
    intervalCall: function(arr){
        document.getElementsByClassName('map')[0].innerHTML = '';
        this.drawMap(arr);
        setTimeout(function(){tetrisBoard.intervalCall(tetrisBoard.tileArr);}, 400);
    }
};

(function initApp(){
    creElT('div', 'app', document.body, '', 'app');
    creElT('div', 'map', document.getElementById('app'));
    tetrisBoard.makePiecesBlueprint();
    tetrisBoard.tileInit();
    tetrisBoard.drawMap(tetrisBoard.tileArr);
    setTimeout(function(){
        tetrisBoard.intervalCall(tetrisBoard.tileArr);
    }, 400)
})()