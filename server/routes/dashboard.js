const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

let activities = [
  { id: 1, type: 'test', title: 'Login Functionality Test', time: '2 hours ago', status: 'passed' },
  { id: 2, type: 'test', title: 'Payment Integration Test', time: '5 hours ago', status: 'failed' },
  { id: 3, type: 'test', title: 'API Endpoint Validation', time: '1 day ago', status: 'passed' },
  { id: 4, type: 'test', title: 'Mobile Responsive Test', time: '2 days ago', status: 'passed' },
  { id: 5, type: 'create', title: 'Created new test suite', time: '3 days ago', status: 'completed' }
];

router.get('/stats', auth, async (req, res) => {
  try {
    const stats = {
      totalTests: 24,
      passedTests: 18,
      failedTests: 6,
      successRate: '75',
      totalUsers: 156,
      activeUsers: 42
    };
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/activity', auth, async (req, res) => {
  try {
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/activity/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    const activityIndex = activities.findIndex(activity => activity.id === parseInt(id));
    
    if (activityIndex === -1) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    activities[activityIndex] = {
      ...activities[activityIndex],
      title: title || activities[activityIndex].title,
      status: status || activities[activityIndex].status
    };

    res.json({
      success: true,
      message: `Activity ID ${id} updated successfully`,
      updatedData: activities[activityIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.delete('/activity/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const activityIndex = activities.findIndex(activity => activity.id === parseInt(id));
    
    if (activityIndex === -1) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    activities = activities.filter(activity => activity.id !== parseInt(id));

    res.json({
      success: true,
      message: `Activity ID ${id} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;