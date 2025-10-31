document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    const patientNameInput = document.getElementById('patientName');
    const departmentSelect = document.getElementById('department');
    const commentsTextarea = document.getElementById('comments');
    const satisfactionError = document.getElementById('satisfactionError');
    const successMessage = document.getElementById('successMessage');
    const surveyResults = document.getElementById('surveyResults');

    // Objeto para traducir los valores
    const departmentNames = {
        'pediatria': 'Pediatría',
        'cirugia': 'Cirugía',
        'traumatologia': 'Traumatología',
        'cardiologia': 'Cardiología'
    };

    const satisfactionLevels = {
        'muy-satisfecho': { text: 'Muy satisfecho', emoji: '😄', color: '#2ecc71' },
        'satisfecho': { text: 'Satisfecho', emoji: '🙂', color: '#a8e6cf' },
        'regular': { text: 'Regular', emoji: '😐', color: '#ffd93d' },
        'insatisfecho': { text: 'Insatisfecho', emoji: '😞', color: '#ff6b6b' }
    };

    // Validación de nivel de satisfacción
    function validateSatisfaction() {
        const selectedSatisfaction = document.querySelector('input[name="satisfaction"]:checked');
        
        if (!selectedSatisfaction) {
            satisfactionError.textContent = 'Por favor, selecciona tu nivel de satisfacción';
            return false;
        } else {
            satisfactionError.textContent = '';
            return true;
        }
    }

    // Limpiar error cuando se seleccione una opción
    const satisfactionRadios = document.querySelectorAll('input[name="satisfaction"]');
    satisfactionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (satisfactionError.textContent) {
                validateSatisfaction();
            }
        });
    });

    // Efecto de expansión adicional en el textarea (opcional)
    commentsTextarea.addEventListener('focus', function() {
        this.style.minHeight = '180px';
    });

    // Contador de caracteres para el textarea (opcional)
    let charCounter = document.createElement('div');
    charCounter.style.textAlign = 'right';
    charCounter.style.fontSize = '12px';
    charCounter.style.color = '#95a5a6';
    charCounter.style.marginTop = '5px';
    commentsTextarea.parentNode.appendChild(charCounter);

    commentsTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = `${length} caracteres`;
        
        if (length > 500) {
            charCounter.style.color = '#e74c3c';
        } else {
            charCounter.style.color = '#95a5a6';
        }
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar nivel de satisfacción
        const isSatisfactionValid = validateSatisfaction();
        
        if (!isSatisfactionValid) {
            // Hacer scroll hasta los radio buttons
            document.querySelector('.satisfaction-group').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            return;
        }

        // Recopilar datos del formulario
        const selectedSatisfaction = document.querySelector('input[name="satisfaction"]:checked').value;
        
        const formData = {
            nombrePaciente: patientNameInput.value.trim(),
            departamento: departmentSelect.value,
            nivelSatisfaccion: selectedSatisfaction,
            comentarios: commentsTextarea.value.trim()
        };

        // Mostrar datos en consola (para desarrollo)
        console.log('📋 Datos de la encuesta:', formData);

        // Preparar el resumen de la encuesta
        const satisfactionInfo = satisfactionLevels[formData.nivelSatisfaccion];
        const departmentName = departmentNames[formData.departamento];

        let resultsHTML = `
            <p><strong>Paciente:</strong> ${formData.nombrePaciente}</p>
            <p><strong>Departamento:</strong> ${departmentName}</p>
            <p>
                <strong>Nivel de satisfacción:</strong> 
                <span class="satisfaction-level" style="background-color: ${satisfactionInfo.color}; color: ${formData.nivelSatisfaccion === 'satisfecho' || formData.nivelSatisfaccion === 'regular' ? '#2c3e50' : 'white'}">
                    ${satisfactionInfo.emoji} ${satisfactionInfo.text}
                </span>
            </p>
        `;

        if (formData.comentarios) {
            resultsHTML += `
                <p><strong>Comentarios:</strong></p>
                <p style="font-style: italic; padding: 10px; background: white; border-radius: 8px; margin-top: 8px;">
                    "${formData.comentarios}"
                </p>
            `;
        }

        surveyResults.innerHTML = resultsHTML;

        // Animación de envío del botón
        const submitButton = form.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Enviando...</span> <span class="button-icon">⏳</span>';
        
        // Simular delay de envío
        setTimeout(function() {
            // Ocultar formulario con animación
            form.style.opacity = '0';
            form.style.transform = 'scale(0.95)';
            
            setTimeout(function() {
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
                
                // Opcional: resetear el formulario después de 6 segundos
                setTimeout(function() {
                    successMessage.classList.add('hidden');
                    form.style.display = 'block';
                    
                    setTimeout(function() {
                        form.style.opacity = '1';
                        form.style.transform = 'scale(1)';
                    }, 50);
                    
                    form.reset();
                    charCounter.textContent = '';
                    commentsTextarea.style.minHeight = '80px';
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Enviar encuesta</span> <span class="button-icon">📨</span>';
                    satisfactionError.textContent = '';
                }, 6000);
            }, 300);
        }, 1500);
    });

    // Agregar transición suave al formulario
    form.style.transition = 'all 0.3s ease';

    // Efecto de animación en los botones de satisfacción al cargar
    const satisfactionButtons = document.querySelectorAll('.satisfaction-button');
    satisfactionButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});