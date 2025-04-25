import React, { useEffect, useState } from "react";
import { Form, InputGroup } from '@themesberg/react-bootstrap';
import { UsersTable } from "../components/Tables";
// import { fetchUsers, updateUserSearchInput } from "../features/adminSlice";
import { useDispatch, useSelector } from "react-redux";
// import { exportUsersData } from "../api/adminApi";
import { getRequests, resetFilter, updateFilter } from "../../features/requestSlice";
import { RequestsTable } from "../../components/Tables";
import { useAlert } from "react-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "../components/ImageModal";

export default () => {

    // Image Modal states
    const [imageModalShow, setImageModalShow] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const alert = useAlert()
    const dispatch = useDispatch();
    const { requests, filter, loading } = useSelector(state => state.request);

    useEffect(() => {
        dispatch(updateFilter({ status: "cancelled" }))
        dispatch(getRequests({ filters: { "status": "cancelled" } }))
        return () => dispatch(resetFilter())
    }, [])

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault()
        try {
            if (e.key === "Enter") {
                dispatch(getRequests({ filters: filter }))
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Preview image
    const previewImage = (url) => {
        setImageUrl(url)
        setImageModalShow(true)
    }
    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="btn-toolbar mb-2 mb-md-0">
                    {/* <ButtonGroup>
                                <Button variant="outline-primary" size="sm" onClick={handleExport}>Export</Button>
                            </ButtonGroup> */}
                </div>
                <div className="d-flex align-items-center">
                    <Form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
                        <Form.Group id="topbarSearch">
                            <InputGroup className="input-group-merge search-bar">
                                <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                                <Form.Control type="text" placeholder="Search" onChange={(e) => dispatch(updateFilter({ "searchKeyword": e.target.value }))} onKeyUp={(e) => handleSearch(e)} />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </div>
            </div>
            <RequestsTable requests={requests} previewImage={previewImage} handleUpdate={null} status="" />
            <ImageModal show={imageModalShow} onClose={() => setImageModalShow(false)} imageUrl={imageUrl} />
        </>
    );
};
