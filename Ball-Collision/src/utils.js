//* ---------------------------- Utility functions --------------------------- */
 
 function getRandomNumber(min,max)
{
    return min + Math.random() * (max - min);
}

function getRandomColor()
{
    
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    return randomColor;
}