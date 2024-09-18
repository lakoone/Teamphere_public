'use client';
import React, { createContext, useContext, useState } from 'react';
import { RegisterUser } from '@/entities/User/types';

type PartialUserType = Partial<RegisterUser>;
interface DataContextProps {
  step?: number;
  setSteps?: (step: number) => void;
  data?: PartialUserType | undefined;
  setValues?: (values: PartialUserType) => void;
}
const DataContext = createContext<DataContextProps>({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<PartialUserType | undefined>({
    name: '',
    email: '',
    password: '',
    tag: '',
    tagColor: '#ffffff',
  });
  const setSteps = (step: number) => {
    setStep(step);
  };
  const setValues = (values: PartialUserType) => {
    setData((prevData) => ({
      ...prevData,
      ...values,
    }));
  };
  return (
    <DataContext.Provider value={{ data, setValues, step, setSteps }}>
      {children}
    </DataContext.Provider>
  );
};
export const useData = () => useContext(DataContext);
