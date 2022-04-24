// ** React Imports
import { Fragment } from "react"

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs"
import WalletConnect from "../component/wallet-connect"
import Cohort from "../component/cohort"
import AdminClaim from "../component/admin-claim"
import StudentClaim from "../component/student-claim"
import UpdateAdmin from "../component/update-admin"
import UploadData from "../component/upload-nft"
import UpdateWhitelist from "../component/update-whitelist"

// ** Reactstrap Imports
import { Row } from "reactstrap"

const Home = () => {
    return (
        <Fragment>
            <Breadcrumbs
                breadCrumbTitle='ZKU NFT Certificate'
            />
            <Row>
                <WalletConnect />
                <Cohort />
                <AdminClaim />
                <StudentClaim />
                <UpdateAdmin />
                <UploadData />
                <UpdateWhitelist />
            </Row>
        </Fragment>
    )
}

export default Home
