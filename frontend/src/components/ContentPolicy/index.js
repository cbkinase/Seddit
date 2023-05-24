import "./contentpolicy.css"

export default function ContentPolicy() {
    return <section className="content-policy">
    <div className="content-policy-header">
      <h2>Reddit Content Policy</h2>
      <p>Reddit is a platform for communities to discuss, connect, and share in an open environment, home to some of the most authentic content anywhere online. The nature of this content might be funny, serious, offensive, or anywhere in between. While participating, it’s important to keep in mind this value above all others: show enough respect to others so that we all may continue to enjoy Reddit for what it is.</p>
    </div>
    <div className="content-policy-list">
      <h3>Prohibited Content</h3>
      <ul>
        <li>Spam</li>
        <li>Incitement to violence</li>
        <li>Personal and confidential information</li>
        <li>Impersonation</li>
        <li>Hate speech</li>
        <li>Sexual or suggestive content involving minors</li>
        <li>Illegal activities</li>
        <li>Manipulation and Disinformation</li>
        <li>Non-public personal or confidential information</li>
      </ul>
    </div>
    <div className="content-policy-footer">
      <h3>Enforcement</h3>
      <p>Reddit's content policy is enforced by a team of moderators, who review and remove any content that violates the policy. Users can also report content that they believe violates the policy by using the report function on each post or comment.</p>
      <h3>Appeals Process</h3>
      <p>If a user's content has been removed for violating the content policy, they can appeal the decision by contacting Reddit's support team. The support team will review the appeal and make a determination on whether the content should be restored or remain removed.</p>
    </div>
  </section>
}
