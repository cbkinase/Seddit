export default function userReactedCheck(user, blob) {
    // Blob may either be a post or comment
    if (!user) return false;
    return blob["reaction_info"][user.id]
}
