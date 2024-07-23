import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Error from './Error';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
    // Log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // Return a fallback UI for the error state
      return <Error message={'Something went wrong.'} />;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
