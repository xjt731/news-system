import {useEffect, useState} from 'react'
import axios from 'axios'
import {notification} from 'antd'

function usePublish(type){
    const {username} = JSON.parse(localStorage.getItem("token"))

    const [dataSource, setdataSource] = useState([])
    useEffect(() => {

        axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
            // console.log(res.data)
            setdataSource(res.data)
        })
    }, [username,type])



    const handlePublish = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))

        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime":Date.now()
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到【发布管理/已经发布】中查看您的新闻`,
                placement:"bottomRight"
            });
        })
    }

    const handleSunset = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))

        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res=>{
            notification.info({
                message: `notification`,
                description:
                  `You can view your news in [Release Management/Offline]`,
                placement:"bottomRight"
            });
        })
    }

    const handleDelete = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))

        axios.delete(`/news/${id}`).then(res=>{
            notification.info({
                message: `notification`,
                description:
                  `You have deleted the offline new`,
                placement:"bottomRight"
            });
        })

    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish