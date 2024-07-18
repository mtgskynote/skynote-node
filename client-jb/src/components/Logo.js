import logo from '../assets/images/new_logo_2023.jpg'

const Logo = ({ height, width }) => {
  return (
    <img
      src={logo}
      className="logo"
      alt="skynote-logo"
      height={height}
      width={width}
    />
  )
}

export default Logo
