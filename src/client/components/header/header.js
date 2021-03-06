import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames/bind';
import Plx from 'react-plx';
import ColorDots from './color-dots';
import Svg from '../_global/svg';
import { Triangle, DotGrid, LilSquare } from '../_particles';
import { dotGridA, dotGridB, dotGridC, dotGridD } from './dots';
import { countLongestArray, hasWindow } from '../../util/util';
import { startSequence } from '../../util/animation';
import { triangles } from './config.json';
import { meta } from '../../../shared/config.json';
import style from './header.css';
const cx = cn.bind(style);

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleSequence = this.handleSequence.bind(this);
    this.interval = 180;
    this.delay = 4000;
    this.state = {
      dotGridIndex: 0
    }
  }

  componentDidMount() {
    const dotGridLength = countLongestArray([
      dotGridA,
      dotGridB,
      dotGridC,
      dotGridD
    ]);

    startSequence({
      length: dotGridLength,
      interval: this.interval,
      delay: this.delay,
      index: this.state.dotGridIndex
    }, this.handleSequence);
  }

  handleSequence(index) {
    let newState = { dotGridIndex: index || 0 };
    this.setState(newState);
  }

  getPlxData({ plx, start, end }) {
    return [
      {
        start,
        end,
        properties: [
          {
            startValue: plx[0],
            endValue: plx[1],
            unit: '%',
            property: 'translateY'
          }
        ]
      }
    ];
  }

  renderTriangles() {
    return triangles.map((tri, i) => (
      <div
        className={cx('triangle-parallax', tri.id, tri.color, tri.size)}
        key={i + tri.id}
      >
        <Plx
          disabled={!hasWindow() || this.props.isMobile}
          parallaxData={this.getPlxData(tri)}
        >
          <Triangle {...tri} />
        </Plx>
      </div>
    ));
  }

  render() {
    return (
      <div className={cx(
        style.homeHeader,
        { [style.splashOpen]: this.props.splashOpen }
      )}>
        <ColorDots splashOpen={this.props.splashOpen} />
        <LilSquare />
        {this.renderTriangles()}
        <div className={cx(style.dotGridWrapper)}>
          <DotGrid
            classNames={cx(style.dotGridA)}
            sequence={dotGridA}
            index={this.state.dotGridIndex}
          />
          <DotGrid
            classNames={cx(style.dotGridB)}
            sequence={dotGridB}
            index={this.state.dotGridIndex}
          />
          <DotGrid
            classNames={cx(style.dotGridC)}
            sequence={dotGridC}
            index={this.state.dotGridIndex}
          />
          <DotGrid
            classNames={cx(style.dotGridD)}
            sequence={dotGridD}
            index={this.state.dotGridIndex}
          />
        </div>
        <div className={cx(style.titleWrapper)}>
          <h1 className={cx(style.title)}>{meta.name}</h1>
          <h2 className={cx(style.subtitle)}>{meta.role}</h2>
          <ColorDots splashOpen={this.props.splashOpen} forMobile />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ global }) => {
  return {
    pageLoaded: global.pageLoaded,
    splashOpen: global.splashOpen,
    mode: global.mode,
    isMobile: global.isMobile
  }
}

export default connect(mapStateToProps)(Header);
