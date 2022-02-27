// ** Reactstrap Imports
import { Spinner } from "reactstrap"

// ** Third Party Components
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const handleSuccess = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "success",
        confirmButtonText: <span className='align-middle'>Close</span>,
        customClass: {
            confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
    })
}

const handleInfo = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "info",
        confirmButtonText: <span className='align-middle'>Close</span>,
        customClass: {
            confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
    })
}

const handleWarning = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "warning",
        confirmButtonText: <span className='align-middle'>Close</span>,
        customClass: {
            confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
    })
}

const handleError = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "error",
        confirmButtonText: <span className='align-middle'>Close</span>,
        customClass: {
            confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
    })
}

const handleLoading = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        iconHtml: <Spinner type='grow' color='primary' size='lg' />,
        confirmButtonText: <span className='align-middle'>Close</span>,
        customClass: {
            confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
    })
}

export { handleSuccess, handleInfo, handleWarning, handleError, handleLoading }
