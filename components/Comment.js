import { Accordion, Form, Button } from "react-bootstrap"
import { useState, useEffect } from "react"
import { putComment } from "@lib/api"
import { useRouter } from "next/router"
import { useRedirectToLogin } from "@lib/session"




const defaultModel = {
    comment: "",
    user:""
}

function validateModel(comment) {
    const errors = {
        comment: "",
        user:""
    }

    let isValid = true

    if(comment.comment === "") {
        errors.title = "You can't send a blank comment'"
        isValid = false;
    }

    return { errors, isValid }
}

export default function Comment({ session, post }) {


    useRedirectToLogin(session)
    
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState(defaultModel)
    const [comment, setComment] = useState(defaultModel)



    const handleChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        
        setComment({ 
            ...comment,
            [name]:value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrors(defaultModel)

        comment.user = session.user.firstName
        const result = validateModel(comment)

        if(!result.isValid) {
            setErrors(result.errors)
            setIsLoading(false)
            return
        }



        const newComment = await putComment(comment, post.id, session.accessToken)

        
        router.reload()
        setIsLoading(false)
        
    }



    return post && (
        <Accordion defaultActiveKey={['0']} alwaysOpen style={{ marginTop:"2rem" }}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>💬</Accordion.Header>
                {
                    post.comments.map((comment) => {
                        return (
                            <div>

                                {/* {comment.comment} */}
                                {
                                    comment.user === session.user?.firstName ?
                                        <Accordion.Body align="right">
                                            {comment.user}:
                                            <br />
                                            {comment.comment}
                                        </Accordion.Body>
                                        :
                                        <Accordion.Body >
                                            {comment.user}:
                                            <br />
                                            {comment.comment}
                                        </Accordion.Body>
                                }
                               
                            </div>
                        )
                    }
                    )
                }
                <Accordion.Body>
                    <Form style={{marginTop:'0.5rem'}} onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control as="textarea" rows={2} value={comment.comment} name="comment" onChange={handleChange}></Form.Control>
                            {errors.comment && <div style={{color:'red'}}>{errors.comment}</div>}
                            <Button variant="primary" type="submit">send</Button>
                        </Form.Group>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </ Accordion>
    )
}