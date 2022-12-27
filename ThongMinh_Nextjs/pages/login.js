import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Button, Checkbox, Form, Input, message } from 'antd';
import Head from 'next/head';
import axios from 'axios'
import Router from "next/router";

function Login() {

  const onFinish = async (values) => {
    console.log(values)

    try {
      const response = await axios.post(`http://127.0.0.1:6868/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response)

      if(response.status === 200) {
        const accessToken = response.data.access_token

        localStorage.setItem('accessToken', accessToken);

        await Router.push("/")
      }
      else {

      }

    } catch (error) {
      
    }
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100'>
      <Head>
        <title>Movie - Login</title>
      </Head>
      <main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
        <div className='bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl'>
          <div className='w-3/5 p-5'>
            <div className='text-left font-bold'>
              <Image src="/logo.png" alt="logo" width={160} height={40}/>
            </div>
            <div className='py-10'>
              <h2 className='text-3xl font-bold text-green-500 mb-2'>Login to account</h2>
              <div className='border-2 w-10 border-green-500 inline-block mb-2'/>
            </div>
            <div className='flex flex-col items-center'>
              <Form layout="vertical" autoComplete="off" className='w-2/3' onFinish={onFinish}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                    {
                      type: 'email',
                      message: 'This is not a valid email!'
                    }
                  ]}
                >
                  <Input size='large'/>
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password size='large'/>
                </Form.Item>
                <div className='mt-10'>
                  <button type="submit" className='border-2 text-black border-green-500 rounded-full px-14 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white'>
                    Login
                  </button>
                </div>
                
              </Form>
            </div>
          </div>
          <div className='w-2/5 bg-green-500 text-white rounded-br-2xl py-36 px-12'>
            <h2 className='text-3xl font-bold mb-2'>Hello, Friend!</h2>
            <div className='border-2 w-10 border-white inline-block mb-2'/>
            <p className='mb-2'>Fill up personal infomation and start journey with us.</p>
            <Link href='/register'>
              <p className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500'>Sign up</p>
            </Link>
          </div>
        </div>

      </main>
    </div>
      

  )
}

export default Login