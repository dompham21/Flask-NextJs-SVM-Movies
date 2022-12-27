import React from 'react'
import Head from 'next/head'
import axios from 'axios'
import withAuth from '../../../HOC/withAuth'
import HeaderPage from '../../../components/Header'
import MovieDisplay from '../../../components/MovieDisplay'
import Menu from '../../../components/Menu'
import Footer from '../../../components/Footer'
import { useRouter } from 'next/router'

function CategoryMovie({movies}) {
    const router = useRouter()
    const { id } = router.query
  return (
    <div className="popular-movies bg-zinc-900">
      <Head>
        <title>Movies - xemphim</title>
      </Head>
      <div className='min-h-screen'>
        <HeaderPage />
        <Menu />
        <MovieDisplay movies={movies} category={id}/>
      </div>
     
      <Footer />
    </div>
  )
}

export async function getServerSideProps(context){ 
 const id = context.params.id
console.log(id)
  try {

    let config = {
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3MDE0MzE1MywianRpIjoiMGZkYzY0ZjQtZjM4Mi00ZjQ5LWJiYjMtZWFhOWVlZGViMjk5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImRvbXBoYW0zMDA3MjFAZ21haWwuY29tIn0sIm5iZiI6MTY3MDE0MzE1MywiZXhwIjoxNjcyNzM1MTUzfQ.C2U8b7yhhtBXO3qEvFjWwvKzSYqpHXTgnT3GqpsJv2g",
        "Content-Type": "application/json"
      }
    }
    const response = await axios.get(`http://127.0.0.1:6868/movies/${id}`, config);
    // const movies = await data.json();
    let movies = []
    if(response.status === 200) {
      movies = response.data.movies
    }
  
    return {
      props: {
        movies,
      }
    }
  } catch (error) {
    return {
      props: {
        movies: [],
      }
    }
  }
  
}

export default withAuth(CategoryMovie)