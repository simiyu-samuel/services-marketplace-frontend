import AnimatedWrapper from "@/components/ui/AnimatedWrapper";

const TermsOfService = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="container pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedWrapper>
            <header className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </header>
          </AnimatedWrapper>

          <AnimatedWrapper delay={0.2}>
            <div className="prose dark:prose-invert max-w-none prose-lg prose-p:text-foreground/80 prose-li:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
              <h2>1. AGREEMENT TO TERMS</h2>
              <p>
                By using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
              </p>
              
              <h2>2. SERVICES</h2>
              <p>
                Themabinti Services Hub provides a platform for users to connect with service providers for beauty, health, and lifestyle services. We are not a direct provider of these services. We are not responsible for the quality or safety of the services provided by sellers on our platform. We do not employ service providers and we are not responsible for the conduct of any user of our platform.
              </p>

              <h2>3. ACCOUNTS</h2>
              <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
              </p>

              <h2>4. CONTENT</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
              </p>

              <h2>5. TERMINATION</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>

              <h2>6. GOVERNING LAW</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
              </p>

              <h2>7. CHANGES</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2>8. CONTACT US</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@themabinti.com.
              </p>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
