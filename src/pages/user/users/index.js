import React from 'react'
import { Helmet } from 'react-helmet'
import { Table } from 'antd';
import { post } from '../../../services/net'

const columns = [{
  title: 'Name',
  dataIndex: 'last_name',
  sorter: true,
  render: lastName => `${lastName}`,
  width: '20%',
}, {
  title: 'Gender',
  dataIndex: 'gender',
  filters: [
    { text: 'Male', value: 'male' },
    { text: 'Female', value: 'female' },
  ],
  width: '20%',
}, {
  title: 'Email',
  dataIndex: 'email',
}];


class Users extends React.Component {

  state = {
    data: [],
    pagination: {},
    loading: false,
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (paginationParam, filters, sorter) => {
    const { pagination } = this.state;
    pagination.current = paginationParam.current;
    this.setState({
      pagination
    });
    this.fetch({
      results: paginationParam.pageSize,
      page: paginationParam.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  fetch = (params = {}) => {
    console.log('params:', params);
    // this.setState({ loading: true });

    const { pagination } = this.state;

    params =  {
          results: 100,
          filtered: [],
          pageSize: 100,
          sortBy: {id:"_id", desc: true},
          ...params,
        };

    const url = `${process.env.REACT_APP_API_URL}usersList?page=${params.page}`;

    post(url, params).then(json => {
      console.log('json',json);
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = json.data.users.total;
        pagination.pageSize = 100;
      console.log('pagination', pagination);
        this.setState({
          loading: false,
          data: json.data.users.data,
          pagination,
        });
    })
        .catch(err => {
          console.log('error', err);
        });
  }

  render() {
    const {
        pagination,
        loading,
        data,
    } = this.state
    return (
      <div>
        <Helmet title="Users list" />
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Users list</strong>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Recently Referrals</strong>
                </div>
                <div className="utils__titleDescription">
                  Block with important Recently Referrals information
                </div>
              </div>
              <div className="card-body">
                <Table
                  className="utils__scrollTable"
                  rowKey={record => record.id}
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
    )
  }
}

export default Users
