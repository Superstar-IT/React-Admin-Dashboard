import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { post } from '../../services/net'
import styles from './style.module.scss';

class promoList extends React.Component {

  state = {
    data: [],
    pagination: {},
    loading: false,
    modalDelete: false,
    selectedPromo: null,
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

    const url = `${process.env.REACT_APP_API_URL}coupons/list?page=${params.page}`;

    post(url, params).then(json => {
      console.log('json',json);
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = json.data.coupons.total;
        pagination.pageSize = 100;
      console.log('pagination', pagination);
        this.setState({
          loading: false,
          data: json.data.coupons.data,
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

  deletePromo = (value) => {
    console.log('deletePromoId: ', value);

    const url = `${process.env.REACT_APP_API_URL}coupons/${value}/delete`;
    post(url).then(json => {
      if (json.success) {
        this.fetch();
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
        pagination,
        loading,
        data,
        modalDelete,
        selectedPromo
    } = this.state;

    const columns = [{
      title: 'Code',
      dataIndex: 'promo_code',
    }, {
      title: 'Amount',
      dataIndex: 'promo_value',
    }, {
      title: 'Usage limit',
      dataIndex: 'usage_allowed',
    }, {
      title: 'Used',
      dataIndex: 'usage',
      render: (usage) => usage ? usage.length : 0,
    }, {
      title: 'Remaining',
      render: (row) => row.usage_allowed - (row.usage ? row.usage.length : 0),
    }, {
      title: 'Activation',
      dataIndex: 'validity',
      render: (validity) => <div>{validity && validity.valid_from && validity.valid_from}</div>,
    }, {
      title: 'Expires',
      render: (row) => <div>{row.validity && row.validity.valid_to && row.validity.valid_to}</div>,
    }, {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <div><span className={(status === 'Active') ? 'font-size-12 badge badge-success' : 'font-size-12 badge badge-danger'}>{status}</span></div>,
    }, {
        title: 'Action',
        dataIndex: '_id',
        render: (id) => <div><Link to={`/promo/promoCode/${id}`}><Button icon="edit" className="mr-1" size="small" /></Link><Button onClick={() => this.setState({modalDelete: true, selectedPromo: id})} icon="close" className="mr-1 text-danger" size="small" /></div>,
    }];

    return (
      <div>
        <Helmet title="Promo Codes list" />
        <Modal
          title="Delete"
          visible={modalDelete}
          onOk={() => this.deletePromo(selectedPromo)}
          onCancel={() => this.setState({modalDelete: false})}
        >
          <div className="form-group col-12 border-1-grey">
            Are you sure you want to delete promo code ?
          </div>
        </Modal>
        <div className="row">
          <div className="col-lg-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Promo Codes list</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-12">
                      <div className="float-right">
                        <Link to='/promo/promoCode/'><Button icon="plus" type="primary" className={styles.marginLeft5}>Add Promo Code</Button></Link>
                      </div>
                    </div>
                  </div>
                  <div className={styles.marginTop10}>
                    <Table
                      className="utils__scrollTable"
                      rowKey={record => record.promo_code}
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

export default promoList
