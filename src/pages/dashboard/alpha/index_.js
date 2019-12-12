import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'

class DashboardAlpha extends React.Component {
  render() {

    return (
      <Authorize roles={['super']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">&nbsp;</strong>
        </div>
      </Authorize>
    )
  }
}

export default DashboardAlpha
