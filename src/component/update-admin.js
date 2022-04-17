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

import { createAdmin } from "../services/logic"
import { handleSuccess, handleError } from "./alert"

// ** Styles
import "@styles/react/libs/input-number/input-number.scss"

const UpdateAdmin = () => {
    // ** States
    const [show, setShow] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues = {
        walletAddress: ""
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
            const admin = await createAdmin(data)
            if (admin) {
                setIsSubmitting(false)
                setShow(false)
                reset()
                handleSuccess({title: "Admin Created", text: "Admin created successfully"})
            } else {
                setIsSubmitting(false)
                setShow(false)
                reset()
                handleError({title: "Error Occured", text: "Admin creation failed"})
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
                        <CardTitle tag='h4'>Add a New Admin</CardTitle>
                        <CardText>
                            Add a new admninistrator to the smart contract. This
                            functionality is for admins only.
                        </CardText>
                        <CardText>
                            <Button
                                color='primary'
                                outline
                                onClick={() => setShow(true)}
                            >
                                Add Admin
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
                        <h1 className='mb-1'>Add Administrator</h1>
                        <p>
                            Use this form to add a new admin to the smart
                            contract.
                        </p>
                    </div>
                    <Row
                        tag='form'
                        className='gy-1 pt-75'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Col xs={12}>
                            <Label className='form-label' for='walletAddress'>
                                Wallet Address
                            </Label>
                            <Controller
                                control={control}
                                name='walletAddress'
                                render={({ field }) => {
                                    return (
                                        <Input
                                            {...field}
                                            id='walletAddress'
                                            placeholder='Enter the address of the wallet'
                                            value={field.value}
                                            invalid={errors.walletAddress && true}
                                        />
                                    )
                                }}
                            />
                            {errors.walletAddress && (
                                <FormFeedback>
                                    Please enter a valid Wallet Address
                                </FormFeedback>
                            )}
                        </Col>
                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button
                                type='submit'
                                className='me-1'
                                color='primary'
                                {...(isSubmitting && {disabled: true})}
                            >
                                {isSubmitting ? (
                                    <Fragment>
                                        <span className='ml-2'>Adding...</span>
                                    </Fragment>
                                ) : (
                                    "Add Admin"
                                )}
                            </Button>
                            <Button
                                type='reset'
                                color='secondary'
                                outline
                                {...(isSubmitting && {disabled: true})}
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

export default UpdateAdmin
