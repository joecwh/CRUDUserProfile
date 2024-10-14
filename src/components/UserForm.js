import React, { useEffect, useState } from 'react';
import { ReferralType, ReferralTypeDisplay } from '../enums/ReferralType'; 
import axios from 'axios';
import { isValidEmail } from '../utils/EmailValidator';
import { isValidPhoneNumber } from '../utils/PhoneNumberValidator';
import { format } from 'date-fns';

function User() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dob, setDob] = useState('');
    const [referralType, setReferralType] = useState(ReferralType.None); 
    const [userList, setUserList] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null); // Store the user ID being edited

    const [error, setError] = useState('');

    const API_URL = "https://localhost:7006/api/v1/user";

    useEffect(() => {
        fetchUserList(); 
    }, []);

    const fetchUserList = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            console.log('Fetched User Data:', result); // Log the entire response to inspect it

            if (result && Array.isArray(result.data)) {
                setUserList(result.data); // Set user list from the data array
            } else {
                console.error('Expected an array of users, but received:', result);
                setUserList([]); 
            }
        } catch (error) {
            console.error('Error fetching user list:', error);
            setUserList([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address (format: xxxx@xxxx.xxx).');
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setError('Please enter a valid phone number (format: 01x-xxx xxxx or 01x xxxx xxxx).');
            return;
        }

        // Proceed with form submission (e.g., send data to backend)
        setError(''); // Clear error if validation passes
        console.log('Email is valid:', email);
        console.log('Phone number is valid:', phoneNumber);
        // Add your form submission logic here

        const newUser = {
            fullName,
            email,
            phoneNumber,
            dateOfBirth: dob ? new Date(dob).toISOString() : null,
            referralType,
        };

        try {
            if (isEditing) {
                // Update existing user (assuming PUT request)
                const response = await axios.put(`${API_URL}/${editingUserId}`, newUser);
                if (response.status === 200) { // Assuming 200 is returned on successful update
                    fetchUserList();
                    resetForm();
                }
            } else {
                // Create new user
                const response = await axios.post(API_URL, newUser);
                if (response.status === 201) { // Assuming 201 is returned on successful creation
                    fetchUserList();
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };
  
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchId) {
            try {
                const response = await axios.get(`${API_URL}/${searchId}`);
                if (response.status === 200) {
                    const foundUser = response.data; // Store found user details
                    // Populate form with found user details
                    setFullName(foundUser.fullName);
                    setEmail(foundUser.email);
                    setPhoneNumber(foundUser.phoneNumber);
                    setDob(format(new Date(foundUser.dateOfBirth), 'yyyy-MM-dd'));
                    setReferralType(foundUser.referralType);
                    setIsEditing(true); // Set editing mode to true
                    setEditingUserId(foundUser.id); // Set the user ID being edited
                } else if (response.status === 204) {
                    // Clear the form when no user is found
                    resetForm();
                    setIsEditing(false); // Reset editing mode
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                resetForm(); // Clear the form if there's an error
                setIsEditing(false); // Reset editing mode
            }
        } else {
            fetchUserList(); // If search ID is empty, fetch all users
            resetForm(); // Clear the form when search ID is empty
            setIsEditing(false); // Reset editing mode
        }
    };

    const handleDelete = async (userId) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`${API_URL}/${userId}`);
                if (response.status === 200) { // Assuming 200 is returned on successful deletion
                    fetchUserList(); // Refresh the user list after deletion
                    resetForm(); // Clear form after deletion
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setDob('');
        setReferralType(ReferralType.None);
        setIsEditing(false); // Reset editing state
        setSearchId(''); // Reset search ID
        setEditingUserId(null); // Reset editing user ID
    };

    return (
        <div className="container">
            <div className="row vh-100 align-items-center">
                {/* Left column for the form */}
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} style={{ width: '400px' }}>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referralType" className="form-label">Referral Type</label>
                            <select
                                id="referralType"
                                value={referralType}
                                onChange={(e) => setReferralType(parseInt(e.target.value, 10))}
                                className="form-control"
                                required
                            >
                                {/* Map through ReferralType options */}
                                {Object.keys(ReferralType).map((key) => (
                                    <option key={key} value={ReferralType[key]}>
                                        {ReferralTypeDisplay[ReferralType[key]]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="d-flex flex-column align-items-start">
                            {/* Error message displayed above the buttons */}
                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Update' : 'Submit'}
                                </button>
                                {isEditing && (
                                    <button type="button" className="btn btn-danger ms-2" onClick={() => handleDelete(editingUserId)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="col-md-6">
                    <h3>List of Users</h3>
                    <form onSubmit={handleSearch} className="mb-3">
                        <input
                            type="text"
                            placeholder="Search by ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="form-control"
                        />
                        <button type="submit" className="btn btn-secondary mt-2">Search</button>
                    </form>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Date of Birth</th>
                                <th>Referral Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                                    <td>{ReferralTypeDisplay[user.referralType]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default User;
