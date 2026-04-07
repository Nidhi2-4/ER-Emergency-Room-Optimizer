export interface Patient {
  id: string;
  name: string;
  injury: string;
  severity: number;
  treatmentTime: number;
  status: 'Critical' | 'Moderate' | 'Stable';
  rank: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  status: 'available' | 'busy';
  assignedCase: string | null;
}

export interface Medicine {
  id: string;
  name: string;
  stock: number;
  required: number;
  unit: string;
}

export interface WardPatient {
  bed: string;
  patientId: string;
  patientName: string;
  condition: string;
}

export interface Ward {
  id: string;
  name: string;
  capacity: number;
  patients: WardPatient[];
}

export interface Surgery {
  patientId: string;
  patientName: string;
  duration: number;
  survivalScore: number;
}

export interface OTRoom {
  id: string;
  name: string;
  surgeries: Surgery[];
}
