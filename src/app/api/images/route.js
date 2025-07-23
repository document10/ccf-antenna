'use server';

import { ImageResponse } from 'next/og'
import { Antenna } from '../../../entity/Antenna';
import { Operator } from '../../../entity/Operator';
import { AppDataSource } from '../../../data-source';
import { error } from 'console';
import { NextResponse } from 'next/server';
var QRCode = require('qrcode')
export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const location = Number(await searchParams.get('location'));
        const operator = Number(await searchParams.get('operator'));
        if (location && operator) return NextResponse.json({ error: 'Cannot have both location and operator in the query.' }, { status: 400 })
        const qrcode = Number(await searchParams.get('qr'));
        if (location) {
            if (!AppDataSource.isInitialized) await AppDataSource.initialize();
            const foundLocation = await AppDataSource.manager.findOne(Antenna, { where: { id: location } });
            if (foundLocation) {
                const antOp = await AppDataSource.manager.findOne(Operator, { where: { id: foundLocation.operatorId } }) || { id: -1, name: "Unknown", origin: "?" };
                if (qrcode) {
                    const img = await QRCode.toBuffer(`Location #${foundLocation.id}\nLatitude: ${foundLocation.latitude}\nLongitude: ${foundLocation.longitude}\nRange: ${foundLocation.range} meters\nGeneration: ${foundLocation.generation}\nStatus: ${foundLocation.active ? "Online" : "Offline"}\nOperated by: ${antOp.name} (${antOp.id}) from ${antOp.origin}`)
                    return new NextResponse(img, { headers: { 'Content-Type': 'image/png' },status:200 })
                }
                else return new ImageResponse(
                    (
                        <div style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'black',
                            padding: '40px',
                        }}>
                            {foundLocation.active ? (
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                    <div style={{ fontSize: 75, color: 'green', textAlign: 'center', display: 'flex' }}>
                                        Location no. {foundLocation.id} (Online)
                                    </div>
                                    <img src='http://localhost:3000/online.svg' width={64} height={64} style={{ filter: 'invert(100%)' }} />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                    <div style={{ fontSize: 75, color: '#888', textAlign: 'center', display: 'flex' }}>
                                        Location no. {foundLocation.id} (Offline)
                                    </div>
                                    <img src='http://localhost:3000/offline.svg' width={64} height={64} style={{ filter: 'invert(50%)' }} />
                                </div>
                            )}
                            <div style={{ fontSize: 50, color: '#fff', marginTop: '20px', display: 'flex' }}>
                                Latitude: {foundLocation.latitude}
                            </div>
                            <div style={{ fontSize: 50, color: '#fff', marginTop: '20px', display: 'flex' }}>
                                Longitude: {foundLocation.longitude}
                            </div>
                            <div style={{ fontSize: 50, color: '#fff', marginTop: '20px', display: 'flex' }}>
                                Range: {foundLocation.range} meters
                            </div>
                            <div style={{ fontSize: 50, color: '#fff', marginTop: '20px', display: 'flex' }}>
                                Generation: {foundLocation.generation}
                            </div>
                            <div style={{ fontSize: 50, color: '#fff', marginTop: '20px', display: 'flex', textAlign: 'center' }}>
                                Operated by: {antOp.name} ({antOp.id}) from {antOp.origin}
                            </div>
                        </div>
                    ), { width: 1080, height: 720, status: 200 }
                )
            }
            else return new ImageResponse((
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'black',
                    color: 'red',
                    padding: '40px',
                }}>
                    <div style={{ fontSize: 80, color: 'red', textAlign: 'center', display: 'flex' }}>
                        Location not found
                    </div>
                    <img src='http://localhost:3000/404.svg' width={256} height={256} style={{ filter: 'invert(100%)' }} />
                </div>
            ), { width: 1080, height: 720, status: 404 })
        }
        if (operator) {
            if (!AppDataSource.isInitialized) await AppDataSource.initialize();
            const foundOperator = await AppDataSource.manager.findOne(Operator, { where: { id: operator } });
            if (foundOperator) {
                if (qrcode) {
                    const img = await QRCode.toBuffer(`Operator ${foundOperator.name} [${foundOperator.id}] from ${foundOperator.origin}`)
                    return new NextResponse(img, { headers: { 'Content-Type': 'image/png' },status:200 })
                }
                else return new ImageResponse((
                    <div style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'black',
                        textAlign: 'center',
                        padding: '40px',
                    }}>
                        <div style={{ fontSize: 80, color: 'blue', textAlign: 'center', display: 'flex' }}>
                            Operator {foundOperator.name} [{foundOperator.id}] from {foundOperator.origin}
                        </div>
                        <img src='http://localhost:3000/operator.svg' width={128} height={128} style={{ filter: 'invert(100%)' }} />
                    </div>
                ), { width: 1080, height: 720, status: 200, })
            }
            else return new ImageResponse((
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'black',
                    textAlign: 'center',
                    padding: '40px',
                    color: 'red',
                    fontSize: '80px'
                }}>
                    <div style={{ fontSize: 80, color: 'red', textAlign: 'center', display: 'flex' }}>
                        Operator not found
                    </div>
                    <img src='http://localhost:3000/404.svg' width={256} height={256} style={{ filter: 'invert(100%)' }} />
                </div>
            ), { width: 1080, height: 720, status: 404 })
        }
        return NextResponse.json({ error: "You need to supply either a location ID or an operator ID!" }, { status: 400 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to generate the image.' }, { status: 500, })
    }
}