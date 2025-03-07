// Navigation Handling
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const contentPages = document.querySelectorAll('.content');
    const headerTitle = document.querySelector('.header-left h1');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            contentPages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding content
            const pageId = item.getAttribute('data-page');
            document.getElementById(`${pageId}-page`).classList.add('active');
            
            // Update header title
            headerTitle.textContent = item.querySelector('span').textContent;
        });
    });

    // Modal Handling
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloseButtons = document.querySelectorAll('.close-modal, [data-dismiss="modal"]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            document.getElementById(modalId).classList.add('active');
        });
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.remove('active');
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Notification System
    function showNotification(title, message, type = 'info', duration = 5000) {
        const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = 'fa-info-circle';
        switch(type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-circle';
                break;
            case 'error':
                icon = 'fa-times-circle';
                break;
        }

        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(notification);

        // Add close button functionality
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOut 0.3s ease-out forwards';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }

        return notification;
    }

    // Update notification handler
    const notificationBell = document.querySelector('.notifications');
    notificationBell.addEventListener('click', () => {
        showNotification('New Notifications', 'You have 3 new notifications', 'info');
        setTimeout(() => {
            showNotification('New Order', 'Order #ORD-003 received', 'success');
        }, 1000);
        setTimeout(() => {
            showNotification('Low Stock Alert', 'Handcrafted Leather Bag is running low', 'warning');
        }, 2000);
        setTimeout(() => {
            showNotification('Payment Received', 'Payment received for order #ORD-001', 'success');
        }, 3000);
    });

    // Profile handler
    const profile = document.querySelector('.profile');
    profile.addEventListener('click', () => {
        const profileNav = document.querySelector('[data-page="profile"]');
        profileNav.click();
    });

    // License Upload Handler
    const licenseUpload = document.querySelector('#license-upload');
    const licensePreview = document.querySelector('.license-preview');
    const verificationStatus = document.querySelector('.verification-status');
    
    if (licenseUpload) {
        licenseUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file type
                if (!file.type.startsWith('image/') && !file.type === 'application/pdf') {
                    showNotification('Error', 'Please upload an image or PDF file', 'error');
                    return;
                }
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Error', 'File size should be less than 5MB', 'error');
                    return;
                }

                // Update preview
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        licensePreview.innerHTML = `
                            <img src="${e.target.result}" alt="License Preview">
                            <p class="file-name">${file.name}</p>
                        `;
                    };
                    reader.readAsDataURL(file);
                } else {
                    licensePreview.innerHTML = `
                        <div class="pdf-preview">
                            <i class="fas fa-file-pdf"></i>
                            <p class="file-name">${file.name}</p>
                        </div>
                    `;
                }

                // Update verification status
                verificationStatus.innerHTML = `
                    <div class="status pending">
                        <i class="fas fa-clock"></i>
                        <span>Verification Pending</span>
                    </div>
                `;

                showNotification('License Uploaded', 'Your license has been uploaded and is pending verification', 'success');
            }
        });
    }

    // Mock verification check (for demo purposes)
    const checkVerification = document.querySelector('#check-verification');
    if (checkVerification) {
        checkVerification.addEventListener('click', () => {
            const statuses = ['verified', 'pending', 'rejected'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            let statusHTML = '';
            let notificationTitle = '';
            let notificationType = '';

            switch(randomStatus) {
                case 'verified':
                    statusHTML = `
                        <div class="status verified">
                            <i class="fas fa-check-circle"></i>
                            <span>Verified</span>
                        </div>
                    `;
                    notificationTitle = 'License Verified';
                    notificationType = 'success';
                    break;
                case 'pending':
                    statusHTML = `
                        <div class="status pending">
                            <i class="fas fa-clock"></i>
                            <span>Verification Pending</span>
                        </div>
                    `;
                    notificationTitle = 'Verification Pending';
                    notificationType = 'info';
                    break;
                case 'rejected':
                    statusHTML = `
                        <div class="status rejected">
                            <i class="fas fa-times-circle"></i>
                            <span>Verification Failed</span>
                        </div>
                    `;
                    notificationTitle = 'Verification Failed';
                    notificationType = 'error';
                    break;
            }

            verificationStatus.innerHTML = statusHTML;
            showNotification(notificationTitle, 'Click for more details', notificationType);
        });
    }

    // Update logout handler
    const logoutBtn = document.querySelector('.logout button');
    logoutBtn.addEventListener('click', () => {
        const confirmLogout = confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            showNotification('Logged Out', 'You have been successfully logged out', 'success');
            // Redirect to login page
            // window.location.href = '/login';
        }
    });

    // Update action buttons handler
    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            const orderId = row.querySelector('td').textContent;
            const customer = row.querySelector('td:nth-child(2)').textContent;
            const product = row.querySelector('td:nth-child(3)').textContent;
            const amount = row.querySelector('td:nth-child(4)').textContent;
            const status = row.querySelector('.status').textContent;

            showNotification(
                `Order Details: ${orderId}`,
                `Customer: ${customer}\nProduct: ${product}\nAmount: ${amount}\nStatus: ${status}`,
                'info',
                0 // No auto-close
            );
        });
    });

    // Update view all buttons handler
    const viewAllButtons = document.querySelectorAll('.view-all');
    viewAllButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.section').querySelector('h2').textContent;
            showNotification('Coming Soon', `Viewing all ${section} feature will be available soon!`, 'info');
        });
    });

    // Update marketplace cards handler
    const marketplaceCards = document.querySelectorAll('.marketplace-card');
    marketplaceCards.forEach(card => {
        card.addEventListener('click', () => {
            const marketplace = card.querySelector('h3').textContent;
            const performance = card.querySelector('p').textContent;
            showNotification(
                `${marketplace} Performance`,
                performance,
                'info'
            );
        });
    });

    // Initialize Charts
    if (document.getElementById('salesChart')) {
        const salesChart = new Chart(document.getElementById('salesChart'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                    borderColor: '#00f2ff',
                    backgroundColor: 'rgba(0, 242, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(45, 45, 45, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#a0a0a0',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a0a0a0',
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a0a0a0'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // Sales Chart Toggle
        const revenueBtn = document.querySelector('.chart-actions button:first-child');
        const ordersBtn = document.querySelector('.chart-actions button:last-child');
        
        if (revenueBtn && ordersBtn) {
            revenueBtn.addEventListener('click', () => {
                revenueBtn.classList.add('active');
                ordersBtn.classList.remove('active');
                salesChart.data.datasets[0].label = 'Revenue';
                salesChart.data.datasets[0].data = [12000, 19000, 15000, 25000, 22000, 30000, 28000];
                salesChart.update();
            });

            ordersBtn.addEventListener('click', () => {
                ordersBtn.classList.add('active');
                revenueBtn.classList.remove('active');
                salesChart.data.datasets[0].label = 'Orders';
                salesChart.data.datasets[0].data = [45, 62, 58, 75, 68, 82, 78];
                salesChart.update();
            });
        }
    }

    if (document.getElementById('productsChart')) {
        const productsChart = new Chart(document.getElementById('productsChart'), {
            type: 'bar',
            data: {
                labels: ['Leather Bag', 'Copper Cookware', 'Handwoven Scarf', 'Water Bottle', 'Wall Art'],
                datasets: [{
                    label: 'Sales',
                    data: [25450, 18225, 12000, 8500, 6800],
                    backgroundColor: [
                        '#00f2ff',
                        '#b026ff',
                        '#00ff88',
                        '#ff6b6b',
                        '#ffd93d'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(45, 45, 45, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#a0a0a0',
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a0a0a0',
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a0a0a0'
                        }
                    }
                }
            }
        });
    }

    if (document.getElementById('marketplaceChart')) {
        const marketplaceChart = new Chart(document.getElementById('marketplaceChart'), {
            type: 'doughnut',
            data: {
                labels: ['Amazon', 'Flipkart', 'Meesho'],
                datasets: [{
                    data: [25450, 18225, 12000],
                    backgroundColor: [
                        '#00f2ff',
                        '#b026ff',
                        '#00ff88'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#a0a0a0',
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(45, 45, 45, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#a0a0a0',
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    if (document.getElementById('demographicsChart')) {
        const demographicsChart = new Chart(document.getElementById('demographicsChart'), {
            type: 'polarArea',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    data: [15, 35, 25, 15, 10],
                    backgroundColor: [
                        '#00f2ff',
                        '#b026ff',
                        '#00ff88',
                        '#ff6b6b',
                        '#ffd93d'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#a0a0a0',
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(45, 45, 45, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#a0a0a0'
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Chart Interval Change Handler
    const chartInterval = document.querySelector('.chart-interval');
    if (chartInterval) {
        chartInterval.addEventListener('change', (e) => {
            showNotification('Chart Update', `Data updated to show ${e.target.value.toLowerCase()} intervals`, 'info');
        });
    }

    // Download Report Handler
    const downloadBtn = document.querySelector('.chart-actions .btn-icon[title="Download Report"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            showNotification('Report Download', 'Your report is being generated and will download shortly', 'success');
        });
    }

    // View Details Handler
    const viewDetailsBtn = document.querySelector('.chart-actions .btn-icon[title="View Details"]');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
            showNotification('Detailed View', 'Detailed demographics analysis will open in a new view', 'info');
        });
    }

    // Info Icon Tooltips
    const infoIcons = document.querySelectorAll('.metric-header i');
    infoIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            showNotification('Metric Info', icon.getAttribute('title'), 'info', 2000);
        });
    });

    // Sample data for products
    const sampleProducts = [
        {
            name: 'Handcrafted Leather Bag',
            price: '₹1,899',
            stock: 15,
            category: 'Accessories'
        },
        {
            name: 'Traditional Copper Cookware',
            price: '₹2,499',
            stock: 8,
            category: 'Home & Living'
        },
        {
            name: 'Handwoven Silk Saree',
            price: '₹5,999',
            stock: 12,
            category: 'Clothing'
        },
        {
            name: 'Brass Table Decor Set',
            price: '₹3,299',
            stock: 20,
            category: 'Home & Living'
        },
        {
            name: 'Wooden Wind Chimes',
            price: '₹899',
            stock: 25,
            category: 'Home & Living'
        },
        {
            name: 'Handmade Jute Rug',
            price: '₹1,499',
            stock: 18,
            category: 'Home & Living'
        },
        {
            name: 'Silver Oxidized Jewelry Set',
            price: '₹2,799',
            stock: 30,
            category: 'Accessories'
        },
        {
            name: 'Cotton Block Print Bedsheet',
            price: '₹1,299',
            stock: 22,
            category: 'Home & Living'
        },
        {
            name: 'Bamboo Storage Baskets',
            price: '₹799',
            stock: 40,
            category: 'Home & Living'
        },
        {
            name: 'Handwoven Cotton Stole',
            price: '₹699',
            stock: 35,
            category: 'Accessories'
        },
        {
            name: 'Terracotta Wall Art',
            price: '₹2,199',

            stock: 15,
            category: 'Home & Living'
        },
        {
            name: 'Leather Laptop Sleeve',
            price: '₹1,599',

            stock: 28,
            category: 'Electronics'
        },
        {
            name: 'Handmade Ceramic Planters',
            price: '₹899',

            stock: 45,
            category: 'Home & Living'
        },
        {
            name: 'Macrame Wall Hanging',
            price: '₹1,299',

            stock: 20,
            category: 'Home & Living'
        },
        {
            name: 'Brass Door Handles',
            price: '₹1,999',

            stock: 32,
            category: 'Home & Living'
        }
    ];

    // Populate products list
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.className = 'products-list';
        sampleProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-list-item';
            productItem.innerHTML = `
                <div class="product-details">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <div class="product-stats">
                        <div class="stat">
                            <span class="label">Price</span>
                            <span class="value">${product.price}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Stock</span>
                            <span class="value ${product.stock <= 10 ? 'low-stock' : ''}">${product.stock} units</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-primary">Edit</button>
                        <button class="btn-secondary">View Details</button>
                        <button class="btn-action">Delete</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productItem);
        });
    }

    // Sample data for orders
    const sampleOrders = [
        {
            id: '#ORD-003',
            customer: 'Mike Johnson',
            products: 'Copper Water Bottle',
            total: '₹899',
            date: '2024-03-06',
            status: 'pending'
        },
        {
            id: '#ORD-004',
            customer: 'Sarah Williams',
            products: 'Handwoven Scarf',
            total: '₹1,299',
            date: '2024-03-06',
            status: 'processing'
        }
    ];

    // Populate orders table
    const ordersTable = document.querySelector('.orders-table tbody');
    if (ordersTable) {
        sampleOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.products}</td>
                <td>${order.total}</td>
                <td>${order.date}</td>
                <td><span class="status ${order.status}">${order.status}</span></td>
                <td><button class="btn-action">Details</button></td>
            `;
            ordersTable.appendChild(row);
        });
    }

    // Sample data for inventory
    const sampleInventory = [
        {
            sku: 'SKU001',
            product: 'Handcrafted Leather Bag',
            category: 'Accessories',
            stock: 15,
            price: '₹1,899',
            value: '₹28,485'
        },
        {
            sku: 'SKU002',
            product: 'Traditional Copper Cookware',
            category: 'Home & Living',
            stock: 8,
            price: '₹2,499',
            value: '₹19,992'
        }
    ];

    // Populate inventory table
    const inventoryTable = document.querySelector('.inventory-table tbody');
    if (inventoryTable) {
        sampleInventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.sku}</td>
                <td>${item.product}</td>
                <td>${item.category}</td>
                <td>${item.stock}</td>
                <td>${item.price}</td>
                <td>${item.value}</td>
                <td>
                    <button class="btn-action">Edit</button>
                    <button class="btn-action">Delete</button>
                </td>
            `;
            inventoryTable.appendChild(row);
        });
    }

    // Real-time stats update
    setInterval(() => {
        const stats = document.querySelectorAll('.stat-card .amount');
        const randomStat = stats[Math.floor(Math.random() * stats.length)];
        if (randomStat) {
            const currentValue = parseInt(randomStat.textContent.replace(/[^0-9]/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 100) - 50;
            
            randomStat.textContent = randomStat.textContent.includes('₹') ? 
                `₹${newValue.toLocaleString()}` : 
                newValue.toLocaleString();

            const trend = randomStat.nextElementSibling;
            if (trend) {
                const trendValue = Math.floor(Math.random() * 20) - 10;
                trend.textContent = `${trendValue >= 0 ? '+' : ''}${trendValue}%`;
                trend.className = `trend ${trendValue >= 0 ? 'positive' : 'negative'}`;
            }
        }
    }, 5000);

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const parentSection = input.closest('.section');
            
            if (parentSection.querySelector('.products-list')) {
                const products = parentSection.querySelectorAll('.product-list-item');
                products.forEach(product => {
                    const productName = product.querySelector('h3').textContent.toLowerCase();
                    product.style.display = productName.includes(searchTerm) ? 'flex' : 'none';
                });
            } else if (parentSection.querySelector('table')) {
                const rows = parentSection.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });

    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-options select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filterValue = select.value.toLowerCase();
            const parentSection = select.closest('.section');
            
            if (parentSection.querySelector('.products-list')) {
                const products = parentSection.querySelectorAll('.product-list-item');
                products.forEach(product => {
                    const category = product.querySelector('.product-category').textContent.toLowerCase();
                    product.style.display = !filterValue || category.includes(filterValue) ? 'flex' : 'none';
                });
            } else if (parentSection.querySelector('table')) {
                const rows = parentSection.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    if (!filterValue || row.textContent.toLowerCase().includes(filterValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });

    // Function to switch tabs
    function switchTab(targetTab) {
        // Remove active class from all tabs
        document.querySelectorAll('.content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.sidebar nav ul li').forEach(item => item.classList.remove('active'));
        
        // Add active class to target tab
        document.getElementById(targetTab + '-page').classList.add('active');
        document.querySelector(`[data-page="${targetTab}"]`).classList.add('active');
    }

    // Handle view details button clicks
    document.querySelectorAll('.view-all[data-target]').forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-target');
            switchTab(targetTab);
        });
    });

    // Handle sidebar navigation
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-page');
            switchTab(targetTab);
        });
    });

    // Create and append footer
    const mainContent = document.querySelector('.main-content');
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <p>Made with <span class="heart"><i class="fas fa-heart"></i></span> by AnshulK01</p>
        <div class="social-links">
            <a href="https://www.linkedin.com/in/anshul-kanswal/" target="_blank" title="LinkedIn">
                <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://x.com/AnshulKanswal01" target="_blank" title="Twitter">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="https://github.com/AnshulK-01" target="_blank" title="GitHub">
                <i class="fab fa-github"></i>
            </a>
        </div>
    `;
    mainContent.appendChild(footer);
});