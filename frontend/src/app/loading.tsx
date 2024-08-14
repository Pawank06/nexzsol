import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='w-full h-screen mx-auto flex items-center justify-center'>
        <Loader className='animate-spin'/>
    </div>
  )
}

export default Loading