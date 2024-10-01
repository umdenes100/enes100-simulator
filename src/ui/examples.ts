export const basicExample = `#include "Arduino.h"
#include "Enes100.h"
#include "Tank.h"



void setup() {
    Enes100.begin("Simulator", FIRE, 3, 8, 9);
    Tank.begin();
    
    Enes100.println("Starting driving");
    Tank.setLeftMotorPWM(255);
    Tank.setRightMotorPWM(255);
}

void loop() {
    delay(1000);
    Enes100.print("X = "); Enes100.println(Enes100.getX());
    Enes100.print("Y = "); Enes100.println(Enes100.getY());
    Enes100.print("Theta = "); Enes100.println(Enes100.getTheta());
}`

export const testExample = `#include "Arduino.h"
#include "Enes100.h"
#include "Tank.h"


void setup() {
    Enes100.begin("Simulator", DATA, 3, 8, 9);
    Enes100.println(257);
    Enes100.println(true);
    Enes100.println("Hello, World!");
    Enes100.println(1.0);
    float x = Enes100.getX();
    Enes100.println(x);
    Enes100.println(Enes100.getY());
    Enes100.println(Enes100.getTheta());
    Enes100.println(Enes100.isVisible());
    Enes100.println(Enes100.isConnected());
    
    // A little test script that should put the simulator through its paces.
    Enes100.begin("Simulator", CRASH_SITE, 3, 8, 9);
    Enes100.mission(LENGTH, 1000);
    Enes100.mission(HEIGHT, 1000);
    Enes100.mission(DIRECTION, NORMAL_X);
    Enes100.mission(DIRECTION, NORMAL_Y);
    
    Enes100.begin("Simulator", DATA, 3, 8, 9);
    Enes100.mission(CYCLE, 10);
    Enes100.mission(MAGNETISM, MAGNETIC);
    Enes100.mission(MAGNETISM, NOT_MAGNETIC);
    
    Enes100.begin("Simulator", MATERIAL, 3, 8, 9);
    Enes100.mission(WEIGHT, HEAVY);
    Enes100.mission(WEIGHT, MEDIUM);
    Enes100.mission(WEIGHT, LIGHT);
    Enes100.mission(MATERIAL_TYPE, FOAM);
    Enes100.mission(MATERIAL_TYPE, PLASTIC);
    
    Enes100.begin("Simulator", FIRE, 3, 8, 9);
    Enes100.mission(NUM_CANDLES, 3);
    Enes100.mission(TOPOGRAPHY, TOP_A);
    Enes100.mission(TOPOGRAPHY, TOP_B);
    Enes100.mission(TOPOGRAPHY, TOP_C);
    
    Enes100.begin("Simulator", WATER, 3, 8, 9);
    Enes100.mission(DEPTH, 1000);
    Enes100.mission(WATER_TYPE, FRESH_UNPOLLUTED);
    Enes100.mission(WATER_TYPE, FRESH_POLLUTED);
    
    Enes100.begin("Simulator", SEED, 3, 8, 9);
    Enes100.mission(PERCENTAGE, 100);
    // In the simulator, Coordinate only works in this way. You cannot declare coordinate objects.
    Enes100.mission(LOCATION, Coordinate(100, 100));
    Enes100.mission(LOCATION, Coordinate(200, 200));
    
    Tank.begin();
    Tank.setLeftMotorPWM(100);
    Tank.setRightMotorPWM(100);
    
    delay(1000);
    Tank.turnOffMotors();
}

void loop() {
    delay(1000);
    Enes100.println("Hello, World! (from loop)");
}`