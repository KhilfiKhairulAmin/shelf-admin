import prismadb from "@/lib/prismadb"

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST (
  req: Request,
  { params }: { params: { shelfId: string }}
) {
  try {
    // Authentication
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    // Authorization
    const storeByUserId = await prismadb.shelf.findFirst({
      where: {
        id: params.shelfId,
        userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const { label, imageUrl } = await req.json()

    // Data validation
    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Image url is required', { status: 400 })
    }

    if (!params.shelfId) {
      return new NextResponse('Shelf id is required', { status: 400 })
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        shelfId: params.shelfId
      }
    })

    return NextResponse.json(billboard)
    
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })

  }
}

export async function GET (
  req: Request,
  { params }: { params: { shelfId: string }}
) {
  try {
    if (!params.shelfId) {
      return new NextResponse('Shelf id is required', { status: 400 })
    }

    const billboard = await prismadb.billboard.findMany({
      where: {
        shelfId: params.shelfId
      }
    })

    return NextResponse.json(billboard)
    
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })

  }
}