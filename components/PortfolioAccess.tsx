'use client';
import {createContext, useContext} from 'react';
export const AccessContext = createContext({unlock:()=>{}});
export function usePortfolioAccess(){return useContext(AccessContext);}
