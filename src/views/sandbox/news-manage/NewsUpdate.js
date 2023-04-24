import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")

    // const User = JSON.parse(localStorage.getItem("token"))
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res)
                setformInfo(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            // console.log(content)
            if (content === "" || content.trim() === "<p></p>") {
                message.error("News content cannot be empty")
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const handlePrevious = () => {
        setCurrent(current - 1)
    }

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    }

    const NewsForm = useRef(null)

    useEffect(() => {
        axios.get("/categories").then(res => {
            // console.log(res.data)
            setCategoryList(res.data)
        })
    }, [])

    useEffect(() => {
        // console.log()
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // setnewsInfo(res.data)

            // content , 
            // formInfo 
            let {title,categoryId,content} = res.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })

            setContent(content)
        })
    }, [props.match.params.id])


    const handleSave = (auditState) => {

        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res=>{
            props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')

            notification.info({
                message: `notification`,
                description:
                  `You can view your news in the${auditState===0?'draft box':'review list'}`,
                placement:"bottomRight"
            });
        })
    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Update news"
                onBack={()=>props.history.goBack()}
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="Basic Information" description="News title, news category" />
                <Step title="News Content" description="Main body of news" />
                <Step title="News Submission" description="Save draft or submit for review" />
            </Steps>


            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>

                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="title"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="news category"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </div>

                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        // console.log(value)
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>

            </div>
            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(0)}>Save to Draft</Button>
                        <Button danger onClick={() => handleSave(1)}>Submit for Review</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>Next Step</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>Previous Step</Button>
                }
            </div>
        </div>
    )
}
