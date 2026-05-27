<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <span>🤖</span>
          <span class="footer-logo-text">AI Interview</span>
        </div>
        <p class="footer-slogan">AI赋能求职，让面试更自信。</p>
      </div>

      <div class="footer-col">
        <div class="footer-col-title">产品</div>
        <div class="footer-link">生成简历</div>
        <div class="footer-link">模拟面试</div>
      </div>

      <div class="footer-col">
        <div class="footer-col-title">关于</div>
        <div class="footer-link">关于我们</div>
        <div class="footer-link">隐私政策</div>
      </div>

      <div class="footer-col">
        <div class="footer-col-title">联系我们</div>
        <div class="footer-contact">support@aiinterview.com</div>
        <div class="footer-socials">
          <span class="social-icon">💬</span>
          <span class="social-icon">in</span>
          <span class="social-icon">⌥</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">© 2024 AI Interview. 保留所有权利。</div>
  </footer>
</template>

<style lang="less" scoped>
.footer {
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 48px 40px 0;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
  padding-bottom: 40px;
}

.footer-brand {
  flex: 1.5;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 16px;

  .footer-logo-text {
    font-weight: 700;
    color: #515ff1;
  }
}

.footer-slogan {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.footer-col {
  flex: 1;
}

.footer-col-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.footer-link {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    color: #515ff1;
  }
}

.footer-contact {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.footer-socials {
  display: flex;
  gap: 12px;

  .social-icon {
    font-size: 16px;
    cursor: pointer;
    color: #888;

    &:hover {
      color: #515ff1;
    }
  }
}

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 0;
  font-size: 12px;
  color: #aaa;
  border-top: 1px solid #f5f5f5;
  text-align: center;
}
</style>
