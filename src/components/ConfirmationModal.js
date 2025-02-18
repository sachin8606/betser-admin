import React from "react";
import { Modal, Button } from "@themesberg/react-bootstrap";

const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
  // Inline styles (JSON format)
  const styles = {
    modalContent: {
      background: "rgba(255, 255, 255, 0.15)", // Glass effect
      backdropFilter: "blur(10px)", // Blur background
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "25px",
      textAlign: "center",
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#222",
      marginBottom: "10px",
    },
    message: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "20px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
    },
    button: {
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "16px",
      transition: "all 0.3s ease",
    },
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body style={styles.modalContent}>
        <h4 style={styles.title}>{title || "Confirm Action"}</h4>
        <p style={styles.message}>{message || "Are you sure you want to proceed?"}</p>

        <div style={styles.buttonContainer}>
          <Button variant="light" onClick={onClose} style={styles.button}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} style={styles.button}>
            Confirm
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;
