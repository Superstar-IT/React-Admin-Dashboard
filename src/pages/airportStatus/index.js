import React from 'react'
import { Helmet } from 'react-helmet'
import { Radio, Slider, InputNumber, Table, Button, Modal, Input, DatePicker } from 'antd';
import moment from 'moment'
import { get, post } from '../../services/net'
import styles from './style.module.scss';

class airportStatus extends React.Component {

  state = {
    events: [],
    airports: [],
    allAirports: [],
    modalEvent: false,
    modalDelete: false,
    event: {
      name: '',
      from_date: '',
      from_time: '',
      till_date: '',
      till_time: '',
    }
  };

  componentDidMount() {
    this.getAirport();
  }

  getAirport() {
    const url = `${process.env.REACT_APP_API_URL}airportList`;
    get(url).then(json => {
      if (json.success) {
        console.log('showRide', json.data);
        const airports = [];
        airports[0] = this.findAirport(json.data.airports, 'JFK');
        airports[1] = this.findAirport(json.data.airports, 'LGAP5');
        airports[2] = this.findAirport(json.data.airports, 'JFKSHO');
        airports[3] = this.findAirport(json.data.airports, 'LGAP7');
        const airportsToRemove = ['JFK', 'LGAP5', 'JFKSHO', 'LGAP7'];
        const allAirports = json.data.airports.filter(item => !airportsToRemove.includes(item.id));
        this.setState({
          airports,
          allAirports,
          events: json.data.events
        }, () => {console.log('airports', airports);});
        console.log('airports', airports);
        console.log('allAirports', allAirports);
        console.log('events', json.data.events);
      }
      if (!json.success) {
        console.log('failed')
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  onChangeStatus = (value,i) => {
    const {airports} = this.state;
    if (airports[i]) {
      airports[i].status = Number(value);
      this.setState({
        airports
      });
      const params = airports[i];
      const url = `${process.env.REACT_APP_API_URL}saveAirportStatus/${airports[i]}`;
      post(url, params).then(json => {
        console.log('saveAirportStatus', json);
        if (json.success) {
          console.log('success');

        }
        if (!json.success) {
          console.log('failed');
        }
      })
        .catch(err => {
          console.log('err', err);
        });
    }
    console.log('value', value);
  };

  onChangeMovingSpeed = (e, i) => {
    const {airports} = this.state;
    if (airports[i]) {
      airports[i].moving_speed = {
        value: e.target.value
      };
      this.setState({
        airports
      });
      const params = airports[i];
      const url = `${process.env.REACT_APP_API_URL}saveAirportStatus/${airports[i]}`;
      post(url, params).then(json => {
        console.log('saveAirportStatus', json);
        if (json.success) {
          console.log('success');

        }
        if (!json.success) {
          console.log('failed');
        }
      })
        .catch(err => {
          console.log('err', err);
        });
    }
  console.log(`radio checked:${e.target.value}`);
  };

  onChangeMovingSpeedAll = (e, i) => {
    const {allAirports} = this.state;
    if (allAirports[i]) {
      allAirports[i].status = e.target.value;
      this.setState({
        allAirports
      });
      const params = allAirports[i];
      const url = `${process.env.REACT_APP_API_URL}saveAirportStatus/${allAirports[i]}`;
      post(url, params).then(json => {
        console.log('saveAirportStatus', json);
        if (json.success) {
          console.log('success');

        }
        if (!json.success) {
          console.log('failed');
        }
      })
        .catch(err => {
          console.log('err', err);
        });
    }
    console.log(`allAirports:${e.target.value}`);
  };


  findAirport = (array, id) => {
    return array.find((element) => {
      return element.id === id;
    })
  };

  deleteEvent = (value) => {
    console.log('deleteEventId: ', value);

    const url = `${process.env.REACT_APP_API_URL}deleteEvent/${value.id}`;
    post(url).then(json => {
      if (json.success) {
        this.getAirport();
        this.setState({
          modalDelete: false
        });
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  };

  saveEvent = () => {
    const { event } = this.state;

    const from =  `${event.from_date.format('YYYY-MM-DD')} ${event.from_time.format('HH:mm')}`;
    const till =  `${event.till_date.format('YYYY-MM-DD')} ${event.till_time.format('HH:mm')}`;

    const params = {
      id: event.id,
      name: event.name,
      from,
      till
    };

    console.log('params',params);

    const url = `${process.env.REACT_APP_API_URL}saveEvent`;
    post(url, params).then(json => {
      console.log('saveEvent', json);
      if (json.success) {
        this.getAirport();
        this.setState({
          modalEvent: false
        });
        this.getAirport();
        console.log('success');

      }
      if (!json.success) {
        console.log('failed');
      }
    })
      .catch(err => {
        console.log('err', err);
      });

    console.log('name', event.name);
    console.log('from', event.from);
  }

  render() {
    const { allAirports, airports, events, modalEvent, event, modalDelete } = this.state;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'From',
        dataIndex: 'from_date',
        key: 'from_date',
        render: (fromDate) => <div>{fromDate}</div>
      },
      {
        title: 'Till',
        render: (row) => <div>{row.till_date && row.till_date}</div>
      },
      {
        title: 'Action',
        width: '15%',
        render: (row) => <div className="text-center"><Button icon="edit" onClick={() => this.setState({modalEvent:true, event: { id: row._id, name: row.name, from_date: moment(row.from_date,'YYYY-MM-DD HH:mm'), from_time: moment(row.from_date,'YYYY-MM-DD HH:mm'), till_date: moment(row.till_date,'YYYY-MM-DD HH:mm'), till_time: moment(row.till_date,'YYYY-MM-DD HH:mm')}}, () => console.log('event', event))} className="mr-1" size="small">Edit</Button><Button onClick={() => this.setState({modalDelete: true, event: { id: row._id, name: row.name, from_date: moment(row.from_date,'YYYY-MM-DD HH:mm'), from_time: moment(row.from_date,'YYYY-MM-DD HH:mm'), till_date: moment(row.till_date,'YYYY-MM-DD HH:mm'), till_time: moment(row.till_date,'YYYY-MM-DD HH:mm')}})} icon="close" className="mr-1" size="small">Delete</Button></div>,
      },
    ];


    return (
      <div>
        <Modal
          title="Delete"
          visible={modalDelete}
          onOk={() => this.deleteEvent(event)}
          onCancel={() => this.setState({modalDelete: false})}
        >
          <div className="form-group col-12 border-1-grey">
            Are you sure you want to delete event ?
          </div>
        </Modal>
        <Modal
          title="Event"
          visible={modalEvent}
          onOk={() => this.saveEvent()}
          onCancel={() => this.setState({modalEvent: false})}
        >
          <div className="row">
            <div className="form-group col-12 border-1-grey">
              <Input
                placeholder="Event name"
                value={event.name}
                onChange={(e) => this.setState({event : {
                  id: event.id,
                  name: e.target.value,
                  from_date: event.from_date,
                  from_time: event.from_time,
                  till_date: event.till_date,
                  till_time: event.till_time,
                }})}
              />
            </div>
            <div className="form-group col-6 border-1-grey">
              <DatePicker
                style={{width: '100%'}}
                placeholder="Select Start Date"
                size="small"
                value={event.from_date}
                onChange={(value) => this.setState({event : {
                  id: event.id,
                  name: event.name,
                  from_date: value,
                  from_time: event.from_time,
                  till_date: event.till_date,
                  till_time: event.till_time,
                }})}
              />
            </div>
            <div className="form-group col-6 border-1-grey">
              <DatePicker
                style={{width: '100%'}}
                showTime={{ format: 'HH:mm' }}
                format="HH:mm"
                mode="time"
                size="small"
                placeholder="Select Start Time"
                value={event.from_time}
                onChange={(value) => this.setState({event : {
                  id: event.id,
                  name: event.name,
                  from_date: event.from_date,
                  from_time: value,
                  till_date: event.till_date,
                  till_time: event.till_time,
                }})}
              />
            </div>
            <div className="form-group col-6 border-1-grey">
              <DatePicker
                style={{width: '100%'}}
                placeholder="Select End Date"
                size="small"
                value={event.till_date}
                onChange={(value) => this.setState({event : {
                  id: event.id,
                  name: event.name,
                  from_date: event.from_date,
                  from_time: event.from_time,
                  till_date: value,
                  till_time: event.till_time,
                }})}
              />
            </div>
            <div className="form-group col-6 border-1-grey">
              <DatePicker
                style={{width: '100%'}}
                showTime={{ format: 'HH:mm' }}
                format="HH:mm"
                mode="time"
                size="small"
                placeholder="Select End Time"
                value={event.till_time}
                onChange={(value) => this.setState({event : {
                  id: event.id,
                  name: event.name,
                  from_date: event.from_date,
                  from_time: event.from_time,
                  till_date: event.till_date,
                  till_time: value,
                }})}
              />
            </div>
          </div>
        </Modal>
        <Helmet title="Airport Status" />
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-plane" /> AIRPORT STATUS</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    { airports && airports.map((item,i) => (
                      <div key={item.id} className="col-6 my-lg-2">
                        <div className="row">
                          <div className="col-2">
                            <strong>{item.name}</strong>
                          </div>
                          <div className="col-3">
                            <Slider
                              min={0}
                              max={100}
                              step={10}
                              onChange={(value) => this.onChangeStatus(value, i)}
                              value={typeof item.status === 'number' ? item.status : 0}
                            />
                          </div>
                          <div className="col-2">
                            <InputNumber
                              min={0}
                              max={100}
                              style={{ marginLeft: 5 }}
                              value={item.status}
                              onChange={this.onChange}
                            />
                          </div>
                          <div className="col-5">
                            <Radio.Group onChange={(e) => this.onChangeMovingSpeed(e,i)} value={`${item.moving_speed.value}`} buttonStyle="solid" size="small">
                              <Radio.Button value="slow">slow</Radio.Button>
                              <Radio.Button value="med">on/off</Radio.Button>
                              <Radio.Button value="fast">fast</Radio.Button>
                            </Radio.Group>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            Last Update: {item.updated_at}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> DRIVE APP NEWS</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-12">
                      <div className={styles.marginTop10}>
                        <Button type="primary" size="small" onClick={() => this.setState({modalEvent: true})}>Add Event</Button>
                      </div>
                      <br />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <Table
                        className="utils__scrollTable"
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                        columns={columns}
                        dataSource={events}
                        onChange={this.handleTableChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-child" /> PICKUP ZONE STATUS</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    { allAirports && allAirports.map((item, i) => (
                      <div key={item.id} className="col-lg-2 my-lg-2">
                        <div className={styles.marginTop5}><strong>{item.name}</strong></div>
                        <Radio.Group onChange={(e) => this.onChangeMovingSpeedAll(e,i)} defaultValue={`${item.status}`} buttonStyle="solid" size="small">
                          <Radio.Button value="0">0</Radio.Button>
                          <Radio.Button value="50">+</Radio.Button>
                          <Radio.Button value="100">++</Radio.Button>
                        </Radio.Group>
                      </div>
                    ))}
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

export default airportStatus
