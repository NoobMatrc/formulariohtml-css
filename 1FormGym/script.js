document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const ageInput = document.getElementById('age');
    const ageError = document.getElementById('ageError');
    const successMessage = document.getElementById('successMessage');

    // Validación de edad en tiempo real
    ageInput.addEventListener('input', function() {
        const age = parseInt(this.value);
        
        if (this.value && age <= 15) {
            ageError.textContent = 'Debes tener más de 15 años para registrarte';
            this.setCustomValidity('Edad mínima no cumplida');
        } else {
            ageError.textContent = '';
            this.setCustomValidity('');
        }
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar edad nuevamente
        const age = parseInt(ageInput.value);
        if (age <= 15) {
            ageError.textContent = 'Debes tener más de 15 años para registrarte';
            ageInput.focus();
            return;
        }

        // Recopilar datos del formulario
        const formData = {
            nombreCompleto: document.getElementById('fullName').value,
            edad: age,
            genero: document.querySelector('input[name="gender"]:checked').value,
            plan: document.getElementById('plan').value,
            terminosAceptados: document.getElementById('terms').checked
        };

        // Mostrar datos en consola
        console.log('Datos del nuevo socio:', formData);

        // Ocultar formulario y mostrar mensaje de éxito
        form.style.display = 'none';
        successMessage.classList.remove('hidden');

        // Resetear y mostrar el formulario nuevamente después de 3 segundos
        setTimeout(function() {
            form.reset();
            successMessage.classList.add('hidden');
            form.style.display = 'block';
        }, 3000);
    });

    // Validación adicional para el checkbox de términos
    const termsCheckbox = document.getElementById('terms');
    termsCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            this.setCustomValidity('Debes aceptar los términos y condiciones');
        } else {
            this.setCustomValidity('');
        }
    });
});