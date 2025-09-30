import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Mock user data
const users = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: '$2b$10$rQZ8K9vQZ8K9vQZ8K9vQZ8K9vQZ8K9vQZ8K9vQZ8K9vQZ8K9vQZ8K9vQ', // password123
    phone: '+1234567890',
    isVerified: true,
    createdAt: '2024-01-01T10:00:00Z'
  }
];

export default (req, res, next) => {
  // Handle authentication routes
  if (req.path === '/auth/login' && req.method === 'POST') {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const { password: _, ...userWithoutPassword } = user;
      
      return res.json({
        token,
        user: userWithoutPassword
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  if (req.path === '/auth/register' && req.method === 'POST') {
    const { firstName, lastName, email, phone, password } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    return res.json({
      token,
      user: userWithoutPassword
    });
  }

  if (req.path === '/auth/me' && req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  if (req.path === '/auth/profile' && req.method === 'PUT') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userIndex = users.findIndex(u => u.id === decoded.userId);
      
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { firstName, lastName, email, phone } = req.body;
      users[userIndex] = {
        ...users[userIndex],
        firstName: firstName || users[userIndex].firstName,
        lastName: lastName || users[userIndex].lastName,
        email: email || users[userIndex].email,
        phone: phone || users[userIndex].phone,
      };
      
      const { password: _, ...userWithoutPassword } = users[userIndex];
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  if (req.path === '/auth/logout' && req.method === 'POST') {
    // In a real implementation, you might blacklist the token
    return res.json({ message: 'Logged out successfully' });
  }

  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};