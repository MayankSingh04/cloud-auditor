# ☁️ Cloud Auditor

A modern, interactive cloud security and compliance dashboard built with React, Framer Motion, and AWS Amplify.

## 🚀 Features

- **🔐 Secure Authentication** - AWS Cognito integration with email/password authentication
- **📊 Interactive Dashboard** - Beautiful statistics and metrics visualization
- **🔍 Security Findings** - Track and manage security issues with severity indicators
- **🛡️ Security Groups** - Monitor AWS security group configurations
- **📋 Reports** - Generate compliance and security reports
- **📱 Responsive Design** - Works perfectly on desktop and mobile devices
- **🎨 Modern UI** - Dark theme with glass morphism and smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Framer Motion
- **Authentication**: AWS Amplify, AWS Cognito
- **Styling**: CSS3 with Glass Morphism effects
- **Backend**: AWS Lambda, AWS API Gateway
- **Infrastructure**: Terraform, AWS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cloud-auditor
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure AWS Amplify**
   - Update `frontend/src/auth/configureAmplify.js` with your Cognito credentials:
   ```javascript
   Amplify.configure({
     Auth: {
       Cognito: {
         region: 'your-region',
         userPoolId: 'your-user-pool-id',
         userPoolClientId: 'your-client-id',
       }
     }
   });
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5174`

## 🏗️ Project Structure

```
cloud-auditor/
├── frontend/                 # React application
│   ├── src/
│   │   ├── auth/            # Authentication configuration
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Application styles
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── functions/               # AWS Lambda functions
│   ├── check-security-groups/
│   └── get-findings/
├── main.tf                  # Terraform configuration
└── README.md               # Project documentation
```

## 🔧 Configuration

### AWS Cognito Setup

1. Create a Cognito User Pool in AWS Console
2. Create an App Client
3. Update the configuration in `frontend/src/auth/configureAmplify.js`

### Environment Variables

Create a `.env` file in the frontend directory:
```env
VITE_AWS_REGION=your-region
VITE_USER_POOL_ID=your-user-pool-id
VITE_USER_POOL_CLIENT_ID=your-client-id
```

## 🎨 UI Components

- **Header**: Clean navigation with user info and sign-out
- **Navigation Tabs**: Smooth tab switching with animations
- **Statistics Cards**: Interactive cards with hover effects
- **Findings List**: Security issues with severity indicators
- **Security Groups**: AWS security group monitoring
- **Reports**: Compliance and security reporting

## 🚀 Deployment

### Frontend Deployment

1. **Build the application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to AWS S3/CloudFront** or your preferred hosting service

### Backend Deployment

1. **Initialize Terraform**
   ```bash
   terraform init
   ```

2. **Deploy infrastructure**
   ```bash
   terraform apply
   ```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 Features in Detail

### Authentication
- Email/password sign up and sign in
- Secure session management
- User profile display
- Sign out functionality

### Dashboard Overview
- Total findings count
- Security groups monitored
- High severity issues
- Resolved issues count

### Security Findings
- Severity-based color coding
- Status tracking (open/resolved)
- Detailed descriptions
- Action buttons for management

### Security Groups
- Group status indicators
- Rule count display
- Security status badges
- Quick access to group details

### Reports
- Weekly security reports
- Compliance reports
- PDF download functionality
- Report generation timestamps

## 🔒 Security Features

- AWS Cognito authentication
- Secure API endpoints
- Environment variable protection
- HTTPS enforcement
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS Amplify for authentication
- Framer Motion for animations
- React team for the amazing framework
- Vite for fast development experience

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using React, AWS Amplify, and Framer Motion**
