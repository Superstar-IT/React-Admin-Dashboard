import React from 'react'
import { Helmet } from 'react-helmet'
import { Progress, Input } from 'antd';
import AvailableMap from './map';
import { post } from '../../services/net'
import styles from './style.module.scss'

class driversMap extends React.Component {

  state = {
    searchDrivers: '',
    availableDrivers: [],
    timeout: 0
  };

  componentDidMount() {
    this.setAutorefresh();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSearch(event) {
    let { timeout } = this.state;
    const searchText = event.target.value;
    this.setState({
      searchDrivers: searchText
    }, () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.getAvailableDrivers();
      }, 1000);
    });
  }

  getAvailableDrivers() {
    const {searchDrivers} = this.state;
    const url = `${process.env.REACT_APP_API_URL}availableDrivers`;

    const params = {
      search: searchDrivers
    };

    post(url, params, true).then(json => {
      console.log('json', json);
      if (json.success) {
        console.log('availableDrivers', json.data.drivers);
        this.setState({
          availableDrivers: Array.from(json.data.drivers),
          widgetOnlineTaxi: json.data.widgetOnlineTaxi,
          widgetOnlineAthenaTaxi: json.data.widgetOnlineAthenaTaxi,
          widgetOnlineShl: json.data.widgetOnlineShl,
          widgetPickup: json.data.widgetPickup,
          widgetOnTrip: json.data.widgetOnTrip,
          widgetOfflineTaxi: json.data.widgetOfflineTaxi,
          widgetOfflineAthenaTaxi: json.data.widgetOfflineAthenaTaxi,
          widgetOfflineShl: json.data.widgetOfflineShl,
        })
      }
      if (!json.success) {
        console.log('fail');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  setAutorefresh() {
    this.getAvailableDrivers();
    this.interval = setInterval(() => {
      console.log('setinterlva',new Date());
      this.getAvailableDrivers();
    }, 15000);
  }

  render() {
    const {
        searchDrivers,
        availableDrivers,
        widgetOnlineTaxi,
        widgetOnlineAthenaTaxi,
        widgetOnlineShl,
        widgetPickup,
        widgetOnTrip,
        widgetOfflineTaxi,
        widgetOfflineAthenaTaxi,
        widgetOfflineShl
    } = this.state;
    return (
      <div>
        <Helmet title="Users list" />
        <div className="row">
          <div className={`${styles.colLg2} col-lg-2`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.head}>
                  <div className={styles.name}>
                    <h2 className={styles.title}>Online App </h2>
                  </div>
                  <div className={`${styles.value} text-primary`}>
                    <span style={{ color: '#ffc107' }}>{widgetOnlineTaxi}</span><span style={{color: '#b8beca'}}>/{widgetOfflineTaxi}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className="progressCard__line">
                    <Progress
                      type="line"
                      percent={Number((widgetOnlineTaxi/widgetOfflineTaxi)*100)}
                      showInfo={false}
                      strokeWidth={8}
                      strokeColor="#ffc107"
                    />
                  </div>
                  <div className={styles.lineDescr}>
                    <span>Drivers</span>
                    <span>{Number((widgetOnlineTaxi/widgetOfflineTaxi)*100).toFixed(0)} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.head}>
                  <div className={styles.name}>
                    <h2 className={styles.title}>Online Taxi OS </h2>
                  </div>
                  <div className={`${styles.value} text-primary`}>
                    <span style={{ color: '#dc3545' }}>{widgetOnlineAthenaTaxi}</span><span style={{color: '#b8beca'}}>/{widgetOfflineAthenaTaxi}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className="progressCard__line">
                    <Progress
                      type="line"
                      percent={Number((widgetOnlineAthenaTaxi/widgetOfflineAthenaTaxi)*100)}
                      showInfo={false}
                      strokeWidth={8}
                      strokeColor="#dc3545"
                    />
                  </div>
                  <div className={styles.lineDescr}>
                    <span>Drivers</span>
                    <span>{Number((widgetOnlineAthenaTaxi/widgetOfflineAthenaTaxi)*100).toFixed(0)} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.head}>
                  <div className={styles.name}>
                    <h2 className={styles.title}>Online SHL </h2>
                  </div>
                  <div className={`${styles.value} text-primary`}>
                    <span style={{ color: '#28a745' }}>{widgetOnlineShl}</span><span style={{color: '#b8beca'}}>/{widgetOfflineShl}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className="progressCard__line">
                    <Progress
                      type="line"
                      percent={Number((widgetOnlineShl/widgetOfflineShl)*100)}
                      showInfo={false}
                      strokeWidth={8}
                      strokeColor="#28a745"
                    />
                  </div>
                  <div className={styles.lineDescr}>
                    <span>Drivers</span>
                    <span>{Number((widgetOnlineShl/widgetOfflineShl)*100).toFixed(0)} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.head}>
                  <div className={styles.name}>
                    <h2 className={styles.title}>Online Total </h2>
                  </div>
                  <div className={`${styles.value} text-primary`}>
                    <span style={{ color: '#343a40' }}>{Number(widgetOnlineShl+widgetOnlineAthenaTaxi+widgetOnlineTaxi)}</span><span style={{color: '#b8beca'}}>/{Number(widgetOfflineShl+widgetOfflineAthenaTaxi+widgetOfflineTaxi)}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className="progressCard__line">
                    <Progress
                      type="line"
                      percent={Number((Number(widgetOnlineShl+widgetOnlineAthenaTaxi+widgetOnlineTaxi)/Number(widgetOfflineShl+widgetOfflineAthenaTaxi+widgetOfflineTaxi))*100)}
                      showInfo={false}
                      strokeWidth={8}
                      strokeColor="#343a40"
                    />
                  </div>
                  <div className={styles.lineDescr}>
                    <span>Drivers</span>
                    <span>{Number((Number(widgetOnlineShl+widgetOnlineAthenaTaxi+widgetOnlineTaxi)/Number(widgetOfflineShl+widgetOfflineAthenaTaxi+widgetOfflineTaxi))*100).toFixed(0)} %</span>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.head}>
                  <div className={styles.name}>
                    <h2 className={styles.title}>Pickup</h2>
                  </div>
                  <div className={`${styles.value} text-primary`}>
                    <span style={{ color: '#FF8C00' }}>{widgetPickup}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className="progressCard__line">
                    <Progress
                      type="line"
                      percent="100"
                      showInfo={false}
                      strokeWidth={8}
                      strokeColor="#FF8C00"
                    />
                  </div>
                  <div className={styles.lineDescr}>
                    <span>Trips</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.head}>
                  <div className={styles.name}>
                    <h2 className={styles.title}>On trip</h2>
                  </div>
                  <div className={`${styles.value} text-primary`}>
                    <span style={{ color: '#007bff' }}>{widgetOnTrip}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className="progressCard__line">
                    <Progress
                      type="line"
                      percent="100"
                      showInfo={false}
                      strokeWidth={8}
                      strokeColor="#007bff"
                    />
                  </div>
                  <div className={styles.lineDescr}>
                    <span>Trips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg10} col-lg-10`}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardBody}>
                  <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
                    <AvailableMap availableDrivers={availableDrivers} />
                    <div className={styles.over_map}>
                      <Input
                        value={searchDrivers}
                        onChange={(e) => this.onSearch(e)}
                        placeholder="Medallion/Last Name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default driversMap
