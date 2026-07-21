"use client";

const DROPLETS = [
  { w: 170, h: 137, mx: -257, my: 129, fx: -255, fy: 179, angle: 63, dur: 1.02, breathe: 5.57, delay: 1.82, g: 1 },
  { w: 100, h: 76, mx: -461, my: -206, fx: -457, fy: -167, angle: 90, dur: 1.77, breathe: 7.82, delay: 2.57, g: 1 },
  { w: 162, h: 126, mx: -310, my: -273, fx: -295, fy: -231, angle: 86, dur: 1.32, breathe: 6.45, delay: 2.12, g: 1 },
  { w: 78, h: 61, mx: 290, my: -270, fx: 301, fy: -287, angle: 78, dur: 1.11, breathe: 5.83, delay: 1.91, g: 1 },
  { w: 180, h: 151, mx: -185, my: 84, fx: -216, fy: 56, angle: 79, dur: 1.43, breathe: 6.79, delay: 2.23, g: 1 },
  { w: 133, h: 118, mx: -419, my: 241, fx: -460, fy: 282, angle: 31, dur: 1.8, breathe: 7.9, delay: 2.6, g: 1 },
  { w: 219, h: 171, mx: 666, my: -238, fx: 690, fy: -205, angle: 125, dur: 1.97, breathe: 8.4, delay: 2.77, g: 1 },
  { w: 194, h: 175, mx: 543, my: 235, fx: 506, fy: 274, angle: 2, dur: 1.35, breathe: 6.54, delay: 2.15, g: 1 },
  { w: 194, h: 171, mx: -184, my: -316, fx: -183, fy: -354, angle: 85, dur: 1.4, breathe: 6.71, delay: 2.2, g: 1 },
  { w: 140, h: 137, mx: 45, my: -123, fx: -2, fy: -90, angle: 92, dur: 1.46, breathe: 6.89, delay: 2.26, g: 1 },
  { w: 203, h: 170, mx: 600, my: -54, fx: 556, fy: -24, angle: 19, dur: 1.97, breathe: 8.42, delay: 2.77, g: 1 },
  { w: 30, h: 27, mx: -291, my: 106, fx: -293, fy: 111, angle: 102, dur: 1.76, breathe: 7.77, delay: 2.56, g: 1 },
  { w: 201, h: 167, mx: 408, my: 146, fx: 454, fy: 167, angle: 50, dur: 1.98, breathe: 8.45, delay: 2.78, g: 2 },
  { w: 219, h: 196, mx: -86, my: -233, fx: -45, fy: -242, angle: 29, dur: 1.16, breathe: 5.97, delay: 1.96, g: 2 },
  { w: 40, h: 35, mx: -362, my: 219, fx: -363, fy: 237, angle: 4, dur: 1.62, breathe: 7.36, delay: 2.42, g: 2 },
  { w: 86, h: 68, mx: 314, my: 138, fx: 309, fy: 121, angle: 27, dur: 1.92, breathe: 8.26, delay: 2.72, g: 2 },
  { w: 107, h: 96, mx: 197, my: 211, fx: 151, fy: 167, angle: 35, dur: 1.22, breathe: 6.16, delay: 2.02, g: 2 },
  { w: 160, h: 148, mx: -215, my: -167, fx: -262, fy: -141, angle: 162, dur: 1.58, breathe: 7.25, delay: 2.38, g: 2 },
  { w: 112, h: 90, mx: 635, my: -148, fx: 605, fy: -122, angle: 96, dur: 1.51, breathe: 7.03, delay: 2.31, g: 2 },
  { w: 162, h: 122, mx: 603, my: 120, fx: 592, fy: 170, angle: 58, dur: 1.98, breathe: 8.44, delay: 2.78, g: 2 },
  { w: 81, h: 75, mx: 654, my: 276, fx: 643, fy: 252, angle: 42, dur: 1.77, breathe: 7.81, delay: 2.57, g: 2 },
  { w: 266, h: 199, mx: 580, my: 265, fx: 627, fy: 268, angle: 24, dur: 1.66, breathe: 7.47, delay: 2.46, g: 2 },
  { w: 21, h: 21, mx: -243, my: -148, fx: -270, fy: -141, angle: 135, dur: 1.86, breathe: 8.08, delay: 2.66, g: 2 },
  { w: 191, h: 146, mx: -299, my: 36, fx: -342, fy: 3, angle: 112, dur: 1.04, breathe: 5.63, delay: 1.84, g: 2 },
  { w: 172, h: 150, mx: -445, my: -65, fx: -474, fy: -16, angle: 48, dur: 1.71, breathe: 7.64, delay: 2.51, g: 2 },
];

export default function LavaBlobs() {
  return (
    <div className="lava-blur-wrapper" aria-hidden="true">
      <div className="lava-wrapper">
        <div className="lava tail" />
        <div className="lava blob group-1" />
        <div className="lava blob clone" />
        <svg className="lava-filter" style={{ width: 0, height: 0 }}>
          <defs>
            <filter id="lava-meld">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" edgeMode="duplicate" />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -10"
                colorInterpolationFilters="sRGB"
              />
            </filter>
          </defs>
        </svg>
        {DROPLETS.map((d, i) => (
          <i
            key={i}
            className={`lava droplet group-${d.g}`}
            style={{
              width: d.w,
              height: d.h,
              ["--droplet-move-x" as string]: `${d.mx}px`,
              ["--droplet-move-y" as string]: `${d.my}px`,
              ["--droplet-flow-x" as string]: `${d.fx}px`,
              ["--droplet-flow-y" as string]: `${d.fy}px`,
              ["--droplet-angle" as string]: `${d.angle}deg`,
              animation: `${d.dur}s cubic-bezier(0.25, 1, 1, 1) 0.8s 1 normal forwards running explode, ${d.breathe}s ease-in-out ${d.delay}s infinite normal none running explode-breathe`,
              opacity: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
