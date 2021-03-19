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
    this.initializeTimer = new Date().getTime();
    this.pauseStartedAt = 0;
    this.pauseEndedAt = 0;
    this.notes = {};
    this.idNumber = 0;
    this.haveBeenPaused = false;
    this.text = "";
  }
  printInitializeTimer() {
    console.log(this.initializeTimer);
  }

  calcTemps() {
    this.actualTime = new Date().getTime();
    var timeDifference = (this.actualTime - this.initializeTimer) / 1000;
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
      this.initializeTimer += this.pauseEndedAt - this.pauseStartedAt;
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
  setTimeUp(typeTime) {
    console.log(typeTime);
    this.timerSetCurrentSelectionValue = Number($("." + typeTime).html());
    if (this.timerSetCurrentSelectionValue >= 59) {
      this.timerSetCurrentSelectionValue = 0;
      $("." + typeTime).html(this.timerSetCurrentSelectionValue.toString());
    } else {
      $("." + typeTime).html(
        (this.timerSetCurrentSelectionValue + 1).toString()
      );
    }
  }
  setTimeLow(typeTime) {
    this.timerSetCurrentSelectionValue = Number($("." + typeTime).html());
    if (this.timerSetCurrentSelectionValue <= 0) {
      this.timerSetCurrentSelectionValue = 59;
      $("." + typeTime).html(this.timerSetCurrentSelectionValue.toString());
    } else {
      $("." + typeTime).html(
        (this.timerSetCurrentSelectionValue - 1).toString()
      );
    }
  }


  adjustTime() {
    this.initializeTimer =
      new Date().getTime() -
      (Number($(".hour").html()) * 3600 +
        Number($(".minute").html()) * 60 +
        Number($(".second").html())) *
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
    $(".play").toggleClass("hidden");
    $(".pause").toggleClass("hidden");
  });
  $("i.pause").click(() => {
    clearInterval(playTime);
    playTime = null;
    $(".play").toggleClass("hidden");
    $(".pause").toggleClass("hidden");
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
    if (!chron) {
      chron = new coursChrono();
    }
  });
  $(".timeComponante").click((ev) => {
    $(".selected").each((i, elem) => {
      $(elem).toggleClass("selected");
      //on veut s'assurer qu'il en ait juste un
    });
    console.log("teet");
    $(ev.target).toggleClass("selected");
  });
  $("i.raise").click(() => {
    console.log($(".selected").attr("timeDiv").toString());
    chron.setTimeUp($(".selected").attr("timeDiv").toString());
  });
  $("i.lower").click(() => {
    console.log($(".selected").attr("timeDiv").toString());
    chron.setTimeLow($(".selected").attr("timeDiv").toString());
  });
  $("i.approve").click(() => {
    chron.adjustTime();
    $("i.play").trigger("click");
    $("#timeAdjust").toggleClass("hidden")
  });
});

