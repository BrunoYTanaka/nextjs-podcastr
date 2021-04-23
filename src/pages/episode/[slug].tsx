import { ReactElement } from 'react'
import Link from 'next/link'
import { GetStaticProps, GetStaticPaths } from 'next'
import { api } from 'services/api'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { convertDurationToTimeString } from 'utils/convertDurationToTimeString'

import styles from './episode.module.scss'
import Image from 'next/image'
import { usePlayer } from 'contexts/PlayerContext'
import Head from 'next/head'

type ResponseData = {
  id: string
  title: string
  thumbnail: string
  members: string
  published_at: string
  file: {
    url: string
    duration: number
  }
  description: string
}

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  url: string
  description: string
}

interface EpisodeProps {
  episode: Episode
}

function Episode({ episode }: EpisodeProps): ReactElement {
  const { play } = usePlayer()
  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />

    </div>
  )
}

export default Episode


export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<ResponseData[]>('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => ({ params: { slug: episode.id } }))

  return {
    paths,
    fallback: "blocking" //blocking ssr - true client
  }
}



export const getStaticProps: GetStaticProps = async context => {

  const { slug } = context.params

  const { data } = await api.get<ResponseData>(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: data.file.duration,
    durationAsString: convertDurationToTimeString(data.file.duration),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: { episode },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
