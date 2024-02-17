import { useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SignUpAdditionalInfoModal({ user }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const router = useRouter();

  const handleSaveAdditionalInfo = async () => {
    try {
      await addDoc(collection(db, 'users'), {
        firstName: firstName,
        lastName: lastName,
        contactNumber: contactNumber,
        uid: user.uid,
      });
      router.push('/');
    } catch (error) {
      console.error('Error saving additional information:', error);
    }
  };

  return (
    <div className="modal p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Additional Information</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSaveAdditionalInfo}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Save And Enter
      </button>
    </div>
  );
}
