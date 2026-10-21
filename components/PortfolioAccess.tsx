'use client';
import {createContext, useContext} from 'react';
export const AccessContext = createContext({unlocked:false,unlock:()=>{}});
export function usePortfolioAccess(){return useContext(AccessContext);}
