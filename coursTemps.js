function SaveAsFile(t, f, m) {
  try {
    var b = new Blob([t], { type: m });
    saveAs(b, f);
  } catch (e) {
    window.open("data:" + m + "," + encodeURIComponent(t), "_blank", "");
  }
}

var chron = null;
var playTime = null;
var pauseTime = null;
class coursChrono {
  constructor() {
    this.timeStartedAt = new Date().getTime();
    this.pauseStartedAt = 0;
    this.pauseEndedAt = 0;
    this.idNumber = 0;
    this.haveBeenPaused = false;
    this.text = "";
  }
  printInitializeTimer() {
    console.log(this.timeStartedAt);
  }

  calcTemps() {
    this.actualTime = new Date().getTime();
    var timeDifference = (this.actualTime - this.timeStartedAt) / 1000;
    this.seconds = timeDifference % 60;
    this.minutes = (timeDifference / 60) % 60;
    this.hours = timeDifference / 3600;

    this.lastTime =
      Math.floor(this.hours).toString() +
      ":" +
      Math.floor(this.minutes).toString() +
      ":" +
      Math.floor(this.seconds).toString();
    return (
      Math.floor(this.hours).toString() +
      ":" +
      Math.floor(this.minutes).toString() +
      ":" +
      Math.floor(this.seconds).toString()
    );
  }

  pauseBegin() {
    this.pauseStartedAt = new Date().getTime();
  }
  pauseEnd() {
    if (this.haveBeenPaused) {
      this.pauseEndedAt = new Date().getTime();
      this.timeStartedAt += this.pauseEndedAt - this.pauseStartedAt;
      this.pauseEndedAt = 0;
      this.pauseStartedAt = 0;
    }
  }
  getTextFromTextArea(){
    this.text = $("#timeEditor").val()
  }

  addTimeToBottomOfText() {
    this.text = $("#timeEditor").val()
    this.text += "\n-"+this.lastTime+": "
    $("#timeEditor").val(this.text)
  }
  saveNotes(id) {
    this.notes[id] = {
      time: $("#" + id + " .timeOfNote").text(),
      note: $("#" + id + " textarea")
        .val()
        .toString(),
    };
  }

  adjustTime() {
    this.timeStartedAt =
      new Date().getTime() -
      (Number($(".hour input").val()) * 3600 +
        Number($(".minute input").val()) * 60 +
        Number($(".second input").val())) *
        1000;
    console.log($(".hour").text());
  }
}
$(document).ready(function () {
  var lang = navigator.language.split("-")[0]
    if (lang == "fr"){
       $("#appTitle").html("Notes Temporelles");
       $("#appDesc").html("Prenez des notes associés a un moment particulier de votre cours à distance ")

    }
    else{
      $("#appTitle").text("Timenote");
      $("#appDesc").text("Take notes associated to a particular timestamp in your online classes");
  
    }
  $("i.play").click(() => {
    clearInterval(pauseTime);
    pauseTime = null;
    if (!chron) {
      chron = new coursChrono();
    }
    chron.pauseEnd();
    chron.haveBeenPaused = false;
    if (!playTime) {
      playTime = setInterval(() => {
        $("#temps").html(chron.calcTemps());
      }, 1000);
    }
    $(".play").addClass("hidden");
    $(".pause").removeClass("hidden");
  });
  $("i.pause").click(() => {
    clearInterval(playTime);
    playTime = null;
    $(".play").removeClass("hidden");
    $(".pause").addClass("hidden");
    chron.pauseBegin();
    chron.haveBeenPaused = true;
  });
  $(".note").click(() => {
    chron.addTimeToBottomOfText();
  });
  $("i.save").click(() => {
    chron.getTextFromTextArea();
    var noteDate = new Date();
    SaveAsFile(
      chron.text,
      noteDate.toString() + ".txt",
      "text/plain;charset=utf-8"
    );
  });
  $("i.updateTime").click(() => {
      $("#timeAdjust").toggleClass("hidden")
    if (chron){
      $("i.play").trigger("click");
    }
    if (!chron) {
      chron = new coursChrono();
    }
  });
  $("i.approve").click(() => {
    chron.adjustTime();
    $("i.play").trigger("click");
    $("#timeAdjust").toggleClass("hidden")
  });
});

