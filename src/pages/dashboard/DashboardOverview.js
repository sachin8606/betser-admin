
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, validateToken } from "../../features/adminSlice";
import { useHistory } from "react-router-dom";
import { messaging, onMessage, requestPermission } from '../../config/firebase';
import { fetchRequests } from "../../api/requestApi";
import { getUsers } from "../../api/adminApi";

export default () => {

  const [userCount, setUserCount] = useState();
  const [requestsCount, setRequestsCount] = useState();


  useEffect(() => {
    const fetchApis = async () => {
      try {
        // Fetch requests data
        const requests = await fetchRequests();
        console.log(requests)
        setRequestsCount(requests?.data?.requests?.totalRecords);

        // Fetch users data
        const users = await getUsers();
        console.log(users)
        setUserCount(users?.data?.totalRecords);
      } catch (err) {
        console.error('Error fetching data:', err);
        setRequestsCount(0);
        setUserCount(0);
      }
    };

    fetchApis();
  }, []);



  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        {/* <Dropdown className="btn-toolbar">
          <Dropdown.Toggle as={Button} variant="primary" size="sm" className="me-2">
            <FontAwesomeIcon icon={faPlus} className="me-2" />New Task
          </Dropdown.Toggle>
          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faTasks} className="me-2" /> New Task
            </Dropdown.Item>
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" /> Upload Files
            </Dropdown.Item>
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faUserShield} className="me-2" /> Preview Security
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faRocket} className="text-danger me-2" /> Upgrade to Pro
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
        {/* 
        <ButtonGroup>
          <Button variant="outline-primary" size="sm">Share</Button>
          <Button variant="outline-primary" size="sm">Export</Button>
        </ButtonGroup> */}
      </div>

      <Row className="justify-content-md-center">
        {/* <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col> */}
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Users"
            title={userCount}
            period="Feb 1 - Apr 1"
            percentage={18.2}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Requests"
            title={requestsCount}
            period="Feb 1 - Apr 1"
            percentage={28.4}
            icon={faBoxOpen}
            iconColor="shape-tertiary"
          />
        </Col>

        {/* <Col xs={12} sm={6} xl={4} className="mb-4">
          <CircleChartWidget
            title="Traffic Share"
            data={trafficShares} />
        </Col> */}
      </Row>

      <Row>
        {/* <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <PageVisitsTable />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <TeamMembersWidget />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <ProgressTrackWidget />
                </Col>
              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="mb-4">
                  <BarChartWidget
                    title="Total orders"
                    value={452}
                    percentage={18.2}
                    data={totalOrders} />
                </Col>

                <Col xs={12} className="px-0 mb-4">
                  <RankingWidget />
                </Col>

                <Col xs={12} className="px-0">
                  <AcquisitionWidget />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col> */}
      </Row>
    </>
  );
};
