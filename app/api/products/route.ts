import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        breadcrumbs: true,
        variants: {
          include: {
            images: true,
          },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, href, description, details, highlights, breadcrumbs, variants } = body;

    // Generate alphanumeric ID
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const product = await prisma.product.create({
      data: {
        id,
        name,
        price,
        href,
        description,
        details,
        highlights,
        breadcrumbs: {
          create: breadcrumbs.map((b: any) => ({
            name: b.name,
            href: b.href,
          })),
        },
        variants: {
          create: variants.map((variant: any) => ({
            name: variant.name,
            images: {
              create: variant.images,
            },
          })),
        },
      },
      include: {
        breadcrumbs: true,
        variants: {
          include: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
