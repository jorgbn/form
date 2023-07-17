'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Tooltip {
  constructor(reference) {
    this.reference = reference;
    this.trigger = {
      selector: document.querySelector(`[data-tooltip-trigger="${this.reference}"]`),
      get dimension() {
        let rect = this.selector.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height
        };
      },
      get position() {
        return {
          x: this.selector.offsetLeft - this.selector.scrollLeft + this.selector.clientLeft,
          y: this.selector.offsetTop - this.selector.scrollTop + this.selector.clientTop
        };
      }
    };

    this.content = {
      selector: document.querySelector(`[data-tooltip-content="${this.reference}"]`),
      get auto() {
        return this.selector.getAttribute('data-tooltip-auto') == 'false' ? false : true;
      },
      get position() {
        let rect = this.selector.getBoundingClientRect();

        return {
          x: rect.x,
          y: rect.y
        };
      },
      get dimension() {
        let rect = this.selector.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height
        };
      }
    };

    this.initialDirection = this.content.selector.getAttribute('data-tooltip-direction');

    this.showReference = this.show.bind(this);
    this.hideReference = this.hide.bind(this);

    this.init();
  }

  _alignHorizontally() {
    return (this.trigger.position.x + this.trigger.dimension.width / 2) - this.content.dimension.width / 2;
  }

  _alignVertically() {
    return (this.trigger.position.y + this.trigger.dimension.height / 2) - this.content.dimension.height / 2;
  }

  _isOverflowingTop() {
    return this.content.position.y < 0;
  }

  _isOverflowingRight() {
    return (window.pageXOffset + window.innerWidth) < (this.content.dimension.width + this.content.position.x);
  }

  _isOverflowingBottom() {
    return (this.content.position.y + this.content.dimension.height) > window.innerHeight;
  }

  _isOverflowingLeft() {
    return window.pageXOffset > this.content.position.x;
  }

  _getLocationTop() {
    return {
      x: this._alignHorizontally(),
      y: this.trigger.position.y - this.content.dimension.height,
      direction: 'top'
    };
  }

  _getLocationRight() {
    return {
      x: this.trigger.position.x + this.trigger.dimension.width,
      y: this._alignVertically(),
      direction: 'right'
    };
  }

  _getLocationBottom() {
    return {
      x: this._alignHorizontally(),
      y: this.trigger.position.y + this.trigger.dimension.height,
      direction: 'bottom'
    };
  }

  _getLocationLeft() {
    return {
      x: this.trigger.position.x - this.content.dimension.width,
      y: this._alignVertically(),
      direction: 'left'
    };
  }

  _getLocationFullTop() {
    this._setArrowPosition();
    return {
      x: 0,
      y: this.trigger.position.y - this.content.dimension.height,
      direction: 'full-top'
    };
  }

  _getLocationFullBottom() {
    this._setArrowPosition();
    return {
      x: 0,
      y: this.trigger.position.y + this.trigger.dimension.height,
      direction: 'full-bottom'
    };
  }

  _setArrowPosition() {
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    let css = `
      .Tooltip[data-tooltip-direction="full-top"]::after, .Tooltip[data-tooltip-direction="full-bottom"]::after  {
        left: ${this.trigger.position.x + (this.trigger.dimension.width / 2)}px;
        right: auto;
      }`;

    style.type = 'text/css';
    style.id = 'Tooltip-pseudo';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  _getLocationAuto(tooltip) {
    let position = tooltip;

    if (this._isOverflowingLeft()) {
      position = this._getLocationRight();
      this._setPosition(position);

      if (this._isOverflowingRight()) {
        position = this._getLocationFullTop();
        this._setPosition(position);

        if (this._isOverflowingTop()) {
          position = this._getLocationFullBottom();
          this._setPosition(position);
        }
      }
    }

    if (this._isOverflowingRight()) {

      position = this._getLocationLeft();
      this._setPosition(position);

      if (this._isOverflowingLeft()) {
        position = this._getLocationFullTop();
        this._setPosition(position);

        if (this._isOverflowingTop()) {
          position = this._getLocationFullBottom();
          this._setPosition(position);
        }

      }
    }

    if (this._isOverflowingTop()) {
      position = this._getLocationBottom();
      this._setPosition(position);
    }

    if (this._isOverflowingBottom()) {
      position = this._getLocationTop();
      this._setPosition(position);
    }

    return position;
  }

  _setPosition(position) {
    this.content.selector.style.top = `${position.y}px`;
    this.content.selector.style.left = `${position.x}px`;
  }

  show() {
    // This needs to come first before calculations
    this.content.selector.classList.add('is-active');

    let tooltip;

    switch (this.initialDirection) {
      case 'right':
        tooltip = this._getLocationRight();
        break;
      case 'bottom':
        tooltip = this._getLocationBottom();
        break;
      case 'left':
        tooltip = this._getLocationLeft();
        break;
      case 'full-top':
        tooltip = this._getLocationFullTop();
        break;
      case 'full-bottom':
        tooltip = this._getLocationFullBottom();
        break;
      default:
        tooltip = this._getLocationTop();
    }

    this._setPosition(tooltip);

    if (this.content.auto) {
      tooltip = this._getLocationAuto(tooltip);
    }

    this.content.selector.setAttribute('data-tooltip-direction', tooltip.direction);
  }

  hide() {
    this.content.selector.classList.remove('is-active');
    this.content.selector.setAttribute('data-tooltip-direction', this.initialDirection);

    let pseudoCSS = document.getElementById('Tooltip-pseudo');

    if (pseudoCSS) {
      pseudoCSS.remove();
    }
  }

  init() {

    this.trigger.selector.addEventListener('mouseenter', this.showReference);

    this.trigger.selector.addEventListener('mouseleave', this.hideReference);

    this.content.selector.addEventListener('mouseenter', this.showReference);

    this.content.selector.addEventListener('mouseleave', this.hideReference);
  }

  destroy() {

    this.trigger.selector.removeEventListener('mouseenter', this.showReference);

    this.trigger.selector.removeEventListener('mouseleave', this.hideReference);

    this.content.selector.removeEventListener('mouseenter', this.showReference);

    this.content.selector.removeEventListener('mouseleave', this.hideReference);
  }
}

exports.default = Tooltip;
