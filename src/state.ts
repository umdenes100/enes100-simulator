import {type Writable, writable} from "svelte/store";
import type {Arena, Robot} from "./sim/Types";
import {basicExample} from "./ui/examples";
import {storable} from "./storable";


// When in edit mode, the user can edit the code and has the full screen. With simulate mode, the simulator takes up a % of the screen.
export const mode: Writable<'edit' | 'simulate'> = writable('edit')
export const code: Writable<string> = storable('code', basicExample)
export const output: Writable<string> = writable('')
export const arena: Writable<Arena> = writable();
export const robot: Writable<Robot> = writable();
export const variables: Writable<{ name: string; type: string; value: string }[]> = writable([])

export const teamName: Writable<string> = writable('')
export const teamType: Writable<0 | 1 | 2 | 3 | 4 | 5> = writable(0)
export const markerId: Writable<number> = writable(0)

export const clearOutputWhenRun: Writable<boolean> = writable(true)
export const showVariables: Writable<boolean> = writable(true)
export const delay: Writable<number | undefined> = writable(undefined); // Hack way to do delay to not block the main thread lol.
export const robotDimensions = {length: 0.15, width: 0.12}

function reset() {
    arena.set({
        height: 2,
        width: 4,
        obstacles: []
    });

    robot.set({
        x: 1,
        y: 1,
        angle: 0,
        v: 0,
        w: 0,
    });
}

reset()