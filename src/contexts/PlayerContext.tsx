import { createContext, ReactElement, useState } from 'react'

interface Episode {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[]
  currentEpisodeIndex: number,
  isPlaying: boolean
  play: (episode: Episode) => void
  setPlayingState: (state: boolean) => void
  togglePlay: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

export default function PlayerContextProvider({ children }): ReactElement {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = (episode: Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        episodeList,
        currentEpisodeIndex,
        play,
        togglePlay,
        setPlayingState
      }}>
      {children}
    </PlayerContext.Provider>
  )
}
