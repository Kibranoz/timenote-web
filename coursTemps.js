var chron = null
var playTime = null
var pauseTime = null
class coursChrono {
    constructor(){
        this.initializeTimer = new Date().getTime()
        this.pauseStartedAt = 0;
        this.pauseEndedAt = 0;
        this.notes = {};
        this.idNumber  = 0;
        this.haveBeenPaused = false;
    }
    printInitializeTimer(){
        console.log(this.initializeTimer);
    }

    calcTemps(){
        this.actualTime = new Date().getTime();
        var timeDifference = ((this.actualTime - this.initializeTimer)/1000);
        this.seconds = timeDifference % 60
        this.minutes = (timeDifference / 60)%60
        this.hours = (timeDifference/3600);

        this.lastTime = Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString()
        return Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString() 
    }

    pauseBegin(){
        this.pauseStartedAt = new Date().getTime();

    }
    pauseEnd(){
        if (this.haveBeenPaused){
        this.pauseEndedAt = new Date().getTime()
        this.initializeTimer += (this.pauseEndedAt - this.pauseStartedAt)
        this.pauseEndedAt = 0;
        this.pauseStartedAt = 0;
    }
}



    addNewNoteField(){
        $(".noteZone").append("<div class='container notearea' id = 'note-"+this.idNumber+"'><div class ='timeOfNote'>" + this.lastTime + "</div><textarea class = 'form-control' type = 'text'></textarea></div>")
        this.idNumber +=1
    }
    saveNotes(id){
        this.notes[id] = 
        {"time": $("#"+id+" .timeOfNote").text(), "note" : $("#"+id+" textarea").val().toString() }
        
    }


    }
$(document).ready(function () {

$("i.play").click(()=>{
    clearInterval(pauseTime);
    pauseTime = null;
    if (!chron){
          chron = new coursChrono();
    }
    chron.pauseEnd()
    chron.haveBeenPaused = false;
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
    chron.pauseBegin()
    chron.haveBeenPaused = true;
})
$(".note").click(()=>{
    chron.addNewNoteField()
})
})

$(document).on("change",'.noteZone textarea',()=>{
    $(".noteZone textarea").each((i)=>{
        chron.saveNotes("note-"+i)
    })
    console.log(chron.notes)
})