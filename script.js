// Google Professional ML Engineer Study Guide - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Highlight current section in navigation
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add animation to cards on scroll
    const cards = document.querySelectorAll('.info-card, .domain-item, .problem-type-card, .formula-card');
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        cardObserver.observe(card);
    });
    
    // Track study progress (localStorage)
    const completedSections = JSON.parse(localStorage.getItem('completedSections') || '[]');
    
    // Add checkboxes to track progress
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        if (sectionId && sectionId !== 'overview' && sectionId !== 'resources') {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `progress-${sectionId}`;
            checkbox.checked = completedSections.includes(sectionId);
            checkbox.style.marginRight = '10px';
            
            const label = document.createElement('label');
            label.htmlFor = `progress-${sectionId}`;
            label.textContent = 'Mark as completed';
            label.style.cursor = 'pointer';
            label.style.fontSize = '0.9rem';
            label.style.color = '#5f6368';
            
            const progressDiv = document.createElement('div');
            progressDiv.style.marginTop = '20px';
            progressDiv.style.padding = '15px';
            progressDiv.style.background = '#f8f9fa';
            progressDiv.style.borderRadius = '8px';
            progressDiv.appendChild(checkbox);
            progressDiv.appendChild(label);
            
            section.appendChild(progressDiv);
            
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    if (!completedSections.includes(sectionId)) {
                        completedSections.push(sectionId);
                    }
                } else {
                    const index = completedSections.indexOf(sectionId);
                    if (index > -1) {
                        completedSections.splice(index, 1);
                    }
                }
                localStorage.setItem('completedSections', JSON.stringify(completedSections));
                updateProgress();
            });
        }
    });
    
    // Display overall progress
    function updateProgress() {
        const totalSections = 7; // 7 domains
        const completed = completedSections.length;
        const percentage = Math.round((completed / totalSections) * 100);
        
        let progressBar = document.getElementById('overall-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'overall-progress';
            progressBar.style.position = 'fixed';
            progressBar.style.bottom = '20px';
            progressBar.style.right = '20px';
            progressBar.style.background = 'white';
            progressBar.style.padding = '15px 20px';
            progressBar.style.borderRadius = '8px';
            progressBar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            progressBar.style.zIndex = '1000';
            progressBar.style.minWidth = '200px';
            document.body.appendChild(progressBar);
        }
        
        progressBar.innerHTML = `
            <div style="font-weight: 500; margin-bottom: 8px;">Study Progress</div>
            <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #4285f4; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
            </div>
            <div style="margin-top: 8px; font-size: 0.9rem; color: #5f6368;">
                ${completed} of ${totalSections} domains completed (${percentage}%)
            </div>
        `;
    }
    
    updateProgress();
    
    // Print-friendly version
    const printButton = document.createElement('button');
    printButton.textContent = '🖨️ Print Study Guide';
    printButton.style.position = 'fixed';
    printButton.style.bottom = '100px';
    printButton.style.right = '20px';
    printButton.style.background = '#4285f4';
    printButton.style.color = 'white';
    printButton.style.border = 'none';
    printButton.style.padding = '12px 20px';
    printButton.style.borderRadius = '8px';
    printButton.style.cursor = 'pointer';
    printButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    printButton.style.zIndex = '1000';
    printButton.style.fontSize = '0.9rem';
    printButton.style.fontWeight = '500';
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);
    
    // Add tooltips to technical terms
    const technicalTerms = {
        'AUC-ROC': 'Area Under the Receiver Operating Characteristic Curve - measures model performance across all classification thresholds',
        'F1 Score': 'Harmonic mean of precision and recall - balances both metrics',
        'Precision': 'Of all positive predictions, how many were actually positive',
        'Recall': 'Of all actual positives, how many did we correctly identify',
        'Overfitting': 'Model performs well on training data but poorly on new data',
        'Underfitting': 'Model is too simple and performs poorly on both training and test data',
        'Regularization': 'Technique to prevent overfitting by adding penalty for complexity',
        'Hyperparameter': 'Configuration setting for the learning algorithm (not learned from data)',
        'Feature Engineering': 'Process of creating new features from raw data to improve model performance'
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'n' for next section
        if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
            const currentSection = document.querySelector('.content-section:hover') || sections[0];
            const currentIndex = Array.from(sections).indexOf(currentSection);
            if (currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Press 'p' for previous section
        if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
            const currentSection = document.querySelector('.content-section:hover') || sections[0];
            const currentIndex = Array.from(sections).indexOf(currentSection);
            if (currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Press 'h' to go home
        if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    console.log('📚 Google Professional ML Engineer Study Guide loaded!');
    console.log('💡 Keyboard shortcuts: n (next), p (previous), h (home)');
});
