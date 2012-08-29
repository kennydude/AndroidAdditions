This is really useful for glowable edges. You can rotate the canvas before drawing, which allows you to move the glow. By default it glows from the top edge.

You can automate a glow by having a float value, increasing on `draw()`, and calling `onPull()` until a sepecified value, then `onRelease`.

