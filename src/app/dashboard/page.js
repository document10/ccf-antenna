"use client";
import { useSearchParams } from 'next/navigation'
import { eventNames } from 'process';
import React from 'react';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");
  const [locations, setLocations] = React.useState([]);
  if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return (
      <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
        <p className="text-red-500">Access denied. Incorrect or missing password.</p>
      </div>
    );
  }
  else {
    React.useEffect(() => {
      fetch('/api/locations')
        .then(response => response.json())
        .then(data =>
          setLocations(data)
        )
        .catch(error => console.error('Error fetching locations:', error))
    }, [])
    return (
      <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold text-center box-border p-3">Admin Dashboard</h1>
        <div className="text-center" id="Locations">
          <h2 className="text-2xl font-semibold text-center box-border p-3">Antenna Locations</h2>
          <table className="table-auto overflow-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase">ID</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Latitude</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase">Longitude</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Range</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase">Operator(s)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Generation</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase">Active</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Delete</th>
              </tr>
            </thead>
            <tbody id="locations" className="bg-gray-50 divide-y divide-green-500">
              {locations.map((location, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-all duration-300">
                  <td><p className='text-center text-base text-gray-500'>{location.id}</p></td>
                  <td><input type="number" className='text-center text-base text-gray-900' id={`loc${location.id}_lat`} defaultValue={location.latitude} /></td>
                  <td><input type="number" className='text-center text-base text-gray-900' id={`loc${location.id}_lon`} defaultValue={location.longitude} /></td>
                  <td><input type="number" className='text-center text-base text-gray-900' id={`loc${location.id}_ran`} defaultValue={location.range} /></td>
                  <td><input type="text" className='text-center text-base text-gray-900' id={`loc${location.id}_op`} defaultValue={location.operators} /></td>
                  <td>
                    <select className='text-center text-xl text-gray-50 bg-blue-500 rounded-2xl border-2 border-blue-950 hover:bg-blue-600 hover:text-gray-200 hover:border-blue-800 transition-all duration-300' id={`loc${location.id}_gen`} defaultValue={location.generation}>
                      <optgroup label="Outdated" className='text-center'>
                        <option value="1G">1G</option>
                        <option value="2G">2G</option>
                        <option value="3G">3G</option>
                      </optgroup>
                      <optgroup label='In use' className='text-center'>
                        <option value="4G/LTE">4G/LTE</option>
                        <option value="5G">5G</option>
                      </optgroup>
                    </select>
                  </td>
                  <td><input type="checkbox" className='text-center text-base w-7 h-7 accent-green-800 rounded-2xl hover:accent-green-700 transition-all duration-300' id={`loc${location.id}_on`} defaultChecked={location.active} /></td>
                  <td><button className="text-base font-bold text-center p-3 text-white bg-red-700 rounded-2xl m-2 cursor-pointer border-2 border-red-900 transition-all duration-300 hover:bg-red-800 hover:text-gray-300 hover:border-red-950" onClick={() => {
                    setLocations(locations.filter((loc) => loc.id !== location.id));
                    fetch(`/api/locations/?id=${location.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ id: location.id }),
                    }).then(response => console.log("Location deleted:", response)).catch(error => console.error('Error deleting location:', error));
                  }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-green-800 rounded-2xl m-2 cursor-pointer transition-all duration-300 hover:bg-green-900 hover:text-gray-300" onClick={() => {
            const newLocation = {
              latitude: "0.0",
              longitude: "0.0",
              range: "0",
              operators: "None",
              generation: "3G",
              active: true
            };
            setLocations([...locations, newLocation]);
            fetch('/api/locations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newLocation),
            }).then(response => {
              console.log("New location added:", response)
              window.location.href = `/dashboard?password=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`
            }).catch(error => console.error('Error adding new location:', error));
          }}>New Location</button>
          <button type='button' className="text-2xl font-bold text-center p-3 text-gray-950 bg-cyan-400 rounded-2xl m-2 cursor-pointer transition-all duration-300 hover:bg-cyan-500 hover:text-gray-800" onClick={() => window.location.href = "/mapboard?password=admin123"} >Manual Location</button>
          <button className="text-2xl font-bold text-center p-3 text-white bg-pink-500 rounded-2xl m-2 cursor-pointer transition-all duration-300 hover:bg-pink-700 hover:text-gray-300" onClick={() => {
            const updatedLocations = locations.map(location => {
              return {
                ...location,
                latitude: document.querySelector(`#loc${location.id}_lat`).value,
                longitude: document.querySelector(`#loc${location.id}_lon`).value,
                range: document.querySelector(`#loc${location.id}_ran`).value,
                operators: document.querySelector(`#loc${location.id}_op`).value,
                generation: document.querySelector(`#loc${location.id}_gen`).value,
                active: document.querySelector(`#loc${location.id}_on`).checked
              };
            });
            console.log("Updated locations:", updatedLocations);
            updatedLocations.forEach(loc => {
              fetch(`/api/locations/?id=${loc.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(loc),
              }).then(response => console.log("Location updated:", response)).catch(error => console.error('Error updating location:', error));
            });
            setLocations(updatedLocations);
            alert("Locations updated successfully!");
          }}>Save changes</button>
        </div>
        <div className='flex flex-col items-center' id="Backup">
          <h2 className="text-2xl font-semibold text-center box-border p-3">Database Backup</h2>
          <div className='flex flex-row'>
            <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-purple-600 rounded-2xl m-2 cursor-pointer transition-all duration-300 hover:bg-purple-700 hover:text-gray-300" onClick={(event) => {
              console.log(locations)
            }}>Create Backup</button>
            <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-indigo-500 rounded-2xl m-2 cursor-pointer transition-all duration-300 hover:bg-indigo-700 hover:text-gray-300" onClick={(event) => {
              console.log(locations)
            }}>Load Backup</button>

          </div>
        </div>

        <div className='flex flex-col items-center' id="ChangePassword">
          <h2 className="text-2xl font-semibold text-center box-border p-3">Change Password</h2>
          <div className="grid grid-cols-2 gird-rows-2 grid-flow-row items-center justify-items-center">
            <label className="text-lg font-semibold mb-2">Current Password</label>
            <input type="password" placeholder="Current password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-300 focus:outline-none mb-4" />
            <label className="text-lg font-semibold mb-2">New Password</label>
            <input type="password" placeholder="New password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-300 focus:outline-none mb-4" />
          </div>
          <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-blue-800 rounded-2xl m-2 cursor-pointer transition-all duration-300 hover:bg-blue-950 hover:text-gray-300" onClick={() => alert("Not implemented yet!")}>Change password</button>
        </div>
        <button type='button' className="text-2xl font-bold text-center p-3 text-black bg-yellow-300 rounded-2xl m-2 cursor-pointer transition-all duration-300 hover:bg-yellow-500 hover:text-gray-800" onClick={() => window.location.href = "/"}>Return home</button>
      </div>
    );
  }
}
