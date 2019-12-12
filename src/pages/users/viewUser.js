import React from 'react'
import { Helmet } from 'react-helmet'
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import { get } from '../../services/net'
import { userThumb }from '../../assets/images/index';
import styles from './style.module.scss';

class viewUser extends React.Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      userId: match.params.id,
      user: {
        last_name: ''
      },
      pagination: {},
      loading: false,
    };
  }

  componentDidMount() {
    const { userId } = this.state;
    this.fetch(userId);
  }

  fetch = (userId) => {
    console.log('userId', userId);
    const url = `${process.env.REACT_APP_API_URL}editUser/${userId}`;
    get(url).then(json => {
      if (json.success) {
        console.log('user',json.data.user);
        console.log('rides',json.data.rides);
        this.setState({
          user: json.data.user,
          rides: json.data.rides,
        });
      }
      if (!json.success) {
        console.log('get failed');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  render() {

    const { user, pagination, loading, rides } = this.state;

    const columns = [{
      title: 'Date',
      dataIndex: 'booking_date',
      render: bookingDate => <div className="text-center">{bookingDate.substr(0,8)} {bookingDate.substr(9,5)}</div>,
    }, {
      title: 'Status',
      dataIndex: 'ride_status',
      render: (rideStatus, row) =>
        /* stylelint-disable */
        <span className={(rideStatus === 'Completed' || rideStatus === 'Finished') ? 'font-size-12 badge badge-success' : (rideStatus === 'Cancelled') ? 'font-size-12 badge badge-danger' : (rideStatus === 'Booked') ? 'font-size-12 badge badge-default' : (rideStatus === 'Onride' || rideStatus === 'Arrived') ? 'font-size-12 badge badge-primary' : ''}>{row.cancelled && row.cancelled.primary && row.cancelled.primary.by === 'User' && row.driver.id === '' && 'No driver found'}
          {row.cancelled && row.driver.id !== '' && row.cancelled.primary && rideStatus + " by " + row.cancelled.primary.by}
          {rideStatus !== 'Cancelled' && rideStatus}
        </span>,
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
      dataIndex: 'user',
      render: (row) => row.user && row.user.name && row.user.name,
    },{
      title: 'Driver',
      dataIndex: 'driver',
      render: (driver) => driver && driver.name && driver.name,
    },{
      title: 'Number',
      dataIndex: 'vehicle_extra',
      render: vehicleExtra => vehicleExtra && vehicleExtra.license,
    },
      {
        title: 'Action',
        dataIndex: 'idd',
        render: (idd) => <div className="text-center"><Link to={`/trips/tripDetails/${idd}`}><div className="fa fa-eye" /></Link></div>,
      }];

    return (
      <div>
        <Helmet title="User Info" />
        <div className="row">
          <div className="col-lg-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> User Info</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>First Name</strong>
                        </div>
                        <div className="col-lg-6">
                          {user.user_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Last Name</strong>
                        </div>
                        <div className="col-lg-6">
                          {user.last_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Email</strong>
                        </div>
                        <div className="col-lg-6">
                          {user.email}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Phone</strong>
                        </div>
                        <div className="col-lg-6">
                          {user.country_code} {user.phone_number}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>NickName</strong>
                        </div>
                        <div className="col-lg-6">
                          {user.nick_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Unique Code</strong>
                        </div>
                        <div className="col-lg-6">
                          {user.unique_code}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Taxi user ID</strong>
                        </div>
                        <div className="col-lg-6">
                          {user._id}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Picture</strong>
                        </div>
                        <div className="col-lg-6">
                          {user.user_image_thumb == null && <img alt="thumb" width="100" src={userThumb} />}
                          {user.user_image_thumb != null && <img alt="thumb" width="100" src={`data:image/jpeg;base64,${user.user_image_thumb.image.$binary}`}  />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Rides</strong>
                </div>
                <div className={styles.cardBody}>
                  <Table
                    className="utils__scrollTable"
                    rowKey={record => record._id}
                    columns={columns}
                    dataSource={rides}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Link to="/users/usersList">
              <Button icon="ordered-list">
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default viewUser
