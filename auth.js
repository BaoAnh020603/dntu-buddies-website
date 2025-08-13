// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Password strength checker
        const passwordInput = registerForm.querySelector('#password');
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }
        
        // Confirm password validation
        const confirmPasswordInput = registerForm.querySelector('#confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordMatch);
        }
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });
    
    // Form validation on input
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearInputError);
    });
});

// Login form handler
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };
    
    // Validate form
    if (!validateLoginForm(loginData)) {
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    try {
        // Simulate API call
        await simulateLogin(loginData);
        
        // Success
        showNotification('Đăng nhập thành công! Chào mừng bạn quay trở lại.', 'success');
        
        // Save login state
        if (loginData.remember) {
            saveToLocalStorage('user_session', {
                email: loginData.email,
                loginTime: new Date().toISOString(),
                remember: true
            });
        }
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        showNotification(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.', 'error');
    } finally {
        hideLoading(submitBtn);
    }
}

// Register form handler
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const registerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        studentId: formData.get('studentId'),
        faculty: formData.get('faculty'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        terms: formData.get('terms') === 'on',
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Validate form
    if (!validateRegisterForm(registerData)) {
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    try {
        // Simulate API call
        await simulateRegister(registerData);
        
        // Success
        showNotification('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.', 'success');
        
        // Clear form
        e.target.reset();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        showNotification(error.message || 'Đăng ký thất bại. Vui lòng thử lại.', 'error');
    } finally {
        hideLoading(submitBtn);
    }
}

// Login form validation
function validateLoginForm(data) {
    let isValid = true;
    
    // Email validation
    if (!data.email) {
        showInputError('email', 'Vui lòng nhập email');
        isValid = false;
    } else if (!validateEmail(data.email)) {
        showInputError('email', 'Email không hợp lệ');
        isValid = false;
    }
    
    // Password validation
    if (!data.password) {
        showInputError('password', 'Vui lòng nhập mật khẩu');
        isValid = false;
    } else if (data.password.length < 6) {
        showInputError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
    }
    
    return isValid;
}

// Register form validation
function validateRegisterForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.firstName.trim()) {
        showInputError('firstName', 'Vui lòng nhập họ');
        isValid = false;
    }
    
    if (!data.lastName.trim()) {
        showInputError('lastName', 'Vui lòng nhập tên');
        isValid = false;
    }
    
    // Email validation
    if (!data.email) {
        showInputError('email', 'Vui lòng nhập email');
        isValid = false;
    } else if (!validateEmail(data.email)) {
        showInputError('email', 'Email không hợp lệ');
        isValid = false;
    } else if (!data.email.endsWith('@dntu.edu.vn')) {
        showInputError('email', 'Vui lòng sử dụng email của trường DNTU');
        isValid = false;
    }
    
    // Student ID validation
    if (!data.studentId) {
        showInputError('studentId', 'Vui lòng nhập mã số sinh viên');
        isValid = false;
    } else if (!validateStudentId(data.studentId)) {
        showInputError('studentId', 'Mã số sinh viên không hợp lệ (10 chữ số)');
        isValid = false;
    }
    
    // Faculty validation
    if (!data.faculty) {
        showInputError('faculty', 'Vui lòng chọn khoa');
        isValid = false;
    }
    
    // Phone validation
    if (!data.phone) {
        showInputError('phone', 'Vui lòng nhập số điện thoại');
        isValid = false;
    } else if (!validatePhone(data.phone)) {
        showInputError('phone', 'Số điện thoại không hợp lệ');
        isValid = false;
    }
    
    // Password validation
    if (!data.password) {
        showInputError('password', 'Vui lòng nhập mật khẩu');
        isValid = false;
    } else if (data.password.length < 8) {
        showInputError('password', 'Mật khẩu phải có ít nhất 8 ký tự');
        isValid = false;
    }
    
    // Confirm password validation
    if (data.password !== data.confirmPassword) {
        showInputError('confirmPassword', 'Mật khẩu xác nhận không khớp');
        isValid = false;
    }
    
    // Terms validation
    if (!data.terms) {
        showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Password strength checker
function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let strengthLabel = '';
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Determine strength level
    if (strength <= 2) {
        strengthLabel = 'Yếu';
        strengthBar.className = 'strength-fill weak';
    } else if (strength <= 3) {
        strengthLabel = 'Trung bình';
        strengthBar.className = 'strength-fill fair';
    } else if (strength <= 4) {
        strengthLabel = 'Tốt';
        strengthBar.className = 'strength-fill good';
    } else {
        strengthLabel = 'Mạnh';
        strengthBar.className = 'strength-fill strong';
    }
    
    strengthText.textContent = `Độ mạnh mật khẩu: ${strengthLabel}`;
}

// Password match validation
function validatePasswordMatch(e) {
    const confirmPassword = e.target.value;
    const password = document.querySelector('#password').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showInputError('confirmPassword', 'Mật khẩu xác nhận không khớp');
    } else {
        clearInputError('confirmPassword');
    }
}

// Social login handler
function handleSocialLogin(e) {
    const provider = e.target.closest('.social-btn').classList.contains('google') ? 'google' : 'facebook';
    
    showNotification(`Đang chuyển hướng đến ${provider}...`, 'info');
    
    // Simulate social login redirect
    setTimeout(() => {
        showNotification('Tính năng đăng nhập mạng xã hội sẽ được triển khai sớm!', 'info');
    }, 1000);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Input validation
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    clearInputError(input.id);
    
    if (input.hasAttribute('required') && !value) {
        showInputError(input.id, 'Trường này là bắt buộc');
        return false;
    }
    
    switch (type) {
        case 'email':
            if (value && !validateEmail(value)) {
                showInputError(input.id, 'Email không hợp lệ');
                return false;
            }
            if (name === 'email' && value && !value.endsWith('@dntu.edu.vn')) {
                showInputError(input.id, 'Vui lòng sử dụng email của trường DNTU');
                return false;
            }
            break;
            
        case 'tel':
            if (value && !validatePhone(value)) {
                showInputError(input.id, 'Số điện thoại không hợp lệ');
                return false;
            }
            break;
            
        case 'text':
            if (name === 'studentId' && value && !validateStudentId(value)) {
                showInputError(input.id, 'Mã số sinh viên không hợp lệ (10 chữ số)');
                return false;
            }
            break;
    }
    
    return true;
}

// Show input error
function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Remove existing error
    clearInputError(inputId);
    
    // Add error class
    input.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = message;
    
    // Insert error message after input wrapper
    const wrapper = input.closest('.input-wrapper') || input;
    wrapper.parentNode.insertBefore(errorElement, wrapper.nextSibling);
}

// Clear input error
function clearInputError(inputId) {
    const input = typeof inputId === 'string' ? document.getElementById(inputId) : inputId;
    if (!input) return;
    
    // Remove error class
    input.classList.remove('error');
    
    // Remove error message
    const wrapper = input.closest('.input-wrapper') || input;
    const errorElement = wrapper.parentNode.querySelector('.input-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Simulate API calls
async function simulateLogin(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate different scenarios
            if (data.email === 'test@dntu.edu.vn' && data.password === 'password123') {
                resolve({ success: true, user: { email: data.email, name: 'Test User' } });
            } else {
                reject(new Error('Email hoặc mật khẩu không chính xác'));
            }
        }, 1500);
    });
}

async function simulateRegister(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check if email already exists
            const existingUsers = getFromLocalStorage('registered_users') || [];
            const emailExists = existingUsers.some(user => user.email === data.email);
            const studentIdExists = existingUsers.some(user => user.studentId === data.studentId);
            
            if (emailExists) {
                reject(new Error('Email đã được sử dụng'));
                return;
            }
            
            if (studentIdExists) {
                reject(new Error('Mã số sinh viên đã được đăng ký'));
                return;
            }
            
            // Save new user
            const newUser = {
                id: Date.now(),
                ...data,
                password: undefined, // Don't store password in real app
                registeredAt: new Date().toISOString(),
                verified: false
            };
            
            existingUsers.push(newUser);
            saveToLocalStorage('registered_users', existingUsers);
            
            resolve({ success: true, user: newUser });
        }, 2000);
    });
}

// Auto-fill demo data (for testing)
function fillDemoData(formType) {
    if (formType === 'login') {
        document.getElementById('email').value = 'test@dntu.edu.vn';
        document.getElementById('password').value = 'password123';
    } else if (formType === 'register') {
        document.getElementById('firstName').value = 'Nguyễn';
        document.getElementById('lastName').value = 'Văn A';
        document.getElementById('email').value = 'nguyenvana@dntu.edu.vn';
        document.getElementById('studentId').value = '2021001234';
        document.getElementById('faculty').value = 'cntt';
        document.getElementById('phone').value = '0123456789';
        document.getElementById('password').value = 'Password123!';
        document.getElementById('confirmPassword').value = 'Password123!';
        document.querySelector('input[name="terms"]').checked = true;
    }
}

// Add demo data button for testing (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        const authForm = document.querySelector('.auth-form');
        if (authForm) {
            const demoBtn = document.createElement('button');
            demoBtn.type = 'button';
            demoBtn.className = 'btn btn-secondary';
            demoBtn.style.marginBottom = '1rem';
            demoBtn.innerHTML = '<i class="fas fa-magic"></i> Điền dữ liệu demo';
            
            const formType = document.getElementById('loginForm') ? 'login' : 'register';
            demoBtn.addEventListener('click', () => fillDemoData(formType));
            
            authForm.insertBefore(demoBtn, authForm.firstChild);
        }
    });
}

// Utility functions specific to auth
function checkUserSession() {
    const session = getFromLocalStorage('user_session');
    if (session && session.remember) {
        // Check if session is still valid (e.g., within 30 days)
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 30) {
            return session;
        } else {
            removeFromLocalStorage('user_session');
        }
    }
    return null;
}

function logout() {
    removeFromLocalStorage('user_session');
    showNotification('Đã đăng xuất thành công', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Auto-redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    const isAuthPage = currentPage.includes('login.html') || currentPage.includes('register.html');
    const session = checkUserSession();
    
    if (isAuthPage && session) {
        showNotification('Bạn đã đăng nhập, đang chuyển hướng...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
});

// Export auth functions
window.DNTU_Auth = {
    login: handleLogin,
    register: handleRegister,
    logout,
    checkUserSession,
    togglePassword,
    validateLoginForm,
    validateRegisterForm
};
