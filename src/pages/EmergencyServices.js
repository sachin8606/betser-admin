import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col, Container, InputGroup } from "@themesberg/react-bootstrap";
import Select from "react-select"; // Searchable dropdown
import { Country, State } from "country-state-city"; // Real-world country/state data
import { Search } from "react-feather"; // Search icon
import { useDispatch, useSelector } from "react-redux";
import { deleteService, emergencyServiceCreate, emergencyServiceEdit, getServices, updateSearchKeyword } from "../features/emergencyServicesSlice";
import ConfirmationModal from "../components/ConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";

const EmergencyServices = () => {
  const alert = useAlert()
  const dispatch = useDispatch();
  const { loading, error, totalPages, currentPage, filter, data } = useSelector(state => state.emergencyService)
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [city, setCity] = useState("")
  const [serviceName, setServiceName] = useState("")
  const [number, setNumber] = useState("");

  const [editId, setEditId] = useState(false)
  const [inputValues, setInputValues] = useState({});

  // Confirmation states
  const [show, setShow] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    dispatch(getServices())
  }, [])

  useEffect(() => {
    if (!loading) {
      setShow(false)
      setSelectedCountry(null)
      setSelectedState(null)
      setNumber("")
      setCity("")
      setServiceName("")
    }
  }, [loading])


  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const stateOptions =
    selectedCountry &&
    State.getStatesOfCountry(selectedCountry.value).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));

  const addEntry = async () => {
    if (!selectedCountry || !selectedState || !number || serviceName === "" || city === "") {
      alert.info("All fields are required!");
      return;
    }
    await dispatch(emergencyServiceCreate({ "country": selectedCountry.label, "state": selectedState.label, "contact": number, "city": city, "serviceName": serviceName })).unwrap()
    dispatch(getServices())
    alert.success("Added successfully.")
  };

  const deleteServiceFun = (id) => {
    setSelectedId(id)
    setShow(true)
  };

  const handleConfirm = async () => {
    await dispatch(deleteService(selectedId)).unwrap();
    dispatch(getServices({ filter: filter }));
    alert.success("Removed successfully.")
  }

  const handleSearch = (key) => {
    if (key === "Enter") {
      dispatch(getServices({ filter: filter }))
    }
  }

  const handleEditInputChange = (id, value) => {
    setInputValues({
      ...inputValues,
      [id]: value
    })
  }

  const handleEditSave = async (id) => {
    if (Number(inputValues[id] < 1)) {
      return
    }
    await dispatch(emergencyServiceEdit({ id, data: { contact: inputValues[id] } })).unwrap();
    dispatch(getServices({ filter: filter }));
    alert.success("Updated")
    setEditId("")
    setInputValues({})
  }

  const styles = {
    inputContainer: {
      position: 'relative',
      marginBottom: '10px'
    },
    contactDisInput: {
      border: 'none',
      width: '-webkit-fill-available',
      textAlign: 'center'
    },
    icon: {
      position: 'absolute',
      top: '6px',
      marginLeft: '4px',
      cursor: 'pointer'
    }
  }

  return (
    <>
      <Container className="py-5">
        {/* Search Filter */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by Country, State, or Number..."
                onKeyDown={(e) => handleSearch(e.key)}
                onChange={(e) => dispatch(updateSearchKeyword(e.target.value))}
              />
            </InputGroup>
          </Col>
        </Row>

        {/*  Input Fields for Adding Entries */}
        <Row className="mb-4">
          <Col md={6}>
            <Select
              options={countryOptions}
              placeholder="Select Country"
              value={selectedCountry}
              onChange={setSelectedCountry}
            />
          </Col>
          <Col md={6}>
            <Select
              options={stateOptions}
              placeholder="Select State"
              value={selectedState}
              onChange={setSelectedState}
              isDisabled={!selectedCountry} // Disable until country is selected
            />
          </Col>

        </Row>
        <Row className="mb-4">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Enter Number"
              value={number}
              onWheel={(e) => e.target.blur()}
              onChange={(e) => setNumber(e.target.value)}
            />
          </Col>
        </Row>
        <Button variant="primary" onClick={() => addEntry()} block>
          Add Entry
        </Button>

        {/* Display Entries as Square Cards */}
        <Row className="mt-4">
          {data && data.map((entry) => (
            <Col md={4} sm={6} xs={12} key={entry.id} className="mb-4">
              <Card className="shadow-sm border-0 text-center p-3" style={{ borderRadius: "10px" }}>
                <Card.Body>
                  <h5 className="text-primary">{entry?.country}</h5>
                  <h6 className="text-secondary">{entry?.state}</h6>
                  <h6>{entry?.serviceName?.toUpperCase()}</h6>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.contactDisInput} type="number"
                      className="text-muted"
                      onChange={(e) => handleEditInputChange(entry.id, e.target.value)}
                      value={inputValues[entry.id] ?? entry.contact}
                      disabled={editId !== entry.id}
                      onWheel={(e) => e.target.blur()}
                      ref={(input) => {
                        if (editId === entry.id && input) {
                          input.focus();
                        }
                      }}
                    />
                    {editId === entry.id ? <FontAwesomeIcon onClick={() => handleEditSave(entry.id)} icon={faSave} style={styles.icon} /> : <FontAwesomeIcon onClick={() => setEditId(entry.id)} icon={faEdit} style={styles.icon} />}
                  </div>
                  <Button variant="danger" size="sm" onClick={() => deleteServiceFun(entry.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <ConfirmationModal
        show={show}
        onClose={() => setShow(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default EmergencyServices;
