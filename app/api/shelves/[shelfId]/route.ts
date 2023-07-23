import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH (
  req: Request,
  { params }: { params: { shelfId: string }}
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { name } = await req.json()

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!params.shelfId) {
      return new NextResponse('Shelf id is required', { status: 400 })
    }

    const store = await prismadb.shelf.updateMany({
      where: {
        id: params.shelfId,
        userId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store)

  } catch (error) {
    console.log('[SHELVES_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE (
  _: Request,
  { params }: { params: { shelfId: string }}
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.shelfId) {
      return new NextResponse('Shelf id is required', { status: 400 })
    }

    const store = await prismadb.shelf.deleteMany({
      where: {
        id: params.shelfId,
        userId
      }
    })

    return NextResponse.json(store)

  } catch (error) {
    console.log('[SHELVES_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}