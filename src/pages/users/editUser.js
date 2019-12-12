import React from 'react'
import { Helmet } from 'react-helmet'
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { get, post } from '../../services/net'
import { userThumb }from '../../assets/images/index';
import styles from './style.module.scss';

class editUser extends React.Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      userId: match.params.id,
      user: {
        user_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        country_code: '',
      },
    };
  }

  componentDidMount() {
    const { userId } = this.state;
    this.fetch(userId);
  }

  fetch = (userId) => {
    console.log('userId', userId);
    const url = `${process.env.REACT_APP_API_URL}editUser/${userId}`;
    get(url).then(json => {
      if (json.success) {
        console.log('user',json.data.user);
        this.setState({
          user: json.data.user,
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

  saveUser = () => {
    const { user, userId } = this.state;
    console.log('savedrivr',user, userId);
    const url = `${process.env.REACT_APP_API_URL}saveUser/${userId}`;
    post(url , user).then(json => {
      console.log('usersave', json);
      if (json.success) {
        console.log('user saved');

      }
      if (!json.success) {
        console.log('user fail');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  }

  render() {

    const { user } = this.state;

    return (
      <div>
        <Helmet title="User Info" />
        <div className="row">
          <div className={`${styles.colLg6} col-lg-6`}>
            <div className={styles.card} style={{height: '85vh'}}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Personal Info</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-3">
                          Picture
                        </div>
                        <div className="col-lg-9">
                          {user.user_image_thumb == null && <img alt="thumb" width="100" src={userThumb} />}
                          {user.user_image_thumb != null && <img alt="thumb" width="100" src={`data:image/jpeg;base64,${user.user_image_thumb.image.$binary}`}  />}
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          First Name
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={user.user_name}
                            onChange={(e) => this.setState({user: {...user, user_name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Last Name
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={user.last_name}
                            onChange={(e) => this.setState({user: {...user, last_name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          User Name
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={user.nick_name}
                            onChange={(e) => this.setState({user: {...user, nick_name: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Phone number
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <div className="row">
                            <div className="col-lg-3">
                              <Input
                                size="small"
                                value={user.country_code}
                                onChange={(e) => this.setState({user: {...user, country_code: e.target.value}})}
                              />
                            </div>
                            <div className="col-lg-9">
                              <Input
                                size="small"
                                value={user.phone_number}
                                onChange={(e) => this.setState({user: {...user, phone_number: e.target.value}})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Email
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={user.email}
                            onChange={(e) => this.setState({user: {...user, email: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          New password
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            type="password"
                            size="small"
                            value={user.password}
                            onChange={(e) => this.setState({user: {...user, password: e.target.value, new_password: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLg6} col-lg-6`}>
            <div className={styles.card} style={{height: '85vh'}}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Additional Infos</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Invitation Code
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={user.unique_code}
                            onChange={(e) => this.setState({user: {...user, unique_code: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-3`}>
                          Referral Code
                        </div>
                        <div className={`${styles.marginTop10} col-lg-9`}>
                          <Input
                            size="small"
                            value={user.referral_code}
                            onChange={(e) => this.setState({user: {...user, referral_code: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={`${styles.marginTop10} col-lg-12`}>
                          <div className="pull-right">
                            <Button icon="save" type="primary" onClick={() => this.saveUser()}>
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className={`${styles.marginTop10} col-lg-12`}>
            <Link to="/users/usersList">
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

export default editUser
