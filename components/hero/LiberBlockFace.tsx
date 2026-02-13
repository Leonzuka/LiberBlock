'use client'

import { Html } from '@react-three/drei'

interface LiberBlockFaceProps {
  isActive: boolean
}

export default function LiberBlockFace({ isActive }: LiberBlockFaceProps) {
  return (
    <group position={[0, 0, 1.02]} rotation={[0, 0, 0]}>
      <Html
        transform
        occlude
        distanceFactor={1.8}
        className="pointer-events-none"
      >
        <div className={`lb-face ${isActive ? 'lb-face--active' : ''}`}>
          {/* Dot grid background */}
          <div className="lb-face__grid" />

          {/* HUD corner brackets */}
          <div className="lb-face__corner lb-face__corner--tl" />
          <div className="lb-face__corner lb-face__corner--tr" />
          <div className="lb-face__corner lb-face__corner--bl" />
          <div className="lb-face__corner lb-face__corner--br" />

          {/* Scan line */}
          <div className="lb-face__scanline" />

          {/* Hexagon with Bitcoin symbol */}
          <div className="lb-face__hex-wrap">
            <svg
              className="lb-face__hexagon"
              viewBox="0 0 100 100"
              width="120"
              height="120"
            >
              {/* Inner decorative hex */}
              <polygon
                points="50,10 86,31 86,69 50,90 14,69 14,31"
                fill="none"
                stroke="rgba(247,147,26,0.2)"
                strokeWidth="0.5"
              />
              {/* Main hex */}
              <polygon
                points="50,2 93,27 93,73 50,98 7,73 7,27"
                fill="none"
                stroke="#F7931A"
                strokeWidth="2"
                className="lb-face__hex-stroke"
              />
            </svg>
            <span className="lb-face__btc">&#x20BF;</span>
          </div>

          {/* Title */}
          <h2 className="lb-face__title">LIBERBLOCK</h2>

          {/* Subtitle */}
          <p className="lb-face__subtitle">Digital Innovation Studio</p>

          {/* Status indicator */}
          <div className="lb-face__status">
            <span className="lb-face__status-dot" />
            <span className="lb-face__status-text">SYSTEM ONLINE</span>
          </div>

          {/* Particle dots */}
          <span className="lb-face__dot lb-face__dot--1" />
          <span className="lb-face__dot lb-face__dot--2" />
          <span className="lb-face__dot lb-face__dot--3" />
          <span className="lb-face__dot lb-face__dot--4" />
          <span className="lb-face__dot lb-face__dot--5" />
          <span className="lb-face__dot lb-face__dot--6" />
          <span className="lb-face__dot lb-face__dot--7" />
          <span className="lb-face__dot lb-face__dot--8" />

          {/* Circuit decorative lines */}
          <div className="lb-face__circuit lb-face__circuit--1" />
          <div className="lb-face__circuit lb-face__circuit--2" />
        </div>
      </Html>
    </group>
  )
}
