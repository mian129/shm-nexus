"use client";

export default function LavaBlobs() {
  return (
    <div className="lava-blur-wrapper" aria-hidden="true">
      <svg className="lava-filter" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="lava-meld">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" edgeMode="duplicate" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              colorInterpolationFilters="sRGB"
            />
          </filter>
        </defs>
      </svg>
      <div className="lava-wrapper" style={{ filter: "url(#lava-meld)" }}>
        <div className="lava-blob blob-1" />
        <div className="lava-blob blob-2" />
        <div className="lava-blob blob-3" />
        <div className="lava-blob blob-4" />
      </div>
    </div>
  );
}
