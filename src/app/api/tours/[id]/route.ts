import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tour = await db.tour.findUnique({
      where: { id },
      include: {
        scenes: {
          orderBy: { order: 'asc' },
          include: {
            hotspots: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const tour = await db.tour.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        brandName: body.brandName,
        tourData: body.tourData ? JSON.stringify(body.tourData) : undefined,
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.tour.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}
