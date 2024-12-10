export const WindowWidth = window.innerWidth;
export const WindowHeight = window.innerHeight;
export const TopLeft = { // Top left corner of the classroom
    x:0.009091176 * WindowWidth,
    y:0.724047146 * WindowHeight
};
export const DownVector = { // Down vector of the classroom
    x:(0.404411765 - 0.009191176) * WindowWidth,
    y:(0.990123457 - 0.727047146) * WindowHeight
};
export const RightVector = { // Right vector of the classroom
    x:(0.59375 - 0.009191176) * WindowWidth,
    y:(1/3 - 0.727047146) * WindowHeight
};
export const DownRightVector = { // Diagonal vector of the classroom
    x:RightVector.x,
    y:DownVector.y
};
export const vecLength = (vec) => { // Compute the length of a vector
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
};
export const vecDot = (vec1, vec2) => { // Compute the dot product of two vectors
    return vec1.x * vec2.x + vec1.y * vec2.y;
}
export const CoordInterval = { // Interval of the classroom's coordinates adapted to the screen
    min:{x:0,y:0},
    max:{x:vecLength(RightVector),y:vecLength(DownVector)}
};




export const DEBUG = false;
export const SHOWPATH = true;
export const DEBUG_INTRO = false;