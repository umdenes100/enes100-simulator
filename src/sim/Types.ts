export type Obstacle = {
    x: number, // meters
    y: number, // meters
    width: number, // meters
    height: number, // meters
}

export type Arena = {
    width: number, // meters
    height: number, // meters
    obstacles: Obstacle[],
}

export type Robot = {
    x: number, // meters
    y: number, // meters
    angle: number, // radians
    v: number, // m/s
    w: number, // rad/s
}
