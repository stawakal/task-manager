import { useEffect } from 'react'

export default function Confetti() {
  useEffect(() => {
    const run = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default
        const duration = 2000
        const end = Date.now() + duration

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#b8a9c9', '#e8d5d5', '#2c2c2c'],
          })
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#b8a9c9', '#e8d5d5', '#2c2c2c'],
          })
          if (Date.now() < end) requestAnimationFrame(frame)
        }
        frame()
      } catch (_) {}
    }
    run()
  }, [])

  return null
}
