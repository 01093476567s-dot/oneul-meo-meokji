import { useMemo } from 'react'

const COLORS = ['#ffc700', '#60b8ff', '#ff6b9d', '#a8e063', '#c084fc']

const CSS = `
.cnf-wrap {
  position: absolute;
  pointer-events: none;
  z-index: 20;
}
.cnf-piece {
  position: absolute;
  border-radius: 3px;
  animation-name: cnf-burst;
  animation-timing-function: cubic-bezier(0.15, 0.85, 0.25, 1);
  animation-duration: var(--dur);
  animation-delay: var(--delay);
  animation-fill-mode: both;
  animation-iteration-count: 1;
}
@keyframes cnf-burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--r0)) scale(1);
  }
  18% { opacity: 1; }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--r1)) scale(0.5);
  }
}
`

function rand(min, max) {
  return min + Math.random() * (max - min)
}

export default function Confetti({ count = 50, top = '50%', left = '50%' }) {
  const pieces = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle  = rand(0, 360)
      const dist   = rand(70, 170)
      const ribbon = Math.random() < 0.45
      return {
        id:    i,
        color: COLORS[i % COLORS.length],
        w:     ribbon ? rand(4, 6)   : rand(8, 14),
        h:     ribbon ? rand(14, 22) : rand(6, 11),
        tx:    Math.cos(angle * Math.PI / 180) * dist,
        ty:    Math.sin(angle * Math.PI / 180) * dist,
        r0:    rand(-40, 40),
        r1:    rand(-380, 380),
        delay: rand(0, 0.08),
        dur:   rand(0.9, 1.4),
      }
    })
  , [count])

  return (
    <>
      <style>{CSS}</style>
      <div className="cnf-wrap" style={{ top, left }}>
        {pieces.map(p => (
          <div
            key={p.id}
            className="cnf-piece"
            style={{
              width:      `${p.w}px`,
              height:     `${p.h}px`,
              background: p.color,
              '--tx':     `${p.tx}px`,
              '--ty':     `${p.ty}px`,
              '--r0':     `${p.r0}deg`,
              '--r1':     `${p.r1}deg`,
              '--delay':  `${p.delay}s`,
              '--dur':    `${p.dur}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
