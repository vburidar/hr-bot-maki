export type CreateUserOutputDto = {
  id: string;
  name: string;
  surname: string;
};

export type User = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  jobExperiences: Array<{
    nbMonths: number;
    company: string;
    jobTitle: string;
  }>;
  academicExperience: Array<{
    level: string;
    university: string;
    topic: string;
  }>;
  expectedJob: {
    jobTitle: string;
    annualSalary: number;
  };
};
