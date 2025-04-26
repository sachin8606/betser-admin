import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequests, resetFilter, updateFilter, updateRequestStatus } from "../../features/requestSlice";
import { RequestsTable } from "../../components/Tables";
import { useAlert } from "react-alert";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Form, InputGroup } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "../components/ImageModal";

export default () => {

  // Confirmation states
  const [show, setShow] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [currStatus, setCurrStatus] = useState(null)
  const [commentRec, setCommentRec] = useState("")

  // Image Modal states
  const [imageModalShow, setImageModalShow] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const alert = useAlert()
  const dispatch = useDispatch();
  const { requests, filter, loading } = useSelector(state => state.request);

  useEffect(() => {
    dispatch(updateFilter({ status: "pending" }))
    dispatch(getRequests({ filters: { "status": "pending" } }))
    return () => dispatch(resetFilter())
  }, [])

  const handleConfirm = async () => {
    try {
      let commentBody = {
        "comment":commentRec,
        "admin":localStorage.getItem("betser-admin"),
        "createdAt":new Date().toISOString(1)
      }
      await dispatch(updateRequestStatus({ id: selectedId, data: { status: currStatus,comments:[commentBody] } })).unwrap()
      alert.success("Status updated.")
      resetFields();
      dispatch(getRequests({ filters: { "status": "pending" } }))
    } catch (err) {
      alert.error("error")
    }
  }

  const resetFields = () =>{
    setShow(false)
    setSelectedId(null)
    setCurrStatus(null)
    setCommentRec("")
}

  const handleUpdate = async (id, status,comment) => {
    try {
      setCurrStatus(status)
      setSelectedId(id)
      setShow(true)
      setCommentRec(comment)
    }
    catch (err) {
      alert.error("error")
    }
  }

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
      <RequestsTable requests={requests} handleUpdate={handleUpdate} previewImage={previewImage} status="progress" />
      <ConfirmationModal
        show={show}
        onClose={() => setShow(false)}
        onConfirm={handleConfirm}
      />
      <ImageModal show={imageModalShow} onClose={() => setImageModalShow(false)} imageUrl={imageUrl} />
    </>
  );
};
