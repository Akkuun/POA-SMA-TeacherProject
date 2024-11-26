export const WindowWidth = window.innerWidth;
export const WindowHeight = window.innerHeight;
export const TopLeft = {
    x:0.009191176 * WindowWidth,
    y:0.700047146 * WindowHeight
};
export const DownVector = {
    x:(0.404411765 - 0.009191176) * WindowWidth,
    y:(0.990123457 - 0.727047146) * WindowHeight
};
export const RightVector = {
    x:(0.59375 - 0.009191176) * WindowWidth,
    y:(1/3 - 0.727047146) * WindowHeight
};
export const DownRightVector = {
    x:RightVector.x,
    y:DownVector.y
};
export const vecLength = (vec) => {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
};
export const CoordInterval = {
    min:{x:0,y:0},
    max:{x:vecLength(RightVector),y:vecLength(DownVector)}
};