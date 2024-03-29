var chron = null;
var playTime = null;
var pauseTime = null;
class timeNote {
  constructor() {
    this.timeStartedAt = new Date().getTime();
    this.pauseStartedAt = 0;
    this.pauseEndedAt = 0;
    this.idNumber = 0;
    this.isPaused = false;
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
    if (this.isPaused) {
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
      (parseInt(this.zeroIfNull(document.querySelector(".relativeTimeZone .hour input").value),10)* 3600 +
        parseInt(this.zeroIfNull(document.querySelector(".relativeTimeZone .minute input").value),10) * 60 +
        parseInt(this.zeroIfNull(document.querySelector(".relativeTimeZone .second input").value),10)) *
        1000;
  }

  adjustTimeFromHour(hours,minutes, seconds) {
    let now = new Date();
    let hoursDifference = now.getHours() - this.zeroIfNull(hours);
    let minutesDifference = now.getMinutes() - this.zeroIfNull(minutes);
    let secondsDifference = now.getSeconds() - this.zeroIfNull(seconds);
    let timeDifference = (parseInt(hoursDifference,10) * 3600 + parseInt(minutesDifference,10) * 60 + parseInt(secondsDifference,10)) * 1000
    console.log("timeDifference", timeDifference)
    this.timeStartedAt = new Date().getTime() - timeDifference; 
  }
}


export default timeNote;