import React from 'react'
import Footer from '../../components/Footer'
import MovieInfo from '../../components/MovieInfo'
import Head from 'next/head'
import Header from '../../components/Header'
import axios from 'axios'
import withAuth from '../../HOC/withAuth'

function MovieDetail({movieDetail, movieComments}) {
  return (
    <div className="popular-movies bg-zinc-900">
      <Head>
        <title>{movieDetail.name}</title>
      </Head>
      <Header />
      <MovieInfo MovieDetail={movieDetail} MovieComments={movieComments}/>
      <Footer />
    </div>
  )
}

export async function getServerSideProps(context){ 
  const id = context.params.id
  try {

    let config = {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3MDE0MzE1MywianRpIjoiMGZkYzY0ZjQtZjM4Mi00ZjQ5LWJiYjMtZWFhOWVlZGViMjk5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImRvbXBoYW0zMDA3MjFAZ21haWwuY29tIn0sIm5iZiI6MTY3MDE0MzE1MywiZXhwIjoxNjcyNzM1MTUzfQ.C2U8b7yhhtBXO3qEvFjWwvKzSYqpHXTgnT3GqpsJv2g",
          "Content-Type": "application/json",
        }
    }
    const response = await axios.get(`http://127.0.0.1:6868/movies/detail/${id}`, config);
    // const movies = await data.json();
    let movieDetail = {}
    let movieComments = []
    if(response.status === 200) {
      movieDetail = response.data.movie
      movieComments = response.data.comments
    }
  
    return {
      props: {
        movieDetail,
        movieComments
      }
    }
  } catch (error) {
    return {
      props: {
        movieDetail: {},
        movieComments: []
      }
    }
  }
  
}


export default withAuth(MovieDetail);