export default function Card({ children, style = {}, className = '', noPad = false }) {
  return (
    <div
      className={`card ${className}`}
      style={{ padding: noPad ? 0 : 24, ...style }}
    >
      {children}
    </div>
  )
}
