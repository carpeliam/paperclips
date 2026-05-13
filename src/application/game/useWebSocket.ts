import { useEffect, useState } from 'react'
import type { GameAction, GameState } from '../../domain/game'

export function useWebSocket(dispatch: (action: GameAction) => void) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let current = true
    const ws = new WebSocket('ws://localhost:8080')
    ws.onopen = () => {
      if (current) {
        dispatch({ type: 'reset' })
        setConnected(true)
      }
    }
    ws.onclose = () => { if (current) setConnected(false) }
    ws.onmessage = (event) => {
      if (!current) return
      const state = JSON.parse(event.data) as GameState
      dispatch({ type: 'replace', state })
    }

    return () => {
      current = false
      ws.close()
    }
  }, [dispatch])

  return { connected }
}
