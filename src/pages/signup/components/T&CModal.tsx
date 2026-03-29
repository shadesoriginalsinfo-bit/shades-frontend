import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TermsAndConditionsModal({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95%] md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-[#C6A46C]">Terms and Conditions</DialogTitle>
          {/* <p className="text-sm text-muted-foreground">Last updated on 1/12/2025</p> */}
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4 text-sm">
          
          <div className="text-sm leading-relaxed space-y-1">

            {/* Intro */}
            <p>
              Bharat Petroleum Corporation Limited (hereinafter referred to as “BPCL”, “we”, “us”, or “our”, including our affiliates and group companies) is offering various services under our customer centric initiatives, through our websites: www.bharatpetroleum.com (“BP X-Change”) in the course of providing services to you.
            </p>

            <p>
              This Agreement contains all the Terms and Conditions applicable to, and governing, the provision of Services by BPCL through the BP X-Change (“Terms of Use”).
            </p>

            {/* Section 1 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">1. SERVICES :</span>{" "}
                The BP X-CHANGE are owned and operated by BPCL. Through the BP X-Change,
                we provide you with the following services (“Services”):
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Providing a platform for Bidding for Petrochemical Products for registered Customer / resellers of BPCL;
                </li>
                <li>
                  The BP X-Change use “cookies”. Cookies are small data files that a website stores on your web browser. These are used for the purpose of storing your preferences, previous browsing activities, profiling and tracking your behaviour on the BP X-Change. By visiting the BP X-Change you acknowledge, accept and expressly authorize us for the placement of cookies on your web browser.
                </li>
                <li>
                  Any accessing or browsing of the BP X-Change, registration for and/or use of the Services indicates your agreement to these Terms of Use. If you disagree with any of the Terms of Use, then you should discontinue access or use of the BP X-Change.
                </li>
                <li>
                  We retain the right to update or revise these Terms of Use from time to time and therefore request you to check the Terms of Use every time you wish to use the BP X-Change, to understand the prevailing Terms of Use.
                </li>
                <li>
                  In case of any query regarding the Services, Terms of Use and Privacy Policy, you may contact us at [dlbpxchange@bharatpetroleum.in].
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">2. ELIGIBILITY :</span>{" "}
                When you use the BP X-Change, you represent that you meet the following primary eligibility criteria:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  You are at least 18 years old and valid Power of Attorney/authorization/board resolution for the representing Company/Firm.
                </li>
                <li>
                  You are legally competent to contract, and otherwise competent to receive the Services.
                </li>
                <li>
                   You have not been previously suspended or holiday listed or removed by BPCL, or disqualified for any other reason, from availing the Services.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">3. USE OF THE BP X-CHANGE :</span>{" "}
                As an customer/distributor/reseller and recipient of Services, when you use the BP X-Change, you agree to the following conditions of use:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  You will provide correct, accurate and complete information everywhere on the BP X-Change, based on which you will receive the Services.
                </li>
                <li>
                  Prior to providing the Services, we reserve the right to verify, without assuming any obligation or responsibility to do so, all information and documents submitted by you,including your age, identity, nationality. and We also reserve our rights seeking such additional information as we deem necessary in our sole discretion to verify your details, and you hereby acknowledge and agree that you will provide all such additional information and documents required by us promptly by uploading the same on  BP X-Change.
                </li>
                <li>
                   You may view and access the content available on the BP X-Change solely for the purposes of availing the Services, and only as per these Terms of Use. You shall not modify any content on the BP X-Change or reproduce, display, publicly perform, distribute, or otherwise use such content in any way for any public or commercial purpose or for personal gain.
                </li>
                <li>
                  You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, translate, modify, reverse-engineer, disassemble, decompile or otherwise exploit the BP X-Change or any portion of it unless expressly permitted by BPCL in writing.
                </li>
                <li>You will be solely responsible for all access to and use of the BP X-Change by anyone using the password and identification originally generated in relation to your use whether or not such access to and use of the BP X-Change is actually authorized by you, including without limitation, all communications and transmissions and all obligations (including, without limitation, financial obligations) incurred through such access or use. You are solely responsible for protecting the security and confidentiality of the password and identification generated in relation to your use.</li>
                <li>
                  You may not make any commercial use of any of the information provided on the BP X-Change.
                </li>
                <li>
                  You may not impersonate any person or entity, or falsely state or otherwise misrepresent your identity, age or affiliation with any person or entity.
                </li>
                <li>
                  You may not upload any content prohibited under applicable law, and/or designated as “Prohibited Content” under Clause 4 of these Terms of Use.
                </li>
                <li>
                  We reserve the right to refuse service or terminate accounts at our discretion, if we believe that you have violated or are likely to violate applicable law or these Terms of Use.
                </li>
              </ul>
            </div>
            {/* Section 4 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">4. PROHIBITED CONTENT :</span>{" "}
              </p>

              <ul className=" pl-6 space-y-1">
                <li>
                  a) You shall not upload to, distribute, or otherwise publish through the BP X-Change the following Prohibited Content, including but not limited to any document, content, information, or other material that:
                  <ul className="list-disc pl-6 space-y-1">
                    <li>belongs to another person and which you do not own the rights to;</li>
                    <li>is harmful, harassing, blasphemous defamatory, obscene, pornographic, pedophilic, invasive of another's privacy.</li>
                    <li>is hateful, racially or ethnically objectionable, disparaging of any person;</li>
                    <li>relates to or seems to encourage money laundering or gambling,</li>
                    <li>harms minors in any way;</li>
                    <li>infringes any patent, trademark, copyright or other proprietary rights;</li>
                    <li>violates any law in India for the time being in force;</li>
                    <li>deceives or misleads the addressee about the origin of your message;</li>
                    <li>communicates any information which is grossly offensive or menacing in nature;</li>
                    <li>impersonates another person;</li>
                    <li>contains software viruses and malicious programs;</li>
                    <li>threatens the unity, integrity, defense, security or sovereignty of India, friendly relations with foreign states, or public order;</li>
                    <li>incites any offence or prevents investigation of any offence or insults any other nation.</li>
                  </ul>
                </li>
                <li>
                  You also understand and acknowledge that if you fail to adhere to the above, we have the right to remove such information and/or immediately terminate your access to the BP X-Change and/or the Services.
                </li>
              </ul>
            </div>
            
            {/* Section 5 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">5. LIMITATION OF LIABILITY :</span>{" "}
                When you use the BP X-Change, you represent that you meet the following primary eligibility criteria:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  By using our Services, you confirm that you understand and agree to the following:
                  <ul className="list-disc pl-6 space-y-1">
                    <li>We are not liable for any direct, indirect, punitive, incidental, special or consequential losses or damages, including without limitation, losses and damages arising in relation to loss of data or profits, arising out of, or in connection with, the use of the BP X-Change or availing the Services.</li>
                    <li>In no event we are responsible for any misuse data by third party and for any acts, deeds and circumstances beyond our reasonable control, including security and data theft.</li>
                    <li>In the event that BPCL markets or promotes any Services to you, please note that you will be responsible for undertaking an assessment regarding the suitability of such Services for your purposes. Marketing or promotion of Services should be considered as being for informational purposes only and does not constitute expert advice on the suitability of such services for your specific needs.</li>
                    <li>In no event we will be liable to you for any special, indirect, incidental, consequential, punitive, reliance, or exemplary damages arising out of or relating to: (A) these Terms of Use and the Privacy Policy available at [https://www.bharatpetroleum.in/privacy-policy.aspx], with any modifications and updates; (B) your use or inability to use the BP X-Change; or (C) your use of any third party tools and services.</li>
                  </ul>
                </li>
                <li>
                  This Clause 5 shall survive the termination of this Agreement and the termination of your use of our Services.
                </li>
                
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">6. INDEMNITY :</span>{" "}
                
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  You agree and undertake to indemnify and keep us indemnified against any and all losses, damages, liabilities, costs and expenses, including reasonable attorney fees, that we may incur or suffer on account of, in relation to, or arising from, (i) your use of the BP X-Change and, or, availing or attempting to avail Services from us; (ii) any misrepresentation, inaccuracy in or breach of any of the representations and warranties made by you under this Agreement or any breach by you of any term, covenant, undertaking or obligation contained in this Agreement and, or, breach of applicable laws, Act, Rules, Regulations, Bye-laws, Policies, Guidelines; (iii) your failure to provide, in a timely manner, true, correct and complete information and documents; (iv) suppression of material facts by you or failure to provide relevant information and documents to us; (v) incorrect or inaccurate payment details provided by you and, or, use of a bank account, credit/debit card/any mode of digital payment which is not lawfully owned by you, etc.; and (vi) permitting a third party to use/access your account.
                </li>
                
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">7. DATA & INFORMATION POLICY :</span>{" "}
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  We respect your right to privacy in respect of any personal information provided to us. To see how we collect and use your personal information, please see our Privacy Policy [https://www.bharatpetroleum.in/privacy-policy.aspx].
                </li>
                <li>
                  We use reasonable technical, administrative, and physical security measures for the purpose of safeguarding all data you share with us and have internal policies in place to prevent unauthorized access to your data. We also take adequate steps to ensure that third parties with whom we may share data, also adopt reasonable level of security practices and procedures to ensure the privacy and security of your Personal Information.

                </li>
                <li>
                   We use all reasonable endeavors to ensure the integrity and security of the BP X-Change Despite our endeavors, breaches of security and confidentiality could occur. You acknowledge that we are not liable for any loss suffered by you as a result of any breaches in security or technology breaches.
                </li>
                <li>
                  We have made every effort to display the information as accurately as possible on the BP X-Change. However, unless expressly stated as otherwise, we do not undertake any liability with respect to any information with regard to which you are capable of conducting your own due diligence to ascertain accuracy and you are responsible for undertaking an assessment regarding the suitability of the information and Services for your purposes.
                </li>
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">8. INTELLECTUAL PROPERTY :</span>{" "}
                
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  You acknowledge that we own the BPCL brand name and the BP X-Change, as well as all intellectual property rights contained on the BP X-Change, including all trademarks, trade names, tag lines, logos, programs, processes, designs, software, technologies, inventions and materials therein.

                </li>
                <li>
                  You are not permitted to use the content available on the BP X-Change without our prior written permission.

                </li>
              </ul>
            </div>

            {/* Section 9 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">9. THIRD PARTY LINKS & RESOURCES:</span>{" "}
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Where the BP X-Change contain links to other sites and resources provided by third parties (including where our social media sharing plug-ins include links to third party sites), these links are provided for your information only.

                </li>
                <li>
                  We have no control over the contents of these third party websites or resources and accept no responsibility for them or for any loss or damage that may arise from your use of them.

                </li>
                <li>
                   In particular, we cannot be held responsible for the privacy policies and practices of other websites even if:

                </li>
                <li>You accessed the third-party website using links from the BP X-Change; or</li>
                <li>You were linked to the BP X-Change from a third-party website.</li>
                <li>We recommend that you check the policy of each site you visit and contact the host or owner or operator of such website if you have any concerns or questions.</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">10. FORCE MAJEURE :</span>{" "}
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  We will not be liable for any non-compliance or delay in compliance with any of the obligations we assume under any contract when caused by events that are beyond our reasonable control (“Force Majeure”). Force Majeure shall include any act, event, failure to exercise, omission or accident that is beyond our reasonable control, including but not limited to, among others, the following:
                </li>
                <li>
                  Strike, lockout or other forms of protest

                </li>
                <li>
                   Civil unrest, revolt, invasion, terrorist attack or terrorist threat, war (declared or not) or threat or preparation for war.
                </li>
                <li>Fire, explosion, storm, flood, earthquake, collapse, pandemic, epidemic or any other natural disaster.</li>
                <li>Technical glitches and other technological issues faced by the BP X-Change.</li>
                <li>Inability to use public or private transportation and telecommunication systems.</li>
                <li>Acts, decrees, legislation, regulations or restrictions of any government or public authority including any judicial determination.</li>
                <li>Our obligations deriving from any contracts should be considered suspended during the period in which Force Majeure remains in effect and we will be given an extension of the period in which to fulfil these obligations by an amount of time we shall communicate to you, not being less than the time that the situation of Force Majeure lasted.</li>
                <li>For change in law specifically, we reserve our rights to suspend our obligations under any contract indefinitely, and/or provide the Services under revised Terms of Use.</li>
              </ul>
            </div>

            {/* Section 11 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">11. GOVERNING LAW & JURISDICTION :</span>{" "}
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>
                  The use of the BP X-Change and availing the Services contracts through the BP X-Change shall be governed by the laws of India.

                </li>
                <li>
                  Any dispute arising out of, involving or relating to, or in connection with the BP X-Change and the Services or the interpretation of any provisions of these Terms of Use, or the breach, termination or invalidity thereof and shall be subject to the exclusive jurisdiction of the courts at Mumbai.

                </li>
                
              </ul>
            </div>

            {/* Section 12 */}
            <div>
              <p className="mb-2">
                <span className="font-semibold">12. Other Terms & Conditions :</span>{" "}
              </p>

              <p>Under the Information Technology Act, 2000 and different amended provisions in said Act, this document is electronic record generated by usage of different software’s provided by BPCL referred as BP X-CHANGE  for Customers, Resellers or Distributors. This electronic record does not require any physical or digital signatures.</p>
              <p>For the purpose of contract, Terms of Use, wherever the context so requires 'You' or 'User' shall mean any natural or legal juristic person who has agreed to become a member by using the BP X-Change by providing Registration Data while registering as a Customers or Resellers or Distributors . </p>
              <p>BPCL will not be liable if User has shared his/her login credentials or membership ID with any third party and for any redemption of information from his/her login or membership ID.</p>
            </div>

            {/* Signup */}
            <div>
              <p className="font-semibold">Sign-up for BP X-CHANGE : <span className="font-medium"> Process of Sign-up and access to the portal </span></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Only registered customers or resellers or distributors (Registration process / KYC completed) shall be permitted to access BP X-CHANGE . The email ID & default mobile number entered shall be the same as maintained in SAP. The Power of Attorney, in the format as provided by BPCL, for the above representative of the customer and the GST Certificate shall also form part of the registration documents.</li>
                <li>When the customer logs in for the first time, Terms and Conditions with respect to BP X-CHANGE  shall be agreed to by the customer, before participating in any mandates.</li>
                <li>BP X-Change  may undergo change from time to time, at the sole discretion of BPCL, and the terms of use will apply to customers visit to BP X-CHANGE  to avail the functions.</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Communication and Un-subscription : </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You understand that once you have shared your Account Information and successfully registered on BPCL Software, you may receive SMS or email notifications from BPCL relating to your registration and transactions.</li>
                <li>You may also receive such notifications regarding any marketing / promotional activities that may be available / not available on Software from time to time. By sharing your Account Information and registering and/ or verifying your contact number with us, you explicitly consent to receive marketing/ promotional communications (through call, SMS, email or other digital and electronic means) from us and/or our authorized representatives regarding any new services or offerings, even if your contact number is registered under the DND/NCPR list under the Telecom Commercial Communications Customer Preference Regulations, 2018.</li>
                <li>BPCL may also send notifications and reminders with respect to the Services of BPCL and product promoted and marketed by BPCL. While BPCL, endeavours to provide these notifications and reminders to you promptly, BPCL does not provide any guarantee and will not be held liable or responsible for any failure to send such notifications/reminders to you.</li>
                <li>You can unsubscribe / opt-out from receiving marketing/ promotional communications, newsletters and other notifications from BPCL at any time by following the instructions set out in such communications.</li>
              </ul>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
