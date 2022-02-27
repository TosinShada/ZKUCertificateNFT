// ** React Imports
import { Link } from "react-router-dom"

// ** Third Party Components
import Proptypes from "prop-types"

// ** Reactstrap Imports
import { Breadcrumb, BreadcrumbItem, Button } from "reactstrap"

const Breadcrumbs = (props) => {
    // ** Props
    const { breadCrumbTitle } = props

    return (
        <div className='content-header row'>
            <div className='content-header-left col-md-7 col-12 mb-2'>
                <div className='row breadcrumbs-top'>
                    <div className='col-12'>
                        {breadCrumbTitle ? (
                            <h2 className='content-header-title float-start mb-0'>
                                {breadCrumbTitle}
                            </h2>
                        ) : (
                            "" 
                        )}
                        <div className='breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12'>
                            <Breadcrumb>
                                <BreadcrumbItem tag='li'>
                                    <Link to='/'>Home</Link>
                                </BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Breadcrumbs

// ** PropTypes
Breadcrumbs.propTypes = {
    breadCrumbTitle: Proptypes.string.isRequired
}
