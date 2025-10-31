import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        console.log(`Searching for users with query: "${query}"`);

        if (!query) {
            return new NextResponse("Query parameter is required", { status: 400 });
        }

        const users = await db.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        username: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });

        console.log(`Found ${users.length} users for query: "${query}"`);

        return NextResponse.json(users);
    } catch (error) {
        console.error("[USER_SEARCH_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
