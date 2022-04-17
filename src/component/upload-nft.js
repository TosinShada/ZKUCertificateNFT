// ** React Imports
import React, { Fragment, useState } from "react"

// ** Third Party Components
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { DownloadCloud } from "react-feather"

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
// import { createAdmin } from "../services/logic"
import { handleSuccess, handleError } from "./alert"

// ** Styles
// import "@styles/react/libs/input-number/input-number.scss"

const UploadData = () => {
    // ** States
    const [show, setShow] = useState(false)

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop: async (result) => {
            const formData = new FormData()
            formData.append("file", result)
            await axios({
                method: "post",
                url: process.env.REACT_APP_IPFS_URL,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                auth: {
                    username: process.env.REACT_APP_IPFS_USERNAME,
                    password: process.env.REACT_APP_IPFS_PASSWORD
                }
            })
            .then(function (response) {
                //handle success
                console.log("API Success Response", response)
                setShow(false)
                handleSuccess({title: "File Uploaded Successfully", text: `The file was uploaded successfully to IPFS with hash - ${response.data.Hash}`})
            })
            .catch(function (response) {
                //handle error
                console.log("API Failure Response", response)
                setShow(false)
                handleError({title: "Error Occured", text: "File upload failed"})
            })
        }
    })

    return (
        <Fragment>
            <Col md='4' xl='3'>
                <Card className='bg-transparent border-primary shadow-none'>
                    <CardBody>
                        <CardTitle tag='h4'>Add Files</CardTitle>
                        <CardText>Add the NFT Image/Metadata to IPFS</CardText>
                        <CardText>
                            <Button
                                color='primary'
                                outline
                                onClick={() => setShow(true)}
                            >
                                Add Image/Metadata
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
                        <h1 className='mb-1'>Add NFT Image/Metadata</h1>
                        <p>
                            Use this form to add a new image/metadata to IPFS.
                        </p>
                    </div>
                    <Row className='import-component'>
                        <Col sm='12'>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm='12'>
                                            <div
                                                {...getRootProps({
                                                    className: "dropzone"
                                                })}
                                            >
                                                <input {...getInputProps()} />
                                                <div className='d-flex align-items-center justify-content-center flex-column'>
                                                    <DownloadCloud size={64} />
                                                    <h5>
                                                        Drop Files here or click
                                                        to upload
                                                    </h5>
                                                    <p className='text-secondary'>
                                                        Drop files here or click{" "}
                                                        <a
                                                            href='/'
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            browse
                                                        </a>{" "}
                                                        thorough your machine
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default UploadData
