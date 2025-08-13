// Members Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('memberSearch');
    const facultyFilter = document.getElementById('facultyFilter');
    const roleFilter = document.getElementById('roleFilter');
    const viewButtons = document.querySelectorAll('.view-btn');
    const membersContainer = document.getElementById('membersContainer');
    
    let allMembers = [];
    let filteredMembers = [];
    let currentPage = 1;
    const membersPerPage = 12;
    
    // Initialize
    loadMembers();
    setupEventListeners();
    
    function setupEventListeners() {
        // Search functionality
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    filterMembers();
                }, 300);
            });
        }
        
        // Filter functionality
        if (facultyFilter) {
            facultyFilter.addEventListener('change', filterMembers);
        }
        
        if (roleFilter) {
            roleFilter.addEventListener('change', filterMembers);
        }
        
        // View toggle
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.dataset.view;
                toggleView(view);
            });
        });
        
        // Member actions
        setupMemberActions();
    }
    
    function loadMembers() {
        // Load from localStorage or use demo data
        const savedMembers = getFromLocalStorage('club_members');
        
        if (savedMembers && savedMembers.length > 0) {
            allMembers = savedMembers;
        } else {
            allMembers = getDemoMembers();
            // Save demo data
            saveToLocalStorage('club_members', allMembers);
        }
        
        filteredMembers = [...allMembers];
        displayMembers();
        updateStats();
    }
    
    function getDemoMembers() {
        return [
            {
                id: '1',
                firstName: 'Văn A',
                lastName: 'Nguyễn',
                email: 'nguyenvana@dntu.edu.vn',
                studentId: '2021001234',
                faculty: 'cntt',
                role: 'chutichu',
                phone: '0123456789',
                academicYear: '3',
                joinDate: '2023-08-15',
                skills: ['Leadership', 'Web Development', 'English'],
                description: 'Chuyên về phát triển web và ứng dụng di động. Có kinh nghiệm tổ chức sự kiện và quản lý nhóm.',
                status: 'online',
                profileImage: 'https://via.placeholder.com/120x120/4a90e2/ffffff?text=NVA'
            },
            {
                id: '2',
                firstName: 'Thị B',
                lastName: 'Trần',
                email: 'tranthib@dntu.edu.vn',
                studentId: '2022005678',
                faculty: 'ngoaingu',
                role: 'phochutichu',
                phone: '0987654321',
                academicYear: '2',
                joinDate: '2023-09-01',
                skills: ['Translation', 'Japanese', 'Korean'],
                description: 'Thành thạo tiếng Anh, Nhật và Hàn Quốc. Có kinh nghiệm phiên dịch và tổ chức hoạt động quốc tế.',
                status: 'online',
                profileImage: 'https://via.placeholder.com/120x120/52c41a/ffffff?text=TTB'
            },
            {
                id: '3',
                firstName: 'Văn C',
                lastName: 'Lê',
                email: 'levanc@dntu.edu.vn',
                studentId: '2022009876',
                faculty: 'kinhtequocte',
                role: 'thuky',
                phone: '0369852147',
                academicYear: '2',
                joinDate: '2023-09-15',
                skills: ['Organization', 'Documentation', 'Communication'],
                description: 'Có kinh nghiệm trong việc tổ chức và quản lý tài liệu, phối hợp hoạt động giữa các bộ phận.',
                status: 'offline',
                profileImage: 'https://via.placeholder.com/120x120/f39c12/ffffff?text=LVC'
            },
            {
                id: '4',
                firstName: 'Thị D',
                lastName: 'Phạm',
                email: 'phamthid@dntu.edu.vn',
                studentId: '2023001111',
                faculty: 'ngoaingu',
                role: 'thanhvien',
                phone: '0147258369',
                academicYear: '1',
                joinDate: '2023-10-01',
                skills: ['English', 'Event Planning', 'Social Media'],
                description: 'Sinh viên năm nhất năng động, nhiệt tình tham gia các hoạt động CLB và có khả năng ngoại ngữ tốt.',
                status: 'online',
                profileImage: 'https://via.placeholder.com/120x120/e74c3c/ffffff?text=PTD'
            },
            {
                id: '5',
                firstName: 'Văn E',
                lastName: 'Hoàng',
                email: 'hoangvane@dntu.edu.vn',
                studentId: '2021002345',
                faculty: 'cntt',
                role: 'thanhvien',
                phone: '0258147369',
                academicYear: '3',
                joinDate: '2023-08-20',
                skills: ['UI/UX Design', 'Photoshop', 'Figma'],
                description: 'Chuyên về thiết kế giao diện và trải nghiệm người dùng. Có kinh nghiệm làm việc với các dự án quốc tế.',
                status: 'online',
                profileImage: 'https://via.placeholder.com/120x120/9b59b6/ffffff?text=HVE'
            },
            {
                id: '6',
                firstName: 'Thị F',
                lastName: 'Nguyễn',
                email: 'nguyenthif@dntu.edu.vn',
                studentId: '2022003456',
                faculty: 'quantrikiemtoan',
                role: 'thanhvien',
                phone: '0741852963',
                academicYear: '2',
                joinDate: '2023-09-10',
                skills: ['Finance', 'Project Management', 'English'],
                description: 'Có khả năng quản lý tài chính và tổ chức sự kiện. Thành thạo tiếng Anh và có kinh nghiệm làm việc nhóm.',
                status: 'online',
                profileImage: 'https://via.placeholder.com/120x120/1abc9c/ffffff?text=NTF'
            }
        ];
    }
    
    function filterMembers() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const facultyValue = facultyFilter?.value || '';
        const roleValue = roleFilter?.value || '';
        
        filteredMembers = allMembers.filter(member => {
            const matchesSearch = !searchTerm || 
                member.firstName.toLowerCase().includes(searchTerm) ||
                member.lastName.toLowerCase().includes(searchTerm) ||
                member.email.toLowerCase().includes(searchTerm) ||
                member.studentId.includes(searchTerm);
            
            const matchesFaculty = !facultyValue || member.faculty === facultyValue;
            const matchesRole = !roleValue || member.role === roleValue;
            
            return matchesSearch && matchesFaculty && matchesRole;
        });
        
        currentPage = 1;
        displayMembers();
        updatePagination();
    }
    
    function displayMembers() {
        if (!membersContainer) return;
        
        const startIndex = (currentPage - 1) * membersPerPage;
        const endIndex = startIndex + membersPerPage;
        const pageMembers = filteredMembers.slice(startIndex, endIndex);
        
        if (pageMembers.length === 0) {
            membersContainer.innerHTML = `
                <div class="no-members">
                    <i class="fas fa-users"></i>
                    <h3>Không tìm thấy thành viên</h3>
                    <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
            return;
        }
        
        membersContainer.innerHTML = pageMembers.map(member => createMemberCard(member)).join('');
        setupMemberActions();
    }
    
    function createMemberCard(member) {
        const fullName = `${member.lastName} ${member.firstName}`;
        const facultyName = getFacultyName(member.faculty);
        const roleName = getRoleName(member.role);
        const roleBadgeClass = getRoleBadgeClass(member.role);
        
        return `
            <div class="member-card" data-faculty="${member.faculty}" data-role="${member.role}">
                <div class="member-header">
                    <div class="member-avatar">
                        <img src="${member.profileImage}" alt="${fullName}">
                        <div class="member-status ${member.status}"></div>
                    </div>
                    <div class="member-badge ${roleBadgeClass}">${roleName}</div>
                </div>
                <div class="member-info">
                    <h3 class="member-name">${fullName}</h3>
                    <p class="member-id">MSSV: ${member.studentId}</p>
                    <p class="member-faculty">${facultyName}</p>
                    <p class="member-year">Năm ${member.academicYear}</p>
                    <p class="member-description">${member.description || 'Chưa có mô tả'}</p>
                </div>
                <div class="member-skills">
                    ${member.skills ? member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('') : ''}
                </div>
                <div class="member-actions">
                    <button class="action-btn view-profile" title="Xem hồ sơ" data-member-id="${member.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn send-message" title="Nhắn tin" data-member-id="${member.id}">
                        <i class="fas fa-message"></i>
                    </button>
                    <button class="action-btn contact-info" title="Thông tin liên hệ" data-member-id="${member.id}">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    function setupMemberActions() {
        // View profile buttons
        document.querySelectorAll('.view-profile').forEach(btn => {
            btn.addEventListener('click', function() {
                const memberId = this.dataset.memberId;
                viewMemberProfile(memberId);
            });
        });
        
        // Send message buttons
        document.querySelectorAll('.send-message').forEach(btn => {
            btn.addEventListener('click', function() {
                const memberId = this.dataset.memberId;
                sendMessage(memberId);
            });
        });
        
        // Contact info buttons
        document.querySelectorAll('.contact-info').forEach(btn => {
            btn.addEventListener('click', function() {
                const memberId = this.dataset.memberId;
                showContactInfo(memberId);
            });
        });
    }
    
    function toggleView(viewType) {
        // Update active button
        viewButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewType) {
                btn.classList.add('active');
            }
        });
        
        // Update container class
        if (membersContainer) {
            if (viewType === 'list') {
                membersContainer.classList.add('list-view');
            } else {
                membersContainer.classList.remove('list-view');
            }
        }
    }
    
    function updateStats() {
        const totalMembers = allMembers.length;
        const activeMembers = allMembers.filter(member => member.status === 'online').length;
        const managementMembers = allMembers.filter(member => 
            ['chutichu', 'phochutichu', 'thuky', 'thutruong'].includes(member.role)
        ).length;
        const faculties = [...new Set(allMembers.map(member => member.faculty))].length;
        
        // Update stat cards if they exist
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-number').textContent = totalMembers;
            statCards[1].querySelector('.stat-number').textContent = activeMembers;
            statCards[2].querySelector('.stat-number').textContent = managementMembers;
            statCards[3].querySelector('.stat-number').textContent = faculties;
        }
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        const pageNumbers = paginationContainer.querySelector('.page-numbers');
        const prevBtn = paginationContainer.querySelector('.prev');
        const nextBtn = paginationContainer.querySelector('.next');
        
        // Update prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        
        // Update page numbers
        pageNumbers.innerHTML = generatePageNumbers(currentPage, totalPages);
        
        // Add event listeners to page buttons
        pageNumbers.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.textContent);
                displayMembers();
                updatePagination();
            });
        });
        
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                displayMembers();
                updatePagination();
            }
        };
        
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayMembers();
                updatePagination();
            }
        };
    }
    
    function generatePageNumbers(current, total) {
        let pages = [];
        
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 4) {
                pages = [1, 2, 3, 4, 5, '...', total];
            } else if (current >= total - 3) {
                pages = [1, '...', total - 4, total - 3, total - 2, total - 1, total];
            } else {
                pages = [1, '...', current - 1, current, current + 1, '...', total];
            }
        }
        
        return pages.map(page => {
            if (page === '...') {
                return '<span class="page-dots">...</span>';
            } else {
                const activeClass = page === current ? 'active' : '';
                return `<button class="page-number ${activeClass}">${page}</button>`;
            }
        }).join('');
    }
    
    // Member Actions
    function viewMemberProfile(memberId) {
        const member = allMembers.find(m => m.id === memberId);
        if (!member) return;
        
        showMemberModal(member);
    }
    
    function sendMessage(memberId) {
        const member = allMembers.find(m => m.id === memberId);
        if (!member) return;
        
        // For demo purposes, show notification
        showNotification(`Tính năng nhắn tin cho ${member.lastName} ${member.firstName} sẽ được phát triển sớm!`, 'info');
    }
    
    function showContactInfo(memberId) {
        const member = allMembers.find(m => m.id === memberId);
        if (!member) return;
        
        const modal = createContactModal(member);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 100);
    }
    
    function showMemberModal(member) {
        const modal = createMemberModal(member);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 100);
    }
    
    function createMemberModal(member) {
        const modal = document.createElement('div');
        modal.className = 'member-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeMemberModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Hồ sơ thành viên</h2>
                    <button class="modal-close" onclick="closeMemberModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="member-profile">
                        <div class="profile-avatar">
                            <img src="${member.profileImage}" alt="${member.lastName} ${member.firstName}">
                            <div class="status-badge ${member.status}">${member.status === 'online' ? 'Đang hoạt động' : 'Offline'}</div>
                        </div>
                        <div class="profile-info">
                            <h3>${member.lastName} ${member.firstName}</h3>
                            <p class="role">${getRoleName(member.role)}</p>
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>MSSV:</label>
                                    <span>${member.studentId}</span>
                                </div>
                                <div class="info-item">
                                    <label>Khoa:</label>
                                    <span>${getFacultyName(member.faculty)}</span>
                                </div>
                                <div class="info-item">
                                    <label>Năm học:</label>
                                    <span>Năm ${member.academicYear}</span>
                                </div>
                                <div class="info-item">
                                    <label>Ngày tham gia:</label>
                                    <span>${formatDate(member.joinDate)}</span>
                                </div>
                            </div>
                            <div class="profile-skills">
                                <label>Kỹ năng:</label>
                                <div class="skills-list">
                                    ${member.skills ? member.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('') : 'Chưa cập nhật'}
                                </div>
                            </div>
                            <div class="profile-description">
                                <label>Mô tả:</label>
                                <p>${member.description || 'Chưa có mô tả'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeMemberModal()">Đóng</button>
                    <button class="btn btn-primary" onclick="sendMessage('${member.id}'); closeMemberModal();">Nhắn tin</button>
                </div>
            </div>
        `;
        return modal;
    }
    
    function createContactModal(member) {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeContactModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Thông tin liên hệ</h2>
                    <button class="modal-close" onclick="closeContactModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="contact-info">
                        <div class="contact-avatar">
                            <img src="${member.profileImage}" alt="${member.lastName} ${member.firstName}">
                        </div>
                        <h3>${member.lastName} ${member.firstName}</h3>
                        <div class="contact-details">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>${member.email}</span>
                                <button class="copy-btn" onclick="copyToClipboard('${member.email}')" title="Copy">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>${formatPhoneNumber(member.phone)}</span>
                                <button class="copy-btn" onclick="copyToClipboard('${member.phone}')" title="Copy">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeContactModal()">Đóng</button>
                </div>
            </div>
        `;
        return modal;
    }
    
    // Utility functions
    function getFacultyName(faculty) {
        const faculties = {
            'cntt': 'Công nghệ thông tin',
            'ngoaingu': 'Ngoại ngữ',
            'kinhtequocte': 'Kinh tế quốc tế',
            'quantrikiemtoan': 'Quản trị - Kiểm toán',
            'cokhi': 'Cơ khí',
            'xaydung': 'Xây dựng'
        };
        return faculties[faculty] || faculty;
    }
    
    function getRoleName(role) {
        const roles = {
            'chutichu': 'Chủ tịch',
            'phochutichu': 'Phó chủ tịch',
            'thuky': 'Thư ký',
            'thutruong': 'Thủ trưởng',
            'thanhvien': 'Thành viên'
        };
        return roles[role] || role;
    }
    
    function getRoleBadgeClass(role) {
        const classes = {
            'chutichu': 'president',
            'phochutichu': 'vice-president',
            'thuky': 'secretary',
            'thutruong': 'leader',
            'thanhvien': 'member'
        };
        return classes[role] || 'member';
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Đã copy vào clipboard!', 'success');
        }).catch(() => {
            showNotification('Không thể copy. Vui lòng copy thủ công.', 'error');
        });
    }
});

// Global functions for modal management
function closeMemberModal() {
    const modal = document.querySelector('.member-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function closeContactModal() {
    const modal = document.querySelector('.contact-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Add modal styles
const modalStyles = `
<style>
.member-modal, .contact-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.member-modal.show, .contact-modal.show {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 16px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    background: #f0f0f0;
    color: #666;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #f0f0f0;
}

.member-profile {
    display: flex;
    gap: 2rem;
}

.profile-avatar {
    text-align: center;
}

.profile-avatar img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #f0f0f0;
}

.status-badge {
    margin-top: 0.5rem;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.status-badge.online {
    background: #d4edda;
    color: #155724;
}

.status-badge.offline {
    background: #f8d7da;
    color: #721c24;
}

.profile-info {
    flex: 1;
}

.profile-info h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.profile-info .role {
    color: #667eea;
    font-weight: 500;
    margin-bottom: 1.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-item label {
    font-weight: 500;
    color: #666;
    font-size: 0.9rem;
}

.profile-skills, .profile-description {
    margin-bottom: 1.5rem;
}

.profile-skills label, .profile-description label {
    display: block;
    font-weight: 500;
    color: #666;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-badge {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
}

.contact-info {
    text-align: center;
}

.contact-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 1rem;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.contact-item i {
    color: #667eea;
    width: 20px;
}

.contact-item span {
    flex: 1;
    text-align: left;
}

.copy-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
}

.copy-btn:hover {
    background: #e9ecef;
    color: #667eea;
}

.no-members {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    color: #999;
}

.no-members i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #ddd;
}

.no-members h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #666;
}

@media (max-width: 768px) {
    .member-profile {
        flex-direction: column;
        text-align: center;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-content {
        width: 95%;
    }
}
</style>
`;

// Add styles to document
document.head.insertAdjacentHTML('beforeend', modalStyles);
