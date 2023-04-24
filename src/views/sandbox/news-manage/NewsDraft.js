import React, { useState, useEffect } from 'react'
import { Button, Table, Modal,notification} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function NewsDraft(props) {
    const [dataSource, setdataSource] = useState([])

    const {username}  = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [username])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: 'Headline',
            dataIndex: 'title',
            render:(title,item)=>{
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: 'author',
            dataIndex: 'author'
        },
        {
            title: 'category',
            dataIndex: 'category',
            render:(category)=>{
                return category.title
            }
        },
        {
            title: "action",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    
                    <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
                        props.history.push(`/news-manage/update/${item.id}`)
                    }}/>

                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)}/>
                </div>
            }
        }
    ];


    const handleCheck = (id)=>{
        axios.patch(`/news/${id}`,{
            auditState:1
        }).then(res=>{
            props.history.push('/audit-manage/list')

            notification.info({
                message: `notification`,
                description:
                  `You can view your news in the ${' review list'}`,
                placement:"bottomRight"
            });
        })
    }

    const confirmMethod = (item) => {
        confirm({
            title: 'Are you sure you want to delete?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    }
    //删除
    const deleteMethod = (item) => {
        // console.log(item)
        // 当前页面同步状态 + 后端同步
      
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                rowKey={item=>item.id}
                />
        </div>
    )
}
