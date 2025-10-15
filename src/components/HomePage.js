import React from 'react';
import { Link } from 'react-router-dom';
import './styles/HomePage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">TestPlatform</h1>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link register-btn">Sign Up</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Testing Platform</h1>
          <p className="hero-subtitle">
            A modern platform for software testing and quality assurance
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <h3>Test Management</h3>
            <p>Organize and execute tests efficiently</p>
          </div>
          <div className="floating-card">
            <h3>Real-time Analytics</h3>
            <p>Monitor test results and coverage</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="features-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Reliable</h3>
              <p>Lightning-fast test execution with reliable results</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Enterprise-grade security for your test data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Comprehensive reporting and analytics dashboard</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;