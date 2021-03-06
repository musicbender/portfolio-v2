import React from 'react';
import PropTypes from 'prop-types';
import TextEmbed from './text-embed';
import { getTextWidth } from '../../../util/dot-grid';
import cn from 'classnames/bind';
import style from './text-embeds.css';
const cx = cn.bind(style);

const TextEmbeds = ({
  textConfig,
  spacing,
  getDotOffset,
  dotSize,
  active,
  rowMajority
}) => {
  const getTextOffset = (item) => {
    return item.direction === 'right'
      ? getDotOffset(item.position[0], 'x')
      : getDotOffset(item.position[1], 'y')
  }

  const getTextSpacing = (direction) => {
    switch(direction) {
      case 'up':
        return rowMajority 
          ? spacing[0]
          : spacing[1] / 2;
      case 'down':
        return rowMajority 
          ? (spacing[0]) - 0.25
          : (spacing[1] / 2) - 0.25;
      default:
        return spacing[0];
    }
  }

  return (
    <div className={cx(style.textEmbeds)}>
      {
        textConfig.map((item, i) => (
          <TextEmbed
            data={item}
            spacing={spacing}
            active={active}
            offsets={{
              x: getDotOffset(item.position[0], 'x'),
              y: getDotOffset(item.position[1], 'y') + (dotSize / 2)
            }}
            width={getTextWidth(item.text, getTextSpacing(item.direction), getTextOffset(item))}
            key={item.text + i}
          />
        ))
      }
    </div>
  );
}

TextEmbeds.propTypes = {
  textConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  spacing: PropTypes.arrayOf(PropTypes.number),
  getDotOffset: PropTypes.func
}

TextEmbeds.defaultProps = {
  spacing: [7, 7]
}

export default TextEmbeds;
