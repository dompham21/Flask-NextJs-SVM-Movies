import React from 'react'
import { Progress } from 'antd';
import CommentCards from './CommentCards';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios'
import Router from "next/router";
const { TextArea } = Input;

const Review = (props) => {


  const { MovieComments, movie_id } = props
  const [form] = Form.useForm();



  const getPercentLabelComment = (labelId)  => {
    const total = MovieComments.length
    
    if( total === 0) return 0;
    
    let count = 0;

    MovieComments.map(cmt => {
        if(cmt.label === labelId) count ++
    })

    const scoce = (count/total)*100 

    return scoce.toFixed(2)

  }

  const onFinish = async (values) => {
    values["movie_id"] = movie_id

    try {
        const accessToken = localStorage.getItem('accessToken')

        let config = {
            headers: {
              "Authorization": "Bearer " + accessToken,
              "Content-Type": "application/json",
            }
        }
        const response = await axios.post(`http://127.0.0.1:6868/comment/add`, values, config);
        console.log(response)
  
        if(response.status === 200) {
            const message = response.data.message
            form.resetFields();
            Router.replace( Router.asPath,undefined, {scroll: false})
        }
        else {
  
        }
  
      } catch (error) {
        
      }
   }
  return (
   <div className="flex text-white">
        <div className="flex flex-col w-2/3 pr-8">
            <h1 className="text-2xl">Bình luận về bộ phim</h1>
            <div className="mt-10">
                <ul className="list-none">
                    {MovieComments.map(CommentCard => {
                        return (<CommentCards key={CommentCard.id} CommentInfo={CommentCard}/>)
                    })}
                    
                    <li className="flex pt-1 pr-p pb-8 pl-2">
                        <div className="mr-3">
                            <div className="w-10 text-center rounded-full overflow-hidden">
                                <img src="https://res.cloudinary.com/dmriwkfll/image/upload/v1656155271/f0w0qgwpe8wxo1ceafhm.jpg"/>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <Form form={form}  autoComplete="off" className='w-full' onFinish={onFinish}>
                                
                                <Form.Item
                                    name="comment"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your comment!',
                                        }
                                    ]}
                                >
                                    <TextArea placeholder='Viết bình luận...' rows={4}/>
                                </Form.Item>
                                <div className="mt-5">
                                    <button type="submit" className="py-2 px-3 font-bold text-white bg-rose-500 rounded-md">Bình luận</button>
                                </div>
                            </Form>
            
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div className="w-1/3">
            <h4 className="text-center text-lg font-bold">Thống kê bình luận</h4>
            <div>
                <div>Vui</div>
                <Progress 
// @ts-ignore
                percent={getPercentLabelComment(0)}/>
            </div>
            <div>
                <div>Cảm động</div>
                <Progress 
// @ts-ignore
                percent={getPercentLabelComment(1)} />
            </div>
            <div>
                <div>Sợ</div>
                <Progress 
// @ts-ignore
                percent={getPercentLabelComment(2)} />
            </div>
            <div>
                <div>Thích thú</div>
                <Progress 
// @ts-ignore
                percent={getPercentLabelComment(3)}/>
            </div>    
            <div>
                <div>Khác</div>
                <Progress 
// @ts-ignore
                percent={getPercentLabelComment(4)}/>
            </div>
        </div>      
   </div>
  );
};

export default Review;
