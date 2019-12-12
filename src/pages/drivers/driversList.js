import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Input, Icon, Modal } from 'antd';
import { Link } from 'react-router-dom';
import ReactExport from "react-data-export";
import { post, get } from '../../services/net';
import styles from './style.module.scss';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class driversList extends React.Component {

  state = {
    drivers: [],
    pageSize: 100,
    sortBy: {id:"_id", desc: true},
    filterDropdownVisible: false,
    filterDropdownVisible1: false,
    filterDropdownVisible2: false,
    filterDropdownVisible3: false,
    filterDropdownVisible5: false,
    filterDropdownVisible6: false,
    filtered: '',
    pagination: {pageSizeOptions: ['10', '50', '100', '200'], showSizeChanger: true },
    search: [],
    searchableColumns: ['driver_name', 'last_name', 'email', 'mobile_number', 'payout', 'verify_status'],
    modalTrips: false,
    driverRides: [],
    timeout: 0
  };

  componentDidMount() {
    this.getDriversList();
  }

  handleSearch = (value) => {
    console.log('value', value);
    this.getDriversList();
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { pagination:pager } = this.state;
    let { sortBy } = this.state;
    // const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    if (sorter.columnKey !== undefined) {
      sortBy = {
        id: sorter.columnKey,
        desc: sorter.order !== 'ascend'
      };
    } else {
      sortBy = {id:"_id", desc: true}
    }

    this.setState({
      sortBy
    }, () => this.getDriversList())

    console.log('sortBy', sortBy);

    console.log('sorter', sorter);
    console.log('filters', filters);
    console.log('pagination', pagination);
    console.log('pager', pager);
    // this.fetch({
    //   results: pagination.pageSize,
    //   page: pagination.current,
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   ...filters,
    // });
  }

  getDriverRidesList = (id) => {
    const url = `${process.env.REACT_APP_API_URL}driverRidesList/${id}`;
    get(url).then(json => {
      console.log('jsongetDriverRidesList', json);
      if (json.success) {
        this.setState({
          driverRides: Array.from(json.data.rides),
        })
      }
      if (!json.success) {
        console.log('fail');
      }
    })
  }

  getDriversList = (page) => {
    const { pageSize, sortBy, search, searchableColumns } = this.state;

    console.log('page', page);
    console.log('search', search);

    const filtered = [];

    searchableColumns.map((item) => {
      if (search[item]) {
        filtered.push({
          id: item,
          value: search[item]
        });
      }
      return 1;
    });

    const parameters = {
      filtered,
      pageSize,
      sortBy
    };
    console.log('params', parameters);
    const url = `${process.env.REACT_APP_API_URL}driversList?page=0`;
    post(url, parameters).then(json => {
      console.log('json', json);
      if (json.success) {
        const {pagination} = this.state;
        pagination.total = json.data.drivers.total;
        this.setState({
          drivers: Array.from(json.data.drivers.data),
          pagination
          // page: (json.data.drivers.current_page-1),
          // pages: json.data.drivers.last_page,
          // pageSize: json.data.drivers.per_page,
        })
      }
      if (!json.success) {
        console.log('fail');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  };

  updateDriverStatus = (id, type, action) => {
    let params = {};

    if (type === 'status') {
      if (action === 'Active') {
        params = {
          'status': 'Inactive'
        }
      } else {
        params = {
          'status': 'Active'
        }
      }
    }

    if (type === 'verify_status') {
      if (action === 'Yes') {
        params = {
          'verify_status': 'No'
        }
      } else {
        params = {
          'verify_status': 'Yes'
        }
      }

    }
    const url = `${process.env.REACT_APP_API_URL}saveDriver/${id}`;
    post(url , params).then(json => {
      if (json.success) {
        this.getDriversList();
      }
      if (!json.success) {
        console.log('save failed');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  };

  onInputChange = (e, id) => {
    let { timeout } = this.state;
    const { search } = this.state;
    search[id] = e.target.value;
    this.setState({
      search,
    }, () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.getDriversList();
      }, 250);
      this.setState({timeout});
    });
  };

  resetFilters = () => {
    console.log('resetfilters');
    this.setState({search: [], sortBy: {id:"_id", desc: true}}, () => this.getDriversList());
  };

  render() {
    const {
      drivers,
      filterDropdownVisible,
      filterDropdownVisible1,
      filterDropdownVisible2,
      filterDropdownVisible3,
      filterDropdownVisible5,
      filterDropdownVisible6,
      filtered,
      pagination,
      search,
      modalTrips,
      driverRides,
      sortBy
    } = this.state;

    const columnsRides = [
      {
        title: 'Date',
        dataIndex: 'booking_date',
        render: bookingDate => <div className="text-center">{bookingDate.substr(0,8)} {bookingDate.substr(9,5)}</div>,
      }, {
        title: 'Status',
        dataIndex: 'ride_status',
        render: (rideStatus, row) =>
          /* stylelint-disable */
          <div className="text-center">
            <span className={(rideStatus === 'Completed' || rideStatus === 'Finished') ? 'font-size-12 badge badge-success' : (rideStatus === 'Cancelled') ? 'font-size-12 badge badge-danger' : (rideStatus === 'Booked') ? 'font-size-12 badge badge-default' : (rideStatus === 'Onride' || rideStatus === 'Arrived') ? 'font-size-12 badge badge-primary' : ''}>{row.cancelled && row.cancelled.primary && row.cancelled.primary.by === 'User' && row.driver.id === '' && 'No driver found'}
              {row.cancelled && row.driver.id !== '' && row.cancelled.primary && rideStatus + " by " + row.cancelled.primary.by}
              {rideStatus !== 'Cancelled' && rideStatus}
            </span>
          </div>,
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
        render: (user) => user && user.name && user.name,
      },{
        title: 'Driver',
        dataIndex: 'driver',
        render: (driver) => driver && driver.name && driver.name,
      },{
        title: 'Number',
        dataIndex: 'vehicle_extra',
        render: vehicleExtra => vehicleExtra && vehicleExtra.license,
      }
    ];

    const columns = [
      {
        title: 'First Name',
        dataIndex: 'driver_name',
        key: 'driver_name',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['driver_name']}
              onChange={(e) => this.onInputChange(e, 'driver_name')}
              onPressEnter={() => {this.setState({filterDropdownVisible: false}); this.handleSearch(); }}
            />
            <Button type="primary" onClick={() => {this.setState({filterDropdownVisible: false}); this.handleSearch(); }}>
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
      },
      {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['last_name']}
              onChange={(e) => this.onInputChange(e, 'last_name')}
              onPressEnter={() => {this.setState({filterDropdownVisible1: false}); this.handleSearch(); }}
            />
            <Button type="primary" onClick={() => {this.setState({filterDropdownVisible1: false}, ()=> this.handleSearch()); }}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: filterDropdownVisible1,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible1: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Phone',
        dataIndex: 'mobile_number',
        render: (mobileNumber, row) => <div>({row.dail_code}) {mobileNumber}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['mobile_number']}
              onChange={(e) => this.onInputChange(e, 'mobile_number')}
              onPressEnter={() => {this.setState({filterDropdownVisible2: false}); this.handleSearch(); }}
            />
            <Button type="primary" onClick={() => {this.setState({filterDropdownVisible2: false}); this.handleSearch(); }}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: filterDropdownVisible2,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible2: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['email']}
              onChange={(e) => this.onInputChange(e, 'email')}
              onPressEnter={() => {this.setState({filterDropdownVisible3: false}); this.handleSearch(); }}
            />
            <Button type="primary" onClick={() => {this.setState({filterDropdownVisible3: false}); this.handleSearch(); }}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: filterDropdownVisible3,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible3: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Signup',
        dataIndex: 'signup',
        key: 'signup',
        render: (signup) => <div>{signup.substr(0,8)} <br /> {signup.substr(9,5)}</div>
      },
      {
        title: 'Trips',
        dataIndex: 'no_of_rides',
        key: 'no_of_rides',
        sorter: (a, b) => a.quantity - b.quantity,
        sortOrder: sortBy.id==='no_of_rides' ? sortBy.desc ? 'descend': 'ascend' : false,
        render: (noOfRides, row) => <div><a role="presentation" onClick={() => this.setState({modalTrips: true}, this.getDriverRidesList(row._id))} onKeyDown={() => this.setState({modalTrips: true})}>{noOfRides - row.cancelled_rides}</a></div>
      },
      {
        title: 'Canc',
        dataIndex: 'cancelled_rides',
        key: 'cancelled_rides',
        sorter: (a, b) => a.quantity - b.quantity,
        sortOrder: sortBy.id==='cancelled_rides' ? sortBy.desc ? 'descend': 'ascend' : false,
        render: (cancelledRides) => <div>{cancelledRides}</div>
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'avg_review',
        sorter: (a, b) => a.quantity - b.quantity,
        sortOrder: sortBy.id==='avg_review' ? sortBy.desc ? 'descend': 'ascend' : false,
        render: (rating) => <div>{rating}</div>
      },
      {
        title: 'LastOnline',
        dataIndex: 'ping',
        key: 'ping',
        render: (ping) => <div>{ping.substr(0,8)} <br /> {ping.substr(9,5)}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
        sortOrder: sortBy.id==='ping' ? sortBy.desc ? 'descend': 'ascend' : false,
      },
      {
        title: 'Online',
        dataIndex: 'online',
        key: 'online',
        render: (online) => <div>{online === 'Yes' ? <span className={styles.dotGreen} /> : <span className={styles.dotRed} />} </div>,
        sorter: (a, b) => a.quantity - b.quantity,
        sortOrder: sortBy.id==='online' ? sortBy.desc ? 'descend': 'ascend' : false,
      },
      {
        title: 'Info',
        dataIndex: 'payout',
        key: 'payout',
        render: (payout) => <div>{payout !== null ? `Yes` : `No`}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['payout']}
              onChange={(e) => this.onInputChange(e, 'payout')}
              onPressEnter={() => {this.setState({filterDropdownVisible5: false}); this.handleSearch(); }}
            />
            <Button type="primary" onClick={() => {this.setState({filterDropdownVisible5: false}); this.handleSearch(); }}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: filterDropdownVisible5,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible5: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Verif',
        dataIndex: 'verify_status',
        key: 'verify_status',
        render: (verifyStatus, row) => <a role="presentation" onKeyDown={() => this.updateDriverStatus(row._id, 'verify_status', verifyStatus)} onClick={() => this.updateDriverStatus(row._id, 'verify_status', verifyStatus)}><span className={(verifyStatus === 'Yes') ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'}>{verifyStatus}</span></a>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['verify_status']}
              onChange={(e) => this.onInputChange(e, 'verify_status')}
              onPressEnter={() => {this.setState({filterDropdownVisible6: false}); this.handleSearch(); }}
            />
            <Button type="primary" onClick={() => {this.setState({filterDropdownVisible6: false}); this.handleSearch(); }}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: filterDropdownVisible6,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible6: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Action',
        dataIndex: '_id',
        render: (id) => <div className="text-center"><Link to={`/drivers/driver/${id}/edit`}><Button icon="bank" className="mr-1" size="small" /></Link><Link to={`/drivers/driver/${id}`}><Button icon="eye" className="mr-1" size="small" /></Link></div>,
      },
    ];


    return (
      <div>
        <Modal
          title="Drivers trips"
          visible={modalTrips}
          width="80%"
          onOk={() => this.setState({modalTrips: false})}
          onCancel={() => this.setState({modalTrips: false})}
        >
          <div className="form-group col-12 border-1-grey">
            <div>
              <Table
                rowKey={record => record._id}
                className="utils__scrollTable"
                scroll={{ x: '100%' }}
                columns={columnsRides}
                dataSource={driverRides}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Modal>
        <Helmet title="Drivers list" />
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Drivers list</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-12">
                      <div className="float-left">
                        <Button icon="filter" onClick={() => this.resetFilters()}>Reset Filters</Button>
                      </div>
                      <div className="float-right">
                        <ExcelFile element={<Button icon="download" type="primary">Download</Button>}>
                          <ExcelSheet data={drivers} name="Drivers">
                            <ExcelColumn label="First Name" value="driver_name" />
                            <ExcelColumn label="Last Name" value="last_name" />
                            <ExcelColumn label="Phone" value="mobile_number" />
                            <ExcelColumn label="Email" value="email" />
                            <ExcelColumn label="Signup" value="signup" />
                            <ExcelColumn label="Trips Total" value="no_of_rides" />
                            <ExcelColumn label="Trips Cancelled" value="cancelled_rides" />
                            <ExcelColumn label="Rating" value="rating" />
                            <ExcelColumn label="Last Online" value="ping" />
                            <ExcelColumn label="Personal Information" value={(col) => col.payout !== null ? "Yes" : "No"} />
                            <ExcelColumn label="Verified" value="verify_status" />
                          </ExcelSheet>
                        </ExcelFile>
                        <a href={`${process.env.REACT_APP_API_URL}exportAllDriversList?api_token=${JSON.parse(localStorage.getItem('user')).api_token}`}><Button icon="download" type="primary" className={`${styles.marginLeft5}`}>Download all</Button></a>
                        <br /><br />
                      </div>
                    </div>
                  </div>
                  <div className={styles.marginTop10}>
                    <Table
                      rowKey={record => record._id}
                      className="utils__scrollTable"
                      scroll={{ x: '100%' }}
                      columns={columns}
                      dataSource={drivers}
                      pagination={pagination}
                      onChange={this.handleTableChange}
                    />
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

export default driversList
