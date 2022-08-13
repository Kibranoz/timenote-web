var chron = null;
var playTime = null;
var pauseTime = null;
class timeNote {
  constructor() {
    this.timeStartedAt = new Date().getTime();
    this.pauseStartedAt = 0;
    this.pauseEndedAt = 0;
    this.idNumber = 0;
    this.haveBeenPaused = false;
    this.text = "";
    this.inPause = true;
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
    this.text = document.querySelector("#timeEditor").value
    return this.text;
  }

  addTimeToBottomOfText() {
    this.text = document.querySelector("#timeEditor").value
    this.text += "\n-"+this.lastTime+": "
    this.text = document.querySelector("#timeEditor").value = this.text
  }

  zeroIfNull(n){
    if (!n) {
      return "0"
    }
    else {
      return n
    }

  }

  adjustTime() {
    console.log(document.querySelector(".hour input").value)
    this.timeStartedAt =
      new Date().getTime() -
      (parseInt(this.zeroIfNull(document.querySelector(".hour input").value),10)* 3600 +
        parseInt(this.zeroIfNull(document.querySelector(".minute input").value),10) * 60 +
        parseInt(this.zeroIfNull(document.querySelector(".second input").value),10)) *
        1000;
  }
}


export default timeNote;