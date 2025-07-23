'use server';

import { NextResponse } from 'next/server';
import { Operator } from '../../../entity/Operator';
import { AppDataSource } from '../../../data-source';
import { error } from 'console';
import { Antenna } from '../../../entity/Antenna';

export async function GET(request) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const searchParams = request.nextUrl.searchParams;
  const id = Number(await searchParams.get('id'));
  try {
    if (id) {
      const operator = await AppDataSource.manager.findOne(Operator, { where: { id } });
      if (operator) return NextResponse.json(operator, { status: 200 });
      else return NextResponse.json({ error: "Operator not found" }, { status: 404 });
    }
    else {
      const operators = await AppDataSource.manager.find(Operator)
      return NextResponse.json(operators, { status: 200 })
    }
  }
  catch {
    console.error(error)
    return NextResponse.json({ error: "Failed to retrieve operators" }, { status: 500 })
  }
}

export async function POST(request) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  try {
    const body = await request.json();
    const operator = new Operator();
    operator.name = body.name;
    operator.origin = body.origin;
    const savedOperator = await AppDataSource.manager.save(operator);
    return NextResponse.json(savedOperator, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create operator' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = Number(await searchParams.get('id'));
    if (!id) return NextResponse.json({ error: "Missing ID!" }, { status: 400 })

    const operator = await AppDataSource.manager.findOne(Operator, { where: { id } })
    if (!operator) return NextResponse.json({ error: "Operator not found" }, { status: 404 });
    const antennas = await AppDataSource.manager.find(Antenna)
    antennas.forEach(async (ant, index) => {
      if (ant.operatorId == operator.id) {
        let newAnt = ant;
        newAnt.operatorId = -1;
        await AppDataSource.manager.save(newAnt)
        console.log("Previous antenna modified", newAnt)
      }
    })
    await AppDataSource.manager.remove(operator);
    return NextResponse.json({ message: 'Operator deleted successfully', }, { status: 200 });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete operator' }, { status: 500 });
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
    const operator = await AppDataSource.manager.findOne(Operator, { where: { id } })
    operator.name = body.name;
    operator.origin = body.origin;
    const updatedOperator = await AppDataSource.manager.save(operator);
    return NextResponse.json(updatedOperator, { status: 200 });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update operator' }, { status: 500 });
  }
}