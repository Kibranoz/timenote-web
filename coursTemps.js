var chron = null
var playTime = null
var pauseTime = null
class coursChrono {
    constructor(){
        this.initializeTimer = new Date().getTime()
        this.actualTime = new Date().getTime()
        this.notes = {};
        this.idNumber  = 0;
    }
    printInitializeTimer(){
        console.log(this.initializeTimer);
    }
    tic(){
        this.actualTime +=1000
    }

    calcTemps(){
        this.tic()
        var timeDifference = ((this.actualTime - this.initializeTimer)/1000);
        this.seconds = timeDifference % 60
        this.minutes = (timeDifference / 60)%60
        this.hours = (timeDifference/3600);

        this.lastTime = Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString()
        return Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString() 
    }


    addNewNoteField(){
        $(".noteZone").append("<div class='container notearea' id = 'note-"+this.idNumber+"'><div class ='timeOfNote'>" + this.lastTime + "</div><textarea class = 'form-control' type = 'text'></textarea></div>")
        this.idNumber +=1
    }
    saveNotes(){
        this.notes["note-"+this.idNumber] = 
        {"time": $("#note-"+this.idNumber+" .timeOdNote").text(), "note" : $("#note-"+this.idNumber+" textarea").text() }
        
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
    $(".play").toggleClass("hidden");
    $(".pause").toggleClass("hidden");
})
$(".note").click(()=>{
    chron.addNewNoteField()
})
})

