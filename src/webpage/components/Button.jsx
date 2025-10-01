import { useMemo } from "react";
import Star from "./Star";
import X from "./X";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({
  onClick, // ✅ 추가
  className = "",
  size = "Medium",
  state = "Default",
  variant = "Primary",
  label = "+ 글쓰기",
  hasIconStart = false,
  hasIconEnd = false,
  buttonHeight,
  buttonWidth,
  buttonBorder,
  buttonAlignSelf,
  buttonMargin,
  buttonFontSize,
  buttonFontWeight,
  size1 = 16,
  starDisplay,
  size2 = 16,
  xDisplay,
}) => {
  const buttonStyle = useMemo(() => {
    return {
      height: buttonHeight,
      width: buttonWidth,
      border: buttonBorder,
      alignSelf: buttonAlignSelf,
    };
  }, [buttonHeight, buttonWidth, buttonBorder, buttonAlignSelf]);

  const button1Style = useMemo(() => {
    return {
      margin: buttonMargin,
      fontSize: buttonFontSize,
      fontWeight: buttonFontWeight,
    };
  }, [buttonMargin, buttonFontSize, buttonFontWeight]);

  return (
    <div
      className={[styles.button1, className].join(" ")}
      data-size={size}
      data-state={state}
      data-variant={variant}
      style={buttonStyle}
      onClick={onClick} // ✅ 여기에 클릭 이벤트 연결
    >
      <Star size={size1} starDisplay={starDisplay} />
      <h2 className={styles.button} style={button1Style}>
        {label}
      </h2>
      <X size={size2} xDisplay={xDisplay} />
    </div>
  );
};


Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  hasIconStart: PropTypes.bool,
  hasIconEnd: PropTypes.bool,
  size1: PropTypes.any,
  starDisplay: PropTypes.string,
  size2: PropTypes.any,
  xDisplay: PropTypes.string,

  /** Variant props */
  size: PropTypes.number,
  state: PropTypes.number,
  variant: PropTypes.number,

  /** Style props */
  buttonHeight: PropTypes.string,
  buttonWidth: PropTypes.string,
  buttonBorder: PropTypes.string,
  buttonAlignSelf: PropTypes.string,
  buttonMargin: PropTypes.string,
  buttonFontSize: PropTypes.string,
  buttonFontWeight: PropTypes.string,
};

export default Button;
