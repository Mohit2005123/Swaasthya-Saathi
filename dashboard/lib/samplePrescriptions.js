// Sample prescription data for Swaasthya-Saathi dashboard
export const samplePrescriptions = [
  {
    id: '1',
    date: '2024-01-15',
    doctor: 'Dr. Priya Sharma',
    clinic: 'City Health Center',
    clinicEmoji: '🏥',
    medicines: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'twice daily',
        duration: '5 days',
        icon: '💊',
        timing: '☀️🌙'
      },
      {
        name: 'Amoxicillin',
        dosage: '250mg',
        frequency: 'thrice daily',
        duration: '7 days',
        icon: '💊',
        timing: '☀️🌙🌆'
      },
      {
        name: 'Vitamin C',
        dosage: '1000mg',
        frequency: 'once daily',
        duration: '10 days',
        icon: '💊',
        timing: '☀️'
      }
    ],
    diagnosis: 'Common Cold & Fever',
    status: 'completed',
    nextRefill: '2024-01-20'
  },
  {
    id: '2',
    date: '2024-01-10',
    doctor: 'Dr. Rajesh Kumar',
    clinic: 'Rural Medical Center',
    clinicEmoji: '🏥',
    medicines: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice daily',
        duration: '30 days',
        icon: '💊',
        timing: '☀️🌙'
      },
      {
        name: 'Gliclazide',
        dosage: '40mg',
        frequency: 'once daily',
        duration: '30 days',
        icon: '💊',
        timing: '☀️'
      }
    ],
    diagnosis: 'Type 2 Diabetes',
    status: 'active',
    nextRefill: '2024-02-10'
  },
  {
    id: '3',
    date: '2024-01-05',
    doctor: 'Dr. Anjali Singh',
    clinic: 'Community Health Clinic',
    clinicEmoji: '🏥',
    medicines: [
      {
        name: 'Omeprazole',
        dosage: '20mg',
        frequency: 'once daily',
        duration: '14 days',
        icon: '💊',
        timing: '🌙'
      },
      {
        name: 'Domperidone',
        dosage: '10mg',
        frequency: 'thrice daily',
        duration: '14 days',
        icon: '💊',
        timing: '☀️🌙🌆'
      }
    ],
    diagnosis: 'Acid Reflux',
    status: 'completed',
    nextRefill: null
  },
  {
    id: '4',
    date: '2023-12-28',
    doctor: 'Dr. Vikram Patel',
    clinic: 'District Hospital',
    clinicEmoji: '🏥',
    medicines: [
      {
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'once daily',
        duration: '30 days',
        icon: '💊',
        timing: '☀️'
      },
      {
        name: 'Losartan',
        dosage: '50mg',
        frequency: 'once daily',
        duration: '30 days',
        icon: '💊',
        timing: '☀️'
      }
    ],
    diagnosis: 'Hypertension',
    status: 'active',
    nextRefill: '2024-01-28'
  },
  {
    id: '5',
    date: '2023-12-20',
    doctor: 'Dr. Sunita Reddy',
    clinic: 'Primary Health Center',
    clinicEmoji: '🏥',
    medicines: [
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'thrice daily',
        duration: '7 days',
        icon: '💊',
        timing: '☀️🌙🌆'
      },
      {
        name: 'Muscle Relaxant',
        dosage: '250mg',
        frequency: 'twice daily',
        duration: '5 days',
        icon: '💊',
        timing: '☀️🌙'
      }
    ],
    diagnosis: 'Back Pain',
    status: 'completed',
    nextRefill: null
  },
  {
    id: '6',
    date: '2023-12-15',
    doctor: 'Dr. Manoj Gupta',
    clinic: 'Village Health Center',
    clinicEmoji: '🏥',
    medicines: [
      {
        name: 'Folic Acid',
        dosage: '5mg',
        frequency: 'once daily',
        duration: '90 days',
        icon: '💊',
        timing: '☀️'
      },
      {
        name: 'Iron Supplement',
        dosage: '100mg',
        frequency: 'once daily',
        duration: '90 days',
        icon: '💊',
        timing: '🌙'
      }
    ],
    diagnosis: 'Anemia',
    status: 'active',
    nextRefill: '2024-03-15'
  }
];

// Helper function to get prescriptions by status
export const getPrescriptionsByStatus = (status) => {
  return samplePrescriptions.filter(prescription => prescription.status === status);
};

// Helper function to get active prescriptions
export const getActivePrescriptions = () => {
  return getPrescriptionsByStatus('active');
};

// Helper function to get completed prescriptions
export const getCompletedPrescriptions = () => {
  return getPrescriptionsByStatus('completed');
};

// Helper function to get prescriptions needing refill
export const getPrescriptionsNeedingRefill = () => {
  const today = new Date();
  return samplePrescriptions.filter(prescription => {
    if (!prescription.nextRefill) return false;
    const refillDate = new Date(prescription.nextRefill);
    const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilRefill <= 7 && daysUntilRefill >= 0;
  });
};
