import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/forgot',
    component: loadable(() => import('pages/user/forgot')),
    exact: true,
  },

  {
    path: '/dispatch',
        component: loadable(() => import('pages/dispatch')),
  },

  {
    path: '/driversMap',
        component: loadable(() => import('pages/driversMap')),
  },

  {
    path: '/airportStatus',
      component: loadable(() => import('pages/airportStatus')),
  },

  {
    path: '/trips/tripsList',
        component: loadable(() => import('pages/trips/tripsList')),
  },

  {
    path: '/drivers/driversList',
      component: loadable(() => import('pages/drivers/driversList')),
  },

  {
    path: '/drivers/driver/:id/edit',
      component: loadable(() => import('pages/drivers/editDriver')),
  },

  {
    path: '/drivers/driver/:id',
      component: loadable(() => import('pages/drivers/viewDriver')),
  },

  {
    path: '/drivers/driversAthenaList',
      component: loadable(() => import('pages/drivers/driversAthenaList')),
  },

  {
    path: '/users/usersList',
      component: loadable(() => import('pages/users/usersList')),
  },

  {
    path: '/users/user/:id/edit',
      component: loadable(() => import('pages/users/editUser')),
  },

  {
    path: '/users/user/:id',
      component: loadable(() => import('pages/users/viewUser')),
  },

  {
    path: '/users/doormanUsersList',
      component: loadable(() => import('pages/users/doormanUsersList')),
  },

  {
    path: '/users/deletedUsersList',
      component: loadable(() => import('pages/users/deletedUsersList')),
  },

  {
    path: '/trips/tripDetails/:id',
        component: loadable(() => import('pages/trips/tripDetails')),
  },

  {
    path: '/promo/promoList',
      component: loadable(() => import('pages/promo/promoList')),
  },

  {
    path: '/promo/promoCode/:id',
      component: loadable(() => import('pages/promo/addPromoCode')),
  },

  {
    path: '/promo/promoCode',
      component: loadable(() => import('pages/promo/addPromoCode')),
  },

  {
    path: '/fleets/fleetsList',
      component: loadable(() => import('pages/fleets/fleetsList')),
  },

  {
    path: '/fleets/athenaFleetsList',
      component: loadable(() => import('pages/fleets/athenaFleetsList')),
  },

  {
    path: '/fleets/viewFleet/:id',
      component: loadable(() => import('pages/fleets/viewFleet')),
  },

  // {
  //   path: '/dashboard',
  //       component: loadable(() => import('pages/dashboard/alpha')),
  // },

  {
    path: '/dashboard/alpha',
        component: loadable(() => import('pages/dashboard/alpha')),
  },

  {
    path: '/dashboard/beta',
        component: loadable(() => import('pages/dashboard/beta')),
  },

  {
    path: '/dashboard/gamma',
        component: loadable(() => import('pages/dashboard/gamma')),
  },

  {
    path: '/dashboard/docs',
        component: loadable(() => import('pages/dashboard/docs')),
  },

  {
    path: '/logout',
        component: loadable(() => import('pages/user/logout')),
  },
]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
