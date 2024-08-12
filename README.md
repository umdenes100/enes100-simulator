# enes100-simulator

This is the enes100 simulator replacing the old simulator

## HOW TO UPDATE THE SIMULATOR

Probably what you want to change is `/src/sim/libs`. There you will find "defines" (`CRASH_SITE` `MATERIAL_TYPE`, etc)


### Reason for creation

The old simulator used an AWS machine to compile Arduino code, 
simulate the mission, and then send it back to the students.
It was moderately slow and maintaining the AWS machine was a pain.

The new simulator is a web app that runs on the client's machine.
It is maintained centrally in this repo and allows for the simulation
to run continously, and the code to just effect the simulation. A lot more like real life.

## The App
The app uses svelte.
`/sim` is where all of the code to actually do simulation and rendering is.
`/ui` is where all of the svelte components to do ui are.

### Code Editor
The code editor is 