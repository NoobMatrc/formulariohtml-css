document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const successMessage = document.getElementById('successMessage');
    const loginBox = document.querySelector('.login-box');

    // Funcionalidad de mostrar/ocultar contraseña
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Cambiar el icono del ojo
        if (type === 'text') {
            eyeIcon.textContent = '👁️‍🗨️';
        } else {
            eyeIcon.textContent = '👁️';
        }
    });

    // Validación de email/usuario
    function validateEmail() {
        const value = emailInput.value.trim();
        
        if (value === '') {
            emailError.textContent = 'Este campo es obligatorio';
            emailInput.setCustomValidity('Campo obligatorio');
            return false;
        } else if (value.length < 3) {
            emailError.textContent = 'Debe tener al menos 3 caracteres';
            emailInput.setCustomValidity('Muy corto');
            return false;
        } else {
            emailError.textContent = '';
            emailInput.setCustomValidity('');
            return true;
        }
    }

    // Validación de contraseña
    function validatePassword() {
        const value = passwordInput.value;
        
        if (value === '') {
            passwordError.textContent = 'La contraseña es obligatoria';
            passwordInput.setCustomValidity('Campo obligatorio');
            return false;
        } else if (value.length < 6) {
            passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            passwordInput.setCustomValidity('Contraseña muy corta');
            return false;
        } else {
            passwordError.textContent = '';
            passwordInput.setCustomValidity('');
            return true;
        }
    }

    // Validación en tiempo real
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);

    emailInput.addEventListener('input', function() {
        if (emailError.textContent) {
            validateEmail();
        }
    });

    passwordInput.addEventListener('input', function() {
        if (passwordError.textContent) {
            validatePassword();
        }
    });

    // Cargar estado de "Recordarme" si existe
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Manejo del enlace "¿Olvidaste tu contraseña?"
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Se ha enviado un enlace de recuperación a tu correo electrónico.\n(Esta es una función de demostración)');
    });

    // Manejo de los botones de login social
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`Iniciando sesión con ${provider}...\n(Esta es una función de demostración)`);
        });
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar ambos campos
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            // Enfocar el primer campo con error
            if (!isEmailValid) {
                emailInput.focus();
            } else if (!isPasswordValid) {
                passwordInput.focus();
            }
            return;
        }

        // Recopilar datos del formulario
        const formData = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
            rememberMe: rememberMeCheckbox.checked
        };

        // Guardar email si "Recordarme" está activado
        if (formData.rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        // Mostrar datos en consola (para desarrollo)
        console.log('🔐 Datos de login:', {
            email: formData.email,
            passwordLength: formData.password.length,
            rememberMe: formData.rememberMe
        });

        // Simular proceso de login
        const submitButton = form.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Iniciando sesión...</span>';
        
        // Simular delay de autenticación
        setTimeout(function() {
            // Ocultar formulario con animación
            loginBox.style.opacity = '0';
            loginBox.style.transform = 'scale(0.95)';
            
            setTimeout(function() {
                loginBox.style.display = 'none';
                successMessage.classList.remove('hidden');
                
                // Simular redirección después de 2 segundos
                setTimeout(function() {
                    console.log('✅ Redirigiendo al panel de control...');
                    // Aquí iría: window.location.href = '/dashboard';
                    
                    // Para demo, resetear y volver a mostrar el formulario
                    successMessage.classList.add('hidden');
                    loginBox.style.display = 'block';
                    setTimeout(function() {
                        loginBox.style.opacity = '1';
                        loginBox.style.transform = 'scale(1)';
                    }, 50);
                    
                    form.reset();
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Iniciar sesión</span><span class="button-icon">→</span>';
                    
                    // Restaurar email si estaba recordado
                    if (savedEmail) {
                        emailInput.value = savedEmail;
                        rememberMeCheckbox.checked = true;
                    }
                }, 2000);
            }, 300);
        }, 1500);
    });

    // Agregar transición suave al login-box
    loginBox.style.transition = 'all 0.3s ease';
});