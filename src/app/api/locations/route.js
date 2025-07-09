import { NextRequest } from 'next/server';

const data = [
  {
    "id": '1',
    "latitude": 47.670162,
    "longitude": 26.287420,
    "range": 1000,
    "operators": "Vodafone, Orange",
    "generation": "5G",
    "active": true
  },
  {
    "id": '2',
    "latitude": 47.071000,
    "longitude": 26.288000,
    "range": 200,
    "operators": "Telekom",
    "generation": "4G",
    "active": true
  },
  {
    "id": '3',
    "latitude": 44.671000,
    "longitude": 29.288000,
    "range": 100,
    "operators": "Digi Mobile",
    "generation": "3G or older",
    "active": false
  },
  {
    "id": '4',
    "latitude": 42.671040,
    "longitude": 32.288200,
    "range": 100,
    "operators": "Cromtel",
    "generation": "3G or older",
    "active": false
  },
]

export function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (id) {
    const location = data.find(item => item.id === id);
    if (location) {
      return new Response(
        JSON.stringify(location),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }
  else return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}