import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Input, Icon, Modal } from 'antd';
import ReactExport from "react-data-export";
import { Link } from 'react-router-dom';
import { post } from '../../services/net'
import styles from './style.module.scss';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class usersList extends React.Component {

  state = {
    users: [],
    pageSize: 100,
    sortBy: {id:"_id", desc: true},
    filterDropdownVisible: '',
    filterDropdownVisible1: '',
    filterDropdownVisible2: '',
    filterDropdownVisible3: '',
    filterDropdownVisible4: '',
    filtered: '',
    pagination: {pageSizeOptions: ['10', '50', '100', '200'], showSizeChanger: true },
    search: [],
    searchableColumns: ['user_name', 'last_name', 'email', 'phone_number', 'status'],
    modalDelete: false,
    selectedUser: null,
  };

  componentDidMount() {
    this.getUsersList();
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
    }, () => this.getUsersList())
  }

  handleSearch = (value) => {
    console.log('value', value);
    this.getUsersList();
  };

  getUsersList = (page) => {
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
    const url = `${process.env.REACT_APP_API_URL}usersList?page=0`;
    post(url, parameters).then(json => {
      console.log('json', json);
      if (json.success) {
        const {pagination} = this.state;
        pagination.total = json.data.users.total;
        this.setState({
          users: Array.from(json.data.users.data),
          pagination,
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
    this.setState({search: []}, () => this.getUsersList());
  };

  deleteUser = (value) => {
    console.log('deleteUserId: ', value);

    const params = {
      'status': 'Deleted'
    };

    const url = `${process.env.REACT_APP_API_URL}saveUser/${value}`;
    post(url, params).then(json => {
      if (json.success) {
        this.getUsersList();
        this.setState({
          modalDelete: false
        });
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  };

  render() {
    const {
      users,
      filterDropdownVisible,
      filterDropdownVisible1,
      filterDropdownVisible2,
      filterDropdownVisible3,
      filterDropdownVisible4,
      filtered,
      search,
      pagination,
      modalDelete,
      selectedUser
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
              value={search['user_name']}
              onChange={(e) => this.onInputChange(e, 'user_name')}
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
        dataIndex: 'phone_number',
        render: (phoneNumber, row) => <div>({row.country_code}) {phoneNumber}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['phone_number']}
              onChange={(e) => this.onInputChange(e, 'phone_number')}
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
        title: 'Last time online',
        dataIndex: 'active',
        key: 'active',
        sorter: (a, b) => a.quantity - b.quantity,
        render: (active) => <div>{active.substr(0,8)} <br /> {active.substr(9,5)}</div>
      },
      {
        title: 'Trips',
        dataIndex: 'no_of_rides',
        key: 'no_of_rides',
        sorter: (a, b) => a.quantity - b.quantity,
        render: (noOfRides) => <div>{noOfRides}</div>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <div><span className={(status === 'Active') ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'}>{status}</span></div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['status']}
              onChange={(e) => this.onInputChange(e, 'status')}
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
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
        dataIndex: '_id',
        render: (id) => <div><Link to={`/users/user/${id}/edit`}><Button icon="edit" className="mr-1" size="small" /></Link><Link to={`/users/user/${id}`}><Button icon="eye" className="mr-1" size="small" /></Link><Button onClick={() => this.setState({modalDelete: true, selectedUser: id})} icon="close" className="mr-1 text-danger" size="small" /></div>,
      },
    ];


    return (
      <div>
        <Helmet title="Users list" />
        <Modal
          title="Delete"
          visible={modalDelete}
          onOk={() => this.deleteUser(selectedUser)}
          onCancel={() => this.setState({modalDelete: false})}
        >
          <div className="form-group col-12 border-1-grey">
            Are you sure you want to delete user ?
          </div>
        </Modal>
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Users list</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-12">
                      <div className="float-left">
                        <Button icon="filter" onClick={() => this.resetFilters()}>Reset Filters</Button>
                        <span className={styles.marginLeft5}>Total users: {pagination.total}</span>
                      </div>
                      <div className="float-right">
                        <ExcelFile element={<Button icon="download" type="primary">Download</Button>}>
                          <ExcelSheet data={users} name="Users">
                            <ExcelColumn label="First Name" value="user_name" />
                            <ExcelColumn label="Last Name" value="last_name" />
                            <ExcelColumn label="Country Code" value="country_code" />
                            <ExcelColumn label="Phone" value="phone_number" />
                            <ExcelColumn label="Email" value="email" />
                            <ExcelColumn label="Signup" value="signup" />
                            <ExcelColumn label="Last Time Online" value="active" />
                            <ExcelColumn label="No of trips" value="no_of_rides" />
                            <ExcelColumn label="Status" value="status" />
                          </ExcelSheet>
                        </ExcelFile>
                        <a href={`${process.env.REACT_APP_API_URL}exportAllUsersList?api_token=${JSON.parse(localStorage.getItem('user')).api_token}`}><Button icon="download" type="primary" className={`${styles.marginLeft5}`}>Download all</Button></a>
                        <br /><br />
                      </div>
                    </div>
                  </div>
                  <div className={styles.marginTop10}>
                    <Table
                      className="utils__scrollTable"
                      rowKey={record => record._id}
                      scroll={{ x: '100%' }}
                      columns={columns}
                      dataSource={users}
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

export default usersList
