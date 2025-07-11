"use client";
import { useSearchParams } from 'next/navigation'
import React from 'react';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");
  const [locations, setLocations] = React.useState([]);
    React.useEffect(() => {
      fetch('/api/locations')
        .then(response => response.json())
        .then(data => 
          setLocations(data)
        )
        .catch(error => console.error('Error fetching locations:', error))
    }, [])
  if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return (
      <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
        <p className="text-red-500">Access denied. Incorrect or missing password.</p>
      </div>
    );
  }
  else {
    return (
      <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold text-center box-border p-3">Admin Dashboard</h1>
        <div className="text-center" id="Locations">
          <h2 className="text-2xl font-semibold text-center box-border p-3">Antenna Locations</h2>
          <table className="min-w-full mt-5">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Latitude</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Longitude</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Range</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Operator(s)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Generation</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Active</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-green-600">
                  {locations.map((location, index) => (
                    <tr key={index} className="hover:bg-gray-200 transition-colors duration-300">
                      <td><p className='text-center text-base text-gray-500 py-2'>{location.id}</p></td>
                      <td><input type="text" className='text-center text-base text-gray-900 py-2' defaultValue={location.latitude} /></td>
                      <td><input type="text" className='text-center text-base text-gray-900 py-2' defaultValue={location.longitude} /></td>
                      <td><input type="text" className='text-center text-base text-gray-900 py-2' defaultValue={location.range} /></td>
                      <td><input type="text" className='text-center text-base text-gray-900 py-2' defaultValue={location.operators} /></td>
                      <td><input type="text" className='text-center text-base text-gray-900 py-2' defaultValue={location.generation} /></td>
                      <td><input type="checkbox" className='text-center text-base text-gray-900' defaultChecked={location.active} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-green-800 rounded-2xl m-2 cursor-pointer transition-all duration-500 hover:bg-green-950 hover:text-gray-300" onClick={() => alert("Not implemented yet!")}>Save changes</button>
        </div>
        <div className='flex flex-col items-center' id="ChangePassword">
          <h2 className="text-2xl font-semibold text-center box-border p-3">Change Password</h2>
          <div className="grid grid-cols-2 gird-rows-2 grid-flow-row items-center justify-items-center">
            <label className="text-lg font-semibold mb-2">Current Password</label>
            <input type="password" placeholder="Current password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-500 focus:outline-none mb-4" />
            <label className="text-lg font-semibold mb-2">New Password</label>
            <input type="password" placeholder="New password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-500 focus:outline-none mb-4" />
          </div>
          <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-blue-800 rounded-2xl m-2 cursor-pointer transition-all duration-500 hover:bg-blue-950 hover:text-gray-300" onClick={() => alert("Not implemented yet!")}>Change password</button>
        </div>
        <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-red-800 rounded-2xl m-2 cursor-pointer transition-all duration-500 hover:bg-red-950 hover:text-gray-300" onClick={() => window.location.href = "/"}>Return home</button>
      </div>
    );
  }
}
