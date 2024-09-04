import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Error from './Error';

/**
 * ErrorBoundary is a React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole component tree.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Initialize the state to track whether an error has been caught
    this.state = { hasError: false };
  }

  // Invoked when an error is thrown anywhere inside the component tree, triggering the fallback UI
  componentDidCatch() {
    this.setState({ hasError: true });
    // If you want, you can log the error to an error reporting service
  }

  render() {
    // If an error has been caught, render the fallback UI
    if (this.state.hasError) {
      return <Error message={'Something went wrong.'} />;
    }

    // Otherwise, render the children components normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
