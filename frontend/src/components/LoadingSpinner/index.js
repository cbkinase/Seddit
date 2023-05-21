export default function LoadingSpinner({ isShort }) {
    return (
    <div className={isShort ? "short-spinner-container" : "spinner-container"}>
    <div className={isShort ? "short-spinner" : "spinner"}></div>
  </div>
    )
}
