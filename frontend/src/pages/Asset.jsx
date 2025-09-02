import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';
import { getAssetsByBAId, getBAById, createAsset, updateAsset, deleteAsset, getAssetsByCategory } from '../services/api';
import { getAuthenticatedFileUrl } from '../services/fileService';
import Navbar from '../components/Navbar';
import PDFViewer from '../components/PDFViewer';
import { useAuth } from '../contexts/AuthContext';

const Asset = () => {
  const { baId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [assets, setAssets] = useState([]);
  const [baData, setBAData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    judul_aset: '',
    deskripsi: '',
    kategori_asset: '1', // Default to 'bergerak'
    ba_id: baId,
    file_pdf_aset: null
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [baId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch BA data
      const baResponse = await getBAById(baId);
      setBAData(baResponse);
      
      // Fetch Assets for this BA
      const assetResponse = await getAssetsByBAId(baId);
      setAssets(assetResponse);
      
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      
      let filteredAssets;
      if (category === 'all') {
        filteredAssets = await getAssetsByBAId(baId);
      } else {
        // First get all assets for this BA
        const allAssets = await getAssetsByBAId(baId);
        // Then filter by category
        filteredAssets = allAssets.filter(asset => 
          asset.kategori_asset.toString() === category
        );
      }
      
      setAssets(filteredAssets);
      setError('');
    } catch (err) {
      setError('Failed to filter assets');
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
    setFormData({ ...formData, file_pdf_aset: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formPayload = new FormData();
      formPayload.append('judul_aset', formData.judul_aset);
      formPayload.append('deskripsi', formData.deskripsi);
      formPayload.append('kategori_asset', formData.kategori_asset);
      formPayload.append('ba_id', formData.ba_id);
      
      if (formData.file_pdf_aset) {
        formPayload.append('file_pdf_aset', formData.file_pdf_aset);
      }
      
      if (editMode) {
        await updateAsset(editId, formPayload);
      } else {
        await createAsset(formPayload);
      }
      
      closeModal();
      fetchData();
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} Asset`);
      console.error(err);
    }
  };

  const handleViewPdf = (pdfPath, documentTitle) => {
    try {
      const authenticatedUrl = getAuthenticatedFileUrl(pdfPath);
      setSelectedPdf(authenticatedUrl);
      setSelectedDocumentTitle(documentTitle);
      setShowPdfModal(true);
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Error loading PDF file: ' + error.message);
    }
  };

  const handleEdit = (asset) => {
    setEditMode(true);
    setEditId(asset.id);
    setFormData({
      judul_aset: asset.judul_aset,
      deskripsi: asset.deskripsi,
      kategori_asset: asset.kategori_asset.toString(),
      ba_id: asset.ba_id,
      file_pdf_aset: null // File input can't be pre-filled
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Asset?')) {
      try {
        await deleteAsset(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete Asset');
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
    setFormData({
      judul_aset: '',
      deskripsi: '',
      kategori_asset: '1',
      ba_id: baId,
      file_pdf_aset: null
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
            onClick={() => navigate(`/berita-acara/${baData?.sprindik_id}`)}
            style={{ marginBottom: '1rem' }}
          >
            &larr; Back to Berita Acara
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {!loading && (
                <h2 style={{ color: 'var(--primary-color)' }}>
                  Asset_{baData?.judul_ba}
                </h2>
              )}
            </div>
            
            {isAdmin && (
              <button 
                className="btn btn-primary" 
                onClick={openModal}
              >
                Add New Asset
              </button>
            )}
          </div>
        </div>
        
        {/* Category Filter */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label htmlFor="category-filter" style={{ fontWeight: '500' }}>Filter by Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="all">All Categories</option>
              <option value="1">Bergerak</option>
              <option value="2">Tidak Bergerak</option>
            </select>
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
            <table className="table asset-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>PDF</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr key={asset.id}>
                      <td>{asset.id}</td>
                      <td>{asset.judul_aset}</td>
                      <td>
                        {asset.kategori_asset === 1 ? 'Bergerak' : 'Tidak Bergerak'}
                      </td>
                      <td className="text-wrap">{asset.deskripsi}</td>
                      <td>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleViewPdf(asset.file_path, asset.judul_aset)}
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          View Document
                        </button>
                      </td>
                      {isAdmin && (
                        <td>
                          <button 
                            className="btn btn-secondary"
                            style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => handleEdit(asset)}
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
                            onClick={() => handleDelete(asset.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5}>No Asset records found for this Berita Acara</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add/Edit Asset Modal */}
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
              {editMode ? 'Edit Asset' : 'Add New Asset'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="judul_aset"
                  className="form-input"
                  value={formData.judul_aset}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="form-label">Category</label>
                <select
                  name="kategori_asset"
                  className="form-input"
                  value={formData.kategori_asset}
                  onChange={handleInputChange}
                  required
                >
                  <option value="1">Bergerak</option>
                  <option value="2">Tidak Bergerak</option>
                </select>
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
                  name="file_pdf_aset"
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

export default Asset;
