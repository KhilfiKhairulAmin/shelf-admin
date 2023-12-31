import prismadb from "@/lib/prismadb"

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST (
  req: Request,
) {
  try {
    // Authentication
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name } = await req.json()

    // Data validation
    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const store = await prismadb.shelf.create({
      data: {
        name,
        userId
      }
    })

    return NextResponse.json(store)
    
  } catch (error) {
    console.log('[SHELVES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}