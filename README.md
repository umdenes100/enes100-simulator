# enes100-simulator

This is the enes100 simulator replacing the old simulator

## HOW TO UPDATE THE SIMULATOR

Clone the repository and run `npm install` to install all the dependencies.

To run the simulator, run `npm run dev` and click the link the appears in the terminal. Leave this terminal running, it will update the website as you make changes.

Probably what you want to change is `/src/sim/libs`. There you will find "defines" (`CRASH_SITE` `MATERIAL_TYPE`, etc) and 
functions like Enes100.begin. You'll get a sense for these functions and be able to add them.

Make sure to test your changes and then push the changes to github. This will trigger a rebuild.

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

### Other notes

JSCPP had some issues (mainly, not throwing exceptions in some cases) so I made
my own fork, compiled it, and then put the result in public/JSCPP.es5.js (minified 
and map file). Which means that if you find an error with JSCPP and want to change
it, you will probably need to contact me. (Forrest Milner).