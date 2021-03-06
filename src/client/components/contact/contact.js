import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DotFormation from '../_particles/dot-formation';
import { setContactTop } from '../../actions/home';
import { meta, config } from '../../../shared/config.json';
import { hasWindow, throttle, minMax } from '../../util/util';
import cn from 'classnames/bind';
import style from './contact.css';
const cx = cn.bind(style);

class Contact extends Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleResize = throttle(this.handleResize.bind(this), 100);
    this.gridID = 'contact-dot-grid';
    this.defaultColor = 'rgb(249, 141, 81)';
    // this.hideArray = [
    //   23, 24, 25, 26, 27,
    //   51, 52, 53, 54, 55,
    //   79, 80, 81, 82, 83,
    //   107, 108, 109, 110, 111,
    //   135, 136, 137, 138, 139
    // ];
    this.hideArray = [];
    this.state = {
      dotsWidth: 0,
      dotsHeight: 0,
      color: this.defaultColor
    }
  }

  componentDidMount() {
    const elm = document.getElementById(this.gridID);
    const rect = elm.getBoundingClientRect();

    window.addEventListener('resize', this.handleResize);
    // elm.addEventListener('mousemove', throttle(this.handleMouseMove(rect), 150));
    this.setState({ dotsWidth: rect.width, dotsHeight: rect.height });
    this.setTop(false, config.contactTop);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.atBottom && !this.props.atBottom) {
      this.setState({ color: this.defaultColor })
    }
  }

  componentWillUnmount() {
    window.removeEventListner('resize', this.handleResize);
  }

  setTop(didResize = false, input) {
    let value = input;

    if (value == null) {
      const elm = document.getElementById(this.gridID);
      const rect = elm.getBoundingClientRect();
      value = rect.top - (rect.height / 2)
    }

    this.props.setContactTop({ value, didResize });
  }

  handleMouseMove(rect) {
    return (e) => {
      const x = Math.max(0, e.clientX);
      const y = Math.max(0, Math.round(e.pageY - rect.top));
      const xPerc = Math.round((x / this.state.dotsWidth) * 100);
      const yPerc = Math.round((y / this.state.dotsHeight) * 100);
      const r = minMax(xPerc * 2);
      const g = minMax(100 + Math.round(Math.max(1, xPerc) / Math.max(1, yPerc)));
      const b = minMax(yPerc * 2);

      this.setState({ color: `rgb(${r}, ${g}, ${b})`});
    }
  }

  handleResize() {
    this.setTop(true);
  }

  handleButton(e) {
    e.preventDefault();
    if (hasWindow()) {
      window.location.href = `mailto:${meta.email}`;
    }
  }

  render() {
    return (
      <div className={cx(style.contact)}>
        <div id={this.gridID} className={cx(style.dotWrapper)}>
          <DotFormation
            classNames={cx('big')}
            columns={15}
            hide={!this.props.atBottom}
            hideArray={this.hideArray}
            color={this.state.color}
          />
          <div
            className={cx(
              style.contactCta,
              { [style.show]: this.props.atBottom },
              { [style.hide]: !this.props.atBottom }
            )}
          >
            <p style={{ color: this.state.color }}>Say Hello</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ global, home }) => {
  return {
    contactTop: home.contactTop
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setContactTop
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
