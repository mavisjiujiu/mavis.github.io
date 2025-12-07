// 初始化页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 1. 导航菜单功能
    const initNavMenu = () => {
        const toggle = document.getElementById('nav-toggle');
        const nav = document.getElementById('nav-menu');
        
        if (toggle && nav) {
            // 菜单切换显示/隐藏
            toggle.addEventListener('click', () => {
                nav.classList.toggle('show');
            });
            
            // 点击导航链接后关闭菜单
            document.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('show');
                });
            });
        }
    };

    // 2. 滚动时导航激活状态
    const initScrollActive = () => {
        const sections = document.querySelectorAll('section[id]');
        
        const handleScrollActive = () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 50;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav__menu a[href*=${sectionId}]`);
                
                if (navLink) { // 避免无效选择器报错
                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        navLink.classList.add('active');
                    } else {
                        navLink.classList.remove('active');
                    }
                }
            });
        };
        
        window.addEventListener('scroll', handleScrollActive);
    };

    // 3. 滚动动画效果
    const initScrollReveal = () => {
        const sr = ScrollReveal({
            origin: 'top',
            distance: '60px',
            duration: 2000,
            delay: 200,
        });
        
        // 基础元素动画
        sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
        sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
        sr.reveal('.home__social-icon', { interval: 200 });
        sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });
        
        // 联系信息项动画
        sr.reveal('.contact__info-item', {
            delay: 200,
            interval: 200,
            distance: '20px',
            origin: 'bottom',
            opacity: 0,
            duration: 800
        });
    };

// 4. 联系表单处理 - 增强版验证
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // 验证规则
    const validateRules = {
        name: {
            required: true,
            minLength: 2,
            message: '姓名至少需要2个字符'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '请输入有效的电子邮件地址'
        },
        message: {
            required: true,
            minLength: 5,
            message: '消息内容至少需要5个字符'
        }
    };

    // 显示错误信息
    const showError = (field, message) => {
        // 移除之前的错误状态
        field.classList.remove('error');
        const existingError = field.nextElementSibling?.classList.contains('error-message') 
            ? field.nextElementSibling 
            : null;
        if (existingError) existingError.remove();

        // 添加新的错误状态
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '-0.5rem';
        errorElement.style.marginBottom = '1rem';
        errorElement.textContent = message;
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    };

    // 移除错误信息
    const clearError = (field) => {
        field.classList.remove('error');
        const errorElement = field.nextElementSibling?.classList.contains('error-message') 
            ? field.nextElementSibling 
            : null;
        if (errorElement) errorElement.remove();
    };

    // 实时验证
    ['name', 'email', 'message'].forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => {
                const value = field.value.trim();
                const rules = validateRules[fieldName];
                
                if (rules.required && !value) {
                    showError(field, '此字段为必填项');
                    return;
                }
                
                if (rules.minLength && value.length < rules.minLength) {
                    showError(field, rules.message);
                    return;
                }
                
                if (rules.pattern && !rules.pattern.test(value)) {
                    showError(field, rules.message);
                    return;
                }
                
                clearError(field);
            });
        }
    });

    // 提交验证
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        ['name', 'email', 'message'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field) return;
            
            const value = field.value.trim();
            const rules = validateRules[fieldName];
            
            if (rules.required && !value) {
                showError(field, '此字段为必填项');
                isValid = false;
                return;
            }
            
            if (rules.minLength && value.length < rules.minLength) {
                showError(field, rules.message);
                isValid = false;
                return;
            }
            
            if (rules.pattern && !rules.pattern.test(value)) {
                showError(field, rules.message);
                isValid = false;
                return;
            }
            
            clearError(field);
        });

        if (isValid) {
            // 模拟提交成功
            alert('消息发送成功！我会尽快回复您～');
            contactForm.reset();
        }
    });
};

    // 5. 奖杯图片模态框
    const initCupModal = () => {
        const cupImg = document.querySelector('.cup__img');
        const modal = document.getElementById('imageModal');
        if (!cupImg || !modal) return;
        
        const closeBtn = modal.querySelector('.modal__close');
        const slides = modal.querySelectorAll('.modal__slides');
        const prevBtn = modal.querySelector('.modal__prev');
        const nextBtn = modal.querySelector('.modal__next');
        const thumbnails = modal.querySelectorAll('.modal__thumb');
        let currentSlide = 0;
        
        // 显示指定幻灯片
        const showSlide = (n) => {
            // 边界处理
            if (n >= slides.length) currentSlide = 0;
            if (n < 0) currentSlide = slides.length - 1;
            
            // 更新显示状态
            slides.forEach(slide => slide.classList.remove('active'));
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            thumbnails[currentSlide].classList.add('active');
        };
        
        // 打开模态框
        cupImg.addEventListener('click', () => {
            modal.style.display = 'block';
            showSlide(currentSlide);
        });
        
        // 关闭模态框
        const closeModal = () => modal.style.display = 'none';
        closeBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
        
        // 幻灯片导航
        nextBtn?.addEventListener('click', () => showSlide(++currentSlide));
        prevBtn?.addEventListener('click', () => showSlide(--currentSlide));
        
        // 缩略图点击切换
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (modal.style.display !== 'block') return;
            
            if (e.key === 'Escape') closeModal();
            else if (e.key === 'ArrowRight') showSlide(++currentSlide);
            else if (e.key === 'ArrowLeft') showSlide(--currentSlide);
        });
    };

    // 6. 导航栏滚动效果
    const initHeaderScroll = () => {
        const header = document.querySelector('.l-header');
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.style.backgroundColor = 'rgba(251, 254, 253, 0.95)';
                header.style.boxShadow = '0 2px 8px rgba(146,161,176,.2)';
            } else {
                header.style.backgroundColor = 'var(--body-color)';
                header.style.boxShadow = '0 1px 4px rgba(146,161,176,.15)';
            }
        });
    };

    // 7. 返回顶部按钮
    const initBackToTop = () => {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="bx bx-chevron-up"></i>';
        document.body.appendChild(backToTopBtn);
        
        const toggleBackToTop = () => {
            if (window.pageYOffset > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // 初始化状态
    };

    // 8. 模态框图片错误处理
    const initImageErrorHandling = () => {
        document.querySelectorAll('.modal__img').forEach(img => {
            img.addEventListener('error', () => {
                img.src = 'image/default-error.png';
                img.alt = '图片加载失败';
            });
        });
    };

    // 执行所有初始化函数
    initNavMenu();
    initScrollActive();
    initScrollReveal();
    initContactForm();
    initCupModal();
    initHeaderScroll();
    initBackToTop();
    initImageErrorHandling();
});