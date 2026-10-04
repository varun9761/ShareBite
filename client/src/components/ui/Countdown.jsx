import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export function Countdown({ expiresAt, urgent }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const remaining = new Date(expiresAt).getTime() - now
  if (remaining <= 0) {
    return <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">EXPIRED</span>
  }

  return (
    <span
      className={`font-mono text-xs font-black ${
        urgent
          ? 'text-rose-600 animate-pulse dark:text-rose-400'
          : 'text-emerald-700 dark:text-emerald-400'
      }`}
    >
      {formatDistanceToNow(new Date(expiresAt), { addSuffix: true })}
    </span>
  )
}
