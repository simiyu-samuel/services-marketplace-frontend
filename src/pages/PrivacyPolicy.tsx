import AnimatedWrapper from "@/components/ui/AnimatedWrapper";

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="container pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedWrapper>
            <header className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </header>
          </AnimatedWrapper>

          <AnimatedWrapper delay={0.2}>
            <div className="prose dark:prose-invert max-w-none prose-lg prose-p:text-foreground/80 prose-li:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
              <p>
                Welcome to Themabinti Services Hub. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
              </p>
              
              <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
              <p>
                We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use.
              </p>
              
              <h2>2. HOW DO WE USE YOUR INFORMATION?</h2>
              <p>
                We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>

              <h2>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
              <p>
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, Legal Obligations, Vital Interests.
              </p>

              <h2>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
              <p>
                We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
              </p>

              <h2>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
              <p>
                We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.
              </p>

              <h2>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
              </p>

              <h2>7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
              <p>
                We do not knowingly solicit data from or market to children under 18 years of age. By using the website, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the website.
              </p>

              <h2>8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
              <p>
                In some regions (like the European Economic Area), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
              </p>

              <h2>9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
              <p>
                Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.
              </p>

              <h2>10. DO WE MAKE UPDATES TO THIS POLICY?</h2>
              <p>
                Yes, we will update this policy as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible.
              </p>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
