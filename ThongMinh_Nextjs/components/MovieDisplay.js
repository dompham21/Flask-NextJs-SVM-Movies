import React from 'react'
import Link from 'next/link'
import MovieCards from './MovieCards'
import { Pagination } from 'antd'

const MovieDisplay = (props) => {
    let { movies, category } = props
   

    return (    
        <div className="popular-movies md:mx-24">
            <div className="flex flex-wrap overflow-hidden sm:-mx-2 pl-2 md:-mx-2 lg:-mx-2 xl:-mx-2">
                {movies.map(MovieCard => {
                    return (<MovieCards key={MovieCard.id} category={category} MovieCard={MovieCard}/>)
                })}
            </div>
        </div>            
     );
}
 
export default MovieDisplay;