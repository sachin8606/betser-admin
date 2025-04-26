import React from 'react'; 
import '../assets/css/commentModal.css'
// Custom styles for the theme color
const customStyles = {
  header: {
    backgroundColor: '#016698',
    color: 'white',
    borderBottom: 'none',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    padding: '1rem 1.5rem'
  },
  badge: {
    backgroundColor: '#016698',
    fontWeight: '500'
  },
  footer: {
    display: 'none' // Hide the footer completely
  },
  timeStamp: {
    color: '#6c757d',
    fontSize: '0.85rem'
  },
  userName: {
    fontWeight: 'bold',
    color: '#333'
  },
  commentText: {
    marginTop: '5px',
    lineHeight: '1.5',
    color: '#444'
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1040,
    backdropFilter: 'blur(2px)'
  },
  modalContent: {
    zIndex: 1050,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    border: 'none'
  },
  modalBody: {
    padding: '0',
    maxHeight: '70vh',
    overflowY: 'auto',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px'
  },
  listItem: {
    padding: '1.25rem',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s ease'
  },
  commentWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    padding: '10px 15px',
    marginTop: '10px'
  },
  newComment: {
    backgroundColor: 'rgba(1, 102, 152, 0.05)',
    borderLeft: '3px solid #016698'
  },
  modalDialog: {
    margin: '1.75rem auto',
    maxWidth: '700px',
    width: '95%'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    color:'white'
  }
};

// Format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const CommentModal = ({ comments, show, handleClose }) => {
  if (!show) return null;
  
  // Add event listener to body to prevent scrolling when modal is open
  if (typeof document !== 'undefined' && show) {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
  }
  
  const closeModal = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    handleClose();
  };

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="modal-backdrop show commentModal" 
        style={customStyles.modalBackdrop} 
        onClick={closeModal}
      ></div>
      
      {/* Modal dialog */}
      <div 
        className="modal fade show" 
        style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}
        tabIndex="-1" 
        role="dialog"
      >
        <div className="modal-dialog" style={customStyles.modalDialog} role="document">
          <div className="modal-content" style={customStyles.modalContent}>
            <div className="modal-header" style={customStyles.header}>
              <h5 className="modal-title" style={customStyles.modalTitle}>
                Comment History
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={closeModal} 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={customStyles.modalBody}>
              {
                comments.length === 0 ? <h4 style={{textAlign:"center",margin:"10px 0px"}}>No comments found.</h4>:  <ul className="list-group list-group-flush">
                {comments.map((comment) => (
                  <li 
                    key={comment.id} 
                    className="list-group-item" 
                    style={{
                      ...customStyles.listItem,
                      ...(comment.isNew ? customStyles.newComment : {})
                    }}
                  >
                    <div className="container-fluid px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={customStyles.userName}>{comment.admin || comment.user}</span>
                        <div>
                          <span style={customStyles.timeStamp}>
                            {formatTimestamp(comment.createdAt || comment.timestamp)}
                          </span>
                          {comment.isNew && (
                            <span className="badge rounded-pill ms-2" style={customStyles.badge}>
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={customStyles.commentWrapper}>
                        <p style={customStyles.commentText}>{comment.comment || comment.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              }
            </div>
            {/* Footer is completely removed by setting display: none in the styles */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;