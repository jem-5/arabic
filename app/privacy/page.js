import React from "react";
export default function Privacy() {
  return (
    <main className="flex-grow flex flex-col items-left p-2 text-neutral w-3/4 bg-[rgba(255,255,255,0.8)]">
      <h3 className="font-bold text-lg self-center ">Privacy Policy</h3>
      <p className="self-center ">Effective Date: June 25, 2024</p>

      <div className="divider "></div>
      <p>
        {" "}
        Arabic Road (&#34;we,&#34; &#34;us,&#34; or &#34;our&#34;) is committed
        to protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you visit our website
        [your website URL] (the &#34;Site&#34;), including our language learning
        platform where users can learn Arabic. Please read this privacy policy
        carefolly. If you do not agree with the terms of this privacy policy,
        please do not access the Site.
      </p>

      <h4 className="font-bold">1. Information We Collect</h4>
      <ol className="list-disc list-inside ">
        <li>
          Account Information:
          <p className="indent-3">
            *Personal Data: When you choose to create an account to save your
            progress through lessons and modoles, we may collect personal data
            such as your name, email address, and a password.
          </p>
        </li>
        <li>
          Usage Data:
          <p className="indent-3">
            *Anonymous Browsing: If you choose not to create an account, you can
            browse our lessons anonymously. In this case, no personal data is
            collected.
          </p>
          <p className="indent-3">
            *Automatically Collected Data: We may collect certain information
            automatically when you visit the Site, such as your IP address,
            browser type, operating system, access times, and the pages you have
            viewed directly before and after accessing the Site. This
            information is used for analytical purposes to improve our service.
          </p>
        </li>
      </ol>

      <h4 className="font-bold">2. Use of Your Information</h4>
      <p>
        We may use the information we collect from you in the following ways:
      </p>
      <ol className="list-disc list-inside">
        <li>
          To provide and maintain our service: Including to monitor the usage of
          our service.
        </li>
        <li>
          To manage your account: To manage your registration as a user of the
          service. The personal data you provide can give you access to
          different functionalities of the service that are available to you as
          a registered user.
        </li>
        <li>
          To improve our website: We continually strive to improve our website
          offerings based on the information and feedback we receive from you.
        </li>
        <li>
          To communicate with you: Including for customer service, to provide
          you with updates and other information relating to the service, and
          for marketing and promotional purposes.
        </li>
        <li>To enforce our terms, conditions, and policies.</li>
        <li>To protect our legal rights and interests. </li>
      </ol>
      <h4 className="font-bold">3. Sharing of Your Information</h4>
      <p>
        We do not share your personal information with third parties except as
        described in this Privacy Policy:
        <ol className="list-disc list-inside">
          <li>
            With service providers: We may share your personal information with
            service providers to monitor and analyze the use of our service, to
            contact you, and to provide the service.
          </li>
          <li>
            For business transfers: We may share or transfer your information in
            connection with, or during negotiations of, any merger, sale of
            company assets, financing, or acquisition of all or a portion of our
            business to another company.
          </li>
          <li>
            With your consent: We may disclose your personal information for any
            other purpose with your consent.
          </li>
        </ol>
      </p>
      <h4 className="font-bold">4. Data Security</h4>
      <p>
        We use administrative, technical, and physical security measures to help
        protect your personal information. While we have taken reasonable steps
        to secure the personal information you provide to us, please be aware
        that despite our efforts, no security measures are perfect or
        impenetrable, and no method of data transmission can be guaranteed
        against any interception or other type of misuse.
      </p>
      <h4 className="font-bold">5. Your Privacy Rights</h4>
      <p>
        Depending on your location, you may have the following rights regarding
        your personal data:
      </p>
      <ol className="list-disc list-inside">
        <li>
          Access and Update: You can review and change your personal information
          by logging into the Site and visiting your account profile page.
        </li>
        <li>
          Deletion: You can request the deletion of your account and personal
          data by contacting us at info @ arabicroad.com
        </li>
        <li>
          Data Portability: You can request to receive a copy of the personal
          data we have about you in a structured, commonly used, and
          machine-readable format.
        </li>
      </ol>
      <h4 className="font-bold">6. Children&#39;s Privacy</h4>
      <p>
        Our services are not directed to individuals under the age of 13. We do
        not knowingly collect personal data from children under 13. If we become
        aware that a child under 13 has provided us with personal data, we will
        take steps to delete such information.
      </p>
      <h4 className="font-bold">7. Changes to This Privacy Policy</h4>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page. You are
        advised to review this Privacy Policy on a regular basis.
      </p>
    </main>
  );
}
