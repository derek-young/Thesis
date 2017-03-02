import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import store from '../../redux/store.js';
import { updateGroupId } from '../../redux/actions/userActions';
import { setDefaultChat } from '../../redux/actions/chatActions';
import { firebaseGetOnce, firebaseSet } from '../../redux/actions/firebaseActions';
import styles from '../Styles.css';
import localStyles from './ConfigStyles.css';


class ChooseGroup extends React.Component {
  constructor(props, context) {
    super(props);
  }

  render(){
    const groupKeys = Object.keys(this.props.groupList);
    const router = this.context.router;
    console.log(groupKeys, 'keys in choose group');

    return (
      <div className="custom-container">
        <div className={ localStyles.header }>
          <h3>Choose Your Group</h3>
        </div>
        <div className={styles.scrollView + ' ' + localStyles.cRow}>
          {groupKeys.map((key, index) => (
            <Link key={index} to='/map'>
              <div
                className={styles.row}
                onClick={() => {
                  updateGroupId(key);
                  this.removeGroupFromPendingInvites(key);
                }}>
                { this.props.groupList[key] }
              </div>
            </Link>
          ))}
        </div>
        <div className={ localStyles.cFooter }>
          <div>
            <Link to="/choosevenue">
              Skip
            </Link>
          </div>
        </div>
      </div>
    );
  }

  removeGroupFromPendingInvites(key) {
    let userId = this.props.userId;

    firebaseGetOnce(`users/${ userId }/pendingInvites`, (invites)=> {
      delete invites[key];
      firebaseSet(`users/${ userId }/pendingInvites`, invites);
    });
  }
}

ChooseGroup.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect((store) => {
	return {
		groupList: store.user.pendingInvites,
    userId : store.user.uid,
    userName : store.user.name
	}
})(ChooseGroup)
