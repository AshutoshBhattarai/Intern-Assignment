const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
/* ------------------------- Game Player Properties ------------------------- */
const PLAYER_ID = 87;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 72;
const PLAYER_INITIAL_SPAWN_X = 80;
const PLAYER_INITIAL_SPAWN_Y = 10;
const SPEED = 0.1;
const SPEED_LIMIT = 3;
const GRAVITY = 1.5;
const JUMP_HEIGHT = -20;
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const DIRECTION_UP = 'up';
const DIRECTION_DOWN = 'down';
const DIRECTION_UP_LEFT = 'up-left';
const DIRECTION_UP_RIGHT = 'up-right';
const DIRECTION_DOWN_RIGHT = 'down-right';
const DIRECTION_DOWN_LEFT = 'down-left';
const BULLET_COOLDOWN = 400;
const BULLET_SPEED = 5;
const ENEMY_BULLET_SPEED = 3;
/* ---------------------------- Level Properties ---------------------------- */
const TILE_SIZE = 40;
/* -------------------------------- Tile ID's ------------------------------- */
const PLATFORM_ID = 1;
const WATER_ID = 20;
const DESTROYABLE_BLOCK_ID = 8;
const WALL_BLOCK_ID = 99;
const DEATH_DROP_ID = 50;
const PLAYER_RESPAWN_COORDS_ID = 7;
/* ------------------------------ Map Sections ------------------------------ */
const MAP_SECTION_1_ID = 'section1';
const MAP_SECTION_2_ID = 'section2';
const MAP_SECTION_3_ID = 'section3';
const MAP_SECTION_4_ID = 'section4';
const MAP_SECTION_5_ID = 'section5';
const MAP_SECTION_6_ID = 'section6';
const MAP_SECTION_7_ID = 'section7';
const MAP_SECTION_8_ID = 'section8';
const MAP_SECTION_ARRAY = [
    MAP_SECTION_1_ID,
    MAP_SECTION_2_ID,
    MAP_SECTION_3_ID,
    MAP_SECTION_4_ID,
    MAP_SECTION_5_ID,
    MAP_SECTION_6_ID,
    MAP_SECTION_7_ID,
    MAP_SECTION_8_ID,
];

/* ------------------------ Collision PLatform types ------------------------ */
const COLLISION_PLATFORM = 'platform';
const COLLISION_WATER = 'water';
/* ------------------------------- Enemy Types with ID's ------------------------------ */
const ENEMY_RUNNING = 3;
const ENEMY_SOLDIER = 4;
const ENEMY_TURRET = 5;
const ENEMY_ID = 33;