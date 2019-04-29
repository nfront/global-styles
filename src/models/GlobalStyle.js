import React from 'react';
import flatten from '../utils/flatten';
import stringifyRules from '../utils/stringifyRules';

export default class GlobalStyle {
  rules;

  compiledStyles;

  elementId;

  constructor(rules, elementId) {
    this.rules = rules;
    this.elementId = elementId;
    this.compiledStyles = '';
    this.ReactStyleComponent = this.ReactStyleComponent.bind(this);
    this.injectStyleInBrowser = this.injectStyleInBrowser.bind(this);
  }

  createStyles(props) {
    const flatCSS = flatten(this.rules, props);
    const css = stringifyRules(flatCSS, '');
    this.compiledStyles = css;
  }

  ReactStyleComponent(props) {
    this.createStyles(props);
    return (
      <style
        id={this.elementId}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: this.compiledStyles,
        }}
      />
    );
  }

  injectStyleInBrowser() {
    if (typeof document === 'undefined') return;
    // Only called by renderStyles,
    // so styles are already created
    // and compiledStyles is available.

    // Replace existing
    if (document.getElementById(this.elementId)) {
      const styleNode = document.getElementById(this.elementId);
      styleNode.innerHTML = this.compiledStyles;
    } else {
      const node = document.createElement('style');
      node.id = this.elementId;
      node.innerHTML = this.compiledStyles;
      const { head } = document;
      const first = head.firstChild;
      first ? head.insertBefore(node, first) : head.appendChild(node);
    }
  }

  renderStyles(props) {
    this.createStyles(props);
    this.injectStyleInBrowser();
  }
}
