import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';
import { getBAsaBySprindikId, getSprindikById, createBA, updateBA, deleteBA } from '../services/api';
import { getAuthenticatedFileUrl } from '../services/fileService';
import Navbar from '../components/Navbar';
import PDFViewer from '../components/PDFViewer';
import { useAuth } from '../contexts/AuthContext';

const BeritaAcara = () => {
  const { sprindikId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [bas, setBAs] = useState([]);
  const [sprindikData, setSprindikData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState('');
  
  const [formData, setFormData] = useState({
    judul_ba: '',
    deskripsi: '',
    sprindik_id: sprindikId,
    file_pdf_ba: null
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [sprindikId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Sprindik data
      const sprindikResponse = await getSprindikById(sprindikId);
      setSprindikData(sprindikResponse);
      
      // Fetch BAs for this Sprindik
      const baResponse = await getBAsaBySprindikId(sprindikId);
      setBAs(baResponse);
      
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file_pdf_ba: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formPayload = new FormData();
      formPayload.append('judul_ba', formData.judul_ba);
      formPayload.append('deskripsi', formData.deskripsi);
      formPayload.append('sprindik_id', formData.sprindik_id);
      
      if (formData.file_pdf_ba) {
        formPayload.append('file_pdf_ba', formData.file_pdf_ba);
      }
      
      if (editMode) {
        await updateBA(editId, formPayload);
      } else {
        await createBA(formPayload);
      }
      
      closeModal();
      fetchData();
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} Berita Acara`);
      console.error(err);
    }
  };

  const handleViewPdf = (pdfPath, documentTitle) => {
    const authenticatedUrl = getAuthenticatedFileUrl(pdfPath);
    setSelectedPdf(authenticatedUrl);
    setSelectedDocumentTitle(documentTitle);
    setShowPdfModal(true);
  };

  const handleEdit = (ba) => {
    setEditMode(true);
    setEditId(ba.id);
    setFormData({
      judul_ba: ba.judul_ba,
      deskripsi: ba.deskripsi,
      sprindik_id: ba.sprindik_id,
      file_pdf_ba: null // File input can't be pre-filled
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Berita Acara?')) {
      try {
        await deleteBA(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete Berita Acara');
        console.error(err);
      }
    }
  };

  const navigateToAsset = (baId) => {
    navigate(`/asset/${baId}`);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
    setFormData({
      judul_ba: '',
      deskripsi: '',
      sprindik_id: sprindikId,
      file_pdf_ba: null
    });
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdf('');
    setSelectedDocumentTitle('');
  };

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate(`/sprindik/${sprindikData?.lp_id}`)}
            style={{ marginBottom: '1rem' }}
          >
            &larr; Back to Sprindik
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="page-header">
            <div>
              {!loading && (
                <h2 style={{ color: 'var(--primary-color)' }}>
                  Berita Acara_{sprindikData?.judul_sprindik}
                </h2>
              )}
            </div>
            
            {isAdmin && (
              <button 
                className="btn btn-primary responsive-btn" 
                onClick={openModal}
              >
                Add New Berita Acara
              </button>
            )}
          </div>
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
              Loading data...
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>PDF</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bas.length > 0 ? (
                  bas.map((ba, index) => (
                    <tr key={ba.id}>
                      <td>{index + 1}</td>
                      <td>{ba.judul_ba}</td>
                      <td className="text-wrap">{ba.deskripsi}</td>
                      <td>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleViewPdf(ba.file_path, ba.judul_ba)}
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          View Document
                        </button>
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary"
                          style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => navigateToAsset(ba.id)}
                        >
                          View Assets
                        </button>
                        
                        {isAdmin && (
                          <>
                            <button 
                              className="btn btn-secondary"
                              style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
                              onClick={() => handleEdit(ba)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-secondary"
                              style={{ 
                                backgroundColor: '#f8d7da', 
                                color: '#842029', 
                                border: 'none',
                                padding: '0.25rem 0.5rem'
                              }}
                              onClick={() => handleDelete(ba.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No Berita Acara records found for this Sprindik</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add/Edit BA Modal */}
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
            maxWidth: '600px'
          }}>
            <h3 style={{ marginBottom: '1.5rem' }}>
              {editMode ? 'Edit Berita Acara' : 'Add New Berita Acara'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="judul_ba"
                  className="form-input"
                  value={formData.judul_ba}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="form-label">Description</label>
                <textarea
                  name="deskripsi"
                  className="form-input"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows={4}
                  style={{ resize: 'none' }}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="form-label">PDF Document</label>
                <input
                  type="file"
                  name="file_pdf_ba"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="form-input"
                  required={!editMode}
                />
                {editMode && (
                  <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
                    Leave empty to keep the current file
                  </small>
                )}
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
      
      {/* PDF Viewer Modal */}
      {showPdfModal && (
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
            padding: '0.5rem',
            borderRadius: '8px',
            width: '98%',
            height: '98%',
            maxWidth: '1400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: '0.5rem',
              borderBottom: '2px solid #eee',
              paddingBottom: '0.75rem',
              position: 'relative'
            }}>
              <h3 style={{ 
                margin: 0, 
                color: 'var(--primary-color)',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {selectedDocumentTitle || 'Document Viewer'}
              </h3>
              <button 
                className="btn btn-secondary"
                onClick={closePdfModal}
                style={{ 
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                Close
              </button>
            </div>
            
            <div style={{ 
              flex: 1, 
              height: 'calc(100% - 3rem)',
              overflow: 'hidden',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <PDFViewer fileUrl={selectedPdf} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeritaAcara;
