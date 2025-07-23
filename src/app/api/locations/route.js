'use server';

import { NextResponse } from 'next/server';
import { Antenna } from '../../../entity/Antenna';
import { Operator } from '../../../entity/Operator';
import { AppDataSource } from '../../../data-source';
import { error } from 'console';

export async function GET(request) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const searchParams = request.nextUrl.searchParams;
  const id = await searchParams.get('id');
  try {
    if (id) {
      const location = await AppDataSource.manager.findOne(Antenna, { where: { id } });
      if (location) {
        const operator = await AppDataSource.manager.findOne(Operator, { where: { id: location.operatorId } }) || { "name": "Unknown" };
        const response = {
          id: location.id,
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
          range: Number(location.range),
          generation: location.generation,
          operator: operator,
          active: location.active,
        };
        return NextResponse.json(response, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 });
      }
    }
    else {
      const locations = (await AppDataSource.manager.find(Antenna));
      const response = locations.map((location) => {
        return {
          id: location.id,
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
          range: Number(location.range),
          generation: location.generation,
          operatorId: location.operatorId,
          active: location.active,
        }
      })
      return NextResponse.json(response, { status: 200 });
    }
  }
  catch {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }

}

export async function POST(request) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const generations = ['1G', '2G', '3G', '4G/LTE', '5G']
  try {
    const body = await request.json();
    console.log(body);
    const antenna = new Antenna();
    antenna.latitude = body.latitude;
    antenna.longitude = body.longitude;
    antenna.range = body.range;
    antenna.operatorId = body.operatorId;
    antenna.generation = body.generation;
    antenna.active = body.active;

    const newAntenna = await AppDataSource.manager.save(antenna);
    return NextResponse.json({ message: "Antenna created succesfully.", result: antenna }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
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

    const deletedLocation = await AppDataSource.manager.remove(antenna);
    return NextResponse.json({ message: 'Location deleted successfully', location: deletedLocation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
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
    antenna.operatorId = body.operatorId || antenna.operatorId;
    antenna.generation = body.generation || antenna.generation;
    antenna.active = body.active !== undefined ? body.active : antenna.active;

    const updatedAntenna = await AppDataSource.manager.save(antenna);

    return NextResponse.json(updatedAntenna, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }

}