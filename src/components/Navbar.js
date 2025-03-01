
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, ListGroup, InputGroup } from '@themesberg/react-bootstrap';

import NOTIFICATIONS_DATA from "../data/notifications";
import Profile3 from "../assets/img/team/profile-picture-3.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/adminSlice";
import { useHistory } from "react-router-dom";
import { getNotifications } from "../features/notificationSlice";
import {formatDistanceToString} from "../utils/dateTimeConverter";
import "../assets/css/notification.css";

export default (props) => {
  useEffect(()=>{
    dispatch(getNotifications())
  },[])
  // const areNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);
  const { adminInfo } = useSelector(state => state.admin);
  const {notifications,loading} = useSelector(state => state.notification);
  const dispatch = useDispatch();
  const history = useHistory();
  // const markNotificationsAsRead = () => {
  //   setTimeout(() => {
  //     setNotifications(notifications.map(n => ({ ...n, read: true })));
  //   }, 300);
  // };


  const Notification = (props) => {
    const { link, User, image, time,createdAt, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image src={image} className="user-avatar lg-avatar rounded-circle" />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{User?.firstName+" "+User?.lastName}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{formatDistanceToString(createdAt)}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">

          </div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}  >
              <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faBell} className="bell-shake" />
                  {/* {areNotificationsRead ? null : <span className="icon-badge rounded-circle unread-notifications" />} */}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush notifications-container">
                  <Nav.Link href="#" className="text-center text-primary fw-bold border-bottom border-light py-3">
                    Notifications
                  </Nav.Link>

                  {notifications.map(n => <Notification key={`notification-${n.id}`} {...n} />)}

                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={Profile3} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">{adminInfo?.name}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item className="fw-bold" onClick={() => {
                  dispatch(logout())
                  history.replace("/sign-in");
                  window.location.reload();
                }
                }>
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
