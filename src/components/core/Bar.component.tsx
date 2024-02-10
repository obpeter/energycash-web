import React, {FC} from "react";

interface BarComponentProps {
  height?: string
  color: string
  percentage: number
}

const BarComponent: FC<BarComponentProps> = (props) => {

  const containerStyle = {
    width: "100%",
    background: "#ECEBEB",
    borderRadius: "10px",
    height: props.height || "10px"
  }

  const childStyle = {
    width: props.percentage+"%",
    background: props.color,
    borderRadius: "10px",
    height: props.height || "10px"

  }

  return (
    <div style={containerStyle}>
      <div style={childStyle}></div>
    </div>
  )
}

export default BarComponent