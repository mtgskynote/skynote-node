import iphone_border from '../assets/images/iphone_border.png'

const IphoneBorder = ({ height, width }) => {
  return (
    <img
      src={iphone_border}
      className="iphone-border"
      altprop="iphone-border"
      height={height}
      width={width}
    />
  )
}

export default IphoneBorder
