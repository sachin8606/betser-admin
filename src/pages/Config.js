import React, { useEffect, useState } from "react";
import { Card, Form, Button, InputGroup } from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createSettings, getSettings, updateSettings } from "../features/settingSlice";
import { useAlert } from "react-alert";

export default () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { setting, loading, error } = useSelector(state => state.setting)
    const [settings, setSettings] = useState({
        help_care_number: "",
    });


    useEffect(() => {
        dispatch(getSettings())
    }, [])

    useEffect(() => {
        setSettings({ help_care_number: setting?.help_care_number })
    }, [setting])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if(settings.help_care_number === "" || settings.help_care_number === null){
                alert.info("Please enter a valid value");
                return;
            }
            if (setting && setting?.id) {
                await dispatch(updateSettings({id:setting.id,data:settings})).unwrap()
                alert.success("Updated successfully")
            }
            else {
                await dispatch(createSettings(settings)).unwrap()
                alert.success("Added successfully.")
            }
            dispatch(getSettings())
        }
        catch (err) {
            alert.error("Error")
        }
    };

    return (
        <Card className="p-4">
            <h4>Configurations</h4>
            <Form onSubmit={handleSubmit}>
                {/* Customer Care Number */}
                <Form.Group>
                    <Form.Label>BE Help Care Number</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            name="help_care_number"
                            value={settings.help_care_number}
                            onChange={handleChange}
                            placeholder="Enter BE Help Care Number"
                        />
                    </InputGroup>
                </Form.Group>

                {/* Save Button */}
                <Button variant="primary" className="mt-3" type="submit">
                    Save Settings
                </Button>
            </Form>
        </Card>
    );
};

