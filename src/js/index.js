import localforage from "./localforage"
import timeNote from "./timenote"
import { appWindow } from '@tauri-apps/api/window'
import { save } from "@tauri-apps/api/dialog";
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';
const bottomBar = document.getElementById("bottomBar");
const input = document.getElementById("timeEditor");
const height = window.visualViewport.height;
const viewport = window.visualViewport;

window.addEventListener("scroll", () => input.blur());
window.visualViewport.addEventListener("resize", resizeHandler);

function resizeHandler() {
    if (!/iPhone|iPad|iPod/.test(window.navigator.userAgent)) {
      height = viewport.height;
    }
    bottomBar.style.bottom = `${height - viewport.height}px`;
  }



var timenote = null;
var playTime = null;
var pauseTime = null;

localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
    ]).then(()=>{

  document.getElementById("remove")
  .addEventListener("click", ()=> appWindow.minimize())

  document.getElementById("close")
  .addEventListener('click', () => appWindow.close())
  document.getElementById("square")
  .addEventListener('click', () => appWindow.toggleMaximize())
  
  document.querySelector(".play").addEventListener("click", ()=>{
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
    document.querySelector(".pause").addEventListener("click",()=> {
      document.querySelector(".pause").classList.add("hidden")
      document.querySelector(".play").classList.remove("hidden");
      timenote.pauseBegin();
      timenote.isPaused = true;
    });
    document.querySelector(".note").addEventListener("click",() => {
      timenote.addTimeToBottomOfText();
    
    });
    document.querySelector(".save").addEventListener("click",async () => {
      const filePath = await save({
        filters: [{
          name: 'Text',
          extensions: ['txt']
        }]
      })

      await writeTextFile({ path: filePath, contents: timenote.getTextFromTextArea()}, { dir: BaseDirectory.Home });
    })
  
    document.querySelector(".share").addEventListener("click", async () => {
      const shareData  = {
        title : new Date().toDateString(),
        text : document.querySelector("#timeEditor").value
      }
  
      await navigator.share(shareData)
    })
  
  function simulateClickPlay () {
    var clickEvent = new MouseEvent("click", { shiftKey: true });
    document.querySelector(".play").dispatchEvent(clickEvent)
    document.querySelector("#timeAdjust").classList.add("hidden")
    
  }
      
    document.querySelector(".updateTime").addEventListener("click",() => {
        document.querySelector("#timeAdjust").classList.toggle("hidden")
      if (timenote){
        var clickEvent = new MouseEvent("click", { shiftKey: true });
        document.querySelector(".play").dispatchEvent(clickEvent)
      }
      if (!timenote) {
        timenote = new timeNote();
      }
    });
    document.querySelector("img.approveRelative ").addEventListener("click",() => {
      timenote.adjustTime();
      simulateClickPlay()
    });

    document.querySelector("img.approveAbsolute").addEventListener("click", ()=>{
      let hour = document.querySelector(".absoluteTimeZone .hour input").value
      let  minutes = document.querySelector(".absoluteTimeZone .minute input").value
      let seconds = document.querySelector(".absoluteTimeZone .minute input").value 
      timenote.adjustTimeFromHour(hour, minutes, seconds)
      simulateClickPlay()


    })
  
  
    document.querySelector("div #hamburger").addEventListener("click", () => {
      document.querySelector(".showContextMenu").classList.toggle("hidden")
    })
  
  document.querySelector("img.dark").addEventListener("click", ()=>{
    document.querySelector("body").classList.add("dark");
    document.querySelector("body").classList.remove("light");
  })
  
  document.querySelector("img.light").addEventListener("click", ()=>{
    document.querySelector("body").classList.add("light");
    document.querySelector("body").classList.remove("dark");
  })

  document.querySelector('span.select_all').addEventListener('click', ()=>{
    let keyBoard = document.querySelector("#timeEditor")
    console.log("click")
    setTimeout(function() {
      keyBoard.select();
    }, 100); 
    keyBoard.focus()
  })

  document.querySelector(".keyboard_tab").addEventListener("click", ()=>{
    let keyBoard = document.querySelector("#timeEditor")
    let editorText = keyBoard.value
    let tabbedText = [editorText.slice(0,keyBoard.selectionStart), "    ", editorText.slice(keyBoard.selectionStart,editorText.length - 1)].join('')
    console.log(tabbedText)
    keyBoard.value = tabbedText
  })

document.querySelector('.hide_keyboard').addEventListener('click', ()=>{
  let keyBoard = document.querySelector("#timeEditor")
  keyBoard.blur()
})

  
  window.addEventListener("load",async ()=>{
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
  
      document.querySelector("body").classList.add("dark");
  
  }
  
  if( /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
    // some code..
    document.querySelector(".save").classList.add("hidden")
    document.querySelector(".share").classList.remove("hidden");
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