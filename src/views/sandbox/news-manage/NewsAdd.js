import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")

    const User = JSON.parse(localStorage.getItem("token"))
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


    const handleSave = (auditState) => {

        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": User.region?User.region:"global",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res=>{
            props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')

            notification.info({
                message: `notification`,
                description:
                  `You can check your news in${auditState===0?'draft box':' review list'}`,
                placement:"bottomRight"
            });
        })
    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Compose news"
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="Basic details" description="News title, news category" />
                <Step title="News content" description="News body content" />
                <Step title="Submit news" description="Save draft or submit for review" />
            </Steps>


            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>

                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="Headline"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="News category"
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
                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>

            </div>
            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(0)}>Save to draft box</Button>
                        <Button danger onClick={() => handleSave(1)}>submit to review</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>Next</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>Prev step</Button>
                }
            </div>
        </div>
    )
}
