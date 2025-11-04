<template>
  <div class="about-view">
    <div class="about-content">
      <!-- Profile section -->
      <section class="profile-section">
        <div class="profile-header">
          <div class="avatar-container">
            <div class="avatar">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">eduhsl</h1>
            <p class="profile-title">AI 技术爱好者 & 全栈开发者</p>
            <p class="profile-bio">
              专注于人工智能技术研究和应用开发，热衷于分享技术见解和实践经验。
              关注大语言模型、机器学习、软件开发等领域的最新发展。
            </p>
          </div>
        </div>
      </section>

      <!-- Skills section -->
      <section class="skills-section">
        <h2 class="section-title">技术栈</h2>
        <div class="skills-grid">
          <div class="skill-category">
            <h3 class="skill-title">前端开发</h3>
            <div class="skill-tags">
              <span class="skill-tag">Vue.js</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">TypeScript</span>
              <span class="skill-tag">Tailwind CSS</span>
            </div>
          </div>
          <div class="skill-category">
            <h3 class="skill-title">后端开发</h3>
            <div class="skill-tags">
              <span class="skill-tag">Node.js</span>
              <span class="skill-tag">Python</span>
              <span class="skill-tag">PostgreSQL</span>
              <span class="skill-tag">Redis</span>
            </div>
          </div>
          <div class="skill-category">
            <h3 class="skill-title">AI/ML</h3>
            <div class="skill-tags">
              <span class="skill-tag">机器学习</span>
              <span class="skill-tag">深度学习</span>
              <span class="skill-tag">NLP</span>
              <span class="skill-tag">大语言模型</span>
            </div>
          </div>
          <div class="skill-category">
            <h3 class="skill-title">工具平台</h3>
            <div class="skill-tags">
              <span class="skill-tag">Docker</span>
              <span class="skill-tag">Git</span>
              <span class="skill-tag">AWS</span>
              <span class="skill-tag">Linux</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Interests section -->
      <section class="interests-section">
        <h2 class="section-title">研究兴趣</h2>
        <div class="interests-list">
          <div class="interest-item">
            <div class="interest-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div class="interest-content">
              <h3>人工智能发展趋势</h3>
              <p>关注 AI 技术的最新进展，从大语言模型到通用人工智能的发展路径</p>
            </div>
          </div>
          
          <div class="interest-item">
            <div class="interest-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="interest-content">
              <h3>大模型应用实践</h3>
              <p>探索大语言模型在实际业务场景中的应用，分享开发经验和最佳实践</p>
            </div>
          </div>
          
          <div class="interest-item">
            <div class="interest-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
              </svg>
            </div>
            <div class="interest-content">
              <h3>软件开发效率</h3>
              <p>研究 AI 如何提升软件开发效率，从代码生成到自动化测试的完整解决方案</p>
            </div>
          </div>
          
          <div class="interest-item">
            <div class="interest-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="interest-content">
              <h3>AI 伦理与治理</h3>
              <p>关注 AI 发展中的伦理问题，探讨如何构建负责任的人工智能系统</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact section -->
      <section class="contact-section">
        <h2 class="section-title">联系方式</h2>
        <div class="contact-content">
          <p class="contact-description">
            欢迎与我交流技术话题，分享见解，或者讨论合作机会。
          </p>
          <div class="contact-links">
            <a href="mailto:contact@eduhsl.com" class="contact-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              contact@eduhsl.com
            </a>
            <a href="https://github.com/eduhsl" class="contact-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Profile section */
.profile-section {
  padding: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.profile-header {
  max-width: 600px;
  margin: 0 auto;
}

.avatar-container {
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.profile-title {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.profile-bio {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto;
}

/* Skills section */
.skills-section {
  padding: 3rem;
  border-bottom: 1px solid #e1e8ed;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.skill-category {
  text-align: center;
}

.skill-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.skill-tag {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background-color: #3498db;
  color: #ffffff;
  transform: translateY(-2px);
}

/* Interests section */
.interests-section {
  padding: 3rem;
  border-bottom: 1px solid #e1e8ed;
}

.interests-list {
  display: grid;
  gap: 2rem;
}

.interest-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.interest-icon {
  width: 48px;
  height: 48px;
  background-color: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  flex-shrink: 0;
}

.interest-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.interest-content p {
  color: #7f8c8d;
  line-height: 1.6;
}

/* Contact section */
.contact-section {
  padding: 3rem;
  text-align: center;
}

.contact-description {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.75rem 1.5rem;
  border: 1px solid #3498db;
  border-radius: 8px;
}

.contact-link:hover {
  background-color: #3498db;
  color: white;
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .about-view {
    margin: 0 -15px;
  }
  
  .about-content {
    border-radius: 0;
    box-shadow: none;
  }
  
  .profile-section {
    padding: 2rem 1.5rem;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .profile-name {
    font-size: 2rem;
  }
  
  .profile-title {
    font-size: 1.125rem;
  }
  
  .skills-section,
  .interests-section,
  .contact-section {
    padding: 2rem 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .interest-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .interest-icon {
    margin: 0 auto;
  }
  
  .contact-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .contact-link {
    width: 100%;
    max-width: 250px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .about-view {
    margin: 0 -10px;
  }
  
  .profile-section {
    padding: 1.5rem 1rem;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .profile-name {
    font-size: 1.75rem;
  }
  
  .profile-title {
    font-size: 1rem;
  }
  
  .profile-bio {
    font-size: 0.9rem;
  }
  
  .skills-section,
  .interests-section,
  .contact-section {
    padding: 1.5rem 1rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .skill-title {
    font-size: 1rem;
  }
  
  .skill-tag {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
  
  .interest-content h3 {
    font-size: 1.125rem;
  }
  
  .interest-content p {
    font-size: 0.9rem;
  }
  
  .contact-description {
    font-size: 0.9rem;
  }
}
</style>
