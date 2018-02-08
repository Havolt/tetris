function creElT(type, cls, apnd, inHL){
    let newEl = document.createElement(type);
    if(typeof(cls) == 'string'){
        newEl.classList.add(cls);
    }else if(typeof(cls) == 'object'){
        for(let i = 0; i < cls.length; i++){
            newEl.classList.add(cls[i]);
        }
    }
    if(inHL){newEl.innerHTML=inHL}
    apnd.appendChild(newEl);
}

let tetrisBoard = {
    tileArr : [],
    tileInit: function(){
        let xRun = 0;
        let yRun = 0;
        for( let i = 0; i < 180; i++){
            let newTileObj = {}
            newTileObj.x = xRun;
            newTileObj.y = yRun;
            xRun++;
            if(xRun == 10){xRun = 0; yRun++}
            this.tileArr.push(newTileObj);
        }
    }
};

(function initApp(){
    creElT('div', ['cat','dog'], document.body, 'cat' )
    tetrisBoard.tileInit();
})()