class coursChrono {
    constructor(){
        this.initializeTimer = new Date().getTime()
    }
    printInitializeTimer(){
        console.log(this.initializeTimer);
    }
}

var chron = new coursChrono();
console.log(chron.printInitializeTimer())