import React from 'react'
import { Helmet } from 'react-helmet'
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { get } from '../../services/net'
import { userThumb }from '../../assets/images/index';
import styles from './style.module.scss';

class viewDriver extends React.Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      driverId: match.params.id,
      driver: {
        last_name: ''
      },
      payoutsTotal: {
        new: 0,
        requested: 0,
        paid: 0,
      },
      rides: {
        'new': [],
        'requested': [],
        'paid': []
      }
    };
  }

  componentDidMount() {
    const { driverId } = this.state;
    this.fetch(driverId);
  }

  fetch = (driverId) => {
    console.log('driverId', driverId);
    const url = `${process.env.REACT_APP_API_URL}editDriver/${driverId}`;
    get(url).then(json => {
      if (json.success) {
        console.log('rides',json.data.rides);
        this.setState({
          driver: json.data.driver,
          rides: json.data.rides,
          payoutsTotal: json.data.payoutsTotal,
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

    const { driver, payoutsTotal, rides } = this.state;

    return (
      <div>
        <Helmet title="Driver Info" />
        <div className="row">
          <div className="col-lg-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Driver Info</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>First Name</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver.driver_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Last Name</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver.last_name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Location</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver && driver.location && driver.location.city && driver.location.city}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Taxi Driver ID</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver._id}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Accessible</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver && driver.driver_extra && driver.driver_extra.accessible && driver.driver_extra.accessible}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Taxi License No</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver && driver.driver_extra && driver.driver_extra.license && driver.driver_extra.license}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Address</strong>
                        </div>
                        <div className="col-lg-6">
                          {(driver.address != null && driver.address.address != null) ? driver.address.address : ''}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>City</strong>
                        </div>
                        <div className="col-lg-6">
                          {(driver.address != null && driver.address.city != null) ? driver.address.city : ''}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>State</strong>
                        </div>
                        <div className="col-lg-6">
                          {(driver.address != null && driver.address.state != null) ? driver.address.state : ''}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>ZIP Code</strong>
                        </div>
                        <div className="col-lg-6">
                          {(driver.address != null && driver.address.postal_code != null) ? driver.address.postal_code : ''}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Email</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver.email}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Mobile number</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver.dail_code} {driver.mobile_number}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="row">
                        <div className="col-lg-6">
                          <strong>Picture</strong>
                        </div>
                        <div className="col-lg-6">
                          {driver.driver_image_thumb == null && <img alt="thumb" width="100" src={userThumb} />}
                          {driver.driver_image_thumb != null && <img alt="thumb" width="100" src={`data:image/jpeg;base64,${driver.driver_image_thumb.image.$binary}`}  />}
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
          <div className={`${styles.colLg4} col-lg-4`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <h4><span className="fa fa-edit" /> Actual balance: { Number(payoutsTotal.new).toFixed(2) }$</h4>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Ride Date</th>
                              <th>Ride Fare</th>
                              <th>Last Update</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rides['new'].map((item) => (
                              <tr key={item.id}>
                                <td><Link to={`/trips/tripDetails/${item.id}`}>{item.date}</Link></td>
                                <td>{Number(item.fare).toFixed(2)}</td>
                                <td>{item.state_date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg4C} col-lg-4`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <h4><span className="fa fa-edit" /> Requested: { Number(payoutsTotal.requested).toFixed(2) }$</h4>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Ride Date</th>
                              <th>Ride Fare</th>
                              <th>Last Update</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rides['requested'].map((item) => (
                              <tr key={item.id}>
                                <td><Link to={`/trips/tripDetails/${item.id}`}>{item.date}</Link></td>
                                <td>{Number(item.fare).toFixed(2)}</td>
                                <td>{item.state_date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg4} col-lg-4`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <h4><span className="fa fa-edit" /> Paid: { Number(payoutsTotal.paid).toFixed(2) }$</h4>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Ride Date</th>
                              <th>Ride Fare</th>
                              <th>Last Update</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rides['paid'].map((item) => (
                              <tr key={item.id}>
                                <td><Link to={`/trips/tripDetails/${item.id}`}>{item.date}</Link></td>
                                <td>{Number(item.fare).toFixed(2)}</td>
                                <td>{item.state_date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
            <Link to="/drivers/driversList">
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

export default viewDriver
