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
    this.text = document.querySelector("#timeEditor").value
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

  document.querySelector("i.play").addEventListener("click", ()=>{
    clearInterval(pauseTime);
    pauseTime = null;
    if (!chron) {
      chron = new coursChrono();
    }
    chron.pauseEnd();
    chron.haveBeenPaused = false;
    if (!playTime) {
      playTime = setInterval(() => {
        document.querySelector("#temps").innerHTML = chron.calcTemps()
      }, 1000);
    }
    document.querySelector(".play").classList.add("hidden")
    document.querySelector(".pause").classList.remove("hidden");
  });
  document.querySelector("i.pause").addEventListener("click",()=> {
    clearInterval(playTime);
    playTime = null;
    document.querySelector(".pause").classList.add("hidden")
    document.querySelector(".play").classList.remove("hidden");
    chron.pauseBegin();
    chron.haveBeenPaused = true;
  });
  document.querySelector(".note").addEventListener("click",() => {
    chron.addTimeToBottomOfText();
  });
  document.querySelector("i.save").addEventListener("click",async () => {
    
    var noteDate = new Date();
    try {  
      
      var save = window.__TAURI__.dialog.save();
      chron.getTextFromTextArea();
    save.then((result)=>{
      console.log(result);

       window.__TAURI__.invoke('write_file',{path:result+".txt",data:chron.text});
    }).catch((error)=>{console.log(error)})
      
    } catch (error) {
      console.log(error)
      
    }
    
  });
  document.querySelector("i.updateTime").addEventListener("click",() => {
      document.querySelector("#timeAdjust").classList.toggle("hidden")
    if (chron){
      var clickEvent = new MouseEvent("click", { shiftKey: true });
      document.querySelector("i.play").dispatchEvent(clickEvent)
    }
    if (!chron) {
      chron = new coursChrono();
    }
  });
  document.querySelector("i.approve").addEventListener("click",() => {
    chron.adjustTime();
    var clickEvent = new MouseEvent("click", { shiftKey: true });
      document.querySelector("i.play").dispatchEvent(clickEvent)
      document.querySelector("#timeAdjust").classList.toggle("hidden")
  });


