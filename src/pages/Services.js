import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addSubCategory, categoryDelete, getCategory } from "../features/categorySlice";
import { useAlert } from "react-alert";
import ConfirmationModal from "../components/ConfirmationModal";

const CategoryManager = () => {
  const { data, currentCategory, loading, error, totalPages, currentPage } = useSelector(state => state.category);
  const dispatch = useDispatch()
  const alert = useAlert();

  // States for new subcategory inputs for each category
  const [healthcareNewSubcategoryName, setHealthcareNewSubcategoryName] = useState("");
  const [healthcareNewSubcategoryDescription, setHealthcareNewSubcategoryDescription] = useState("");
  const [nonHealthcareNewSubcategoryName, setNonHealthcareNewSubcategoryName] = useState("");
  const [nonHealthcareNewSubcategoryDescription, setNonHealthcareNewSubcategoryDescription] = useState("");

  // Confirmation states
  const [show, setShow] = useState(false)
  const [selectedId, setSelectedId] = useState(null)


  useEffect(() => {
    dispatch(getCategory())
  }, [])

  const addHealthcareSubcategory = async () => {
    let isValid = false;
    try {
      isValid = validations("healthcare")
      if (isValid) {
        const newData = {
          "name": healthcareNewSubcategoryName,
          "description": healthcareNewSubcategoryDescription,
          "tag": "healthcare"
        }
        await dispatch(addSubCategory(newData)).unwrap()
        dispatch(getCategory())
        alert.success("Updated successfully")
      }
    }
    catch (err) {
      alert.error("error")
    }
  };

  const validations = (flag) => {
    switch (flag) {
      case "healthcare":
        if (healthcareNewSubcategoryName === undefined || healthcareNewSubcategoryName === "" || healthcareNewSubcategoryName === null || healthcareNewSubcategoryDescription === undefined || healthcareNewSubcategoryDescription === "" || healthcareNewSubcategoryDescription === null) {
          alert.error("Please fill in complete details.")
          return false
        }
        return true
      case "others":
        if (nonHealthcareNewSubcategoryDescription === undefined || nonHealthcareNewSubcategoryDescription === "" || nonHealthcareNewSubcategoryDescription === null || nonHealthcareNewSubcategoryName === "" || nonHealthcareNewSubcategoryName === undefined || nonHealthcareNewSubcategoryName === null) {
          alert.error("Please fill in complete details.")
          return false
        }
        return true
    }
  }

  const addNonHealthcareSubcategory = async () => {
    let isValid = false;
    try {
      isValid = validations("others")
      if (isValid) {
        const newData = {
          "name": nonHealthcareNewSubcategoryName,
          "description": nonHealthcareNewSubcategoryDescription,
          "tag": "others"
        }
        await dispatch(addSubCategory(newData)).unwrap()
        dispatch(getCategory())
        alert.success("Updated successfully")
      }
    } catch (err) {
      alert.error("error")
    }
  };

  const handleDelete = async (subcategoryId) => {
    try {
      setSelectedId(subcategoryId)
      setShow(true)
    } catch (err) {
      alert.error("error")
    }
  };

  const handleConfirm = async () => {
    setShow(false)
    setSelectedId("")
    try {
      await dispatch(categoryDelete(selectedId)).unwrap()
      dispatch(getCategory())
      alert.success("Service removed successfully.")
    } catch (err) {
      alert.error("error")
    }
  }

  const styles = {
    hcHead: {
      background: "#144B8A",
      color: "#FFFFFF"
    },
    nhcHead: {
      background: "#AEC7E6",
      color: "#FFFFFF"
    }
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Healthcare Category */}
        <div className="col-md-6">
          <Card className="mb-4">
            <Card.Header style={styles.hcHead}>Healthcare</Card.Header>
            <Card.Body>
              {data && data.map((subcategory) => {
                if (subcategory?.tag === "healthcare")
                  return (
                    <div
                      key={subcategory.id}
                      className="d-flex justify-content-between mb-3"
                    >
                      <div>
                        <strong>{subcategory.name}</strong>
                        <p>{subcategory.description}</p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(subcategory.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )
              }
              )}

              {/* Add new subcategory input and description for Healthcare */}
              <Form.Control
                type="text"
                placeholder="New Subcategory Name"
                value={healthcareNewSubcategoryName}
                onChange={(e) => setHealthcareNewSubcategoryName(e.target.value)}
                className="my-2"
              />
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Subcategory Description"
                value={healthcareNewSubcategoryDescription}
                onChange={(e) => setHealthcareNewSubcategoryDescription(e.target.value)}
                className="my-2"
              />
              <Button
                variant="primary"
                onClick={addHealthcareSubcategory}
                block
              >
                Add Service
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* Non-healthcare Services Category */}
        <div className="col-md-6">
          <Card className="mb-4">
            <Card.Header style={styles.nhcHead}>Non-healthcare Services others</Card.Header>
            <Card.Body>
              {data.map((subcategory) => {
                if (subcategory?.tag === "others")
                  return (
                    <div
                      key={subcategory.id}
                      className="d-flex justify-content-between mb-3"
                    >
                      <div>
                        <strong>{subcategory.name}</strong>
                        <p>{subcategory.description}</p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(subcategory.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )
              })}

              {/* Add new subcategory input and description for Non-healthcare */}
              <Form.Control
                type="text"
                placeholder="New Subcategory Name"
                value={nonHealthcareNewSubcategoryName}
                onChange={(e) => setNonHealthcareNewSubcategoryName(e.target.value)}
                className="my-2"
              />
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Subcategory Description"
                value={nonHealthcareNewSubcategoryDescription}
                onChange={(e) => setNonHealthcareNewSubcategoryDescription(e.target.value)}
                className="my-2"
              />
              <Button
                variant="primary"
                onClick={addNonHealthcareSubcategory}
                block
              >
                Add Service
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
      <ConfirmationModal
        show={show}
        onClose={() => setShow(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default CategoryManager;
