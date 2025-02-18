import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from '@themesberg/react-bootstrap';
import { UsersTable } from "../components/Tables";
import { fetchUsers, updateUserSearchInput } from "../features/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { exportUsersData } from "../api/adminApi";

export default () => {
  const dispatch = useDispatch();
  const { users, usersFilter,loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchUsers())
    return () => dispatch(updateUserSearchInput(null))
  }, [])

  useEffect(() => {
    console.log(usersFilter)
  }, [usersFilter])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    try {
      if (e.key === "Enter") {
        dispatch(fetchUsers({ filters: usersFilter }))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleExport = async () => {
    const res = await exportUsersData({filters:usersFilter})
    console.log(res)
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.xlsx"; // Set filename
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="btn-toolbar mb-2 mb-md-0">
          <ButtonGroup>
            <Button variant="outline-primary" size="sm" onClick={handleExport}>Export</Button>
          </ButtonGroup>
        </div>
        <div className="d-flex align-items-center">
          <Form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
            <Form.Group id="topbarSearch">
              <InputGroup className="input-group-merge search-bar">
                <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                <Form.Control type="text" placeholder="Search" onChange={(e) => dispatch(updateUserSearchInput(e.target.value))} onKeyUp={(e) => handleSearch(e)} />
              </InputGroup>
            </Form.Group>
          </Form>
        </div>
      </div>

      <UsersTable users={users} />
    </>
  );
};
