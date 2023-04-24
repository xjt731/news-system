import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment'
import axios from 'axios';

export default function NewsPreview(props) {
    const [newsInfo, setnewsInfo] = useState(null)
    useEffect(() => {
        // console.log()
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo(res.data)
        })
    }, [props.match.params.id])

    const auditList = ["Not reviewed", 'Under review', 'Approved', 'Not approved']
    const publishList = ["Unpublished", 'To be released', 'Online', 'Offline']

    const colorList = ["black","orange","green","red"]
    return (
        <div>
            {
                newsInfo && <div>

                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="author">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="create time">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item label="publish time">{
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="region">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="auditState" ><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="publishState" ><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                            <Descriptions.Item label="number of view">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="number of star">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="number of comment">0</Descriptions.Item>

                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        margin:"0 24px",
                        border:"1px solid gray"
                    }}>
                    </div>
                </div>
            }
        </div>
    )
}
