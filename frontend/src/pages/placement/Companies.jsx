import { useEffect, useState } from "react";
import {
    Building2,
    Globe,
    MapPin,
    User,
    Mail,
    Phone,
    FileText,
    Plus,
    ExternalLink,
    Inbox,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Companies.css";

const Companies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    
    const [formData, setFormData] = useState({
        name: "",
        website: "",
        location: "",
        description: "",
        contact_person: "",
        email: "",
        phone: "",
    });
    
    // const token = localStorage.getItem("access_token");
    
    useEffect(() => {
        fetchCompanies();
    }, []);
    
    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies/");
            
            setCompanies(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await api.post("/companies/", formData);
            
            alert("Company Added");
            
            setFormData({
                name: "",
                website: "",
                location: "",
                description: "",
                contact_person: "",
                email: "",
                phone: "",
            });
            
            fetchCompanies();
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

        <div className="co-root">
        
        {/* Page hero — page-specific title/eyebrow, no duplicate logo */}
        
        <div className="co-header">
        <div className="co-header-blob" />
        <div className="co-header-grid" />
        <div className="co-header-top">
        <div className="co-header-text">
        <span className="co-header-eyebrow">
        <Building2 /> Placement Partners
        </span>
        
        <h1 className="co-header-title">Company Management</h1>
        
        <p className="co-header-sub">
        Manage recruiting companies and placement partners.
        </p>
        </div>
        </div>
        </div>
        
        {/* Summary */}
        
        <div className="co-stat-card">
        <div className="co-stat-icon"><Building2 /></div>
        <div>
        <p className="co-stat-label">Total Companies</p>
        <h1 className="co-stat-value">{companies.length}</h1>
        </div>
        </div>
        
        {/* Add Company Form */}
        
        <div className="co-panel">
        <div className="co-panel-head">
        <h2 className="co-panel-title">Add Company</h2>
        <p className="co-panel-subtitle">Register a new recruiting partner</p>
        </div>
        
        <form onSubmit={handleSubmit}>
        <div className="co-form-grid">
        <div className="co-field">
        <label className="co-label">Company Name</label>
        <div className="co-input-wrap">
        <Building2 className="co-input-icon" />
        <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="co-input"
        placeholder="e.g. Infineon Technologies"
        />
        </div>
        </div>
        
        <div className="co-field">
        <label className="co-label">Website</label>
        <div className="co-input-wrap">
        <Globe className="co-input-icon" />
        <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        className="co-input"
        placeholder="https://example.com"
        />
        </div>
        </div>
        
        <div className="co-field">
        <label className="co-label">Contact Person</label>
        <div className="co-input-wrap">
        <User className="co-input-icon" />
        <input
        type="text"
        name="contact_person"
        value={formData.contact_person}
        onChange={handleChange}
        className="co-input"
        placeholder="Full name"
        />
        </div>
        </div>
        
        <div className="co-field">
        <label className="co-label">Email</label>
        <div className="co-input-wrap">
        <Mail className="co-input-icon" />
        <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="co-input"
        placeholder="contact@company.com"
        />
        </div>
        </div>
        
        <div className="co-field">
        <label className="co-label">Phone</label>
        <div className="co-input-wrap">
        <Phone className="co-input-icon" />
        <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="co-input"
        placeholder="+91 00000 00000"
        />
        </div>
        </div>
        
        <div className="co-field">
        <label className="co-label">Location</label>
        <div className="co-input-wrap">
        <MapPin className="co-input-icon" />
        <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="co-input"
        placeholder="City, Country"
        />
        </div>
        </div>
        
        <div className="co-field co-field-full">
        <label className="co-label">Description</label>
        <div className="co-input-wrap co-input-wrap-textarea">
        <FileText className="co-input-icon co-input-icon-textarea" />
        <textarea
        rows="4"
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="co-input co-textarea"
        placeholder="Brief note about the company, hiring focus, etc."
        />
        </div>
        </div>
        </div>
        
        <button type="submit" className="co-submit-btn">
        <Plus />
        Add Company
        </button>
        </form>
        </div>
        
        {/* Company List */}
        
        <div className="co-panel">
        <div className="co-panel-head">
        <h2 className="co-panel-title">Company List</h2>
        <p className="co-panel-subtitle">{companies.length} partner{companies.length === 1 ? "" : "s"} on record</p>
        </div>
        
        {companies.length === 0 ? (
            <div className="co-empty">
            <div className="co-empty-icon"><Inbox /></div>
            <p className="co-empty-title">No companies found</p>
            <p className="co-empty-sub">Companies you add will appear here.</p>
            </div>
        ) : (
            <div className="co-list-grid">
            {companies.map((company) => (
                <div key={company.id} className="co-card">
                <div className="co-card-head">
                <div className="co-avatar">
                {company.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                <h3 className="co-card-name">{company.name}</h3>
                <span className="co-card-location">
                <MapPin />
                {company.location || "Location not available"}
                </span>
                </div>
                </div>
                
                <div className="co-card-rows">
                <div className="co-card-row">
                <Globe className="co-card-row-icon" />
                {company.website ? (
                    <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="co-card-link"
                    >
                    {company.website}
                    <ExternalLink />
                    </a>
                ) : (
                    <span className="co-card-muted">Not available</span>
                )}
                </div>
                
                <div className="co-card-row">
                <User className="co-card-row-icon" />
                <span>{company.contact_person || "Not available"}</span>
                </div>
                
                <div className="co-card-row">
                <Mail className="co-card-row-icon" />
                <span>{company.email || "Not available"}</span>
                </div>
                
                <div className="co-card-row">
                <Phone className="co-card-row-icon" />
                <span>{company.phone || "Not available"}</span>
                </div>
                </div>
                
                {company.description && (
                    <p className="co-card-desc">{company.description}</p>
                )}
                </div>
            ))}
            </div>
        )}
        </div>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

export default Companies;