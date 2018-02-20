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

let tetrisObj = {};

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
        newArr.push(arrObj);
    }
    obj.mapData = newArr;
}

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
        if(h == 0){newOb.n = newPiece};
        if(h == 1){newOb.e = newPiece};
        if(h == 2){newOb.s = newPiece};
        if(h == 3){newOb.w = newPiece};
    }
    newOb.name = piece[4];
    newOb.color = piece[5];
    obj.push(newOb);
}

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



(function initApp(){
    createMapData(tetrisObj);
    createShapeDataCaller(tetrisObj);
    console.log(tetrisObj);
})()