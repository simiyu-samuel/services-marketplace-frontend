const TermsOfService = () => {
  return (
    <div className="container py-8 prose dark:prose-invert max-w-4xl mx-auto">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. AGREEMENT TO TERMS</h2>
      <p>
        By using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the service.
      </p>
      <h2>2. SERVICES</h2>
      <p>
        Themabinti Services Hub provides a platform for users to connect with service providers for beauty, health, and lifestyle services. We are not a direct provider of these services. We are not responsible for the quality or safety of the services provided by sellers on our platform.
      </p>
    </div>
  );
};

export default TermsOfService;