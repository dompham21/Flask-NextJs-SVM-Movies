import React from 'react'
import Link from "next/link";
import { useRouter } from 'next/router'

const Menu = () => {
    const router = useRouter()
  

    return ( 
    <div className="flex mx-8 justify-center">
        <li className="list-none my-8 pr-2">
            <Link href="/" as={`/`}>
                <div className={`rounded-md px-4 py-2 text-white hover:opacity-70 ${router.asPath === "/" ? "bg-green-500" : "bg-zinc-800"}`}>Tất cả</div>
            </Link>
        </li>
        <li className="list-none my-8 pr-2">
            <Link href="/movie/category/0" as={`/movie/category/0`}>
                <div className={`rounded-md px-4 py-2 text-white hover:opacity-70 ${router.asPath === "/movie/category/0" ? "bg-green-500" : "bg-zinc-800"}`}>Phim hài</div>
            </Link>
        </li>
        <li className="list-none my-8 pr-2">
            <Link href="/movie/category/1" as={`/movie/category/1`}>
                <div className={`rounded-md px-4 py-2 text-white hover:opacity-70 ${router.asPath === "/movie/category/1" ? "bg-green-500" : "bg-zinc-800"}`}>Phim cảm động</div>
            </Link>
        </li>
        <li className="list-none my-8 pr-2">
            <Link href="/movie/category/2" as={`/movie/category/2`}>
                <div className={`rounded-md px-4 py-2 text-white hover:opacity-70 ${router.asPath === "/movie/category/2" ? "bg-green-500" : "bg-zinc-800"}`}>Phim kinh dị</div>
            </Link>
        </li>
        <li className="list-none my-8 pr-2">
            <Link href="/movie/category/3" as={`/movie/category/3`}>
                <div className={`rounded-md px-4 py-2 text-white hover:opacity-70 ${router.asPath === "/movie/category/3" ? "bg-green-500" : "bg-zinc-800"}`}>Phim được yêu thích</div>
            </Link>
        </li>
        
        <li className="list-none my-8 pr-2">
            <Link href="/movie/category/4" as={`/movie/category/4`}>
                <div className={`rounded-md px-4 py-2 text-white hover:opacity-70 ${router.asPath === "/movie/category/4" ? "bg-green-500" : "bg-zinc-800"}`}>Phim khác</div>
            </Link>
        </li>
    </div>
     );
}
 
export default Menu;