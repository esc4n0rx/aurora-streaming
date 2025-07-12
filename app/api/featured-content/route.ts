import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY
  const bearerToken = process.env.TMDB_BEARER_TOKEN
  const accountId = process.env.TMDB_ACCOUNT_ID || "1" // mockar account_id
  if (!bearerToken) {
    return NextResponse.json({ error: "TMDB_BEARER_TOKEN não configurado" }, { status: 500 })
  }

  try {
    // Filmes populares
    const urlMovies = `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`
    const resMovies = await fetch(urlMovies, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      next: { revalidate: 60 },
    })
    const dataMovies = await resMovies.json()
    const movies = (dataMovies.results || []).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      rating: movie.vote_average,
      release_date: movie.release_date,
      genres: movie.genre_ids,
    }))

    // Séries em alta
    const urlSeries = `https://api.themoviedb.org/3/trending/tv/week?language=pt-BR`
    const resSeries = await fetch(urlSeries, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      next: { revalidate: 60 },
    })
    const dataSeries = await resSeries.json()
    const series = (dataSeries.results || []).map((tv: any) => ({
      id: tv.id,
      title: tv.name,
      description: tv.overview,
      backdrop: tv.backdrop_path ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}` : null,
      poster: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : null,
      rating: tv.vote_average,
      release_date: tv.first_air_date,
      genres: tv.genre_ids,
    }))

    // Lançamentos (Now Playing)
    const urlNowPlaying = `https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1`
    const resNowPlaying = await fetch(urlNowPlaying, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      next: { revalidate: 60 },
    })
    const dataNowPlaying = await resNowPlaying.json()
    const nowPlaying = (dataNowPlaying.results || []).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      rating: movie.vote_average,
      release_date: movie.release_date,
      genres: movie.genre_ids,
    }))

    return NextResponse.json({ movies, series, nowPlaying })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
} 