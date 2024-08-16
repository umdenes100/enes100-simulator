import {get, type Writable, writable} from "svelte/store";
import type {Arena, Robot} from "./sim/Types";
import {basicExample} from "./ui/examples";
import {storable} from "./storable";

// BIG VARIABLES
export const code: Writable<string> = storable('code', basicExample) // The users code. Don't write to this really.
export const output: Writable<string> = writable('')
export const arena: Writable<Arena> = writable(); // Arena, see Arena type in Types.ts
export const robot: Writable<Robot> = writable(); // robot, updates every time it moves. See Types.ts
export const variables: Writable<{ name: string; type: string; value: string }[]> = writable([]) // All variables. Only opened when paused.
export const delay: Writable<number | undefined> = writable(undefined); // Hack way to do delay to not block the main thread lol.

export const teamName: Writable<string> = writable('') // Team name. Just displayed but we have it for later.
export const teamType: Writable<0 | 1 | 2 | 3 | 4 | 5> = writable(0) //
export const markerId: Writable<number> = writable(0) // Only written to. But if we want it later.

export const clearOutputWhenRun: Writable<boolean> = storable('clearOutputWhenRun',true) // Should we clear the output when we run the program. Currently not settable but here for the future.
export const resetRobotWhenRun: Writable<boolean> = storable('resetRobotWhenRun',true) // Should we reset the robot when we run the program. Currently not settable but here for the future.
export const showVariables: Writable<boolean> = writable(true) // Should we show variables in the table?
export const draggingRobot: Writable<boolean> = writable(false) // Are we currently dragging the robot (disable obstacle physics)

export const robotDimensions = {length: 0.15, width: 0.12} // Change the dims of the robot here.

export function reset() {
    const height = 0.5;
    arena.set({
        height: 2,
        width: 4,
        obstacles: [
            {width: 0.2, height, top: .25, left: .8+.6, collisions: false},
            {width: 0.2, height, top: .75, left: .8+.6, collisions: true},
            {width: 0.2, height, top: 1.25, left: .8+.6+.8, collisions: true},
        ]
    });

    robot.set({
        x: .55,
        y: .55,
        angle: 0,
        v: 0,
        w: 0,
    });
}

reset()