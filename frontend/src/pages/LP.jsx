import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';
import { getAllLPs, createLP, updateLP, deleteLP } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const LP = () => {
  const [lps, setLPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchLPs();
  }, []);

  const fetchLPs = async () => {
    try {
      setLoading(true);
      const data = await getAllLPs();
      setLPs(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch LP data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLPClick = (lpId) => {
    navigate(`/sprindik/${lpId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await updateLP(editId, formData);
      } else {
        await createLP(formData);
      }
      
      closeModal();
      fetchLPs();
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} LP`);
      console.error(err);
    }
  };

  const handleEdit = (lp) => {
    setEditMode(true);
    setEditId(lp.id);
    setFormData({ nama: lp.nama });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this LP?')) {
      try {
        await deleteLP(id);
        fetchLPs();
      } catch (err) {
        setError('Failed to delete LP');
        console.error(err);
      }
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ nama: '' });
  };

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }} className="page-header">
          <h2 style={{ color: 'var(--primary-color)' }}>LP</h2>
          
          {isAdmin && (
            <button 
              className="btn btn-primary responsive-btn" 
              onClick={openModal}
            >
              Add New LP
            </button>
          )}
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#842029', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}
        
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <PuffLoader
              color="var(--primary-color)"
              loading={true}
              size={50}
              aria-label="Loading Data"
            />
            <div style={{
              color: 'var(--primary-color)',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Loading LP data...
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className={`table lp-table ${isAdmin ? 'admin-mode' : 'viewer-mode'}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {lps.length > 0 ? (
                  lps.map((lp) => (
                    <tr key={lp.id}>
                      <td>{lp.id}</td>
                      <td 
                        style={{ cursor: 'pointer', color: 'var(--primary-color)' }}
                        onClick={() => handleLPClick(lp.id)}
                      >
                        LP_{lp.nama}
                      </td>
                      {isAdmin && (
                        <td>
                          <button 
                            className="btn btn-secondary" 
                            style={{ marginRight: '0.5rem' }}
                            onClick={() => handleEdit(lp)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-secondary"
                            style={{ backgroundColor: '#f8d7da', color: '#842029', border: 'none' }}
                            onClick={() => handleDelete(lp.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 3 : 2}>No LP found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginBottom: '1.5rem' }}>
              {editMode ? 'Edit LP' : 'Add New LP'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="nama"
                  className="form-input"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '1rem', 
                marginTop: '1.5rem' 
              }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editMode ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LP;
