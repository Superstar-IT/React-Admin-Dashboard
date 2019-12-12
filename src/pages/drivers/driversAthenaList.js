import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Input, Icon } from 'antd';
import { Link } from 'react-router-dom';
import ReactExport from "react-data-export";
import { post } from '../../services/net'
import styles from './style.module.scss';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class driversAthenaList extends React.Component {

  state = {
    drivers: [],
    pageSize: 100,
    sortBy: {id:"_id", desc: true},
    filterDropdownVisible: '',
    filterDropdownVisible1: '',
    filterDropdownVisible2: '',
    filterDropdownVisible3: '',
    filterDropdownVisible5: '',
    filterDropdownVisible6: '',
    filtered: '',
    pagination: {pageSizeOptions: ['10', '50', '100', '200'], showSizeChanger: true },
    search: [],
    searchableColumns: ['first_name', 'last_name', 'email', 'mobile_number', 'payout', 'verify_status']
  };

  componentDidMount() {
    this.getDriversList();
  }

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
  }

  handleSearch = (value) => {
    console.log('value', value);
    this.getDriversList();
  };

  getDriversList = (page) => {
    const { pageSize, sortBy, search, searchableColumns } = this.state;

    const filtered = [];

    console.log('page', page);

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
    const url = `${process.env.REACT_APP_API_URL}athenaDriversList?page=0`;
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

  onInputChange = (e, id) => {
    const {search} = this.state;
    search[id] = e.target.value;
    this.setState({search});
    console.log('searchAll2',search);
  };


  resetFilters = () => {
    console.log('resetfilters');
    this.setState({search: []}, () => this.getDriversList());
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
      search,
      pagination
    } = this.state;

    const columns = [
      {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['first_name']}
              onChange={(e) => this.onInputChange(e, 'first_name')}
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
        render: (noOfRides) => <div>{noOfRides}</div>
      },
      {
        title: 'Canc',
        dataIndex: 'cancelled_rides',
        key: 'cancelled_rides',
        sorter: (a, b) => a.quantity - b.quantity,
        render: (cancelledRides) => <div>{cancelledRides}</div>
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        sorter: (a, b) => a.quantity - b.quantity,
        render: (rating) => <div>{rating}</div>
      },
      {
        title: 'LastOnline',
        dataIndex: 'ping',
        key: 'ping',
        render: (ping) => <div>{ping.substr(0,8)} <br /> {ping.substr(9,5)}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Online',
        dataIndex: 'availability',
        key: 'availability',
        render: (availability) => <div>{availability === 'Yes' ? <span className={styles.dotGreen} /> : <span className={styles.dotRed} />} </div>,
        sorter: (a, b) => a.quantity - b.quantity,
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
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible5,
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
        render: (verifyStatus) => <div><span className={(verifyStatus === 'Yes') ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'}>{verifyStatus}</span></div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['verify_status']}
              onChange={(e) => this.onInputChange(e, 'verify_status')}
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible6,
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
        render: (id) => <div><Link to={`/drivers/driver/${id}`}><Button icon="eye" className="mr-1" size="small" /></Link></div>,
      },
    ];


    return (
      <div>
        <Helmet title="Drivers list" />
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Athena Drivers list</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-12">
                      <div className="float-left">
                        <Button icon="filter" onClick={() => this.resetFilters()}>Reset Filters</Button>
                      </div>
                      <div className="float-right">
                        <ExcelFile element={<Button icon="download" type="primary">Export</Button>}>
                          <ExcelSheet data={drivers} name="Drivers">
                            <ExcelColumn label="First Name" value="first_name" />
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
                        <a href={`${process.env.REACT_APP_API_URL}exportAllDriversList?api_token=${JSON.parse(localStorage.getItem('user')).api_token}`}><Button icon="download" type="primary" className={`${styles.marginLeft5}`}>Export all</Button></a>
                        <br /><br />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className={styles.marginTop10}>
                        <Table
                          className="utils__scrollTable"
                          rowKey={record => record._id}
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
        </div>
      </div>
    )
  }
}

export default driversAthenaList
