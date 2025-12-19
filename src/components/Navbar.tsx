import "./navbar.css"

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="brand">EquipMon</span>
        <span className="divider" />
        <span className="page-title">Equipment Anomaly Dashboard</span>
      </div>

      <div className="navbar-right">
        <button className="nav-btn">Export PDF</button>
        <div className="user-chip">Admin</div>
      </div>
    </nav>
  )
}
