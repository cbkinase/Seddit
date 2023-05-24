import "./useragreement.css"
import { NavLink } from "react-router-dom"

export default function UserAgreement() {
    return <section className="user-agreement">
    <div className="user-agreement-header">
      <h2>User Agreement</h2>
      <p>Welcome to Reddit, the front page of the internet. We are a community-driven website, with a mission to democratize the traditional model of content creation and distribution. By accessing or using our Services, you agree to be bound by these terms of use ("User Agreement"). Please read them carefully before using our Services. If you do not agree to these terms, you may not use our Services. Furthermore, you agree that you have read and agree with the terms outlined in our <NavLink to="/content-policy">Content Policy</NavLink></p>
    </div>
    <div className="user-agreement-list">
      <h3>Content You Submit</h3>
      <ul>
        <li>You retain ownership of the content you submit to Reddit, but by uploading or posting content to our Services, you grant us a worldwide, non-exclusive, royalty-free, sub-licensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with our Services and our business, including without limitation for promoting and redistributing part or all of our Services.</li>
        <li>We reserve the right to remove or modify any content you submit for any reason, including if we believe it violates these Terms or our policies.</li>
      </ul>
    </div>
    <div className="user-agreement-footer">
      <h3>Changes to this User Agreement</h3>
      <p>We may modify this User Agreement from time to time. Any changes will be effective upon posting the updated User Agreement on our Services. Your continued use of our Services following the posting of any changes constitutes your acceptance of such changes. If you object to any provision of the updated User Agreement, you may stop using our Services.</p>
      <h3>Dispute Resolution and Governing Law</h3>
      <p>This User Agreement shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law. Any dispute arising out of or relating to this User Agreement or your use of our Services will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
    </div>
  </section>

}
