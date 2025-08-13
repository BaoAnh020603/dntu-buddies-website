// Add Member Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addMemberForm');
    const skillsInput = document.getElementById('skillInput');
    const skillsTags = document.getElementById('skillsTags');
    const hiddenSkillsInput = document.getElementById('skills');
    const imageInput = document.getElementById('profileImage');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImage');
    
    let skills = [];
    let currentImageFile = null;
    
    // Initialize form
    initializeForm();
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Skills management
    if (skillsInput) {
        skillsInput.addEventListener('keypress', handleSkillInput);
    }
    
    // Image upload
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', removeImage);
    }
    
    // Language checkbox handlers
    const languageCheckboxes = document.querySelectorAll('input[name="languages"]');
    languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleLanguageToggle);
    });
    
    // Auto-save draft every 30 seconds
    setInterval(autoSaveDraft, 30000);
    
    // Load draft on page load
    loadDraft();
});

function initializeForm() {
    // Set default join date to today
    const joinDateInput = document.getElementById('joinDate');
    if (joinDateInput) {
        joinDateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Initialize progress tracking
    trackFormProgress();
    
    // Add form validation listeners
    addValidationListeners();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('Vui lòng kiểm tra lại thông tin đã nhập', 'error');
        return;
    }
    
    const formData = collectFormData();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    showLoading(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        try {
            saveMember(formData);
            showNotification('Thêm thành viên thành công!', 'success');
            
            // Clear draft and form
            clearDraft();
            resetForm();
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'members.html';
            }, 2000);
            
        } catch (error) {
            showNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        } finally {
            hideLoading(submitBtn);
        }
    }, 2000);
}

function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Trường này là bắt buộc');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Custom validations
    const email = document.getElementById('email').value;
    if (email && !validateEmail(email)) {
        showFieldError(document.getElementById('email'), 'Email không hợp lệ');
        isValid = false;
    }
    
    const studentId = document.getElementById('studentId').value;
    if (studentId && !validateStudentId(studentId)) {
        showFieldError(document.getElementById('studentId'), 'Mã sinh viên không hợp lệ (10 chữ số)');
        isValid = false;
    }
    
    const phone = document.getElementById('phone').value;
    if (phone && !validatePhone(phone)) {
        showFieldError(document.getElementById('phone'), 'Số điện thoại không hợp lệ');
        isValid = false;
    }
    
    // Check agreements
    const dataAgreement = document.querySelector('input[name="dataAgreement"]');
    const rulesAgreement = document.querySelector('input[name="rulesAgreement"]');
    
    if (!dataAgreement.checked || !rulesAgreement.checked) {
        showNotification('Vui lòng đồng ý với các điều khoản bắt buộc', 'error');
        isValid = false;
    }
    
    return isValid;
}

function collectFormData() {
    const formData = new FormData(document.getElementById('addMemberForm'));
    const data = {};
    
    // Collect basic form data
    for (let [key, value] of formData.entries()) {
        if (key === 'languages') {
            if (!data.languages) data.languages = [];
            data.languages.push(value);
        } else {
            data[key] = value;
        }
    }
    
    // Add skills array
    data.skills = skills;
    
    // Add language levels
    const languageCheckboxes = document.querySelectorAll('input[name="languages"]:checked');
    data.languageLevels = {};
    languageCheckboxes.forEach(checkbox => {
        const language = checkbox.value;
        const levelSelect = document.querySelector(`select[name="${language}Level"]`);
        if (levelSelect) {
            data.languageLevels[language] = levelSelect.value;
        }
    });
    
    // Add image data
    if (currentImageFile) {
        data.profileImageFile = currentImageFile;
        data.profileImageData = imagePreview.querySelector('img')?.src;
    }
    
    // Add timestamp
    data.createdAt = new Date().toISOString();
    data.id = Date.now().toString();
    
    return data;
}

function saveMember(memberData) {
    // Get existing members
    const existingMembers = getFromLocalStorage('club_members') || [];
    
    // Check for duplicates
    const emailExists = existingMembers.some(member => member.email === memberData.email);
    const studentIdExists = existingMembers.some(member => member.studentId === memberData.studentId);
    
    if (emailExists) {
        throw new Error('Email đã được sử dụng');
    }
    
    if (studentIdExists) {
        throw new Error('Mã số sinh viên đã tồn tại');
    }
    
    // Add new member
    existingMembers.push(memberData);
    
    // Save to localStorage
    saveToLocalStorage('club_members', existingMembers);
    
    console.log('Member saved:', memberData);
}

// Skills Management
function handleSkillInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addSkill(e.target.value.trim());
        e.target.value = '';
    }
}

function addSkill(skillText) {
    if (!skillText || skills.includes(skillText)) {
        return;
    }
    
    skills.push(skillText);
    updateSkillsDisplay();
    updateHiddenSkillsInput();
}

function removeSkill(skillText) {
    skills = skills.filter(skill => skill !== skillText);
    updateSkillsDisplay();
    updateHiddenSkillsInput();
}

function updateSkillsDisplay() {
    skillsTags.innerHTML = '';
    
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            ${skill}
            <button type="button" onclick="removeSkill('${skill}')">&times;</button>
        `;
        skillsTags.appendChild(tag);
    });
    
    if (skills.length === 0) {
        skillsTags.innerHTML = '<span style="color: #999; font-style: italic;">Chưa có kỹ năng nào</span>';
    }
}

function updateHiddenSkillsInput() {
    hiddenSkillsInput.value = JSON.stringify(skills);
}

// Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Vui lòng chọn file ảnh hợp lệ', 'error');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
        showNotification('File ảnh không được vượt quá 2MB', 'error');
        return;
    }
    
    // Read and display image
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        removeImageBtn.style.display = 'inline-flex';
        currentImageFile = file;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    imagePreview.innerHTML = `
        <i class="fas fa-user"></i>
        <span>Chưa có ảnh</span>
    `;
    removeImageBtn.style.display = 'none';
    imageInput.value = '';
    currentImageFile = null;
}

// Language Toggle
function handleLanguageToggle(e) {
    const language = e.target.value;
    const levelSelect = document.querySelector(`select[name="${language}Level"]`);
    
    if (levelSelect) {
        levelSelect.disabled = !e.target.checked;
        if (!e.target.checked) {
            levelSelect.value = 'basic';
        }
    }
}

// Form Progress Tracking
function trackFormProgress() {
    const sections = document.querySelectorAll('.form-section');
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (!progressBar || !progressText) return;
    
    function updateProgress() {
        let completedSections = 0;
        
        sections.forEach(section => {
            const inputs = section.querySelectorAll('input[required], select[required]');
            const filledInputs = Array.from(inputs).filter(input => {
                if (input.type === 'checkbox') {
                    return input.checked;
                }
                return input.value.trim() !== '';
            });
            
            if (inputs.length > 0 && filledInputs.length === inputs.length) {
                completedSections++;
            }
        });
        
        const progress = (completedSections / sections.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Hoàn thành: ${Math.round(progress)}%`;
    }
    
    // Add listeners to all form inputs
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
    
    // Initial update
    updateProgress();
}

// Validation Listeners
function addValidationListeners() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field check
    if (required && !value) {
        showFieldError(field, 'Trường này là bắt buộc');
        return false;
    }
    
    if (!value) return true; // Skip validation for empty optional fields
    
    // Type-specific validation
    switch (type) {
        case 'email':
            if (!validateEmail(value)) {
                showFieldError(field, 'Email không hợp lệ');
                return false;
            }
            break;
            
        case 'tel':
            if (!validatePhone(value)) {
                showFieldError(field, 'Số điện thoại không hợp lệ');
                return false;
            }
            break;
            
        case 'number':
            if (field.name === 'gpa') {
                const gpa = parseFloat(value);
                if (gpa < 0 || gpa > 4) {
                    showFieldError(field, 'GPA phải từ 0.0 đến 4.0');
                    return false;
                }
            }
            break;
            
        case 'text':
            if (field.name === 'studentId' && !validateStudentId(value)) {
                showFieldError(field, 'Mã sinh viên không hợp lệ (10 chữ số)');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 4px;
    `;
    
    // Insert error after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Draft Management
function saveDraft() {
    const formData = new FormData(document.getElementById('addMemberForm'));
    const draftData = {};
    
    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }
    
    draftData.skills = skills;
    draftData.savedAt = new Date().toISOString();
    
    saveToLocalStorage('member_form_draft', draftData);
    showNotification('Đã lưu nháp thành công', 'success');
}

function loadDraft() {
    const draft = getFromLocalStorage('member_form_draft');
    if (!draft) return;
    
    // Ask user if they want to load draft
    if (confirm('Có bản nháp đã lưu. Bạn có muốn khôi phục không?')) {
        // Fill form with draft data
        Object.keys(draft).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field && key !== 'skills' && key !== 'savedAt') {
                if (field.type === 'checkbox') {
                    field.checked = draft[key] === 'on';
                } else {
                    field.value = draft[key];
                }
            }
        });
        
        // Restore skills
        if (draft.skills) {
            skills = draft.skills;
            updateSkillsDisplay();
            updateHiddenSkillsInput();
        }
        
        showNotification('Đã khôi phục bản nháp', 'success');
    }
}

function autoSaveDraft() {
    // Only auto-save if form has some data
    const formData = new FormData(document.getElementById('addMemberForm'));
    let hasData = false;
    
    for (let [key, value] of formData.entries()) {
        if (value.trim()) {
            hasData = true;
            break;
        }
    }
    
    if (hasData || skills.length > 0) {
        const draftData = {};
        for (let [key, value] of formData.entries()) {
            draftData[key] = value;
        }
        draftData.skills = skills;
        draftData.savedAt = new Date().toISOString();
        
        saveToLocalStorage('member_form_draft', draftData);
    }
}

function clearDraft() {
    removeFromLocalStorage('member_form_draft');
}

// Form Reset
function resetForm() {
    document.getElementById('addMemberForm').reset();
    skills = [];
    updateSkillsDisplay();
    updateHiddenSkillsInput();
    removeImage();
    
    // Reset language selects
    document.querySelectorAll('.skill-level').forEach(select => {
        select.disabled = true;
        select.value = 'basic';
    });
    
    // Set default join date
    const joinDateInput = document.getElementById('joinDate');
    if (joinDateInput) {
        joinDateInput.value = new Date().toISOString().split('T')[0];
    }
}

// Global functions for HTML onclick handlers
window.removeSkill = removeSkill;
window.saveDraft = saveDraft;
window.resetForm = resetForm;
