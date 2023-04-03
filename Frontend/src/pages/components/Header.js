import "./Header.css";

const Header = () => {
    return (
      <header>
        <h1>SyllaBye</h1>
        <nav>
          <button className="headerBtn"> Home </button>
          <button className="headerBtn"> Calendar </button>
          <button className="headerBtn"> Settings </button>
        </nav>
      </header>
    )
  }
  
  export default Header
  