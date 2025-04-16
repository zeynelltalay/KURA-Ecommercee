import { useAuth } from '../context/AuthContext';

const AdminCheck: React.FC = () => {
  const { currentUser, isAdmin, isAuthenticated } = useAuth();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2>Auth Debug Info:</h2>
      <pre>
        {JSON.stringify({
          currentUser: currentUser?.email,
          isAdmin,
          isAuthenticated
        }, null, 2)}
      </pre>
    </div>
  );
};

export default AdminCheck; 