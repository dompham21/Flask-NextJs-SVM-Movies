import React from 'react'
import {Tag } from 'antd';

function CommentCards(props) {
    const { comment, date, id, label, movie_id, user_id, name} = props.CommentInfo
    const renderLabelComment = (label) => {
        switch(label) {
            case 0:
                return  <Tag color="#2cd09f">Vui</Tag>
            case 1: 
                return <Tag color="#108ee9">Cảm động</Tag>

            case 2:
                return <Tag color="#f50">Sợ</Tag>

            case 3:
                return <Tag color="#C72cd0">Thích thú</Tag>

            case 4:
                return <Tag color="#8b13a2">Khác</Tag>
            defatul:
                return <div></div>
        }
    }
  return (
    <li className="flex pt-1 pr-p pl-2 pb-8">
        <div className="mr-3">
            <div className="w-10 text-center rounded-full overflow-hidden">
                <img src="https://res.cloudinary.com/dmriwkfll/image/upload/v1656155271/f0w0qgwpe8wxo1ceafhm.jpg"/>
            </div>
        </div>
        <div className="flex flex-col">
            <div className="flex items-center">
                <div className="text-base font-bold mr-3">{name}</div>
                <div className="text-xs text-slate-400">{date}</div>
                <div className='ml-5'>
                    {renderLabelComment(label)}


                </div>
            </div>
            <div className="text-sm">{comment}</div>
        </div>
    </li>
  )
}

export default CommentCards