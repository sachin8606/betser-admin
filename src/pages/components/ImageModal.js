import React from "react";
import { Modal, Button, Image } from "@themesberg/react-bootstrap";
import "../../assets/css/common.css";
export default({ show, onClose, imageUrl }) => {
    return (
        <Modal 
          show={show} 
          onHide={onClose} 
          centered
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Image Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <Image src={imageUrl} alt="Preview" className="img-fluid rounded" />
          </Modal.Body>
        </Modal>
      );
};

