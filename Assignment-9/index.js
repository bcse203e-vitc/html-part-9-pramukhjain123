document.addEventListener('DOMContentLoaded', function() {
    const bookButtons = document.querySelectorAll('.book-btn');
    const modal = document.getElementById('appointment-modal');
    const closeBtn = modal.querySelector('.close-btn');
    const form = document.getElementById('appointment-form');
    const confirmationPopup = document.getElementById('confirmation-popup');
    const confirmationMessage = document.getElementById('confirmation-message');
    const confirmationCloseBtn = confirmationPopup.querySelector('.close-btn');

    
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.parentElement.getAttribute('data-service');
            form.service.value = service;
            modal.style.display = 'block';
        });
    });

    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    
    confirmationCloseBtn.addEventListener('click', function() {
        confirmationPopup.style.display = 'none';
    });

    
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        
        document.querySelectorAll('.error').forEach(error => error.textContent = '');

        
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const datetime = new Date(form.datetime.value);
        const terms = form.terms.checked;
        let isValid = true;

        if (name === '') {
            isValid = false;
            document.getElementById('name-error').textContent = 'Name is required.';
        }

        if (!validateEmail(email)) {
            isValid = false;
            document.getElementById('email-error').textContent = 'Invalid email format.';
        }

        if (!/^\d{10}$/.test(phone)) {
            isValid = false;
            document.getElementById('phone-error').textContent = 'Phone number must be 10 digits.';
        }

        if (isNaN(datetime.getTime()) || datetime <= new Date()) {
            isValid = false;
            document.getElementById('datetime-error').textContent = 'Date and time must be in the future.';
        }

        if (!terms) {
            isValid = false;
            document.getElementById('terms-error').textContent = 'You must agree to the terms and conditions.';
        }

        if (isValid) {
            const appointment = {
                name,
                email,
                phone,
                service: form.service.value,
                datetime: datetime.toISOString(),
                requests: form.requests.value,
                status: 'Pending'
            };

            saveAppointment(appointment);
            addAppointmentToTable(appointment);

            modal.style.display = 'none';
            confirmationMessage.textContent = `Thank you, ${name}! Your appointment for ${form.service.value} on ${datetime.toLocaleString()} is confirmed.`;
            confirmationPopup.style.display = 'block';
        }
    });

  
    loadAppointments();

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function saveAppointment(appointment) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    function loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.forEach(addAppointmentToTable);
    }

    function addAppointmentToTable(appointment) {
        const table = document.getElementById('appointments-table').getElementsByTagName('tbody')[0];
        const row = table.insertRow();
        row.insertCell(0).textContent = appointment.name;
        row.insertCell(1).textContent = appointment.service;
        row.insertCell(2).textContent = new Date(appointment.datetime).toLocaleString();
        row.insertCell(3).textContent = appointment.status;
    }
});
