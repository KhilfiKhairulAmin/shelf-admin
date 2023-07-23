import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET (
  _: Request,
  { params }: { params: { billboardId: string }}
) {
  try {
    // Data validation
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse('Internal error', { status: 500 })

  }
}

export async function PATCH (
  req: Request,
  { params }: { params: { shelfId: string, billboardId: string }}
) {
  try {
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

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const store = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(store)

  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE (
  _: Request,
  { params }: { params: { shelfId: string, billboardId: string }}
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

    // Data validation
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}