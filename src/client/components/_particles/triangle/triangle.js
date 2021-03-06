import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames/bind';
import style from './triangle.css';
const cx = cn.bind(style);

const Triangle = ({
  color,
  size,
  opacity,
  classNames
}) => {
  const opacities = {
    tiny: 1,
    small: 0.7,
    medium: 0.287,
    giant: 0.0255
  }

  return (
    <svg
      className={cx(style.triangle, style[color], style[size], classNames)}
      viewBox="0 0 10 11"
      style={{ opacity: opacity || opacities[size] || 1 }}
    >
      <g>
        <g opacity="0.8">
          <path d="M0.051,0.559l10,-0.005l0.005,10l-10.005,-9.995Z" />
        </g>
      </g>
    </svg>
  )
}

Triangle.propTypes = {
  color: PropTypes.oneOf(['white', 'orange', 'aqua', 'purple', 'yellow']),
  size: PropTypes.oneOf(['micro', 'tiny', 'small', 'medium', 'giant']),
  opacity: PropTypes.number,
  classNames: PropTypes.string
}

Triangle.defaultProps = {
  color: 'white',
  size: 'medium',
  classNames: '',
}

export default Triangle;
