//import localforage from "./localforage";

localforage.setDriver([
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
  ]).then(()=>{

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

const contents =  chron.getTextFromTextArea()



const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();    
      
    })

function simulateClickPlay () {
  var clickEvent = new MouseEvent("click", { shiftKey: true });
  document.querySelector("i.play").dispatchEvent(clickEvent)
  document.querySelector("#timeAdjust").classList.toggle("hidden")
  
}
    
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
    simulateClickPlay()
  });



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

window.addEventListener("load",()=>{
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode

    document.querySelector("body").classList.add("dark");

}


if (!localforage.getItem("timeBeginning")) {
  return;

}


if (!chron){
  chron = new coursChrono();
}

localforage.getItem("pauseBeginning", (err,value) =>{
  chron.pauseStartedAt = parseInt(value) || new Date.getTime()
  //console.log("pause error")
  console.log("pauseerr"+err)
})

localforage.getItem("timeBeginning", (err,value) =>{
  chron.timeStartedAt = parseInt(value) || new Date.geTIme()
  console.log("VALEUER"+ value)


  console.log(err)
})



localforage.getItem("text").then((val)=>{
  document.querySelector("#timeEditor").value = val
  chron.text = val;
  console.log("success")
  console.log(val)
})
.catch((error)=>{
  console.log("error")
  console.log(error)
})


console.log(text+"text")
if (chron.pauseStartedAt == 0 && chron.haveBeenPaused){
  simulateClickPlay()
}
})

,

window.onbeforeunload = (event) => {
  localforage.setItem("timeBeginning", chron.timeStartedAt)
  localforage.setItem("pauseBeginning", chron.pauseStartedAt)
  localforage.setItem("text", document.querySelector("#timeEditor").value)
  localforage.setItem("haveBeenPaused", chron.haveBeenPaused )

  

}

  })