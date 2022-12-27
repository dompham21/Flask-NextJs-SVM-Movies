import React from 'react'
import Link from "next/link";

const MovieCards = (props) => {
    const { MovieCard, category } = props
    let poster_path = MovieCard.image
    if (MovieCard.image == null) {
        poster_path = "https://i.imgur.com/wjVuAGb.png"
    }
    const getCategoryName = (categoryId) => {
        console.log(typeof(categoryId))
        switch(parseInt(categoryId)) {
            case 0:
                return "vui"
            case 1:
                return "cảm động"
            case 2:
                return "sợ"
            case 3:
                return "thích thú"
            case 4:
                return "khác"
            default:
                return "null"
    }
    

    }
    return (  
        <div className="mt-2 mb-4 px-2 w-full overflow-hidden sm:mt-2 sm:mb-4 sm:px-2 sm:w-1/2 md:mt-2 md:mb-4 md:px-2 md:w-1/4 lg:mt-2 lg:mb-4 lg:px-2 lg:w-1/5 xl:mt-2 xl:mb-4 xl:px-2 xl:w-1/5">
            <div className="rounded-md overflow-hidden">
                <Link key={MovieCard.id} href="/movie/[id]" as={`/movie/${MovieCard.id}`}>
                    <div title={MovieCard.name}>
                        <img className="w-11/12 hover:opacity-70" title={MovieCard.name} src={poster_path} alt={MovieCard.name} width="1500px" height="2250px"/>
                    </div>
                    <div className="mt-2">
                        <h4 className="text-white text-base font-bold">{MovieCard.name}</h4>
                        {
                            category && MovieCard.number_cmt && MovieCard.total_cmt &&  <p className="text-gray-400 text-xs">Có {MovieCard.number_cmt}/{MovieCard.total_cmt} bình luận là {getCategoryName(category)}</p>
                        }
                       
                    </div>
                </Link>
            </div>
        </div>           
        )

}
 
export default MovieCards;