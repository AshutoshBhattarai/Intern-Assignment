/* -------------------------------------------------------------------------- */
/*                                Input Mapping                               */
/* -------------------------------------------------------------------------- */

const inputs = {
    left: false,
    right: false
}


//Detects if the key is pressed
window.onkeydown = (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            inputs.left = true;
            break;
        case 'ArrowRight':
            inputs.right = true;
            break;
        case 'KeyA':
            inputs.left = true;
            break;
        case 'KeyD':
            inputs.right = true;
            break;
    }
}

//Detects if the key is released
window.onkeyup = (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            inputs.left = false;
            break;
        case 'ArrowRight':
            inputs.right = false;
            break;
        case 'KeyA':
            inputs.left = false;
            break;
        case 'KeyD':
            inputs.right = false;
            break;
    }
}