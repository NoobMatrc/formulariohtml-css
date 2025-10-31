document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const interestError = document.getElementById('interestError');
    const successMessage = document.getElementById('successMessage');

    // Validación de correo electrónico en tiempo real
    emailInput.addEventListener('blur', function() {
        validateEmail();
    });

    emailInput.addEventListener('input', function() {
        if (emailError.textContent) {
            validateEmail();
        }
    });

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
            emailError.textContent = 'El correo electrónico es obligatorio';
            emailInput.setCustomValidity('Email inválido');
            return false;
        } else if (!emailRegex.test(emailValue)) {
            emailError.textContent = 'Por favor, ingresa un correo electrónico válido';
            emailInput.setCustomValidity('Email inválido');
            return false;
        } else {
            emailError.textContent = '';
            emailInput.setCustomValidity('');
            return true;
        }
    }

    // Validación de al menos un área de interés seleccionada
    function validateInterest() {
        const checkboxes = document.querySelectorAll('input[name="interest"]:checked');
        
        if (checkboxes.length === 0) {
            interestError.textContent = 'Por favor, selecciona al menos un área de interés';
            return false;
        } else {
            interestError.textContent = '';
            return true;
        }
    }

    // Agregar listeners a los checkboxes
    const interestCheckboxes = document.querySelectorAll('input[name="interest"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (interestError.textContent) {
                validateInterest();
            }
        });
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar email y área de interés
        const isEmailValid = validateEmail();
        const isInterestValid = validateInterest();

        if (!isEmailValid || !isInterestValid) {
            return;
        }

        // Recopilar datos del formulario
        const selectedInterests = Array.from(
            document.querySelectorAll('input[name="interest"]:checked')
        ).map(checkbox => checkbox.value);

        const formData = {
            nombre: document.getElementById('clientName').value,
            email: emailInput.value,
            telefono: document.getElementById('phone').value || 'No proporcionado',
            areasInteres: selectedInterests,
            mensaje: document.getElementById('message').value
        };

        // Mostrar datos en consola (para verificación)
        console.log('Datos del formulario de contacto:', formData);

        // Ocultar formulario y mostrar mensaje de éxito
        form.style.display = 'none';
        successMessage.classList.remove('hidden');

        // Opcional: resetear y mostrar el formulario nuevamente después de 4 segundos
        setTimeout(function() {
            form.reset();
            successMessage.classList.add('hidden');
            form.style.display = 'block';
            emailError.textContent = '';
            interestError.textContent = '';
        }, 4000);
    });
});