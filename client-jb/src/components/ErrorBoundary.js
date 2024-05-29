import React, { Component } from "react";
import ErrorComponent from "./Error";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    // Log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // Return a fallback UI for the error state
      return <ErrorComponent message={"Something went wrong."} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
