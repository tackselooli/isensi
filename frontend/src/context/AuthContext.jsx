// // AuthContext.jsx
// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = (userData) => {
//     setUser(userData);
//     // Optionally, store user data in localStorage or cookies
//   };

//   const logout = () => {
//     setUser(null);
//     // Optionally, remove user data from localStorage or cookies
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
