var chron = null
var playTime = null
var pauseTime = null
class coursChrono {
    constructor(){
        this.initializeTimer = new Date().getTime()
    }
    printInitializeTimer(){
        console.log(this.initializeTimer);
    }
    calcTemps(){
        var timenow = new Date().getTime();
        var timeDifference = ((timenow - this.initializeTimer)/1000);
        this.seconds = timeDifference % 60
        this.minutes = (timeDifference / 60)%60
        this.hours = (timeDifference/3600);

        this.lastTime = Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString()
        return Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString() 
    }
    pauseHandler(){
        this.initializeTimer +=1000;
    }

    addNewNoteField(){
        $(".noteZone").append("<div>" + this.lastTime + "<input type = 'text'/></div>")
    }

    }
$(document).ready(function () {

$("i.play").click(()=>{
    clearInterval(pauseTime);
    pauseTime = null;
    if (!chron){
          chron = new coursChrono();
    }
    if (!playTime){
    playTime = setInterval(()=>{$("#temps").html(chron.calcTemps())},1000);
    }
    $(".play").toggleClass("hidden");
    $(".pause").toggleClass("hidden");
})
$('i.pause').click(()=>{
    clearInterval(playTime);
    playTime = null;
    if (!pauseTime){
    pauseTime = setInterval(()=>{chron.pauseHandler()},1000);
    }
    $(".play").toggleClass("hidden");
    $(".pause").toggleClass("hidden");
})
$(".note").click(()=>{
    chron.addNewNoteField()
})
})

