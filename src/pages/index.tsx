import Image from 'next/image'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from 'services/api'
import { convertDurationToTimeString } from 'utils/convertDurationToTimeString'

import styles from './home.module.scss'

type Data = {
  id: string
  title: string
  thumbnail: string
  members: string
  published_at: string
  file: {
    url: string
    duration: number
  }
}

type ResponseData = Data[]

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  url: string
}

interface HomeProps {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }:HomeProps) {
  return (
   <div className={styles.homePage}>
     <section className={styles.latestEpisodes}>
      <h2>
        Últimos lançamentos
      </h2>
      <ul>
        {latestEpisodes.map(episode=>(
          <li key={episode.id}>
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              width={192}
              height={192}
              objectFit="cover"
            />
            <div className={styles.episodeDetails}>
              <Link href={`/episode/${episode.id}`}>
                <a>{episode.title}</a>
              </Link>
              <p>{episode.members}</p>
              <span>{episode.publishedAt}</span>
              <span>{episode.durationAsString}</span>
            </div>
            <button type="button">
              <img src="/play-green.svg" alt="Tocar episódio"/>
            </button>
          </li>
        ))}
      </ul>
     </section>
     <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map(episode=>(
                <tr key={episode.id}>
                  <td style={{width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
     </section>
   </div>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const { data }= await api.get<ResponseData>('/episodes',{
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order:'desc'
    }
  })

  const episodes = data.map(episode => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
    duration: episode.file.duration,
    durationAsString: convertDurationToTimeString(episode.file.duration),
    url: episode.file.url,
  }))

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}