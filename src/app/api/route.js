'use server';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(
        {
            warning:'These endpoints should only be used in code, do not manually send requests to them unless you know what you are doing.',
            'Available GET endpoints':
            {
                locations:
                {
                    'Get All': '/api/locations',
                    'Get by ID': '/api/locations?id=(ID)'
                },
                operators: {
                    'Get All': '/api/operators',
                    'Get by ID': '/api/operators?id=(ID)'
                },
                images: {
                    'Location Image': '/api/images?location=(ID)[&qr=1]',
                    'Operator Image': '/api/images?operator=(ID)[&qr=1]'
                }
            },
            'Available POST endpoints': [
                '/api/locations/ (+ Location body)',
                '/api/operators/ (+ Operator body)',
            ],
            'Available DELETE endpoints':[
                '/api/locations?id=(ID)',
                '/api/operators?id=(ID)'
            ],
            'Available PATCH endpoints':[
                '/api/locations?id=(ID) (+ Location body)',
                '/api/operators?id=(ID) (+ Operator body)'
            ]

        },
        { status: 200 })
}