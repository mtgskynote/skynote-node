import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Error from './Error'; // Ensure you have this component available

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This method is invoked if a child component throws an error
  componentDidCatch(error, info) {
    console.error('Error caught by ErrorBoundary:', error, info);

    // Update state to show fallback UI
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI if there is an error
      return <Error message={'Something went wrong.'} />;
    }

    // Render children if no error
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
