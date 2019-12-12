export async function getLeftMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      icon: 'fa fa-pie-chart',
      url: '/dashboard'
    },
    {
      title: 'Drivers map',
      key: 'driversMap',
      icon: 'fa fa-map',
      url: '/driversMap'
    },
    {
      title: 'Trips',
      key: 'trips',
      icon: 'fa fa-road',
      children: [
        {
          key: 'tripsList',
          title: 'Trips List',
          url: '/trips/tripsList',
        },
      ],
    },
    {
      title: 'Drivers',
      key: 'drivers',
      icon: 'fa fa-tachometer',
      children: [
        {
          key: 'driversList',
          title: 'Drivers List',
          url: '/drivers/driversList',
        },
        {
          key: 'driversAthenaList',
          title: 'Athena List',
          url: '/drivers/driversAthenaList',
        },
      ],
    },
    {
      title: 'Users',
      key: 'users',
      icon: 'fa fa-user',
      children: [
        {
          key: 'usersList',
          title: 'Users List',
          url: '/users/usersList',
        },
        {
          key: 'doormanUsersList',
          title: 'Doorman Users',
          url: '/users/doormanUsersList',
        },
        {
          key: 'deletedUsersList',
          title: 'Deleted Users',
          url: '/users/deletedUsersList',
        },
      ],
    },
    {
      title: 'Pickup Status',
      key: 'airportStatus',
      icon: 'fa fa-map-marker',
      url: '/airportStatus'
    },
    {
      title: 'Fleets',
      key: 'fleets',
      icon: 'fa fa-automobile',
      children: [
        {
          key: 'fleetsList',
          title: 'Fleets List',
          url: '/fleets/fleetsList',
        },
        {
          key: 'athenaFleetsList',
          title: 'Athena Fleets List',
          url: '/fleets/athenaFleetsList',
        },
      ],
    },
    {
      title: 'Promo Codes',
      key: 'promo',
      icon: 'fa fa-gift',
      children: [
        {
          key: 'promoList',
          title: 'Promo Codes List',
          url: '/promo/promoList',
        },
        {
          key: 'promoCode',
          title: 'Add Promo Codes',
          url: '/promo/promoCode',
        },
      ],
    },
    {
      title: 'Dispatch',
      key: 'dispatch',
      icon: 'fa fa-desktop',
      url: '/dispatch'
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    }
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      icon: 'fa fa-pie-chart',
      url: '/dashboard'
    },
    {
      title: 'Drivers map',
      key: 'driversMap',
      icon: 'fa fa-map',
      url: '/driversMap'
    },
    {
      title: 'Trips',
      key: 'trips',
      icon: 'fa fa-road',
      children: [
        {
          key: 'tripsList',
          title: 'Trips List',
          url: '/trips/tripsList',
        },
      ],
    },
    {
      title: 'Drivers',
      key: 'drivers',
      icon: 'fa fa-tachometer',
      children: [
        {
          key: 'driversList',
          title: 'Drivers List',
          url: '/drivers/driversList',
        },
        {
          key: 'driversAthenaList',
          title: 'Athena List',
          url: '/drivers/driversAthenaList',
        },
      ],
    },
    {
      title: 'Users',
      key: 'users',
      icon: 'fa fa-user',
      children: [
        {
          key: 'usersList',
          title: 'Users List',
          url: '/users/usersList',
        },
        {
          key: 'doormanUsersList',
          title: 'Doorman Users',
          url: '/users/doormanUsersList',
        },
        {
          key: 'deletedUsersList',
          title: 'Deleted Users',
          url: '/users/deletedUsersList',
        },
      ],
    },
    {
      title: 'Pickup Status',
      key: 'airportStatus',
      icon: 'fa fa-map-marker',
      url: '/airportStatus'
    },
    {
      title: 'Fleets',
      key: 'fleets',
      icon: 'fa fa-automobile',
      children: [
        {
          key: 'fleetsList',
          title: 'Fleets List',
          url: '/fleets/fleetsList',
        },
        {
          key: 'athenaFleetsList',
          title: 'Athena Fleets List',
          url: '/fleets/athenaFleetsList',
        },
      ],
    },
    {
      title: 'Promo Codes',
      key: 'promo',
      icon: 'fa fa-gift',
      children: [
        {
          key: 'promoList',
          title: 'Promo Codes List',
          url: '/promo/promoList',
        },
        {
          key: 'promoCode',
          title: 'Add Promo Codes',
          url: '/promo/promoCode',
        },
      ],
    },
    {
      title: 'Dispatch',
      key: 'dispatch',
      icon: 'fa fa-desktop',
      url: '/dispatch'
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    }
  ]
}
