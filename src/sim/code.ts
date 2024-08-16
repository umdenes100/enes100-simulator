import {clearOutputWhenRun, delay, output, resetRobotWhenRun, variables} from "../state";
import {get, type Writable, writable} from "svelte/store";
import type {Debugger} from "./JSCPPTypes";
import {Enes100H} from "./libs/Enes100.h";
import {TankH} from "./libs/Tank.h";
import {ArduinoH} from "./libs/Arduino.h";
import {generateID, sleep} from "./utils";
import {errorClarifiers} from "./checkCode";
import {resetRobot, stopRobot} from "./simulator";

export const ignored_variables = new Set<string>();
ignored_variables.add('main')
export function addIgnoredVariable(v: string) {
    ignored_variables.add(v)
}

// noinspection JSUnusedGlobalSymbols
const config = {
    debug: true,
    includes: {
        "Arduino.h": ArduinoH,
        "Enes100.h": Enes100H,
        "Tank.h": TankH,
    },
    stdio: {
        write: (v: string) => output.update(o => o + v),
    },
    intTypes: ["short", "short int", "signed short", "signed short int", "unsigned short", "unsigned short int", "int", "signed int", "unsigned", "unsigned int", "long", "long int", "long int", "signed long", "signed long int", "unsigned long", "unsigned long int", "long long", "long long int", "long long int", "signed long long", "signed long long int", "unsigned long long", "unsigned long long int", "bool"],
    "unsigned_overflow": "warn"
}


let deb: Debugger | undefined;

type Session = {
    stop: () => void;
    continue: () => void;
    pause: () => void;
    step: () => void;
    line: number | undefined;
    deb: Debugger;
    running: boolean
    id: string // Unique ID for the session
}
// A note about state - if !id then there is no session. If id but not running it is paused.
export const session: Writable<Session | undefined> = writable(undefined);

export function startCode(code: string, interval: number = 100) {
    // console.clear()
    if (get(clearOutputWhenRun)) output.set('')
    if (get(resetRobotWhenRun)) {
        resetRobot(); stopRobot();
    }
    try {
        // @ts-ignore
        deb = JSCPP.run(code, '', config);
    } catch (e: any) {
        // debugger
        console.error(e)
        output.update(o => o + '\n' + errorClarifiers(e.message))
        return;
    }

    if (!deb) return console.log('Error')
    programLength = deb.srcByLines.findIndex((line) => line.includes('int main()')) - 1
    session.set({
        stop: stopCodeInInterval,
        continue: () => resumeCodeInInterval(interval),
        step: nextCode,
        pause: pauseCodeInInterval,
        running: false, // Running if a current statement is executing.
        deb: deb,
        line: deb.prevNode?.sLine,
        id: generateID()
    })
    // noinspection JSIgnoredPromiseFromCall
    nextCode();
}

// To run the code we will have an timeout.
let timeout: number;
let programLength: number;
let $delay: number | undefined, $session: Session | undefined;
delay.subscribe(d => $delay = d)
session.subscribe(s => $session = s)

async function nextCode() {
    console.log('next code')
    let id = $session?.id;
    let done;
    do {
        try {
            if (!deb) return;
            done = deb.next()
            if ($delay) {
                let d = $delay;
                delay.set(undefined);
                await sleep(d);
                // If after the sleep the session is not running, then we should stop the code
                if (id != $session?.id) {
                    console.log('session ended while sleeping', $session?.running, $session?.id, id)
                    return;
                }
            }
            if ($session && !$session?.running){
                // console.log('updating variables')
                variables.set(deb.variable() as [])
            }
        } catch (e: any) {
            console.error(e)
            output.update(o => o + '\n' + errorClarifiers(e.message))
            return;
        }
    } while (!done && (deb?.prevNode?.sLine === undefined || deb.prevNode?.sLine > programLength))

    session.update((s) => (s ? {...s, line: s.deb.prevNode?.sLine} : undefined))

    // Done either has a value or is undefined if the program is finished
    if (done !== false) {
        stopCodeInInterval();
        output.update(e => e + '\nProgram finished\n')
    }
}

function pauseCodeInInterval() {
    session.update((s) => (s ? {...s, running: false} : undefined))
    clearTimeout(timeout);
}

function resumeCodeInInterval(step: number = 100) {
    session.update((s) => (s ? {...s, running: true} : undefined))
    async function run() {
        await nextCode(); // waits for next code to complete.
        if (deb && $session?.running)
            timeout = setTimeout(run, step)
    }
    // noinspection JSIgnoredPromiseFromCall
    run();
}

function stopCodeInInterval() {
    clearTimeout(timeout);
    session.set(undefined)
    deb = undefined;
}


// todo use an imported version of JSCPP