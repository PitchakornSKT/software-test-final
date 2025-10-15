const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = {
      totalTests: 24,
      passedTests: 18,
      failedTests: 6,
      successRate: '75%'
    };

    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get recent activity
router.get('/activity', auth, async (req, res) => {
  try {
    const recentActivity = [
      {
        id: 1,
        type: 'test',
        title: 'Login Functionality Test',
        time: '2 hours ago',
        status: 'passed'
      },
      {
        id: 2,
        type: 'test',
        title: 'Payment Integration Test',
        time: '5 hours ago',
        status: 'failed'
      },
      {
        id: 3,
        type: 'test',
        title: 'API Endpoint Validation',
        time: '1 day ago',
        status: 'passed'
      },
      {
        id: 4,
        type: 'test',
        title: 'Mobile Responsive Test',
        time: '2 days ago',
        status: 'passed'
      }
    ];

    res.json({
      success: true,
      data: recentActivity
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;