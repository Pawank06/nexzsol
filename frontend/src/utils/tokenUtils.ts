// utils/tokenUtils.ts

export const getTokenFromQuery = (query: any) => {
    return query.token ? query.token as string : null;
  };
  
  export const saveTokenToLocalStorage = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  export const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token');
  };
  