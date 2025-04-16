import React, { useEffect, useState } from "react";
import { Card, Form, Button, InputGroup } from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createSettings, getSettings, updateSettings } from "../features/settingSlice";
import { useAlert } from "react-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

export default () => {
    const [inputDisabled, setInputDisabled] = useState(true)
    const [inputDisabled2, setInputDisabled2] = useState(true)
    const [inputDisabled3, setInputDisabled3] = useState(true)
    const [inputDisabled4, setInputDisabled4] = useState(true)
    const dispatch = useDispatch();
    const alert = useAlert();
    const { setting, loading, error } = useSelector(state => state.setting)
    const [settings, setSettings] = useState({
        help_care_number: "",
        learnUrl: "",
        email:"",
        address:""
    });


    useEffect(() => {
        dispatch(getSettings())
    }, [])

    useEffect(() => {
        setSettings({ help_care_number: setting?.help_care_number, learnUrl: setting?.learnUrl,email:setting?.email,address:setting?.email })
    }, [setting])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (setting && setting?.id) {
                await dispatch(updateSettings({ id: setting.id, data: settings })).unwrap()
                alert.success("Updated successfully")
            }
            else {
                await dispatch(createSettings(settings)).unwrap()
                alert.success("Added successfully.")
            }
            dispatch(getSettings())
            setInputDisabled(true)
            setInputDisabled2(true)
        }
        catch (err) {
            alert.error("Error")
        }
    };

    return (

        <Card className="p-4">
            <h4>Configurations</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>BE Help Care Number</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            name="help_care_number"
                            value={settings.help_care_number}
                            onChange={handleChange}
                            disabled={inputDisabled}
                            placeholder="Enter BE Help Care Number"
                        />
                        <InputGroup.Text onClick={() => setInputDisabled(false)} style={{ marginRight: "1px", borderRight: "0.0625rem solid #d1d7e0", cursor: 'pointer' }}>
                            {inputDisabled ? <FontAwesomeIcon icon={faPencilAlt} /> : <></>}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mt-2">
                    <Form.Label>Learn Url</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            name="learnUrl"
                            value={settings.learnUrl}
                            onChange={handleChange}
                            disabled={inputDisabled2}
                            placeholder="Enter Learn Url"
                        />
                        <InputGroup.Text onClick={() => setInputDisabled2(false)} style={{ marginRight: "1px", borderRight: "0.0625rem solid #d1d7e0", cursor: 'pointer' }}>
                            {inputDisabled2 ? <FontAwesomeIcon icon={faPencilAlt} /> : <></>}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mt-2">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            disabled={inputDisabled3}
                            placeholder="Enter Email"
                        />
                        <InputGroup.Text onClick={() => setInputDisabled3(false)} style={{ marginRight: "1px", borderRight: "0.0625rem solid #d1d7e0", cursor: 'pointer' }}>
                            {inputDisabled3 ? <FontAwesomeIcon icon={faPencilAlt} /> : <></>}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mt-2">
                    <Form.Label>Address</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            disabled={inputDisabled4}
                            placeholder="Enter Address"
                        />
                        <InputGroup.Text onClick={() => setInputDisabled4(false)} style={{ marginRight: "1px", borderRight: "0.0625rem solid #d1d7e0", cursor: 'pointer' }}>
                            {inputDisabled4 ? <FontAwesomeIcon icon={faPencilAlt} /> : <></>}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Button variant="primary" className="mt-3" type="submit">
                    Save Settings
                </Button>
            </Form>
        </Card>

    );
};

