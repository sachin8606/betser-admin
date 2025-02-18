
import React, { use, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup } from '@themesberg/react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { Routes } from "../routes";
import { pageVisits, pageTraffic, pageRanking } from "../data/tables";
import transactions from "../data/transactions";
import commands from "../data/commands";
import { dateToLocal } from "../utils/dateTimeConverter";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, fetchUsers } from "../features/adminSlice";
import { getRequests } from "../features/requestSlice";
import "../assets/css/pagination.css";
import Loader from "./Loader";
import "../assets/css/common.css";
const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const PageVisitsTable = () => {
  const TableRow = (props) => {
    const { pageName, views, returnValue, bounceRate } = props;
    const bounceIcon = bounceRate < 0 ? faArrowDown : faArrowUp;
    const bounceTxtColor = bounceRate < 0 ? "text-danger" : "text-success";

    return (
      <tr>
        <th scope="row">{pageName}</th>
        <td>{views}</td>
        <td>${returnValue}</td>
        <td>
          <FontAwesomeIcon icon={bounceIcon} className={`${bounceTxtColor} me-3`} />
          {Math.abs(bounceRate)}%
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Page visits</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Page name</th>
            <th scope="col">Page Views</th>
            <th scope="col">Page Value</th>
            <th scope="col">Bounce rate</th>
          </tr>
        </thead>
        <tbody>
          {pageVisits.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)}
        </tbody>
      </Table>
    </Card>
  );
};

export const PageTrafficTable = () => {
  const TableRow = (props) => {
    const { id, source, sourceIcon, sourceIconColor, sourceType, category, rank, trafficShare, change } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{id}</Card.Link>
        </td>
        <td className="fw-bold">
          <FontAwesomeIcon icon={sourceIcon} className={`icon icon-xs text-${sourceIconColor} w-30`} />
          {source}
        </td>
        <td>{sourceType}</td>
        <td>{category ? category : "--"}</td>
        <td>{rank ? rank : "--"}</td>
        <td>
          <Row className="d-flex align-items-center">
            <Col xs={12} xl={2} className="px-0">
              <small className="fw-bold">{trafficShare}%</small>
            </Col>
            <Col xs={12} xl={10} className="px-0 px-xl-1">
              <ProgressBar variant="primary" className="progress-lg mb-0" now={trafficShare} min={0} max={100} />
            </Col>
          </Row>
        </td>
        <td>
          <ValueChange value={change} suffix="%" />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0">Traffic Source</th>
              <th className="border-0">Source Type</th>
              <th className="border-0">Category</th>
              <th className="border-0">Global Rank</th>
              <th className="border-0">Traffic Share</th>
              <th className="border-0">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageTraffic.map(pt => <TableRow key={`page-traffic-${pt.id}`} {...pt} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const RankingTable = () => {
  const TableRow = (props) => {
    const { country, countryImage, overallRank, overallRankChange, travelRank, travelRankChange, widgetsRank, widgetsRankChange } = props;

    return (
      <tr>
        <td className="border-0">
          <Card.Link href="#" className="d-flex align-items-center">
            <Image src={countryImage} className="image-small rounded-circle me-2" />
            <div><span className="h6">{country}</span></div>
          </Card.Link>
        </td>
        <td className="fw-bold border-0">
          {overallRank ? overallRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={overallRankChange} />
        </td>
        <td className="fw-bold border-0">
          {travelRank ? travelRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={travelRankChange} />
        </td>
        <td className="fw-bold border-0">
          {widgetsRank ? widgetsRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={widgetsRankChange} />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">Country</th>
              <th className="border-0">All</th>
              <th className="border-0">All Change</th>
              <th className="border-0">Travel & Local</th>
              <th className="border-0">Travel & Local Change</th>
              <th className="border-0">Widgets</th>
              <th className="border-0">Widgets Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRanking.map(r => <TableRow key={`ranking-${r.id}`} {...r} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const UsersTable = ({ users }) => {

  const { totalPagesUsers, currentPageUser, usersFilter, currentUser, loading } = useSelector(state => state.admin)

  const history = useHistory()

  const dispatch = useDispatch()

  const TableRow = (props) => {
    const { id, createdAt, phone, email, firstName, lastName, nickName, index } = props
    return (
      <tr>
        <td>
          <Card.Link as={Link} to={Routes.Invoice.path} className="fw-normal">
            {index + 1}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">
            {id}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {firstName + " " + lastName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {nickName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {phone}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            {email}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            {dateToLocal(createdAt)}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => history.push('/users/' + id)}>
                <FontAwesomeIcon icon={faEye} className="me-2" /> View Details
              </Dropdown.Item>
              {/* <Dropdown.Item>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger">
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Remove
              </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };


  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">S.No.</th>
              <th className="border-bottom">User Id</th>
              <th className="border-bottom">Name</th>
              <th className="border-bottom">Nickname</th>
              <th className="border-bottom">Phone</th>
              <th className="border-bottom">Email</th>
              <th className="border-bottom">Created on</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <div style={{ marginLeft: "35vw" }}><Loader /></div> :users && users.length<1 ?<h4 className="found-nothing-text">No data found</h4>:
              Array.isArray(users) && users.map((t, index) => (
                <TableRow key={`users-${t.id}`} {...t} index={index} />
              ))}
          </tbody>
        </Table>
        {
          users && users.length > 0 && <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-center">
            <Nav>
              <Pagination className="mb-2 mb-lg-0">
                <Pagination.Prev
                  onClick={() => dispatch(fetchUsers({ filter: usersFilter, page: currentPageUser - 1 }))}
                  disabled={currentPageUser === 1 || totalPagesUsers === 0}
                >
                  Previous
                </Pagination.Prev>

                {totalPagesUsers &&
                  [...Array(totalPagesUsers)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPageUser}
                      onClick={!(currentPageUser === index + 1) ? () => dispatch(fetchUsers({ filters: usersFilter, page: index + 1 })) : <></>}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}

                <Pagination.Next
                  onClick={() => dispatch(fetchUsers({ filter: usersFilter, page: currentPageUser + 1 }))}
                  disabled={currentPageUser === totalPagesUsers || totalPagesUsers === 0}
                >
                  Next
                </Pagination.Next>
              </Pagination>
            </Nav>

          </Card.Footer>
        }
      </Card.Body>
    </Card>
  );
};

export const RequestsTable = ({ handleUpdate, status }) => {

  const dispatch = useDispatch();
  const { filter, currentPage, totalPages, loading, error, requests } = useSelector((state) => state.request);

  const RequestsRow = (props) => {
    const { id, updatedAt, type, description, User, index } = props
    return (
      <tr>
        <td>
          <Card.Link as={Link} to={Routes.Invoice.path} className="fw-normal">
            {((currentPage - 1) * 10) + (index + 1)}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">
            {id}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {User?.firstName + " " + User?.lastName}<br />
            {"+" + User?.countryCode + " " + User?.phone}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {type}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {description}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            {dateToLocal(updatedAt)}
          </span>
        </td>
        {
          status === "" ? <></> : <td>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleUpdate(id, status)}
              block
            >
              {status === "progress" ? "Mark as In Progress" : status === "resolved" ? "Mark as Resolved" : <></>}
            </Button>
          </td>
        }
      </tr>
    );
  }


  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">S.No.</th>
              <th className="border-bottom">Request Id</th>
              <th className="border-bottom">User</th>
              <th className="border-bottom">Type</th>
              <th className="border-bottom">Description</th>
              <th className="border-bottom">Date</th>
              {status === "" ? <></> : <th className="border-bottom">Action</th>}

            </tr>
          </thead>
          <tbody>
            {
              loading ? <div style={{ marginLeft: "35vw" }}><Loader /></div> : requests && requests.length < 1 ?<h4 className="found-nothing-text">No data found.</h4>:Array.isArray(requests) && requests.map((t, index) => (
                <RequestsRow key={`requests-${t.id}`} {...t} index={index} />
              ))}


          </tbody>
        </Table>
        {requests && requests.length > 0 &&
          <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-center">
            <Nav className="nav-pagination">
              <Pagination className="mb-2 mb-lg-0">
                <Pagination.Prev
                  onClick={() => dispatch(getRequests({ filters: filter, page: currentPage - 1 }))}
                  disabled={currentPage === 1 || totalPages === 0}
                >
                  Previous
                </Pagination.Prev>
                {totalPages &&
                  [...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1} active={index + 1 === currentPage}
                      onClick={!(currentPage === index + 1) ? () => dispatch(getRequests({ filters: filter, page: index + 1 })) : <></>}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                <Pagination.Next
                  onClick={() => dispatch(getRequests({ filters: filter, page: currentPage + 1 }))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Pagination.Next>
              </Pagination>
            </Nav>
          </Card.Footer>
        }
      </Card.Body>
    </Card>
  )
}


export const CommandsTable = () => {
  const TableRow = (props) => {
    const { name, usage = [], description, link } = props;

    return (
      <tr>
        <td className="border-0" style={{ width: '5%' }}>
          <code>{name}</code>
        </td>
        <td className="fw-bold border-0" style={{ width: '5%' }}>
          <ul className="ps-0">
            {usage.map(u => (
              <ol key={u} className="ps-0">
                <code>{u}</code>
              </ol>
            ))}
          </ul>
        </td>
        <td className="border-0" style={{ width: '50%' }}>
          <pre className="m-0 p-0">{description}</pre>
        </td>
        <td className="border-0" style={{ width: '40%' }}>
          <pre><Card.Link href={link} target="_blank">Read More <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" /></Card.Link></pre>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0">
        <Table responsive className="table-centered rounded" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <thead className="thead-light">
            <tr>
              <th className="border-0" style={{ width: '5%' }}>Name</th>
              <th className="border-0" style={{ width: '5%' }}>Usage</th>
              <th className="border-0" style={{ width: '50%' }}>Description</th>
              <th className="border-0" style={{ width: '40%' }}>Extra</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(c => <TableRow key={`command-${c.id}`} {...c} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};