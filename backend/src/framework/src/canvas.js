const canvas = document.getElementById("canvas");
const form = document.getElementById('form');
const action = document.getElementById('action');
const ctx = canvas.getContext("2d");
//import { createFolder } from './index.js';
let stroke_id=0;
let tabFinal=[];

canvas.height = (window.innerHeight/4)*3;
canvas.width = window.innerWidth-60;

// form.addEventListener('submit', (e)=>{
//     e.preventDefault();
//     checkInputs();
// });

function submit_canvas() {
    checkInputs();
    stroke_id=0;
}

function checkInputs(){
    const actionValue = action.value.trim();
    if(actionValue === ''){
        setErrorFor(action, 'Action cannot be blank');
    }
    else{
        setSuccessFor(action);
        ctx.fillStyle=start_background_color;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log("action:"+actionValue);
        console.table(tabFinal);

        var dataGesture = {
            "name":actionValue,
            "subjet":"1",
            "paths":[{"label":"point", "strokes":[]}]
        };

        tabFinal.forEach((stroke, strokeId) => {dataGesture.paths[0].strokes.push({"id": strokeId, "points": stroke})})
        var dataString = JSON.stringify(dataGesture);
        console.log(dataString);
        tabFinal=[];
        test();
    }
}

function setErrorFor(input, message){
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    small.innerText=message;
    formControl.className='form-control error';
}

function setSuccessFor(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

let start_background_color = "white";
ctx.fillStyle=start_background_color;
ctx.fillRect(0, 0, canvas.width, canvas.height);

let painting = false;

function startPosition(e){
    painting=true;
    tabFinal[stroke_id]=[]
    draw(e);
}
function finishedPosition(){
    painting = false;
    stroke_id++
    ctx.beginPath();
}

function draw(e){
    if(!painting) return;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    var objectCoord ={
        "x": e.clientX - canvas.offsetLeft,
        "y": e.clientY - canvas.offsetTop,
        "t": Date.now(),
    };
    tabFinal[stroke_id].push(objectCoord);
    //console.log("X/Y: "+e.clientX - canvas.offsetLeft +"/"+e.clientY - canvas.offsetTop);
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function clear_canvas() {
    ctx.fillStyle=start_background_color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stroke_id=0;
    tabFinal=[];
}

function test(){
    var fs = require('fs');
    var dir = './tmp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);