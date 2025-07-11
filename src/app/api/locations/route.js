import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Antenna } from '../../../entity/Antenna';
import { AppDataSource } from '../../../data-source';
const data = [
  {
    "latitude": 47.670162,
    "longitude": 26.287420,
    "range": 1000,
    "operators": "Vodafone, Orange",
    "generation": "5G",
    "active": true
  },
  {
    "latitude": 47.071000,
    "longitude": 26.288000,
    "range": 200,
    "operators": "Telekom",
    "generation": "4G",
    "active": true
  },
  {
    "latitude": 44.671000,
    "longitude": 29.288000,
    "range": 100,
    "operators": "Digi Mobile",
    "generation": "3G or older",
    "active": false
  },
  {
    "latitude": 42.671040,
    "longitude": 32.288200,
    "range": 100,
    "operators": "Cromtel",
    "generation": "3G or older",
    "active": false
  },
]

export async function GET(request) {
  AppDataSource.initialize().catch(error => console.log("Error during Data Source initialization", error));
  const searchParams = request.nextUrl.searchParams;
  const id = await searchParams.get('id');
  if (id) {
    try {
      const location = await AppDataSource.manager.findOne(Antenna, { where: { id } });
      if (location) {
        location.latitude = parseFloat(location.latitude);
        location.longitude = parseFloat(location.longitude);
        return NextResponse.json(location, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
    }
  }
  else try {
    const locations = (await AppDataSource.manager.find(Antenna))
    locations.forEach(location => {
      location.latitude = parseFloat(location.latitude);
      location.longitude = parseFloat(location.longitude);
    })
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request) {
  AppDataSource.initialize().catch(error => console.log("Error during Data Source initialization", error));
  try {
    const body = await request.json();
    console.log(body);
    const antenna = new Antenna();
    antenna.latitude = body.latitude;
    antenna.longitude = body.longitude;
    antenna.range = body.range;
    antenna.operators = body.operators;
    antenna.generation = body.generation;
    antenna.active = body.active;

    const savedAntenna = await AppDataSource.manager.save(antenna);

    return NextResponse.json(savedAntenna, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}

export async function DELETE(request) {
  AppDataSource.initialize().catch(error => console.log("Error during Data Source initialization", error));
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = await searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const antenna = await AppDataSource.manager.findOne(Antenna, { where: { id } });
    if (!antenna) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    await AppDataSource.manager.remove(antenna);
    return NextResponse.json({ message: 'Location deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}

export async function PATCH(request) {
  AppDataSource.initialize().catch(error => console.log("Error during Data Source initialization", error));
  try {
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const id = await searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const antenna = await AppDataSource.manager.findOne(Antenna, { where: { id } });
    if (!antenna) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    antenna.latitude = body.latitude || antenna.latitude;
    antenna.longitude = body.longitude || antenna.longitude;
    antenna.range = body.range || antenna.range;
    antenna.operators = body.operators || antenna.operators;
    antenna.generation = body.generation || antenna.generation;
    antenna.active = body.active !== undefined ? body.active : antenna.active;

    const updatedAntenna = await AppDataSource.manager.save(antenna);
    
    return NextResponse.json(updatedAntenna, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
  
}