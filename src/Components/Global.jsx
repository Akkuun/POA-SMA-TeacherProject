export const WindowWidth = window.innerWidth;
export const WindowHeight = window.innerHeight;
export const TopLeft = {
    x:0.009191176 * WindowWidth,
    y:0.727047146 * WindowHeight
};
export const DownVector = {
    x:0.404411765 * WindowWidth - TopLeft.x,
    y:0.990123457 * WindowHeight - TopLeft.y
};
export const RightVector = {
    x:0.59375 * WindowWidth - TopLeft.x,
    y:1/3 * WindowHeight - TopLeft.y
};