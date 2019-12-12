import React from 'react'
import { Helmet } from 'react-helmet'
import { Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { get } from '../../services/net'
import styles from './style.module.scss';

class viewFleet extends React.Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      fleetId: match.params.id,
      fleet: {
        name: '',
        address: '',
        phone: '',
        email: '',
        account: '',
        routing: '',
      },
      licenses: []
    };
  }

  componentDidMount() {
    const { fleetId } = this.state;
    this.fetch(fleetId);
  }

  fetch = (fleetId) => {
    console.log('driverId', fleetId);
    const url = `${process.env.REACT_APP_API_URL}editFleet/${fleetId}`;
    get(url).then(json => {
      if (json.success) {
        console.log('rides',json.data.rides);
        this.setState({
          fleet: json.data.fleet,
          licenses: json.data.licenses,
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

    const { fleet, licenses } = this.state;

    return (
      <div>
        <Helmet title="Fleet Info" />
        <div className="row">
          <div className={`${styles.colLg4} col-lg-4`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Fleet</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Company
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.name}
                            onChange={(e) => this.setState({fleet: {...fleet, name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Contact
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.phone}
                            onChange={(e) => this.setState({fleet: {...fleet, phone: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Owner</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Company
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.name}
                            onChange={(e) => this.setState({fleet: {...fleet, name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Contact
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.phone}
                            onChange={(e) => this.setState({fleet: {...fleet, phone: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Address</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Address
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.address}
                            onChange={(e) => this.setState({fleet: {...fleet, address: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          City
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.phone}
                            onChange={(e) => this.setState({fleet: {...fleet, phone: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          ZIP / State
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.email}
                            onChange={(e) => this.setState({fleet: {...fleet, email: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Bank information</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Account
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.account}
                            onChange={(e) => this.setState({fleet: {...fleet, account: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Routing
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={fleet.routing}
                            onChange={(e) => this.setState({fleet: {...fleet, routing: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className={`${styles.marginTop10} col-lg-12`}>
                      <div className="pull-right">
                        <Button icon="save" type="primary" onClick={() => this.saveUser()}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg8} col-lg-8`}>
            <div className="row">
              <div className="col-lg-12">
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.utils__title}>
                      <strong><span className="fa fa-edit" /> Fleet Info</strong>
                    </div>
                    <div className={styles.cardBody}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Owner</th>
                                  <th>License No</th>
                                  <th>Type</th>
                                  <th>Vehicle Type</th>
                                  <th>Model</th>
                                  <th>Year</th>
                                </tr>
                              </thead>
                              <tbody>
                                {licenses.map((item) => (
                                  <tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>{item.license_number}</td>
                                    <td>{item.medallion_type}</td>
                                    <td>{item.vehicle_type}</td>
                                    <td>{item.vehicle_model}</td>
                                    <td>{item.model_year != null ? item.model_year : item.vehicle_year.substr(0,4)}</td>
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
              <div className={`${styles.colLg6L} col-lg-6`}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.utils__title}>
                      <strong><span className="fa fa-edit" /> Surcharge Info</strong>
                    </div>
                    <div className={styles.cardBody}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Balance</th>
                                  <th>MTA Tax</th>
                                  <th>Cong Tax</th>
                                  <th>Last Update</th>
                                </tr>
                              </thead>
                              <tbody>
                                {licenses.map((item) => (
                                  <tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>{item.license_number}</td>
                                    <td>{item.medallion_type}</td>
                                    <td>{item.vehicle_type}</td>
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
              <div className={`${styles.colLg6R} col-lg-6`}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.utils__title}>
                      <strong><span className="fa fa-edit" /> Payment History</strong>
                    </div>
                    <div className={styles.cardBody}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Paid</th>
                                  <th>MTA Tax</th>
                                  <th>Cong Tax</th>
                                  <th>Total</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {licenses.map((item) => (
                                  <tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>{item.license_number}</td>
                                    <td>{item.medallion_type}</td>
                                    <td>{item.vehicle_type}</td>
                                    <td>{item.vehicle_model}</td>
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
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Link to="/fleets/fleetsList">
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

export default viewFleet
