import React from 'react'
import { Helmet } from 'react-helmet'
import { Button, Input, Select, notification } from 'antd';
import { Link } from 'react-router-dom';
import { get, post } from '../../services/net'
import { userThumb }from '../../assets/images/index';
import styles from './style.module.scss';

class editDriver extends React.Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      driverId: match.params.id,
      locations: [],
      driver: {
        driver_name: '',
        last_name: '',
        driver_extra: {
          license: '',
          license_type: '',
        },
        email: '',
        password: '',
        mobile_number: '',
        dail_code: '',
      },
      payout: {
        first_name: '',
        last_name: '',
        home_street_address: '',
        home_city_address: '',
        home_state_address: '',
        home_zip_address: '',
        day_of_birth: '',
        month_of_birth: '',
        year_of_birth: '',
        last_4_ssn: '',
        last_4_bank_account: '',
        last_4_bank_routing: '',
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
          locations: json.data.locations,
        });
      }
      if (!json.success) {
        console.log('get failed');
      }
    })
      .catch(err => {
        console.log('err', err);
      });

    const url2 = `${process.env.REACT_APP_API_URL}editPayout/${driverId}`;

    get(url2).then(json => {
      console.log('payoutget', json);
      if (json.success) {
        this.setState({
          payout: {
            first_name: json.data.payout[0],
            last_name: json.data.payout[1],
            home_street_address: json.data.payout[2],
            home_city_address: json.data.payout[3],
            home_state_address: json.data.payout[4],
            home_zip_address: json.data.payout[5],
            day_of_birth: json.data.payout[6],
            month_of_birth: json.data.payout[7],
            year_of_birth: json.data.payout[8],
            last_4_ssn: json.data.payout[9],
            last_4_bank_account: json.data.payout[10],
            last_4_bank_routing: json.data.payout[11],
          },
        });
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  saveDriver = () => {
    const { driver, driverId } = this.state;
    console.log('savedrivr',driver, driverId);
    const url = `${process.env.REACT_APP_API_URL}saveDriver/${driverId}`;
    post(url , driver).then(json => {
      console.log('driversave', json);
      if (json.success) {
        notification.success({
          message: 'Driver Info',
          description: 'You have successfully saved driver info!',
        });
        console.log('driver saved');

      }
      if (!json.success) {
        notification.error({
          message: 'Driver Info',
          description: 'Failed!',
        });
        console.log('driver fail');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  savePayout = () => {
    const { payout, driverId } = this.state;
    console.log('savePayout',payout, driverId);
    const url = `${process.env.REACT_APP_API_URL}savePayout/${driverId}`;
    post(url , payout).then(json => {
      console.log('payousave', json);
      if (json.success) {
        notification.success({
          message: 'Driver Payout',
          description: 'You have successfully saved driver payout!',
        });
        console.log('payout saved');
      }
      if (!json.success) {
        notification.error({
          message: 'Driver Payout',
          description: 'Failed!',
        });
        console.log('payout fail');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  render() {

    const { driver, payout, locations } = this.state;

    return (
      <div>
        <Helmet title="Driver Info" />
        <div className="row">
          <div className={`${styles.colLg6} col-lg-6`}>
            <div className={styles.card} style={{height: '85vh'}}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Personal Info</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          First Name
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={payout.first_name}
                            onChange={(e) => this.setState({payout: {...payout, first_name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Last Name
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={payout.last_name}
                            onChange={(e) => this.setState({payout: {...payout, last_name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Birthday
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <div className="row">
                            <div className="col-lg-2">
                              <span className="pull-right">Day</span>
                            </div>
                            <div className="col-lg-2">
                              <Input
                                size="small"
                                value={payout.day_of_birth}
                                onChange={(e) => this.setState({payout: {...payout, day_of_birth: e.target.value}})}
                              />
                            </div>
                            <div className="col-lg-2">
                              <span className="pull-right">Month</span>
                            </div>
                            <div className="col-lg-2">
                              <Input
                                size="small"
                                value={payout.month_of_birth}
                                onChange={(e) => this.setState({payout: {...payout, month_of_birth: e.target.value}})}
                              />
                            </div>
                            <div className="col-lg-2">
                              <span className="pull-right">Year</span>
                            </div>
                            <div className="col-lg-2">
                              <Input
                                size="small"
                                value={payout.year_of_birth}
                                onChange={(e) => this.setState({payout: {...payout, year_of_birth: e.target.value}})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          SSN
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={payout.last_4_ssn}
                            onChange={(e) => this.setState({payout: {...payout, last_4_ssn: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Address
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={payout.home_street_address}
                            onChange={(e) => this.setState({payout: {...payout, home_street_address: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          &nbsp;
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <div className="row">
                            <div className="col-lg-1">
                              <span className="pull-right">City</span>
                            </div>
                            <div className="col-lg-3">
                              <Input
                                size="small"
                                value={payout.home_city_address}
                                onChange={(e) => this.setState({payout: {...payout, home_city_address: e.target.value}})}
                              />
                            </div>
                            <div className="col-lg-2">
                              <span className="pull-right">State</span>
                            </div>
                            <div className="col-lg-2">
                              <Input
                                size="small"
                                value={payout.home_state_address}
                                onChange={(e) => this.setState({payout: {...payout, home_state_address: e.target.value}})}
                              />
                            </div>
                            <div className="col-lg-1">
                              <span className="pull-right">ZIP</span>
                            </div>
                            <div className="col-lg-3">
                              <Input
                                size="small"
                                value={payout.home_zip_address}
                                onChange={(e) => this.setState({payout: {...payout, home_zip_address: e.target.value}})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Account No
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={payout.last_4_bank_account}
                            onChange={(e) => this.setState({payout: {...payout, last_4_bank_account: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Routing No
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={payout.last_4_bank_routing}
                            onChange={(e) => this.setState({payout: {...payout, last_4_bank_routing: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.alignBottom}>
                <Button icon="save" type="primary" onClick={() => this.savePayout()}>
                  Save Payout
                </Button>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg6} col-lg-6`}>
            <div className={styles.card} style={{height: '85vh'}}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Driver Info</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-3">
                          Driver Image
                        </div>
                        <div className="col-lg-9">
                          {driver.driver_image_thumb == null && <img alt="thumb" width="100" src={userThumb} />}
                          {driver.driver_image_thumb != null && <img alt="thumb" width="100" src={`data:image/jpeg;base64,${driver.driver_image_thumb.image.$binary}`}  />}
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          First Name
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={driver.driver_name}
                            onChange={(e) => this.setState({driver: {...driver, driver_name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Last Name
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={driver.last_name}
                            onChange={(e) => this.setState({driver: {...driver, last_name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Email
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={driver.email}
                            onChange={(e) => this.setState({driver: {...driver, email: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Mobile number
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <div className="row">
                            <div className="col-lg-3">
                              <Input
                                size="small"
                                value={driver.dail_code}
                                onChange={(e) => this.setState({driver: {...driver, dail_code: e.target.value}})}
                              />
                            </div>
                            <div className="col-lg-9">
                              <Input
                                size="small"
                                value={driver.mobile_number}
                                onChange={(e) => this.setState({driver: {...driver, mobile_number: e.target.value}})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Taxi Driver ID
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={driver.driver_extra.license}
                            onChange={(e) => this.setState({driver: {...driver, driver_extra: { ...driver.driver_extra, license: e.target.value }}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Location
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Select style={{ width: '100%' }} size="small" value={driver.driver_location} onChange={(event) => this.setState({ driver: { ...driver, driver_location: event.target.value } })}>
                            {locations.map((location) => (
                              <option key={location._id} value={location._id}>{location.city}</option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          New password
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            type="password"
                            size="small"
                            value={driver.password}
                            onChange={(e) => this.setState({driver: {...driver, password: e.target.value, new_password: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.alignBottom}>
                <Button icon="save" type="primary" onClick={() => this.saveDriver()}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className={`${styles.marginTop10} col-lg-12`}>
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

export default editDriver
