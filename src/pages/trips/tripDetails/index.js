import React from 'react'
import { Helmet } from 'react-helmet'
import { Form, Button } from 'antd';
import { Link } from 'react-router-dom';
import TripMap from './tripMap';
import { get } from '../../../services/net'
import styles from './style.module.scss'

@Form.create()
class tripDetails extends React.Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      rideId: match.params.id,
      ride: {},
      tracking: [],
      markers: [],
      model: '',
    }
  }

  componentDidMount() {
    const { rideId } = this.state;

    const url = `${process.env.REACT_APP_API_URL}editRide/${rideId}`;
    get(url).then(json => {
      if (json.success) {
        console.log('showRide', json.data.ride);
        console.log('tracking', json.data.tracking);
        console.log('json.data.ride.driver_location', json.data.ride.driver_location);

        let markerAccepted = false;

        if (json.data.tracking && json.data.tracking[0]) {
          markerAccepted = json.data.tracking[0]
        }

        console.log('markerAccepted', markerAccepted);

        this.setState({
          ride: json.data.ride,
          tracking: json.data.tracking,
          model: json.data.model,
          markers: [
            json.data.ride.booking_information.pickup,
            json.data.ride.booking_information.drop,
            markerAccepted,
          ]
        });
      }
      if (!json.success) {
        console.log('error gettind ride');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  render() {
    const {ride, markers, tracking, model} = this.state;
    return (
      <div>
        <Helmet title="Users list" />
        <div className="row">
          <div className={`${styles.colLg4} col-lg-4`}>
            <div className={`${styles.cardCustom} card`}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <span className="fa fa-map-marker" /><strong>&nbsp; Booking details</strong>
                  <div className="pull-right">
                    {ride && ride.ride_status &&
                    <span
                      className={
                        (ride.ride_status === 'Completed' || ride.ride_status === 'Finished') ? 'font-size-12 badge badge-success' : (ride.ride_status === 'Cancelled') ? 'font-size-12 badge badge-danger' : (ride.ride_status === 'Booked') ? 'font-size-12 badge badge-default' : (ride.ride_status === 'Onride' || ride.ride_status === 'Arrived') ? 'font-size-12 badge badge-primary' : ''
                                }
                    >
                      {ride.ride_status
                      }
                    </span>
                    }
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Ride ID
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.ride_id && ride.ride_id}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Type
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.booking_options && ride.booking_options.wheelchair_accessible && (ride.booking_options.wheelchair_accessible === 'Yes' ? 'Accessible' : ride.booking_options.wheelchair_accessible)}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Booking Date
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.booking_date && ride.booking_date}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Est. Pickup
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.est_pickup_date && ride.est_pickup_date}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Est. Dropoff
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.est_drop_date && ride.est_drop_date}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Pickup
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.pickup_date && ride.pickup_date}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Dropoff
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.drop_date && ride.drop_date}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Pickup location
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.pickup_location_name && ride.pickup_location_name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Dropoff location
                    </div>
                    <div className="col-lg-8">
                      {ride && ride.drop_location_name && ride.drop_location_name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Est. Distance
                    </div>
                    <div className="col-lg-8">
                      {ride.estimates && `${(Number(ride.estimates.estimate_meters/1000).toFixed(2)*0.62137).toFixed(2)} mi`}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Distance
                    </div>
                    <div className="col-lg-8">
                      {ride.estimates && `${(Number(ride.estimates.estimate_meters/1000).toFixed(2)*0.62137).toFixed(2)} mi`}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Lap dog
                    </div>
                    <div className="col-lg-8">
                      {ride.booking_options && ride.booking_options.lap_dog && ride.booking_options.lap_dog}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Shared
                    </div>
                    <div className="col-lg-8">
                      {ride.shared ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Vehicle type
                    </div>
                    <div className="col-lg-8">
                      {(ride.vehicle_car_type && ride.vehicle_car_type !== '') ? ride.vehicle_car_type : 'DC'}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Cleanliness
                    </div>
                    <div className="col-lg-8">
                      <div className={styles.utils__title}>{ride && ride.ratings && ride.ratings.cleanliness && (ride.ratings.cleanliness && ride.ratings.cleanliness.avg_rating && ride.ratings.cleanliness.avg_rating === 1 ? <span className="fa fa-frown-o" /> : ride.ratings.cleanliness.avg_rating === 2 ? <span className="fa fa-meg-o" /> : ride.ratings.cleanliness.avg_rating === 3 ? <span className="fa fa-smile-o" /> : <span className="fa fa-smile-o" />)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.cardCustom} card`}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <span className="fa fa-automobile" /><strong>&nbsp; Vehicle</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Type
                    </div>
                    <div className="col-lg-8">
                      { model && model }
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      License Nr
                    </div>
                    <div className="col-lg-8">
                      {ride.vehicle_extra && ride.vehicle_extra.license && ride.vehicle_extra.license}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.cardCustom} card`}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <span className="fa fa-dollar" /><strong>&nbsp; Fare</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-4 grey">
                      Est. Fare
                    </div>
                    <div className="col-lg-8">
                      <strong>{ride.estimates && ride.estimates.estimate_cost && `${Number(ride.estimates.estimate_cost).toFixed(2)} $`}</strong>
                    </div>
                  </div>
                  { ride.ride_status === 'Completed' &&
                    <div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          MTA Tax
                        </div>
                        <div className="col-lg-8">
                          {ride.total && ride.total.service_tax && ride.total.service_tax}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Impr. surch
                        </div>
                        <div className="col-lg-8">
                          {ride.total && ride.total.accessFee && ride.total.accessFee}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Congest. surch
                        </div>
                        <div className="col-lg-8">
                          {ride.total && ride.total.congestion && ride.total.congestion}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Tip
                        </div>
                        <div className="col-lg-8">
                          {ride.total && ride.total.tip && ride.total.tip} ({ride.payment_method && ride.payment_method.tip_value && ride.payment_method.tip_value} %)
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Tolls
                        </div>
                        <div className="col-lg-8">
                          {ride.total && ride.total.toll && ride.total.toll}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Bonus
                        </div>
                        <div className="col-lg-8">
                          {ride.total && ride.total.bonus && ride.total.bonus}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          <strong>Total Fare</strong>
                        </div>
                        <div className="col-lg-8">
                          <strong>{ride.total && ride.total.paid_amount && Number(ride.total.paid_amount).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                    }
                  { ride.ride_status === 'Cancelled' &&
                  <div className="row">
                    <div className="col-lg-4 grey">
                      <strong>Cancellation Fee</strong>
                    </div>
                    <div className="col-lg-8">
                      {ride.total && ride.total.cancellation_fee && `${Number(ride.total.cancellation_fee).toFixed(2)} $`}
                    </div>
                  </div>
                  }
                </div>
              </div>
            </div>
            <div className={`${styles.cardCustom} card`}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <span className="fa fa-dollar" /><strong>&nbsp; Driver Paid</strong>
                </div>
                <div className={styles.cardBody}>
                  { ride.ride_status === 'Completed' &&
                  <div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        <strong>Total Fare</strong>
                      </div>
                      <div className="col-lg-8">
                        <strong>{ride.total && ride.total.paid_amount && Number(ride.total.paid_amount).toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        MTA Tax
                      </div>
                      <div className="col-lg-8">
                        {ride.total && ride.total.service_tax && ride.total.service_tax}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        Impr. surch
                      </div>
                      <div className="col-lg-8">
                        {ride.total && ride.total.accessFee && ride.total.accessFee}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        Congest. surch
                      </div>
                      <div className="col-lg-8">
                        {ride.total && ride.total.congestion && ride.total.congestion}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        Booking Fee Pass
                      </div>
                      <div className="col-lg-8">
                        {ride.total && ride.total.service_fee && ride.total.service_fee}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        Booking fee Driver
                      </div>
                      <div className="col-lg-8">
                        {ride.total && ride.total.booking_fee && ride.total.booking_fee}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        Transact. Fee
                      </div>
                      <div className="col-lg-8">
                        {ride.pay_summary && ride.pay_summary.transaction_fee && ride.pay_summary.transaction_fee} ({(ride.pay_summary && ride.pay_summary.transaction_fee && (ride.pay_summary.transaction_fee/(ride.pay_summary.captured_amount+ride.pay_summary.transaction_fee))*100).toFixed(2)}%)
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 grey">
                        <strong>Driver paid</strong>
                      </div>
                      <div className="col-lg-8">
                        <strong>{ ride.total && ride.pay_summary && ride.total.congestion && Number(ride.total.paid_amount - ride.total.service_fee - ride.total.booking_fee - ride.pay_summary.transaction_fee - ride.total.accessFee - ride.total.service_tax - ride.total.congestion).toFixed(2)}</strong>
                        <strong>{ ride.total && ride.pay_summary && !ride.total.congestion && Number(ride.total.paid_amount - ride.total.service_fee - ride.total.booking_fee - ride.pay_summary.transaction_fee - ride.total.accessFee - ride.total.service_tax ).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                  }
                  { ride.ride_status === 'Cancelled' &&
                  <div className="row">
                    <div className="col-lg-4 grey">
                      <strong>Cancellation Fee</strong>
                    </div>
                    <div className="col-lg-8">
                      {ride.total && ride.total.cancellation_fee && `${Number(ride.total.cancellation_fee).toFixed(2)} $`}
                    </div>
                  </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg8} col-lg-8`}>
            <div className="row">
              <div className={`${styles.colLg6} col-lg-6`}>
                <div className={`${styles.cardCustom} card`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.utils__title}>
                      <span className="fa fa-child" /><strong>&nbsp; Passenger</strong>
                    </div>
                    <div className={styles.cardBody}>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          First name
                        </div>
                        <div className="col-lg-8">
                          {ride.user_full_name && ride.user_full_name.first_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Last name
                        </div>
                        <div className="col-lg-8">
                          {ride.user_full_name && ride.user_full_name.last_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Phone
                        </div>
                        <div className="col-lg-8">
                          {ride.user && ride.user.phone}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Email
                        </div>
                        <div className="col-lg-8">
                          {ride.user && ride.user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.colLg6C} col-lg-6`}>
                <div className={`${styles.cardCustom} card`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.utils__title}>
                      <span className="fa fa-male" /><strong>&nbsp; Driver</strong>
                    </div>
                    <div className={styles.cardBody}>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          First name
                        </div>
                        <div className="col-lg-8">
                          {ride.driver_full_name && ride.driver_full_name.first_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Last name
                        </div>
                        <div className="col-lg-8">
                          {ride.driver_full_name && ride.driver_full_name.last_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Phone
                        </div>
                        <div className="col-lg-8">
                          {ride.driver && ride.driver.phone}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 grey">
                          Email
                        </div>
                        <div className="col-lg-8">
                          {ride.driver && ride.driver.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className={`${styles.cardCustom} card`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardBody}>
                      <div style={{ height: '70vh', width: '100%' }}>
                        <TripMap markers={markers} tracking={tracking} />
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
            <Link to="/trips/tripsList">
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

export default tripDetails
