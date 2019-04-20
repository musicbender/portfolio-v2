import React from 'react';
import PropTypes from 'prop-types';
import DotFormation from '../_particles/dot-formation';
import { config } from '../../../shared/config.json';
import { hasWindow } from '../../util/util';
import cn from 'classnames/bind';
import style from './contact.css';
const cx = cn.bind(style);

const Contact = ({ atBottom }) => {
  const hideArray = [
    23, 24, 25, 26, 27,
    51, 52, 53, 54, 55,
    79, 80, 81, 82, 83,
    107, 108, 109, 110, 111,
    135, 136, 137, 138, 139
  ];

  const handleButton = (e) => {
    e.preventDefault();
    if (hasWindow()) {
      window.location.href = `mailto:${config.email}`;
    }
  }

  return (
    <div className={cx(style.contact)}>
      <div className={cx(style.dotWrapper)}>
        <DotFormation classNames="big" columns={28} hide={!atBottom} hideArray={hideArray} />
        <DotFormation classNames="small" columns={4} />
      </div>
      <a className={cx(style.contactCta)} onClick={handleButton}>
        <p>Say Hello</p>
      </a>
    </div>
  );
}

Contact.propTypes = {

}

Contact.defaultProps = {

}

export default Contact;
