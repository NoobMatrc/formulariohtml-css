document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const dateError = document.getElementById('dateError');
    const timeError = document.getElementById('timeError');
    const successMessage = document.getElementById('successMessage');
    const reservationDetails = document.getElementById('reservationDetails');

    // Establecer fecha mínima (hoy)
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', todayString);

    // Establecer fecha máxima (3 meses desde hoy)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxDateString = maxDate.toISOString().split('T')[0];
    dateInput.setAttribute('max', maxDateString);

    // Validación de fecha en tiempo real
    dateInput.addEventListener('change', function() {
        validateDate();
    });

    function validateDate() {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!dateInput.value) {
            dateError.textContent = '';
            return true;
        }

        if (selectedDate < today) {
            dateError.textContent = 'La fecha debe ser hoy o posterior';
            dateInput.setCustomValidity('Fecha inválida');
            return false;
        } else {
            dateError.textContent = '';
            dateInput.setCustomValidity('');
            return true;
        }
    }

    // Validación de hora (horario del restaurante: 12:00 - 23:00)
    timeInput.addEventListener('change', function() {
        validateTime();
    });

    function validateTime() {
        const selectedTime = timeInput.value;
        
        if (!selectedTime) {
            timeError.textContent = '';
            return true;
        }

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const openingTime = 12 * 60; // 12:00
        const closingTime = 23 * 60; // 23:00

        if (timeInMinutes < openingTime || timeInMinutes > closingTime) {
            timeError.textContent = 'Horario: 12:00 - 23:00';
            timeInput.setCustomValidity('Hora fuera del horario de atención');
            return false;
        } else {
            timeError.textContent = '';
            timeInput.setCustomValidity('');
            return true;
        }
    }

    // Función para formatear la fecha en español
    function formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formatted = date.toLocaleDateString('es-ES', options);
        // Capitalizar primera letra
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    // Función para formatear la hora
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes} hrs`;
    }

    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar fecha y hora antes de enviar
        const isDateValid = validateDate();
        const isTimeValid = validateTime();

        if (!isDateValid || !isTimeValid) {
            // Scroll al primer error
            if (!isDateValid) {
                dateInput.focus();
            } else if (!isTimeValid) {
                timeInput.focus();
            }
            return;
        }

        // Recopilar datos del formulario
        const formData = {
            nombre: document.getElementById('customerName').value,
            fecha: dateInput.value,
            hora: timeInput.value,
            numeroPersonas: document.getElementById('numberOfPeople').value,
            ubicacion: document.querySelector('input[name="location"]:checked').value,
            comentarios: document.getElementById('comments').value.trim()
        };

        // Mostrar datos en consola (para desarrollo/debug)
        console.log('📋 Datos de la reserva:', formData);

        // Preparar textos para mostrar
        const locationText = formData.ubicacion === 'interior' ? '🏠 Interior' : '🌿 Terraza';
        const peopleText = formData.numeroPersonas === '1' ? '1 persona' : `${formData.numeroPersonas} personas`;
        
        // Construir HTML del detalle de reserva
        let detailsHTML = `
            <p><strong>Nombre:</strong> ${formData.nombre}</p>
            <p><strong>Fecha:</strong> ${formatDate(formData.fecha)}</p>
            <p><strong>Hora:</strong> ${formatTime(formData.hora)}</p>
            <p><strong>Personas:</strong> ${peopleText}</p>
            <p><strong>Ubicación:</strong> ${locationText}</p>
        `;
        
        // Agregar comentarios solo si existen
        if (formData.comentarios) {
            detailsHTML += `<p><strong>Comentarios:</strong> ${formData.comentarios}</p>`;
        }
        
        reservationDetails.innerHTML = detailsHTML;

        // Ocultar formulario con animación
        form.style.opacity = '0';
        form.style.transform = 'scale(0.95)';
        
        setTimeout(function() {
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
        }, 300);

        // Opcional: resetear y mostrar el formulario nuevamente después de 7 segundos
        setTimeout(function() {
            successMessage.classList.add('hidden');
            form.style.display = 'block';
            
            // Restaurar transición
            setTimeout(function() {
                form.style.opacity = '1';
                form.style.transform = 'scale(1)';
            }, 50);
            
            form.reset();
            dateError.textContent = '';
            timeError.textContent = '';
        }, 7000);
    });

    // Agregar transición suave al formulario
    form.style.transition = 'all 0.3s ease';
});