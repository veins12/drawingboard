const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
colorBtns = document.querySelectorAll(".colors .option"),
cancelBtns = document.querySelector(".cancelbutton"),
saveBtn = document.querySelector(".save");
ctx= canvas.getContext('2d',{ willReadFrequently: true });

//global variable with default value
let prevMouseX, prevMouseY,snapshot,
isDrawing = false,
selectedTool="brush",
brushWidth=2,
selectedColor = "000";

window.addEventListener("load",()=>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

})
const colorMap = {
    '1': "#FF0000;", // Red
    '2': "#000000", // Black
    '3': "#5C59EF", // Blue
    '4': "#FBFF2B", // Yellow
    '5': "#12BD03", // Green
    '6': "#FF00F5", // Pink
    '7': "#FF9900", // Orange
};
const handleKeyPress = (e) => {
    const color = colorMap[e.key];
    if (color) {
        selectedColor = color;
        // Update selected color in the UI
        colorBtns.forEach(btn => {
            btn.classList.remove('selected');
            if (window.getComputedStyle(btn).getPropertyValue("background-color") === color) {
                btn.classList.add('selected');
            }
        });
    }
};

const drawSquare=(e)=>{
    
    // ctx.strokeRect(e.offsetX,e.offsetY, prevMouseX - e.offsetX,prevMouseY-e.offsetY)
    ctx.putImageData(snapshot, 0, 0); // Restore the canvas state

    // Calculate the width and height from the mouse movement
    let width = e.offsetX - prevMouseX;
    let height = e.offsetY - prevMouseY;

    // Ensure the square has equal width and height
    let size = Math.min(Math.abs(width), Math.abs(height));

    // Adjust starting point for drawing the square
    let startX = prevMouseX;
    let startY = prevMouseY;

    if (width < 0) startX -= size;
    if (height < 0) startY -= size;
    if (!fillColor.checked){

  return  ctx.strokeRect(startX, startY, size, size); // Draw the square
    }
   ctx.fillRect(startX, startY, size, size); // Draw the square

}

const startDraw=(e)=>{
    isDrawing=true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY
    ctx.beginPath();
    ctx.lineWidth=brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height)
   
}
const drawing =(e)=>{
    if(!isDrawing)return;
    ctx.putImageData(snapshot,0,0)
    
    if (selectedTool ==="brush"){
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();
    }
    else if(selectedTool ==="square"){
        drawSquare(e);
    }
}
toolBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector('.options .active').classList.remove("active");
        btn.classList.add('active');
        selectedTool= btn.id;
        console.log(selectedTool);

    })
})

colorBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector('.options .selected').classList.remove("selected");
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")

    })
})

cancelBtns.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
})

const saveDrawing = async () => {
    const dataURL = canvas.toDataURL(); // Get the canvas data as a base64-encoded PNG
    try {
        const response = await fetch('/save-drawing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataURL }),
        });
        if (response.ok) {
            alert('Drawing saved successfully!');
        } else {
            alert('Failed to save drawing.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=>isDrawing=false);

window.addEventListener("keydown", handleKeyPress);
saveBtn.addEventListener("click", saveDrawing);