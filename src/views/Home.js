// ** React Imports
import { Fragment } from "react"

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs"
import WalletConnect from "../component/wallet-connect"
import Cohort from "../component/cohort"
import AdminClaim from "../component/admin-claim"

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
            </Row>
        </Fragment>
    )
}

export default Home
