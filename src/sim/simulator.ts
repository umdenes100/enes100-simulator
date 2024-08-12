// The simulator takes an arena (writable) and a current robot state and returns a new robot state and sets the

import {arena, robot, robotDimensions} from "../state";
import type {Arena, Robot} from "./Types";
import {round} from "./utils";

export function resetRobot() {
    robot.update(r => ({...r, x: 1, y: 1, angle: 0}));
}

export function stopRobot() {
    // robot.set({x: 1, y: 1, angle: 0, w: 0, v: 0});
    robot.update(r => ({...r, v: 0, w: 0}));
}

let $robot: Robot, $arena: Arena;
robot.subscribe(value => $robot = value);
arena.subscribe(value => $arena = value);

/**
 * Propagate the robot's movement and check for collisions.
 * @param dt The time since the last frame in seconds.
 */
export function physics(dt: number) {
    // Propagate movement
    $robot.angle = ($robot.angle + $robot.w * dt) % (2 * Math.PI);

    $robot.x = $robot.x + Math.cos($robot.angle) * $robot.v * dt
    $robot.y = $robot.y + Math.sin($robot.angle) * $robot.v * dt

    // Make sure the robot is within the bounds of the arena
    let corners = [
        [-robotDimensions.length / 2, -robotDimensions.width / 2],
        [-robotDimensions.length / 2, robotDimensions.width / 2],
        [robotDimensions.length / 2, -robotDimensions.width / 2],
        [robotDimensions.length / 2, robotDimensions.width / 2]
    ].map(([x, y]) => {
        return [
            $robot.x + x * Math.cos($robot.angle) - y * Math.sin($robot.angle),
            $robot.y + x * Math.sin($robot.angle) + y * Math.cos($robot.angle)
        ];
    })
    for (const corner of corners) {
        if (corner[0] < 0) {
            // X is left of the arena
            $robot.x += -corner[0];
        }
        if (corner[0] > $arena.width) {
            // X is right of the arena
            $robot.x -= corner[0] - $arena.width;
        }
        if (corner[1] < 0) {
            // Y is above the arena
            $robot.y += -corner[1];
        }
        if (corner[1] > $arena.height) {
            // Y is below the arena
            $robot.y -= corner[1] - $arena.height;
        }
    }
    if ($robot.x < 0) $robot.x = 0;
    if ($robot.y < 0) $robot.y = 0;
    if ($robot.x > $arena.width) $robot.x = $arena.width;
    if ($robot.y > $arena.height) $robot.y = $arena.height;

    $robot.x = round($robot.x, 4);
    $robot.y = round($robot.y, 4);
    $robot.angle = round($robot.angle, 4);
    $robot.w = round($robot.w, 4);
    $robot.v = round($robot.v, 4);
    robot.set($robot);

    // Make sure the robot is not running into an obstacle
}