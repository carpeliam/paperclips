import { useEffect, useReducer } from 'react'
import { createInitialGameState, reduceGameState } from '../../domain/game'
import { loadGame, saveGame } from '../save/storage'
import { useWebSocket } from './useWebSocket'
import { DEFAULT_TICK_MS, startTickLoop } from './tickScheduler'

export function useGameController() {
  const [state, dispatch] = useReducer(reduceGameState, undefined, () => loadGame() ?? createInitialGameState())
  const { connected } = useWebSocket(dispatch)

  useEffect(() => {
    if (!connected) return startTickLoop(() => dispatch({ type: 'tick', deltaMs: DEFAULT_TICK_MS }))
  }, [connected])

  useEffect(() => {
    saveGame(state)
  }, [state])

  return {
    state,
    dispatch,
    tickMs: DEFAULT_TICK_MS,
  }
}
