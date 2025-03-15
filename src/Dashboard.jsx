// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import DailySales from './DailySales';
// import SalesHistory from './SalesHistory';
// import Settings from './Settings';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('daily');

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'daily':
//         return <DailySales />;
//       case 'history':
//         return <SalesHistory />;
//       case 'charts':
//         return <div className="p-6">Charts Component (To be implemented)</div>;
//       case 'settings':
//         return <Settings />;
//       default:
//         return <DailySales />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       <main className="flex-1 bg-white">
//         {renderContent()}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


// Dashboard.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DailySales from './DailySales';
import SalesHistory from './SalesHistory';
import Settings from './Settings';
import Charts from './Charts'; // Add this import

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailySales />;
      case 'history':
        return <SalesHistory />;
      case 'charts':
        return <Charts />; // Updated this line
      case 'settings':
        return <Settings />;
      default:
        return <DailySales />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 bg-white">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;

// Sidebar.jsx remains exactly the same - no changes needed