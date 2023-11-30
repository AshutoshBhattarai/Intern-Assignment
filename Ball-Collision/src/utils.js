 function getRandomNumber(min,max)
{
    return min + Math.random() * (max - min);
}

function calcDistance(x1,y1,x2,y2){
    const dx = x2-x1;
    const dy = y2-y1;
    return Math.sqrt(dx*dx + dy*dy);
}

function getRandomColor()
{
    
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    return randomColor;
}