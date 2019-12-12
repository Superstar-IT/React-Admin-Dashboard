import React from 'react'
import { Helmet } from 'react-helmet'
import { Input, Form, Radio, Button, DatePicker, notification } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { post, get } from '../../services/net'
import styles from './style.module.scss';

class addPromoCode extends React.Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      promoId: match.params.id,
      promo: {
        promo_code: '',
        usage_allowed: '',
        user_usage: '',
        validity: {
          valid_from: moment('2019/01/01', 'YYYY-MM-DD'),
          valid_to: moment('2019/01/01', 'YYYY-MM-DD'),
        },
        code_type: '',
        promo_value: '',
        status: ''
      }
    };
  }

  componentDidMount() {
    const { promoId } = this.state;
    console.log('promoId',promoId);
    if (promoId) {
      this.fetch(promoId);
    }
  }

  fetch = (promoId) => {
    const url = `${process.env.REACT_APP_API_URL}coupons/${promoId}/edit`;
    get(url).then(json => {
      if (json.success) {
        const promo = json.data.coupon;
        promo.validity.valid_from = moment(promo.validity.valid_from,'YYYY-MM-DD');
        promo.validity.valid_to = moment(promo.validity.valid_to,'YYYY-MM-DD');
        this.setState({
          promo: json.data.coupon,
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

  savePromo = () => {
    const { promo, promoId } = this.state;

    promo.validity.valid_from = promo.validity.valid_from.format('YYYY-MM-DD');
    promo.validity.valid_to = promo.validity.valid_to.format('YYYY-MM-DD');

    let url = '';

    if (promoId) {
      url = `${process.env.REACT_APP_API_URL}coupons/${promoId}`;
    } else {
      url = `${process.env.REACT_APP_API_URL}coupons`;
    }
    post(url, promo).then(json => {
      console.log('coupon save', json);
      if (json.success) {
        notification.success({
          message: 'Promo Code',
          description: 'You have successfully saved promo code!',
        });
        console.log('coupon saved');
        // this.addNotify('Coupon data saved!', '' , 'success', 'tr');

      }
      if (!json.success) {
        notification.error({
          message: 'Promo Code',
          description: 'Failed!',
        });
        console.log('coupon saved fail');
        // this.addNotify('Coupon data not saved!', json.data , 'error', 'tr');
      }
    })
      .catch(err => {
        // this.addNotify('Coupon data not saved!', err , 'error', 'tr');
        console.log('err', err);
      });
  };

  onChangeDate = (value, dateString, type) => {
    console.log('reset1', value);
    console.log('reset2', dateString);
    const { promo } = this.state;
    if (type === 1) {
      if (dateString === '') {
        promo.validity.valid_from = moment('2019/01/01', 'YYYY-MM-DD');
      } else {
        promo.validity.valid_from = moment(dateString, 'YYYY-MM-DD');
      }
    } else if (type === 2) {
      if (dateString === '') {
        promo.validity.valid_from = moment('2019/01/01', 'YYYY-MM-DD');
      } else {
        promo.validity.valid_to = moment(dateString, 'YYYY-MM-DD');
      }
    }
    this.setState({
      promo
    });
  }

  render() {

    const { promo } = this.state;

    return (
      <div>
        <Helmet title="Promo Code" />
        <div className="row">
          <div className="col-lg-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Promo Code</strong>
                </div>
                <div className={styles.cardBody}>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Promo Code
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <Input
                              size="small"
                              value={promo.promo_code}
                              onChange={(e) => this.setState({promo: {...promo, promo_code: e.target.value}})}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Usage limit per promo code
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <Input
                              size="small"
                              value={promo.usage_allowed}
                              onChange={(e) => this.setState({promo: {...promo, usage_allowed: e.target.value}})}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Usage limit per user
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <Input
                              size="small"
                              value={promo.user_usage}
                              onChange={(e) => this.setState({promo: {...promo, user_usage: e.target.value}})}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Promo code valid from
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <DatePicker
                              style={{width: '100%'}}
                              placeholder="Select Date"
                              size="small"
                              value={promo.validity.valid_from}
                              onChange={(value, dateString) => this.onChangeDate(value, dateString, 1)}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Promo code valid till
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <DatePicker
                              style={{width: '100%'}}
                              placeholder="Select Date"
                              size="small"
                              value={promo.validity.valid_to}
                              onChange={(value, dateString) => this.onChangeDate(value, dateString, 2)}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Type
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <Radio.Group onChange={(e) => this.setState({promo: {...promo, code_type: e.target.value}})} value={promo.code_type} buttonStyle="solid" size="small">
                              <Radio.Button value="Flat">Flat</Radio.Button>
                              <Radio.Button value="Percent">Percent</Radio.Button>
                            </Radio.Group>
                          </div>
                        </div>
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Promo code amount
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <Input
                              size="small"
                              value={promo.promo_value}
                              onChange={(e) => this.setState({promo: {...promo, promo_value: e.target.value}})}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            Status
                          </div>
                          <div className={`${styles.marginTop10} col-lg-6`}>
                            <Radio.Group onChange={(e) => this.setState({promo: {...promo, status: e.target.value}})} value={promo.status} buttonStyle="solid" size="small">
                              <Radio.Button value="Active">Active</Radio.Button>
                              <Radio.Button value="Inactive">Inactive</Radio.Button>
                            </Radio.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className={`${styles.marginTop10} col-lg-12`}>
                        <div className="pull-right">
                          <Button icon="save" type="primary" onClick={() => this.savePromo()} className={styles.marginLeft5}>Save Promo Code</Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className={`${styles.marginTop10} col-lg-12`}>
            <Link to="/promo/promoList">
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

export default addPromoCode
