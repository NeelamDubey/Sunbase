let authToken = null;

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const loginId = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;
    authenticateUser(loginId, password);
});

document.getElementById('addCustomerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    if (!authToken) {
        alert('Please login first.');
        return;
    }
    const customerData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
    };
    createCustomer(customerData);
});

function authenticateUser(loginId, password) {
    const authApiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';
    const authRequestBody = {
        login_id: loginId,
        password: password,
    };
    fetch(authApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authRequestBody),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                authToken = data.token;
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('customerListScreen').style.display = 'block';
                getCustomerList();
            } else {
                alert('Authentication failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error authenticating user:', error.message);
        });
}

function createCustomer(customerData) {
    const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
    const requestBody = {
        cmd: 'create',
        ...customerData,
    };
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 201) {
                alert('Customer created successfully.');
                getCustomerList();
            } else {
                alert(`Failed to create customer. Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error creating customer:', error.message);
        });
}

function getCustomerList() {
    const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list';
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('customerTableBody');
            tbody.innerHTML = '';
            data.forEach(customer => {
                const row = tbody.insertRow();
                Object.values(customer).forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value;
                });

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', function () {
                    editCustomer(customer.uuid);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () {
                    deleteCustomer(customer.uuid);
                });

                const actionCell = row.insertCell();
                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);
            });
        })
        .catch(error => {
            console.error('Error getting customer list:', error.message);
        });
}

function deleteCustomer(customerUUID) {
    const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
    const requestBody = {
        cmd: 'delete',
        uuid: customerUUID,
    };
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                alert('Customer deleted successfully.');
                getCustomerList();
            } else {
                alert(`Failed to delete customer. Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error deleting customer:', error.message);
        });
}

function editCustomer(customerUUID) {
    // Implement your edit logic here
    // You can show the edit form with existing customer details and update the details on save
    // You may use a similar approach as the 'createCustomer' function
    const customerForm = document.getElementById('customerForm');
    customerForm.style.display = 'block';

    // Fetch the existing customer details using customerUUID
    // Populate the form fields with the fetched details

    // Example (replace with actual implementation):
    // const editFirstNameInput = document.getElementById('edit_first_name');
    // const editLastNameInput = document.getElementById('edit_last_name');
    // const editEmailInput = document.getElementById('edit_email');
    // fetchCustomerDetails(customerUUID)
    //     .then(details => {
    //         editFirstNameInput.value = details.first_name;
    //         editLastNameInput.value = details.last_name;
    //         editEmailInput.value = details.email;
    //     })
    //     .catch(error => {
    //         console.error('Error fetching customer details for edit:', error.message);
    //     });

    // On 'Save Changes' button click, make a POST request to the update API
    const saveChangesButton = document.querySelector('#customerForm button');
    saveChangesButton.addEventListener('click', function () {
        // Get updated details from form fields
        const updatedCustomerData = {
            first_name: document.getElementById('edit_first_name').value,
            last_name: document.getElementById('edit_last_name').value,
            email: document.getElementById('edit_email').value,
            // Include other parameters as needed
        };
        // Make a POST request to the update API
        updateCustomer(customerUUID, updatedCustomerData);
    });
}

// Function to update a customer
function updateCustomer(customerUUID, updatedCustomerData) {
    const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
    const requestBody = {
        cmd: 'update',
        uuid: customerUUID,
        ...updatedCustomerData,
    };
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                alert('Customer updated successfully.');
                getCustomerList();
                // Hide the edit form
                document.getElementById('customerForm').style.display = 'none';
            } else {
                alert(`Failed to update customer. Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error updating customer:', error.message);
        });
}
