/* --------------------- Getting Elements from HTML --------------------- */

const leftScroll = document.getElementById('left-scroll');
const rightScroll = document.getElementById('right-scroll');
const imageContainer = document.getElementById('carousel-image-wrapper');
const container = document.getElementById('btn-div');

/* ------------------------ Initializing image array ------------------------ */

let images = [
    { url: "https://fastly.picsum.photos/id/28/4928/3264.jpg?hmac=GnYF-RnBUg44PFfU5pcw_Qs0ReOyStdnZ8MtQWJqTfA", },
    { url: "https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU", },
    { url: "https://fastly.picsum.photos/id/16/2500/1667.jpg?hmac=uAkZwYc5phCRNFTrV_prJ_0rP0EdwJaZ4ctje2bY7aE", },
    { url: "https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s", },
    // { url: "https://picsum.photos/600", },
    // { url: "https://picsum.photos/700", },
    // { url: "https://picsum.photos/800", },
    // { url: "https://picsum.photos/900", },
]

/* ------------------------ Initializing Variables ------------------------ */
let currentIndex = 0; //Shows Current index of image
let imageWidth = 900; //Define width of the image
let imgAnimation; // getting animation setinterval id

/* ------------------------- Starting the animation ------------------------- */
function startAnim() {
    imgAnimation = setInterval(autoAnimate, 3000);
}
startAnim();

/* -------- Restarting animation when user presses one of the buttons ------- */
function restartAnim() {
    clearInterval(imgAnimation);
    // setTimeout(() => {
    //     startAnim()
    // }, 4500);
}

//function to calculate position based on index value
function getPos(index) {
    return index * (-imageWidth);
}
// Initializing initial width of the container based on the array size
imageContainer.style.width = (images.length) * imageWidth + 'px';

//Creating HTML elements for every image object in the array
images.forEach((el, i) => {
    //creating a index button to jump to certain image
    const indexBtn = document.createElement('button');
    indexBtn.className = 'index-btn';
    //Adding event listener to the index button
    indexBtn.addEventListener('click', () => {

        btnRemoveSelected();
        //Restarts Animation on button click
        restartAnim();
        indexBtn.classList.add('selected');
        // if current index is greater than the index of the image animate to the left
        if (currentIndex > i) {
            let currentPos = getPos(currentIndex);
            currentIndex = i;
            let nextPos = getPos(currentIndex);
            animateLeft(currentPos, nextPos)
        }
        //else if current index is smaller than the index of the image animate to the right
        else {
            let currentPos = getPos(currentIndex);
            currentIndex = i;
            let nextPos = getPos(currentIndex);
            animateRight(currentPos, nextPos)
        }

    })
    //Creating div to store the image 
    const imgDiv = document.createElement('div');
    imgDiv.className = 'image';

    //creating image tag to display the image
    const displayImg = document.createElement('img');
    displayImg.src = el.url;
    displayImg.style.width = '100%';
    displayImg.style.height = '100%';
    // adding elements to the parent container
    imgDiv.appendChild(displayImg);
    imageContainer.appendChild(imgDiv);
    //Adding button to the main container
    container.appendChild(indexBtn);
})

//Animation when user clicks the right button
//Moves image from right to left into the viewport
rightScroll.addEventListener('click', () => {
    restartAnim();
    //When the last image reached and the next button is clicked move to the first image
    if (currentIndex >= images.length - 1) {
        let currentPos = getPos(currentIndex);
        currentIndex = 0;
        animateLeft(currentPos, 0)
    }
    // Else move according to the position
    else {
        let currentPos = getPos(currentIndex);
        currentIndex++;
        let nextPos = getPos(currentIndex);
        animateRight(currentPos, nextPos);
    }
})

// Same as above
leftScroll.addEventListener('click', () => {
    restartAnim();
    if (currentIndex != 0) {
        let currentPos = getPos(currentIndex);
        currentIndex--;
        let nextPos = getPos(currentIndex);
        animateLeft(currentPos, nextPos);
    }
    else {
        let currentPos = getPos(currentIndex);
        currentIndex = images.length - 1;
        let nextPos = getPos(currentIndex);
        animateRight(currentPos, nextPos);
    }
})


// Animating to the left
function animateLeft(currentPos, nextPos) {
    //Takes current and next positions and calculates the movement
    let animationInterval = 1000 / 60;
    function move() {
        let movement = Math.abs((nextPos - currentPos) / animationInterval);
        //Movement is added to go to the right
        currentPos += movement;
        imageContainer.style.left = `${currentPos}px`;
        let animId = requestAnimationFrame(move);
        //Stops the animation when the frame fits the viewport
        // OR Stops when the current position is equal to the next
        if (currentPos == nextPos) {
            cancelAnimationFrame(animId);
        }
    }
    requestAnimationFrame(move);
}

// Same as above
// but decreases the movement to go to the left
function animateRight(currentPos, nextPos) {
    let animationInterval = 1000 / 60;
    function move() {
        let movement = Math.abs((nextPos - currentPos) / animationInterval);
        currentPos -= movement;
        imageContainer.style.left = `${currentPos}px`;
        let animId = requestAnimationFrame(move);
        if (currentPos == nextPos) {
            cancelAnimationFrame(animId);
        }
    }
    requestAnimationFrame(move);
}

// Function to auto animate the images
//Image goes to the start when it reaches the end
function autoAnimate() {
    // btnAddSelected();
    let currentPos = getPos(currentIndex);
    currentIndex++;
    let nextPos = getPos(currentIndex);
    animateRight(currentPos, nextPos);
    if (currentIndex >= images.length) {
        let currentPos = getPos(currentIndex);
        currentIndex = 0;
        animateLeft(currentPos, 0);
    }
}


function btnRemoveSelected() {
    let buttons = document.querySelectorAll('.index-btn');
    buttons.forEach((btn) => {
        btn.classList.remove('selected');
    })
}
function btnAddSelected() {
    btnRemoveSelected();
    let buttons = document.querySelectorAll('.index-btn');
    //buttons[0].classList.add('selected');
    buttons.forEach((btn, i) => {
        buttons[currentIndex + 1].classList.add('selected');
    })
}
