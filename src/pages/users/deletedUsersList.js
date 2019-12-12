import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Input, Icon } from 'antd';
import { post } from '../../services/net'
import styles from './style.module.scss';

class deletedUsersList extends React.Component {

  state = {
    users: [],
    pageSize: 100,
    sortBy: {id:"_id", desc: true},
    searchText: '',
    filterDropdownVisible: '',
    filterDropdownVisible1: '',
    filterDropdownVisible2: '',
    filterDropdownVisible3: '',
    filterDropdownVisible4: '',
    filtered: ''
  };

  componentDidMount() {
    this.getUsersList();
  }

  getUsersList = (page, filtered) => {
    const { pageSize, sortBy } = this.state;

    const parameters = {
      filtered,
      pageSize,
      sortBy
    };
    console.log('params', parameters);
    const url = `${process.env.REACT_APP_API_URL}deletedUsersList?page=0`;
    post(url, parameters).then(json => {
      console.log('json', json);
      if (json.success) {
        this.setState({
          users: Array.from(json.data.users.data),
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

  render() {
    const {
      users,
      searchText,
      filterDropdownVisible,
      filterDropdownVisible1,
      filterDropdownVisible2,
      filterDropdownVisible3,
      filterDropdownVisible4,
      filtered
    } = this.state;

    const columns = [
      {
        title: 'First Name',
        dataIndex: 'user_name',
        key: 'user_name',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
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
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
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
        dataIndex: 'phone_number',
        render: (phoneNumber, row) => <div>({row.country_code}) {phoneNumber}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
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
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
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
        render: (signup) => <div className="text-center">{signup.substr(0,8)} <br /> {signup.substr(9,5)}</div>
      },
      {
        title: 'Last time online',
        dataIndex: 'active',
        key: 'active',
        render: (active) => <div className="text-center">{active.substr(0,8)} <br /> {active.substr(9,5)}</div>
      },
      {
        title: 'Trips',
        dataIndex: 'no_of_rides',
        key: 'no_of_rides',
        render: (noOfRides) => <div className="text-center">{noOfRides}</div>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <div className="text-center"><span className={(status === 'Yes') ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'}>{status}</span></div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible4,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible4: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: () => <div className="text-center"><Button icon="edit" className="mr-1" size="small" /><Button icon="eye" className="mr-1" size="small" /><Button icon="close" className="mr-1 text-danger" size="small" /></div>,
      },
    ];


    return (
      <div>
        <Helmet title="Users list" />
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Deleted Users list</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-12">
                      <div className="float-right">
                        <Button icon="download" type="primary" className={styles.marginLeft5}>Download</Button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.marginTop10}>
                    <Table
                      className="utils__scrollTable"
                      scroll={{ x: '100%' }}
                      columns={columns}
                      dataSource={users}
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

export default deletedUsersList
