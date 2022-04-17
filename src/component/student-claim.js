import React, { useState, Fragment } from "react"

// ** Reactstrap Imports
import {
    Card,
    Row,
    Col,
    Modal,
    Input,
    Label,
    Button,
    CardBody,
    CardText,
    CardTitle,
    ModalBody,
    ModalHeader,
    FormFeedback,
    Spinner
} from "reactstrap"

// ** Third Party Components
import { useForm, Controller } from "react-hook-form"

import { studentClaimToken } from "../services/logic"
import { handleSuccess, handleError } from "./alert"

// ** Styles
import "@styles/react/libs/input-number/input-number.scss"

const StudentClaim = () => {
    // ** States
    const [show, setShow] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues = {
        cohortId: ""
    }

    // ** Hooks
    const {
        control,
        setError,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ defaultValues })

    const onSubmit = async (data) => {
        if (Object.values(data).every((field) => field.length > 0)) {
            setIsSubmitting(true)
            console.log("data", data)
            const token = await studentClaimToken(data)
            if (token) {
                setIsSubmitting(false)
                setShow(false)
                reset()
                handleSuccess({
                    title: "Token Created",
                    text: `Token successfully claimed with id: ${token.hash}`
                })
            } else {
                setIsSubmitting(false)
                setShow(false)
                reset()
                handleError({
                    title: "Error Occured",
                    text: "Token claim failed"
                })
            }
            return null
        } else {
            console.log("errors", errors)
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: "manual"
                    })
                }
            }
        }
    }
    return (
        <Fragment>
            <Col md='4' xl='3'>
                <Card className='bg-transparent border-primary shadow-none'>
                    <CardBody>
                        <CardTitle tag='h4'>Claim Token - Student</CardTitle>
                        <CardText>
                            Claim a token to your address.
                        </CardText>
                        <CardText>
                            <Button
                                color='primary'
                                outline
                                onClick={() => setShow(true)}
                            >
                                Claim Token
                            </Button>
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
            <Modal
                isOpen={show}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader
                    className='bg-transparent'
                    toggle={() => setShow(!show)}
                ></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Claim Token</h1>
                        <p>
                            Use this form to claim a ZKU graduation token
                        </p>
                    </div>
                    <Row
                        tag='form'
                        className='gy-1 pt-75'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Col md={12} >
                            <Label className='form-label' for='cohortId'>
                                Cohort ID
                            </Label>
                            <Controller
                                control={control}
                                name='cohortId'
                                render={({ field }) => {
                                    return (
                                        <Input
                                            {...field}
                                            id='cohortId'
                                            placeholder='Enter the name of the cohort'
                                            value={field.value}
                                            invalid={errors.cohortId && true}
                                        />
                                    )
                                }}
                            />
                            {errors.cohortId && (
                                <FormFeedback>
                                    Please enter a valid Cohort ID
                                </FormFeedback>
                            )}
                        </Col>
                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button
                                type='submit'
                                className='me-1'
                                color='primary'
                                {...(isSubmitting && { disabled: true })}
                            >
                                {isSubmitting ? (
                                    <Fragment>
                                        <span className='ml-2'>Adding...</span>
                                    </Fragment>
                                ) : (
                                    "Claim Token"
                                )}
                            </Button>
                            <Button
                                type='reset'
                                color='secondary'
                                outline
                                {...(isSubmitting && { disabled: true })}
                                onClick={() => {
                                    reset()
                                    setShow(false)
                                }}
                            >
                                Discard
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default StudentClaim
