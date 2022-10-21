import localforage from "./localforage"
import timeNote from "./timenote"

var timenote = null;
var playTime = null;
var pauseTime = null;

localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
    ]).then(()=>{
  
  document.querySelector("i.play").addEventListener("click", ()=>{
      clearInterval(pauseTime);
      pauseTime = null;
      if (!timenote) {
        timenote = new timeNote();
      }
      timenote.pauseEnd();
      timenote.isPaused = false;
        playTime = setInterval(() => {
          if (!timenote.isPaused) {
          document.querySelector("#temps").innerHTML = timenote.calcTemps()
          }
          localforage.setItem("timeBeginning", timenote.timeStartedAt)
          localforage.setItem("pauseBeginning", timenote.pauseStartedAt)
          localforage.setItem("text", document.querySelector("#timeEditor").value)
          localforage.setItem("isPaused", timenote.isPaused )
        }, 1000);
      document.querySelector(".play").classList.add("hidden")
      document.querySelector(".pause").classList.remove("hidden");
    });
    document.querySelector("i.pause").addEventListener("click",()=> {
      document.querySelector(".pause").classList.add("hidden")
      document.querySelector(".play").classList.remove("hidden");
      timenote.pauseBegin();
      timenote.isPaused = true;
    });
    document.querySelector(".note").addEventListener("click",() => {
      timenote.addTimeToBottomOfText();
    
    });
    document.querySelector("i.save").addEventListener("click",async () => {
      let fileHandle;
  
    // Destructure the one-element array.
    fileHandle = await window.showSaveFilePicker({
      types: [
        {
          description: 'Text Files',
          accept: {
            'text/plain': ['.txt'],
          },
        },
      ],
    });
    // Do something with the file handle.
  
  const contents =  timenote.getTextFromTextArea()
  
  
  
  const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();    
        
      })
  
    document.querySelector("i.share").addEventListener("click", async () => {
      const shareData  = {
        title : new Date().toDateString(),
        text : document.querySelector("#timeEditor").value
      }
  
      await navigator.share(shareData)
    })
  
  function simulateClickPlay () {
    var clickEvent = new MouseEvent("click", { shiftKey: true });
    document.querySelector("i.play").dispatchEvent(clickEvent)
    document.querySelector("#timeAdjust").classList.add("hidden")
    
  }
      
    document.querySelector("i.updateTime").addEventListener("click",() => {
        document.querySelector("#timeAdjust").classList.toggle("hidden")
      if (timenote){
        var clickEvent = new MouseEvent("click", { shiftKey: true });
        document.querySelector("i.play").dispatchEvent(clickEvent)
      }
      if (!timenote) {
        timenote = new timeNote();
      }
    });
    document.querySelector("i.approveRelative ").addEventListener("click",() => {
      timenote.adjustTime();
      simulateClickPlay()
    });

    document.querySelector("i.approveAbsolute").addEventListener("click", ()=>{
      let hour = document.querySelector(".absoluteTimeZone .hour input").value
      let  minutes = document.querySelector(".absoluteTimeZone .minute input").value
      let seconds = document.querySelector(".absoluteTimeZone .minute input").value 
      timenote.adjustTimeFromHour(hour, minutes, seconds)
      simulateClickPlay()


    })
  
  
  
    document.querySelector("div #hamburger").addEventListener("click", () => {
      document.querySelector(".showContextMenu").classList.toggle("hidden")
    })
  
  document.querySelector("i.dark").addEventListener("click", ()=>{
    document.querySelector("body").classList.add("dark");
    document.querySelector("body").classList.remove("light");
  })
  
  document.querySelector("i.light").addEventListener("click", ()=>{
    document.querySelector("body").classList.add("light");
    document.querySelector("body").classList.remove("dark");
  })
  
  window.addEventListener("load",async ()=>{
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
  
      document.querySelector("body").classList.add("dark");
  
  }
  
  if( /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
    // some code..
    document.querySelector("i.save").classList.add("hidden")
    document.querySelector("i.share").classList.remove("hidden");
   }

   let timeBeginning = await localforage.getItem("timeBeginning")

  if (timeBeginning.value === 0 || timeBeginning.value === null) {
    return
   }
  
  if (!timenote) {
    timenote = new timeNote();
  }
  
  localforage.getItem("isPaused",(err,value) => {
    timenote.isPaused = value;
    console.log("en pause", value)
  
  localforage.getItem("timeBeginning", (err,value) =>{
    timenote.timeStartedAt = parseInt(value) || new Date().getTime()
    console.log("VALEUER"+ value)
    console.log(err)
  })
  
  if (value) {
    localforage.getItem("pauseBeginning", (err,value) =>{
      timenote.pauseStartedAt = parseInt(value) || new Date().getTime()
    })
      }
      else {
        if (timenote.pauseStartedAt == 0){
          simulateClickPlay()
        }
      }
  })
  
  
  localforage.getItem("text", (err,val)=>{
    document.querySelector("#timeEditor").value = val 
    timenote.text = val;
    console.log("success")
    console.log(val)
    console.log(err)
  })
  
  })
})