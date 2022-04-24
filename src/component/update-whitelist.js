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

import { UpdateWhitelistField } from "../services/logic"
import { handleSuccess, handleError } from "./alert"

// ** Styles
import "@styles/react/libs/input-number/input-number.scss"

const UpdateWhitelist = () => {
    // ** States
    const [show, setShow] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues = {
        cohortId: "",
        limit: 0,
        whitelistedAddresses: ""
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
            const token = await UpdateWhitelistField(data)
            if (token) {
                setIsSubmitting(false)
                setShow(false)
                reset()
                handleSuccess({
                    title: "Cohort Updated",
                    text: "Cohort successfully updated."
                })
            } else {
                setIsSubmitting(false)
                setShow(false)
                reset()
                handleError({
                    title: "Error Occured",
                    text: "Cohort update failed"
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
                        <CardTitle tag='h4'>Update Whitelist - Admin</CardTitle>
                        <CardText>
                        Use this form to update the whitelisted addresses for a cohort
                        </CardText>
                        <CardText>
                            <Button
                                color='primary'
                                outline
                                onClick={() => setShow(true)}
                            >
                                Update Whitelist
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
                        <h1 className='mb-1'>Update Whitelist</h1>
                        <p>
                            Use this form to update the whitelisted addresses for a cohort
                        </p>
                    </div>
                    <Row
                        tag='form'
                        className='gy-1 pt-75'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Col md={6} xs={12}>
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
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='limit'>
                                No of Students
                            </Label>
                            <Controller
                                name='limit'
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <Input
                                            {...field}
                                            id='limit'
                                            type='number'
                                            value={field.value}
                                            invalid={errors.limit && true}
                                        />
                                    )
                                }}
                            />
                            {errors.limit && (
                                <FormFeedback>
                                    Please enter a valid No of Students
                                </FormFeedback>
                            )}
                        </Col>
                        <Col md={12}>
                            <Label
                                className='form-label'
                                for='whitelistedAddresses'
                            >
                                Whitelisted Addresses
                            </Label>
                            <Controller
                                control={control}
                                name='whitelistedAddresses'
                                render={({ field }) => {
                                    return (
                                        <Input
                                            {...field}
                                            id='whitelistedAddresses'
                                            type='textarea'
                                            placeholder='Enter the whitelisted addresses separated by commas'
                                            value={field.value}
                                            invalid={
                                                errors.whitelistedAddresses &&
                                                true
                                            }
                                        />
                                    )
                                }}
                            />
                            {errors.whitelistedAddresses && (
                                <FormFeedback>
                                    Please enter valid Whitelisted Addresses
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
                                    "Update Whitelist"
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

export default UpdateWhitelist
