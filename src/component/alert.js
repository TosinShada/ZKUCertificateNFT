// ** Third Party Components
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

export function handleSuccess(props) {
    const { title, text } = props
    return MySwal.fire({
        title,
        text,
        icon: "success",
        customClass: {
            confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
    })
}

export function handleError(props) {
    const { title, text } = props
    return MySwal.fire({
        title,
        text,
        icon: "error",
        customClass: {
            confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
    })
}
