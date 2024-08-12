// Renders an arena based on an arena state and a robot state.

import type {Arena, Robot} from "./Types";
import {arena, robot, robotDimensions} from "../state";
import {physics} from "./simulator";

const resolution = 400; // pixels per meter (4 meters = 2000 pixels)
const arenaColor = "#808080";

let ctx: CanvasRenderingContext2D | undefined;
let $arena: Arena, $robot: Robot;
arena.subscribe(value => $arena = value);
robot.subscribe(value => $robot = value);

export function startRender(_ctx: CanvasRenderingContext2D) {
    ctx = _ctx;
    ctx.canvas.width = $arena.width * resolution;
    ctx.canvas.height = $arena.height * resolution;
    last = performance.now();
    render();
}

let last = 0;

function render() {
    if (!ctx) return;
    const now = performance.now();
    physics((now - last) / 1000);
    last = now;

    // console.log('frame2')
    ctx.canvas.width = $arena.width * resolution;
    ctx.canvas.height = $arena.height * resolution;
    ctx.fillStyle = arenaColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Render the obstacles
    for (const obstacle of $arena.obstacles) {
        ctx.fillStyle = "white";
        ctx.fillRect(obstacle.x * resolution, obstacle.y * resolution, obstacle.width * resolution, obstacle.height * resolution);
    }

    // Render the robot
    ctx.fillStyle = "white";
    ctx.beginPath();

    // Given an X and a Y, (center the points) draw a robot. Rotated by angle which is angle in radians.
    const x = $robot.x * resolution, y = $robot.y * resolution;
    const angle = $robot.angle;
    const size = 0.1; // meters

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillRect(-robotDimensions.length / 2 * resolution, -robotDimensions.width / 2 * resolution, robotDimensions.length * resolution, robotDimensions.width * resolution);
    ctx.strokeStyle = "black";
    //4 px
    ctx.lineWidth = 1;
    ctx.strokeRect(-robotDimensions.length / 2 * resolution, -robotDimensions.width / 2 * resolution, robotDimensions.length * resolution, robotDimensions.width * resolution);
    // Tracks, two rectangles of grey.
    ctx.fillStyle = "#2f2f2f";
    const center = {x: 0, y: (-.025 - robotDimensions.width / 2) * resolution, width: robotDimensions.length * 1.2 * resolution, height: .03 * resolution};
    ctx.fillRect(center.x - center.width / 2, center.y - center.height / 2, center.width, center.height);
    ctx.fillRect(center.x - center.width / 2, -center.y - center.height / 2, center.width, center.height);


    // Line from center to front of robot
    // black
    ctx.strokeStyle = "black";
    //4 px
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * resolution, 0);
    ctx.stroke();

    ctx.restore();


    requestAnimationFrame(render);
}

export function stopRender() {
    ctx = undefined;
}