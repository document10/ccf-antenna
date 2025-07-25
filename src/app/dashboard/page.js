"use client";
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';
import React, { Suspense } from 'react';
import { Antenna } from '../../entity/Antenna';
import { Operator } from '../../entity/Operator';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");
  const [locations, setLocations] = React.useState([]);
  const [operators, setOperators] = React.useState([])
  if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return (
      <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
        <p className="text-red-500">Access denied. Incorrect or missing password.</p>
      </div>
    );
  }
  else {
    React.useEffect(() => {
      fetch('/api/operators')
        .then(response => response.json())
        .then(data => setOperators(data))
        .catch(error => console.error('Error fetching operators:', error))
    }, [])
    React.useEffect(() => {
      fetch('/api/locations')
        .then(response => response.json())
        .then(data => setLocations(data))
        .catch(error => console.error('Error fetching locations:', error))
    }, [])
    /**
     * Checks if two locations are identical (ignoring IDs)
     * @param {Antenna} x 
     * @param {Antenna} y 
     * @returns {Boolean}
     */
    const sameLoc = (x, y) => { return x.latitude == y.latitude && x.longitude == y.longitude && x.range == y.range && x.operatorId == y.operatorId && x.active == y.active && x.generation == y.generation }
    /**
     * Checks if two operators are identical (ignoring IDs)
     * @param {Operator} x 
     * @param {Operator} y 
     * @returns {Boolean}
     */
    const sameOp = (x, y) => { return x.name == y.name && x.origin == y.origin }
    return (
      <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold text-center box-border m-3">Admin Dashboard</h1>
        <div className="text-center items-center justify-center" id="Locations">
          <h2 className="text-2xl font-semibold text-center box-border m-3">Antenna Locations</h2>
          <Suspense fallback={"Loading Locations..."}>
            <table className="table-auto overflow-auto">
              <thead>
                <tr>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">ID</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-100 uppercase">Latitude</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">Longitude</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-100 uppercase">Range</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">Operator</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-100 uppercase">Generation</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">Active</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-100 uppercase">Delete</th>
                </tr>
              </thead>
              <tbody id="locations" className="bg-gray-50 divide-y divide-green-500">
                {locations.map((location, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-all duration-300">
                    <td><p className='text-center text-base text-gray-500 w-8'>{location.id}</p></td>
                    <td><input type="number" className='text-center text-base text-gray-900' id={`loc${location.id}_lat`} defaultValue={location.latitude} /></td>
                    <td><input type="number" className='text-center text-base text-gray-900' id={`loc${location.id}_lon`} defaultValue={location.longitude} /></td>
                    <td><input type="number" className='text-center text-base text-gray-900 w-32' id={`loc${location.id}_ran`} defaultValue={location.range} /></td>
                    <td>
                      <select className='text-center text-xl text-gray-800 bg-amber-400 rounded-2xl border-2 border-amber-800 shadow-amber-700/50 shadow-md hover:bg-amber-500 hover:text-gray-950 hover:border-amber-700 transition-all duration-300' id={`loc${location.id}_op`} defaultValue={location.operatorId}>
                        {operators.map(op => (<option value={op.id} key={op.id}>{op.name}</option>))}
                        <option key={-1} value={-1}>Unknown</option>
                      </select>
                    </td>
                    <td>
                      <select className='text-center text-xl text-gray-50 bg-blue-500 rounded-2xl border-2 border-blue-950 shadow-blue-600/50 shadow-md hover:bg-blue-600 hover:text-gray-200 hover:border-blue-800 transition-all duration-300' id={`loc${location.id}_gen`} defaultValue={location.generation}>
                        <optgroup label='Outdated' className='text-center'>
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
                    <td><input type="checkbox" className='w-7 h-7 accent-green-800 rounded-2xl shadow-green-700/50 shadow-md hover:accent-green-700 transition-all duration-300' id={`loc${location.id}_on`} defaultChecked={location.active} /></td>
                    <td><button className="p-2 bg-red-700 rounded-2xl m-2 cursor-pointer border-2 border-red-900 shadow-red-700/50 shadow-md transition-all duration-300 hover:bg-red-800 hover:border-red-950" onClick={() => {
                      setLocations(locations.filter((loc) => loc.id !== location.id));
                      fetch(`/api/locations/?id=${location.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: location.id }),
                      }).then(response => console.log("Location deleted:", response)).catch(error => {
                        console.error('Error deleting operator:', error)
                        alert('Something went wrong. Please try again.')
                      });
                    }}><Image src='/trash.svg' width={20} height={20} alt='trash' /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Suspense>
          <div className='flex flex-row'>
            <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-green-800 rounded-2xl m-2 cursor-pointer shadow-green-400 shadow-md/50 transition-all duration-300 hover:bg-green-900 hover:text-gray-300 flex flex-row gap-2" onClick={() => {
              const newLocation = {
                latitude: "0.0",
                longitude: "0.0",
                range: "0",
                operatorId: -1,
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
              }).catch(error => {
                console.error('Error deleting operator:', error)
                alert('Something went wrong. Please try again.')
              });;
            }}><Image src='/antenna.svg' width={32} height={32} alt='plus' />New Location</button>
            <button type='button' className="text-2xl font-bold text-center p-3 text-gray-950 bg-cyan-400 rounded-2xl m-2 cursor-pointer shadow-cyan-600 shadow-md/50 transition-all duration-300 hover:bg-cyan-500 hover:text-gray-800 flex flex-row gap-2" onClick={() => window.location.href = "/mapboard?password=admin123"}><Image src='/marker.svg' width={32} height={32} alt='marker' />Manual Location</button>
            <button className="text-2xl font-bold text-center p-3 text-white bg-pink-500 rounded-2xl m-2 cursor-pointer transition-all duration-300 shadow-pink-500 shadow-md/50 hover:bg-pink-700 hover:text-gray-300 flex flex-row gap-2" onClick={() => {
              const updatedLocations = locations.map(location => {
                return {
                  ...location,
                  latitude: document.querySelector(`#loc${location.id}_lat`).value,
                  longitude: document.querySelector(`#loc${location.id}_lon`).value,
                  range: document.querySelector(`#loc${location.id}_ran`).value,
                  operatorId: Number(document.querySelector(`#loc${location.id}_op`).value),
                  generation: document.querySelector(`#loc${location.id}_gen`).value,
                  active: document.querySelector(`#loc${location.id}_on`).checked
                };
              });
              console.log("Updated locations:", updatedLocations);
              updatedLocations.forEach(loc => {
                const oldLoc = locations.find((v) => v.id == loc.id)
                if (!sameLoc(oldLoc, loc)) fetch(`/api/locations/?id=${loc.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(loc),
                }).then(response => console.log("Location updated:", response)).catch(error => {
                  console.error('Error deleting operator:', error)
                  alert('Something went wrong. Please try again.')
                });
              });
              setLocations(updatedLocations);
            }}><Image src='/disk.svg' width={32} height={32} alt='disk' />Save Locations</button>
            <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-purple-600 rounded-2xl m-2 cursor-pointer shadow-purple-600 shadow-md/50 transition-all duration-300 hover:bg-purple-700 hover:text-gray-300 flex flex-row gap-2" onClick={() => require("downloadjs")(JSON.stringify(locations), `locations_${Date.now()}.json`, "text/plain")}><Image src='/folder.svg' width={32} height={32} alt='folder' />Backup Locations</button>
          </div>
        </div>
        <div className="text-center" id="Operators">
          <h2 className="text-2xl font-semibold text-center box-border m-3">Antenna Operators</h2>
          <Suspense>
            <table className='table-auto overflow-auto'>
              <thead>
                <tr>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">ID</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">Name</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">Origin</th>
                  <th className="p-3 text-center text-SM font-medium text-gray-300 uppercase">Delete</th>
                </tr>
              </thead>
              <tbody className='bg-gray-50 divide-y divide-blue-500'>
                {operators.map((operator, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-all duration-300">
                    <td><label className='text-center text-base text-gray-900 w-8'>{operator.id}</label></td>
                    <td><input className='text-center text-base text-gray-900' defaultValue={operator.name} id={`op${operator.id}_name`} /></td>
                    <td><input className='text-center text-base text-gray-900' defaultValue={operator.origin} id={`op${operator.id}_origin`} /></td>
                    <td><button type='submit' className="p-2 bg-red-700 rounded-2xl m-2 cursor-pointer border-2 border-red-900 shadow-red-600 shadow-md/50 transition-all duration-300 hover:bg-red-800 hover:border-red-950 flex flex-row gap-2" onClick={(event) => {
                      setOperators(operators.filter((op) => op.id != operator.id))
                      fetch(`/api/operators/?id=${operator.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: operator.id }),
                      }).then(response => console.log("Operator deleted:", response)).catch(error => {
                        console.error('Error deleting operator:', error)
                        alert('Something went wrong. Please try again.')
                      });
                    }}><Image src='/trash.svg' width={20} height={20} alt='trash' /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Suspense>
          <div className='flex flex-row'>
            <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-teal-600 rounded-2xl m-2 cursor-pointer transition-all duration-300 shadow-teal-400 shadow-md/50 hover:bg-teal-700 hover:text-gray-300 flex flex-row gap-2" onClick={() => {
              const newOperator = {
                name: "Unnamed",
                origin: "Unknown",
              }
              setOperators([...operators, newOperator])
              fetch('/api/operators', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOperator),
              }).then(response => {
                console.log("New operator added:", response)
                window.location.href = `/dashboard?password=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`
              }).catch(error => console.error('Error adding new operator:', error));
            }}><Image src='/operator.svg' width={32} height={32} alt='operator' />New Operator</button>
            <button type='submit' className="text-2xl font-bold text-center p-3 text-white bg-rose-500 rounded-2xl m-2 cursor-pointer transition-all duration-300 shadow-rose-400 shadow-md/50 hover:bg-rose-600 hover:text-gray-300 flex flex-row gap-2" onClick={() => {
              const updatedOperators = operators.map(operator => {
                return {
                  ...operator,
                  name: document.querySelector(`#op${operator.id}_name`).value,
                  origin: document.querySelector(`#op${operator.id}_origin`).value,
                }
              })
              updatedOperators.forEach(operator => {
                const oldOp = operators.find(op => op.id == operator.id)
                if (!sameOp(oldOp, operator)) fetch(`/api/operators/?id=${operator.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(operator),
                }).then(response => console.log("Location updated:", response)).catch(error => {
                  console.error('Error deleting operator:', error)
                  alert('Something went wrong. Please try again.')
                });
              })
              setOperators(updatedOperators)
            }}><Image src='/download.svg' width={32} height={32} alt='download' />Save Operators</button>
            <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-emerald-400 rounded-2xl m-2 cursor-pointer shadow-emerald-400 shadow-md/50 transition-all duration-300 hover:bg-emerald-500 hover:text-gray-300 flex flex-row gap-2" onClick={() => require("downloadjs")(JSON.stringify(operators), `operators_${Date.now()}.json`, "text/plain")}><Image src='/backup.svg' width={32} height={32} alt='backup' />Backup Operators</button>
          </div>
        </div>
        <div className='flex flex-col items-center' id="ChangePassword">
          <h2 className="text-2xl font-semibold text-center box-border m-3">Login</h2>
          <div className="grid grid-cols-2 gird-rows-2 grid-flow-row items-center justify-items-center">
            <label className="text-lg font-semibold mb-2">New Password</label>
            <input id='pass1' type="password" placeholder="New password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-300 focus:outline-none mb-4" />
            <label className="text-lg font-semibold mb-2">Confirm Password</label>
            <input id='pass2' type="password" placeholder="Confirm password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-300 focus:outline-none mb-4" />
          </div>
          <button type='button' className="text-2xl font-bold text-center p-3 text-white bg-blue-800 rounded-2xl m-2 cursor-pointer shadow-blue-600 shadow-md/50 transition-all duration-300 hover:bg-blue-950 hover:text-gray-300 flex flex-row gap-2" onClick={(event) => {
            const pass1 = document.getElementById("pass1").value
            const pass2 = document.getElementById("pass2").value
            if (pass1 != pass2) {
              alert("Passwords do not match!")
              return;
            }
            if (pass1.length < 6) {
              alert("Password must be at least 6 characters!")
              return;
            }
            alert("Password changed succesfully")
          }}><Image src='/password.svg' width={32} height={32} alt='password' />Change Password</button>
        </div>
        <button type='button' className="text-2xl font-bold text-center p-3 text-black bg-yellow-300 rounded-2xl m-2 cursor-pointer shadow-yellow-600 shadow-md/50 transition-all duration-300 hover:bg-yellow-500 hover:text-gray-800 flex flex-row gap-2" onClick={() => window.location.href = "/"}><Image src='/home.svg' width={32} height={32} alt='home' />Return Home</button>
      </div>
    );
  }
}
