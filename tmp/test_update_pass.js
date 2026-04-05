const axios = require('axios');

async function testUpdate() {
    try {
        // First login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/admin-login', {
            password: 'admin123'
        });
        
        const token = loginRes.data.data.token;
        console.log('Logged in, token:', token);

        // Update password
        const updateRes = await axios.put('http://localhost:5000/api/admin/security-password', {
            password: 'newpassword123'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Update result:', JSON.stringify(updateRes.data, null, 2));
    } catch (error) {
        console.error('Update failed:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testUpdate();
