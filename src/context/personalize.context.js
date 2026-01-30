"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import Personalize from '@contentstack/personalize-edge-sdk';

const PersonalizeContext = createContext(null);

export let sdkInstance = null;

export function PersonalizeProvider({ children }) {
 const [sdk, setSdk] = useState(null);
 const [initialized, setInitialized] = useState(false);
 
 useEffect(() => {
   getPersonalizeInstance().then((instance) => {
     setSdk(instance);
     setInitialized(true);
   });
 }, []);
 
 return (
   <PersonalizeContext.Provider value={sdk}>
     {initialized && children}
   </PersonalizeContext.Provider>
 );
}

export function usePersonalize() {
 return useContext(PersonalizeContext);
}

async function getPersonalizeInstance() {
 if (!Personalize.getInitializationStatus()) {
  // Check if personalization is properly configured
  const personalizeProjectUid = process.env.CONTENTSTACK_PERSONALIZATION;
  if (!personalizeProjectUid || personalizeProjectUid === 'null' || personalizeProjectUid === 'undefined') {
    console.warn('CONTENTSTACK_PERSONALIZATION is not properly configured. Personalization features will be disabled.');
    return null;
  }
  
  if(process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
    Personalize.setEdgeApiUrl(process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
  }
  
  try {
    sdkInstance = await Personalize.init(personalizeProjectUid);
  } catch (error) {
    console.error('Failed to initialize Personalize SDK:', error);
    return null;
  }
 }
 return sdkInstance;
}