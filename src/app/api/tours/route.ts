import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tours = await db.tour.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, brandName, tourData } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const tour = await db.tour.create({
      data: {
        name,
        description: description || '',
        brandName: brandName || '',
        tourData: JSON.stringify(tourData || {}),
      },
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
