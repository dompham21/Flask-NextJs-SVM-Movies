import React from 'react'
import Image from 'next/image';
import { Avatar, Popover, Input, Layout, Form } from 'antd';
import { AiOutlineLogout, AiFillSetting } from 'react-icons/ai'
import Link from 'next/link';
const { Search } = Input;
const { Header} = Layout;
import { useRouter } from 'next/router'



function HeaderPage() {
  const Router = useRouter()

  const logout = () => {
    localStorage.removeItem('accessToken')
    Router.push('/login')
  }
  const onSearch = (value) => {
    Router.push({ pathname: "/search", query: { q: value } });

  
  } 

  
  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', padding: '1rem 6.5rem', display: 'flex', alignItems: 'center',
    background: 'rgba(20, 20, 20, 1)', justifyContent: 'space-between'}}>
      <div className="logo" >
        <Link href={"/"}>
          <Image src="/logo.png" alt="logo" width={160} height={40}/>
        </Link>
      </div>
     <div className='flex-1 mx-6'>
        <Search placeholder="Nhập tên phim để tìm kiếm..." onSearch={onSearch} enterButton style={{ maxWidth: 600 }}/>
     </div>
     <div className="cursor-pointer">
        <Popover placement="bottomRight" 
          content={ 
            <ul className='list-none m-0' style={{width: '150px'}}>
              <li className='flex gap-2 items-center text-base cursor-pointer  p-2 rounded-md hover:bg-zinc-200'>
                <AiFillSetting/>
                <span>Manage Profile</span>
              </li>
              <li className='flex gap-2 items-center text-base cursor-pointer p-2 rounded-md hover:bg-zinc-200' onClick={logout}>
                <AiOutlineLogout/>
                <span>Logout</span>
              </li>
            </ul>
          } 
          trigger="click" >
            <Avatar size="large" src="https://res.cloudinary.com/dmriwkfll/image/upload/v1656155271/f0w0qgwpe8wxo1ceafhm.jpg" />
        </Popover>

     </div>
    </Header>
  )
}

export default HeaderPage