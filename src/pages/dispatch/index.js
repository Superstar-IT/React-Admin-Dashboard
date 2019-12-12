import React from 'react'
import { Table, Form, AutoComplete, Radio, Input, Button, DatePicker, Icon, Modal } from 'antd';
import DispatchMap from './dispatchMap';
import { post, get } from '../../services/net';
import { userThumb }from '../../assets/images/index';
import styles from './style.module.scss';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

const FormItem = Form.Item

class Dispatch extends React.Component {
  constructor(props) {
    super(props);
   this.state = {
     data: [],
     pagination: {},
     loading: false,
     type: 1,
     driver: {
       first_name: '',
       last_name: '',
       phone: '',
       vehicle_model: '',
       license: '',
     },
     user: {
       first_name: '',
       last_name: '',
       phone: '',
     },
     track: [],
     pickup: {},
     dropoff: {},
     availableDrivers: [],
     mapClickNo: 0,
     first_name: null,
     last_name: 'Last Name',
     email: null,
     phone: 'Phone',
     dataSourcePickupAddress: [],
     dataSourceDropoffAddress: [],
     pickupPlaceholder: 'Pickup',
     dropoffPlaceholder: 'Dropoff',
     passengersList: [],
     passengersNameList: [],
     page: 0,
     smsMessage: '',
     smsModal: false,
     modalCC: false,
     driverThumb: '',
     rStatus: false,
     fareEta: '--',
     fareFare: '--.--',
     later: 'now',
   };
  }

  componentDidMount() {
    this.fetch();
    this.getUsersList(0);
  }

  sendMessage = () => {
    const { sms, driver, user, smsMessage } = this.state;
    let phone = '';

    if (sms === 'driver') {
      phone = driver.phone;
    } else if (sms === 'passenger') {
      phone = user.phone;
    }

    const params = {
      message: smsMessage,
      phone
    };

    console.log('paramsSms', params);
    const url = `${process.env.REACT_APP_API_URL}sendSms`;
    post(url, params).then(json => {
      console.log('smsResponse', json);
      if (json.success) {
        console.log('success');
      }
      if (!json.success) {
        console.log('error');
      }
    })
      .catch(err => {
        console.log('error');
        console.log('err', err);
      });
  };

  getUsersList = () => {
    const { page } = this.state;

    const parameters = {
      pageSize: 1000,
      sortBy: {id:"_id", desc: true},
    };
    console.log('params', parameters);
    const url = `${process.env.REACT_APP_API_URL}corporateUsersList?page=${page}`;
    post(url, parameters).then(json => {
      console.log('json', json);
      if (json.success) {
        const passengerList = [];
        const passengerNameList = [];
        {json.data.users.data.map((item) => (
          passengerList.push({
            value: item.phone_number,
            label: item.phone_number,
            first_name: item.user_name,
            last_name: item.last_name,
            email: item.email,
            id: item.id
          })
        ))}
        {json.data.users.data.map((item) => (
          passengerNameList.push({
            value: item.last_name,
            label: item.last_name,
            first_name: item.user_name,
            phone: item.phone_number,
            email: item.email,
            id: item.id
          })
        ))}
        this.setState({
          loading: false,
          passengersList: passengerList,
          passengersNameList: passengerNameList,
        })
        console.log('passengersList', passengerList)
        console.log('passengerNameList', passengerNameList)
      }
      if (!json.success) {
        console.log('fail');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  };

  handleTableChange = (paginationParam, filters, sorter) => {
    const { pagination } = this.state;
    pagination.current = paginationParam.current;
    this.setState({
      pagination
    });
    this.fetch({
      results: paginationParam.pageSize,
      page: paginationParam.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  fetch = (params = {}) => {
    console.log('params:', params);
    // this.setState({ loading: true });

    const { pagination } = this.state;

    params =  {
          results: 100,
          filtered: [],
          pageSize: 100,
          sortBy: {id:"_id", desc: true},
          ...params,
        };

    const url = `${process.env.REACT_APP_API_URL}corporateRidesList?page=${params.page}`;

    post(url, params).then(json => {
      console.log('json',json);
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = json.data.rides.total;
        pagination.pageSize = 100;
      console.log('pagination', pagination);
        this.setState({
          loading: false,
          data: json.data.rides.data,
          pagination,
        });
    })
        .catch(err => {
          console.log('error', err);
        });
  }

  handleSearchAddress = (value, type) => {
    const url = `https://places.api.here.com/places/v1/autosuggest?q=${value}&in=40.7127,-74.0059;r=10000&=USA&app_id=QF36AzFcvwLKygOFHYK1&app_code=qYYhcqwbhljV7Q5ugsMkEA`;
    get(url,null,false).then(json => {
      // get('https://places.api.here.com/places/v1/autosuggest?q='+value+'&in=44.431806,26.1008641;r=10000&=USA&app_id=QF36AzFcvwLKygOFHYK1&app_code=qYYhcqwbhljV7Q5ugsMkEA',null,false).then(json => {
      console.log('json results', json.results);
      if (type === 0) {
        this.setState({
          dataSourcePickupAddress: json.results
        });
      } else if (type === 1) {
        this.setState({
          dataSourceDropoffAddress: json.results
        });
      }
    })
      .catch(err => {
        // this.addNotify('Geocoding failed!', err , 'error', 'tr');
        console.log('err', err);
      });
  };

  handleSearchPhone = (value) => {
    console.log('search phone', value);
  };

  onSelectAddress = (value) => {
    console.log('onSelect', value);
  };

  onChangeTime = (value, dateString) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
  };

  onOk = (value) => {
  console.log('onOk: ', value);
  };

  getRideInfo = () => {
    const { ride_id:id, pickup, dropoff} = this.state;
    const params = {
      id
    };

    console.log('paramsRideInfo', params);

    const url = `${process.env.REACT_APP_API_URL}getRide`;

    post(url, params).then(json => {
      console.log('getRide', json);
      if (json.success === true) {
        console.log('true1', json.data.ride.booking_information.pickup.latlong.lat);
        pickup.lat = json.data.ride.booking_information.pickup.latlong.lat;
        pickup.lng = json.data.ride.booking_information.pickup.latlong.lon;
        dropoff.lat = json.data.ride.booking_information.drop.latlong.lat;
        dropoff.lng = json.data.ride.booking_information.drop.latlong.lon;
        this.setState({
          pickup,
          dropoff,
          track: json.data.tracking,
          driverThumb: json.data.driver_thumb
        });
      } else {
        console.log('false');
        // this.addNotify('Error getting trip!', JSON.stringify(json) , 'error', 'tr');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  };

  onRowClick = (record) => ({
    onClick: () => {
      console.log('row click', record);
      const license = (record.vehicle_extra && record.vehicle_extra.license) ? record.vehicle_extra.license : '';
      this.setState({
        driver : {
          last_name: record.driver_full_name.last_name ? record.driver_full_name.last_name : '',
          first_name: record.driver_full_name.first_name ? record.driver_full_name.first_name : '',
          phone: record.driver.phone ? record.driver.phone : '',
          vehicle_model: record.driver.vehicle_model ? record.driver.vehicle_model : '',
          license
        },
        user : {
          last_name: record.user_full_name.last_name,
          first_name: record.user_full_name.first_name,
          phone: record.user.phone,
        },
        rStatus: record.ride_status,
        ride_id: record.ride_id,
        // cancelled: record.cancelled ? record.cancelled : '',
        selectedRow: record.ride_id
      }, this.getRideInfo);
      console.log('row', record);
    }
  });

  dragMarker = (event, marker, coord, type) => {
    if (type === 'pickup') {
      this.setState({
        pickup: {
          lat: coord.latLng.lat(),
          lng: coord.latLng.lng(),
          title: ''
        }
      }, this.reverseGeo(coord.latLng.lat(), coord.latLng.lng(), 'pickup'));
    } else if (type === 'dropoff') {
      this.setState({
        dropoff: {
          lat: coord.latLng.lat(),
          lng: coord.latLng.lng(),
          title: ''
        }
      }, this.reverseGeo(coord.latLng.lat(), coord.latLng.lng(), 'dropoff'));
    }
    console.log('coord', coord.latLng.lat());
  };

  reverseGeo = (lat, lng, type) => {
    const url = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${lat}%2C${lng}%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=QF36AzFcvwLKygOFHYK1&app_code=qYYhcqwbhljV7Q5ugsMkEA`;
    get(url,null,false).then(json => {
      console.log('reverse json', json);
      if (type === 0) {
        const { pickup } = this.state;
        pickup.address = json.Response.View[0].Result[0].Location.Address.Label;
        this.setState({
          pickup,
          pickupPlaceholder: json.Response.View[0].Result[0].Location.Address.Label
        }, this.calculateRoute());
      } else if (type === 1) {
        const { dropoff } = this.state;
        dropoff.address = json.Response.View[0].Result[0].Location.Address.Label;
        this.setState({
          dropoff,
          dropoffPlaceholder: json.Response.View[0].Result[0].Location.Address.Label
        }, this.calculateRoute());
        console.log('reverse address', dropoff);
      }
    })
      .catch(err => {
        // this.addNotify('Geocoding failed!', err , 'error', 'tr');
        console.log('err', err);
      });
  };

  handleMapClick = (event, marker, coords) => {
    const lat = coords.latLng.lat();
    const lng = coords.latLng.lng();
    let { mapClickNo } = this.state;
    mapClickNo += 1;
    this.setState({
      mapClickNo
    });
    console.log('this.state.mapClickNo',mapClickNo);
    if (mapClickNo % 2 === 1) {
      this.setState({
        pickup: {
          lat,
          lng,
          address: ''
        }
      }, this.reverseGeo(lat, lng, 0));
    } else {
      this.setState({
        dropoff: {
          lat,
          lng,
          address: ''
        }
      }, this.reverseGeo(lat, lng, 1));
    }
  };

  dispatchOrder = () => {
    const { selectedPassenger, pickup, dropoff, fareFare, total_distance:totalDistance, note_to_driver:noteToDriver, fareEta, type} = this.state;

    if (selectedPassenger === null || pickup.address === '' || dropoff.address === null || fareFare === 0 || totalDistance === 0) {
      return 1;
    }

    const params = {
      user_id: selectedPassenger.id,
      pickup: pickup.address,
      pickup_name: pickup.address,
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      dropoff_loc: dropoff.address,
      dropoff_name: dropoff.address,
      dropoff_lat: dropoff.lat,
      dropoff_lng: dropoff.lng,
      wheelchair_accessible: 'DC',
      fare_type: 'fixed',
      lap_dog: 'No',
      type,
      pick_update: new Date(),
      pickup_time: new Date(),
      payment_method_type: '0',
      payment_card_digits: '5917',
      payment_card_exp_date: '01/2024',
      payment_card_brand: 'MASTERCARD',
      payment_tip_value: '20',
      payment_tip_is_percent: 'Yes',
      estimate_cost: fareFare,
      estimate_meters: totalDistance,
      estimate_seconds: fareEta,
      note_to_driver: noteToDriver
    };

    console.log('params', params);
    //
    // console.log('selectedPassenger', this.state.selectedPassenger);
    // console.log('selectedPassenger', this.state.selectedPassenger);

    const url = `${process.env.REACT_APP_API_URL}dispatchOrder`;
    post(url, params).then(json => {
      console.log('dispatchResponse', json);
      const data = JSON.parse(json.data);
      console.log('data.responseCode ', data );
      if (data.response === 'success') {
        // this.addNotify('Order dispatched successfully!', '' , 'success', 'tr');
        this.getTripsList(0);
      }
      if (data.response !== 'success') {
        // this.addNotify('Error Order dispatched!', JSON.stringify(data) , 'error', 'tr');
      }
    })
      .catch(err => {
        // this.addNotify('Error dispatch!', err , 'error', 'tr');
        console.log('err', err);
      });
    return 1;
  };

  onChange = (e) => {
    console.log('value', e.target.value);
    this.setState({
      type: e.target.value,
    });
  }

  dispatchLater = (e) => {
    this.setState({later: e.target.value});
  }

  calculateRoute() {
    const { dropoff, pickup } = this.state;
    if (dropoff.lat != null && dropoff.lng != null && pickup.lat != null && pickup.lng != null) {
      console.log('getRoute');
      const url = `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=QF36AzFcvwLKygOFHYK1&app_code=qYYhcqwbhljV7Q5ugsMkEA&waypoint0=geo!${pickup.lat},${pickup.lng}&waypoint1=geo!${dropoff.lat},${dropoff.lng}&mode=fastest;car;traffic:disabled&routeAttributes=shape`
      get(url,null,false).then(json => {
        console.log('routeResponse', json);
        const route = json.response.route[0].shape;
        const routeCoords = [];
        route.map((item, i) => {
          const string = item.split(',');
          routeCoords[i] = {
            lat: Number(string[0]),
            lng: Number(string[1])
          }
          return 1;
        });
        this.setState({
          track: routeCoords,
          total_distance: json.response.route[0].summary.distance,
          // total_duration: json.response.route[0].summary.travelTime
        },this.calculateFare(json.response.route[0].summary.distance, json.response.route[0].summary.travelTime));
      })
        .catch(err => {
          // this.addNotify('Geocoding failed!', err , 'error', 'tr');
          console.log('err', err);
        });
    }
  }

  calculateFare(distance, travelTime) {
    const {pickup, dropoff} = this.state;
    const params = {
      pickup_latitude: pickup.lat,
      pickup_longitude: pickup.lng,
      dropoff_latitude: dropoff.lat,
      dropoff_longitude: dropoff.lng,
      total_duration: distance,
      total_distance: travelTime
    };
    console.log('calculateFareParams', params);
    const url = `${process.env.REACT_APP_API_URL}calculateFare`;
    post(url,params).then(json => {
      const fare = JSON.parse(json.data);
      console.log('fare', fare);
      if (fare.response_code === "0") {
        if (fare.data[0]) {
          this.setState({
            fareFare: fare.data[0].fare,
            fareEta: fare.data[0].eta
          });
        }
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  render() {
    const {
        pagination,
        loading,
        data,
        type,
        selectedRow,
        driver,
        user,
        pickup,
        dropoff,
        track,
        availableDrivers,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        dataSourcePickupAddress,
        dataSourceDropoffAddress,
        fareEta,
        fareFare,
        searchText,
        filterDropdownVisible,
        filterDropdownVisible1,
        filterDropdownVisible2,
        filterDropdownVisible3,
        filtered,
        pickupPlaceholder,
        dropoffPlaceholder,
        passengersList,
        passengersNameList,
        smsMessage,
        smsModal,
        driverThumb,
        rStatus,
        later,
        modalCC
    } = this.state;
    const dataSourcePickupAddressTitle = dataSourcePickupAddress.map(address => <AutoComplete.Option key={address.href} lat={address.position && address.position[0]} lng={address.position && address.position[1]} value={address.title}>{address.title}</AutoComplete.Option>);
    const dataSourceDropoffAddressTitle = dataSourceDropoffAddress.map(address => <AutoComplete.Option key={address.href} lat={address.position && address.position[0]} lng={address.position && address.position[1]} value={address.title}>{address.title}</AutoComplete.Option>);
    const dataSourcePassengerList = passengersList.map(passenger => <AutoComplete.Option key={passenger.id} firstName={passenger.first_name} lastName={passenger.last_name} email={passenger.email} value={passenger.id}>{passenger.value}</AutoComplete.Option>);
    const dataSourcePassengerNameList = passengersNameList.map(passenger => <AutoComplete.Option key={passenger.id} phone={passenger.phone} firstName={passenger.first_name} lastName={passenger.last_name} email={passenger.email} value={passenger.id}>{passenger.value}</AutoComplete.Option>);
    const rowClassName = (record) => {
      return record.ride_id === selectedRow ? `${styles.active}` : ``;
    };

    const columns = [{
      title: 'Date',
      dataIndex: 'booking_date',
      render: bookingDate => <div className="text-center">{bookingDate.substr(0,8)} {bookingDate.substr(9,5)}</div>,
    }, {
      title: 'Status',
      dataIndex: 'ride_status',
      render: rideStatus =>
        /* stylelint-disable */
        <span
          className={
            (rideStatus === 'Completed' || rideStatus === 'Finished') ? 'font-size-12 badge badge-success' : (rideStatus === 'Cancelled') ? 'font-size-12 badge badge-danger' : (rideStatus === 'Booked') ? 'font-size-12 badge badge-default' : (rideStatus === 'Onride' || rideStatus === 'Arrived') ? 'font-size-12 badge badge-primary' : ''
          }
        >
          {rideStatus}
        </span>,
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={this.refSearchInput}
            placeholder="Search name"
            value={searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>
            Search
          </Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible,
      onFilterDropdownVisibleChange: visible => {
        this.setState(
          {
            filterDropdownVisible: visible,
          },
          () => this.searchInput && this.searchInput.focus(),
        )
      },
    }, {
      title: 'Type',
      render: (row) => row.driver.athena_id ? 'Athena' : 'Waave',
    },{
      title: 'Pickup',
      dataIndex: 'pickup_location_name',
      render: pickupLocationName => pickupLocationName,
    },{
      title: 'Dropoff',
      dataIndex: 'drop_location_name',
      render: dropLocationName => dropLocationName,
    },{
      title: 'Fare',
      render: (row) => row.rideStatus === 'Completed' ? Number(row.total.paid_amount).toFixed(2) : row.estimates && row.estimates.estimate_cost && Number(row.estimates.estimate_cost).toFixed(2),
    },{
      title: 'Dist.',
      render: (row) => row.rideStatus === 'Completed' ? `${(Number(row.total.distance/1000).toFixed(2)*0.62137).toFixed(2)} mi` : (row.estimates && row.estimates.estimate_meters && `${Number((row.estimates.estimate_meters/1000).toFixed(2)*0.62137).toFixed(2)} mi`),
    },{
      title: 'Passenger',
      render: (row) => row.user && row.user.name && row.user.name,
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={this.refSearchInput}
            placeholder="Search name"
            value={searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>
            Search
          </Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible1,
      onFilterDropdownVisibleChange: visible => {
        this.setState(
          {
            filterDropdownVisible1: visible,
          },
          () => this.searchInput && this.searchInput.focus(),
        )
      },
    },{
      title: 'Driver',
      render: (row) => row.driver && row.driver.name && row.driver.name,
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={this.refSearchInput}
            placeholder="Search name"
            value={searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>
            Search
          </Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible2,
      onFilterDropdownVisibleChange: visible => {
        this.setState(
          {
            filterDropdownVisible2: visible,
          },
          () => this.searchInput && this.searchInput.focus(),
        )
      },
    },{
      title: 'Number',
      dataIndex: 'vehicle_extra',
      render: vehicleExtra => vehicleExtra && vehicleExtra.license,
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={this.refSearchInput}
            placeholder="Search name"
            value={searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>
            Search
          </Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible3,
      onFilterDropdownVisibleChange: visible => {
        this.setState(
          {
            filterDropdownVisible3: visible,
          },
          () => this.searchInput && this.searchInput.focus(),
        )
      },
    }];


    return (
      <div>
        <Modal
          title="Send message"
          visible={smsModal}
          onOk={() => this.sendMessage()}
          onCancel={() => this.setState({smsModal: false})}
        >
          <div className="form-group col-12 border-1-grey">
            <div>
              <h6>Message</h6>
            </div>
            <textarea
              className="form-control"
              name="textarea"
              placeholder="Enter instructions"
              value={smsMessage}
              onChange={(e) => {this.setState({smsMessage: e.target.value})}}
            />
          </div>
        </Modal>
        <Modal
          title="Billing Details"
          visible={modalCC}
          onOk={() => this.setState({modalCC: false})}
          onCancel={() => this.setState({modalCC: false})}
        >
          <div className="row">
            <div className="col-md-12">
              <FormItem label="Card Number">
                <Input addonBefore={<Icon type="credit-card" />} placeholder="Card Number" />
              </FormItem>
            </div>
            <div className="col-md-7">
              <FormItem label="Expiration Date">
                <Input id="checkout-cardexpdate" placeholder="MM / YY" />
              </FormItem>
            </div>
            <div className="col-md-5 pull-right">
              <FormItem label="Card CVC">
                <Input id="checkout-cardholder" placeholder="CVC" />
              </FormItem>
            </div>
            <div className="col-md-12">
              <FormItem label="Card Holder Name">
                <Input id="checkout-cardholder" placeholder="Name and Surname" />
              </FormItem>
            </div>
          </div>
        </Modal>
        <div className="row">
          <div className={`${styles.colLg3} col-lg-3`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Passenger</strong>
                </div>
                <div className={styles.cardBody}>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="First Name"
                            size="small"
                            value={firstName}
                          />
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <AutoComplete
                            size="small"
                            onSelect={(value, key) => {console.log('value',key.props); this.setState({last_name: key.props.lastName, first_name: key.props.firstName, phone: key.props.phone, email: key.props.email, selectedPassenger: {id: value}}) }}
                            onSearch={value => this.handleSearchPhone(value)}
                            placeholder={lastName}
                          >
                            {dataSourcePassengerNameList}
                          </AutoComplete>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <AutoComplete
                            size="small"
                            onSelect={(value, key) => {console.log('value',key.props); this.setState({last_name: key.props.lastName, first_name: key.props.firstName, email: key.props.email, selectedPassenger: {id: value}}) }}
                            onSearch={value => this.handleSearchPhone(value)}
                            placeholder={phone}
                          >
                            {dataSourcePassengerList}
                          </AutoComplete>
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="Email"
                            size="small"
                            value={email}
                          />
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Location</strong>
                </div>
                <div className={styles.cardBody}>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className='col-lg-12'>
                        <div className={styles.formItem}>
                          <AutoComplete
                            size="small"
                            onSelect={(value, key) => {console.log('value',key.props); pickup.lat = key.props.lat; pickup.lng = key.props.lng; pickup.address = value; this.setState({pickup},this.calculateRoute())}}
                            onSearch={value => this.handleSearchAddress(value, 0)}
                            placeholder={pickupPlaceholder}
                          >
                            {dataSourcePickupAddressTitle}
                          </AutoComplete>
                        </div>
                      </div>
                      <div className='col-lg-12'>
                        <div className={styles.formItem}>
                          <AutoComplete
                            size="small"
                            onSelect={(value, key) => {console.log('value',key.props); dropoff.lat = key.props.lat; dropoff.lng = key.props.lng; dropoff.address = value; this.setState({dropoff}, this.calculateRoute())}}
                            onSearch={value => this.handleSearchAddress(value, 1)}
                            placeholder={dropoffPlaceholder}
                          >
                            {dataSourceDropoffAddressTitle}
                          </AutoComplete>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Radio.Group value={later} onChange={this.dispatchLater} buttonStyle="solid" size="small" className={styles.marginTop25}>
                            <Radio.Button value="now">NOW</Radio.Button>
                            <Radio.Button value="later">LATER</Radio.Button>
                          </Radio.Group>
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-6`}>
                        { later === "later" &&
                          <div>
                            <div className={styles.formItem}>
                              <DatePicker
                                style={{width: '99%'}}
                                placeholder="Select Date"
                                size="small"
                                onChange={this.onChangeTime}
                                onOk={this.onOk}
                              />
                            </div>
                            <div className={styles.formItem}>
                              <DatePicker
                                style={{width: '99%'}}
                                showTime={{ format: 'HH:mm' }}
                                format="HH:mm"
                                mode="time"
                                placeholder="Select Time"
                                size="small"
                                onChange={this.onChangeTime}
                                onOk={this.onOk}
                              />
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Payment Method</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row text-center">
                    <div className="col-lg-6 text-center">
                      <Button size="small" onClick={()=>this.setState({modalCC: true})}>Add new credit card</Button>
                    </div>
                    <div className="col-lg-6 text-center">
                      <div className={styles.formItem}>
                        <Input
                          placeholder="Select account"
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Type</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row text-center">
                    <div className="col-lg-12 text-center">
                      <RadioGroup size="large" onChange={this.onChange} value={type}>
                        <Radio value={1}><br />Waave</Radio>
                        <Radio value={2}><br />Waave Max</Radio>
                        <Radio value={3}><br />Accessible</Radio>
                        <Radio value={4}><br />Shared</Radio>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title} />
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className={`${styles.colLg3F} col-lg-3`}>
                      <div className={styles.utils__icon}>
                        <span className="fa fa-child" /> : <span className={styles.fontBold}>1-4</span>
                      </div>
                    </div>
                    <div className={`${styles.colLg5F} col-lg-5`}>
                      Pickup: <span className={styles.fontBold}>{fareEta} min</span>
                    </div>
                    <div className={`${styles.colLg4F} col-lg-4`}>
                      Fare: <span className={styles.fontBold}>${fareFare}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Instructions for driver</strong>
                </div>
                <div className={styles.cardBody}>
                  <Form layout="inline" onSubmit={this.handleSubmit}>
                    <TextArea autosize={{ minRows: 2}} />
                  </Form>
                </div>
              </div>
            </div>
            <div className={`${styles.marginBottom10} row`}>
              <div className="col-lg-6">
                <Button>Cancel</Button>
              </div>
              <div className="col-lg-6">
                <div className="pull-right">
                  <Button type="primary" onClick={() => this.dispatchOrder()}>Request</Button>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg6Center} col-lg-6`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardBody}>
                  <div style={{ height: '635px', width: '100%'}}>
                    <DispatchMap
                      style={{ height: '390px', width: '90%'}}
                      availableDrivers={availableDrivers}
                      pickup={pickup}
                      dropoff={dropoff}
                      track={track}
                      dragMarker={this.dragMarker}
                      onPositionChanged={this.onPositionChanged}
                      handleMapClick={this.handleMapClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg3L} col-lg-3`}>
            {rStatus && <span className={(rStatus === 'Completed' || rStatus === 'Finished') ? 'font-size-12 badge badge-success' : (rStatus === 'Cancelled') ? 'font-size-12 badge badge-danger' : (rStatus === 'Booked') ? 'font-size-12 badge badge-default' : (rStatus === 'Onride' || rStatus === 'Arrived') ? 'font-size-12 badge badge-primary' : ''}>{rStatus}</span>}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Driver</strong>
                </div>
                <div className={styles.cardBody}>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="First Name"
                            size="small"
                            value={driver.first_name}
                          />
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="Last Name"
                            size="small"
                            value={driver.last_name}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="Phone"
                            size="small"
                            value={driver.phone}
                          />
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <Button type="primary" size="small">Call</Button>
                      </div>
                      <div className="col-lg-6">
                        <div className="pull-right">
                          <Button type="primary" size="small" onClick={() => this.setState({smsModal: true, sms: 'driver'})}>Text</Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Passenger</strong>
                </div>
                <div className={styles.cardBody}>
                  <Form layout="inline" onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="First Name"
                            size="small"
                            value={user.first_name}
                          />
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="Last Name"
                            size="small"
                            value={user.last_name}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-6`}>
                        <div className={styles.formItem}>
                          <Input
                            placeholder="Phone"
                            size="small"
                            value={user.phone}
                          />
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-6`} />
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <Button type="primary" size="small">Call</Button>
                      </div>
                      <div className="col-lg-6">
                        <div className="pull-right">
                          <Button type="primary" size="small" onClick={() => this.setState({smsModal: true, sms: 'passenger'})}>Text</Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong>Vehicle</strong>
                </div>
                <div className={styles.cardBody}>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className={`${styles.colLg6} col-lg-4 text-center`}>
                        <div className={styles.formItem}>
                          {driverThumb === '' && <img alt="thumb" width="45%" className={styles.roundPic} src={userThumb} /> }
                          {driverThumb !== '' && <img alt="thumb" width="45%" className={styles.roundPic} src={"data:image/jpeg;base64,"+driverThumb.$binary} /> }
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-4 text-center`}>
                        <div className={styles.formItem}>
                          <div className={styles.utils__title}>
                            Model:
                          </div>
                          <br />
                          <span className={styles.fontBold}>{driver.vehicle_model}</span>
                        </div>
                      </div>
                      <div className={`${styles.colLg6} col-lg-4 text-center`}>
                        <div className={styles.formItem}>
                          <div className={styles.utils__title}>
                            License:
                          </div>
                          <br />
                          <span className={styles.fontBold}>{driver.license}</span>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 h-100">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title} />
                <div className={styles.cardBody}>
                  <Table
                    className="utils__scrollTable"
                    rowKey={record => record.ride_id}
                    scroll={{ y: 200 }}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                    onRow={this.onRowClick}
                    rowClassName={rowClassName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Dispatch
