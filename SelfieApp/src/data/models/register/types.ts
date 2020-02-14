type CoWorkerEmail = {
  email: string;
  status: string;
};
type CoWorkerPhoneNumber = {
  phoneNumber: string;
  status: string;
};

export type FormRegister = {
  email: string;
  firstName: string;
  lastName: string;
  adeliNumber: string;
  phoneNumber: string;
  hasReadContracts: boolean;
  cabinetName: string | null;
  coWorkers: {
    emails: CoWorkerEmail[];
    phoneNumbers: CoWorkerPhoneNumber[];
  };
};
