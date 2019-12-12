import React from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import { Table, Form, Checkbox, Button, DatePicker, Input, Icon } from 'antd';
import moment from 'moment';
import { post } from '../../../services/net'
import styles from './style.module.scss'

const { RangePicker } = DatePicker;



@Form.create()
class tripsList extends React.Component {

  state = {
    data: [],
    pagination: {pageSizeOptions: ['100', '200'], showSizeChanger: true },
    loading: false,
    autorefresh: true,
    search: [],
    searchableColumns: ['ride_status', 'user', 'driver', 'vehicle_extra'],
    range: [moment(moment().startOf('month').format('MM/DD/YYYY'), 'MM/DD/YYYY'), moment(moment().add(2,'days').format('MM/DD/YYYY'), 'MM/DD/YYYY')],
    pageSize: 100,
  };

  componentDidMount() {
    this.fetch();
    this.setAutorefresh();
  }

  setAutorefresh() {
    this.fetch();
    this.interval = setInterval(() => {
      console.log('setinterlva',new Date());
      this.fetch();
    }, 15000);
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('paginationhandle', pagination);
    const { pagination:pager } = this.state;
    // const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
      pageSize: pagination.pageSize
    }, () => {
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    });
  }

  fetch = (params = {}) => {
    const { pagination, searchableColumns, search, range, pageSize } = this.state;
    console.log('params:', params);
    // this.setState({ loading: true });

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

    console.log('filtered', filtered);
    console.log('pagination', pagination);

    params =  {
          // results: 100,
          filtered,
          pageSize,
          sortBy: {id:"_id", desc: true},
          dateFrom: range[0].format('YYYY-MM-DD').toString(),
          dateTo: range[1].format('YYYY-MM-DD').toString(),
          ...params,
        };

    console.log('params:', params);
    const url = `${process.env.REACT_APP_API_URL}ridesList?page=${params.page}`;

    post(url, params).then(json => {
      console.log('json',json);
      pagination.total = json.data.rides.total;
      pagination.pageSizeOptions = [];
      if (pagination.total > 100) pagination.pageSizeOptions.push('100');
      if (pagination.total > 200) pagination.pageSizeOptions.push('200');
      if (pagination.total > 500) pagination.pageSizeOptions.push('500');
      pagination.pageSizeOptions.push(json.data.rides.total.toString());
      if (!pagination.pageSize || pagination.pageSize === 10) pagination.pageSize = 100;
      console.log('pagination1', pagination);
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

  onSelect = (value) => {
    console.log('onSelect', value);
  };

  handleSearch = (value) => {
    console.log('handleSearch', value);
    this.fetch();
  };

  onInputChange = (e, id) => {
    const {search} = this.state;
    search[id] = e.target.value;
    this.setState({search});
    console.log('searchAll2',search);
  };

  resetFilters = () => {
    console.log('resetfilters');
    this.setState({search: []}, () => this.fetch());
  };

  changeRange = (range) => {
    if (range.length === 0) {
      range = [moment(moment().startOf('month').format('MM/DD/YYYY'), 'MM/DD/YYYY'), moment(moment().add(1,'days').format('MM/DD/YYYY'), 'MM/DD/YYYY')];
    }
    this.setState({range}, () => this.fetch());
    console.log('range', range);
  }

  handleAutoRefreshChange() {
    const { autorefresh } = this.state;
    console.log('toggle',autorefresh);
    if (autorefresh) {
      this.setState({autorefresh: false})
      clearInterval(this.interval);
    } else {
      this.setState({autorefresh: true});
      this.setAutorefresh();
    }
  }

  render() {
    const {
      autorefresh,
      pagination,
      loading,
      data,
      filterDropdownVisible,
      filterDropdownVisible1,
      filterDropdownVisible2,
      filterDropdownVisible3,
      filtered,
      range,
      search,
    } = this.state;

    const columns = [{
      title: 'Date',
      dataIndex: 'booking_date',
      render: bookingDate => <div>{bookingDate.substr(0,8)} {bookingDate.substr(9,5)}</div>,
    }, {
      title: 'Status',
      dataIndex: 'ride_status',
      render: (rideStatus, row) =>
        /* stylelint-disable */
        <div>
          <span className={(rideStatus === 'Completed' || rideStatus === 'Finished') ? `font-size-12 badge badge-success ${styles.width100}`  : (rideStatus === 'Cancelled' && row.cancelled && row.driver.id !== '' && row.cancelled.primary && row.cancelled.primary.by === 'User') ? `font-size-12 badge ${styles.badgeCancPass} ${styles.width100}` : (rideStatus === 'Cancelled' && row.cancelled && row.cancelled.primary && row.cancelled.primary.by === 'Driver') ? `font-size-12 badge badge-danger ${styles.width100}` : (rideStatus === 'Cancelled' && row.cancelled && row.cancelled.primary && row.cancelled.primary.by === 'User' && row.driver.id === '') ? `font-size-12 badge ${styles.badgeNoDriver} ${styles.width100}` : (rideStatus === 'Booked' || rideStatus === 'Confirmed') ? `font-size-12 badge badge-default ${styles.width100}` : (rideStatus === 'Onride' || rideStatus === 'Arrived') ? `font-size-12 badge badge-primary ${styles.width100}` : ''}>{row.cancelled && row.cancelled.primary && row.cancelled.primary.by === 'User' && row.driver.id === '' && 'No driver found'}
            {row.cancelled && row.driver.id !== '' && row.cancelled.primary && rideStatus +' '+ row.cancelled.primary.by}
            {rideStatus !== 'Cancelled' && rideStatus}
          </span>
        </div>,
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={this.refSearchInput}
            placeholder="Search name"
            value={search['ride_status']}
            onChange={(e) => this.onInputChange(e, 'ride_status')}
            onPressEnter={this.handleSearch}
          />
          <Button type="primary" onClick={this.handleSearch}>
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
      dataIndex: 'user',
      render: (user) => user && user.name && user.name,
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={this.refSearchInput}
            placeholder="Search name"
            value={search['user']}
            onChange={(e) => this.onInputChange(e, 'user')}
            onPressEnter={this.handleSearch}
          />
          <Button type="primary" onClick={this.handleSearch}>
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
      dataIndex: 'driver',
      render: (driver) => driver && driver.name && driver.name,
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={this.refSearchInput}
            placeholder="Search name"
            value={search['driver']}
            onChange={(e) => this.onInputChange(e, 'driver')}
            onPressEnter={this.handleSearch}
          />
          <Button type="primary" onClick={this.handleSearch}>
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
            value={search['vehicle_extra']}
            onChange={(e) => this.onInputChange(e, 'vehicle_extra')}
            onPressEnter={this.handleSearch}
          />
          <Button type="primary" onClick={this.handleSearch}>
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
    },
      {
        title: 'Action',
        dataIndex: 'idd',
        render: (idd) => <div><Link to={`/trips/tripDetails/${idd}`}><div className="fa fa-eye" /></Link></div>,
      }];

    return (
      <div>
        <Helmet title="Trips list" />
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
                      <h3>Trips</h3>
                    </div>
                    <div className="col-6">
                      <Checkbox checked={autorefresh} onChange={() => this.handleAutoRefreshChange()}>Autorefresh</Checkbox>
                      <Button icon="filter" onClick={() => this.resetFilters()}>Reset Filters</Button>
                    </div>
                    <div className="col-6">
                      <div className="float-right">
                        <div className="row">
                          <div className="col-1" />
                          <div className="col-2">
                            <div className="float-right">
                              <div className={styles.font18}>Filter:</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="float-right">
                              <RangePicker
                                defaultValue={range}
                                value={range}
                                format='MM/DD/YYYY'
                                onChange={(e) => this.changeRange(e)}
                              />
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="float-right">
                              <a href={`${process.env.REACT_APP_API_URL}exportRidesList?api_token=${JSON.parse(localStorage.getItem('user')).api_token}&dateFrom=${range[0].format('YYYY-MM-DD').toString()}&dateTo=${range[1].format('YYYY-MM-DD').toString()}&ride_status=${search['ride_status']}&user=${search['user']}&driver=${search['driver']}&license=${search['vehicle_extra']}`}><Button icon="download" type="primary" className={`${styles.marginLeft5}`}>Download</Button></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.marginTop10}>
                    <Table
                      className="utils__scrollTable"
                      rowKey={record => record._id}
                      columns={columns}
                      dataSource={data}
                      pagination={pagination}
                      loading={loading}
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

export default tripsList
