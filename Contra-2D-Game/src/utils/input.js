const inputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    shoot: false,
    jump: false
}

window.onkeydown = (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            inputs.left = true;
            break;
        case 'ArrowRight':
            inputs.right = true;
            break;
        case 'ArrowUp':
            inputs.up = true;
            break;
        case 'ArrowDown':
            inputs.down = true;
            break;
        case 'z':
            inputs.shoot = true;
            break;
        case 'x':
            inputs.jump = true;
            break;
    }
}

window.onkeyup = (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            inputs.left = false;
            break;
        case 'ArrowRight':
            inputs.right = false;
            break;
        case 'ArrowUp':
            inputs.up = false;
            break;
        case 'ArrowDown':
            inputs.down = false;
            break;
        case 'z':
            inputs.shoot = false;
            break;
        case 'x':
            inputs.jump = false;
            break;
    }
}