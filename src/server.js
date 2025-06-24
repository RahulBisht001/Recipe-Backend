import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favouritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());

app.get("/test", (req, res) => {
    res.json("Its working baby!");
});

app.post("/api/favourites", async (req, res) => {
    // Controller
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;
        if (!userId || !recipeId || !title) {
            return res.status(400).json({
                success: false,
                message: 'missing required fields',
                data: null,
                error: null,
            });
        }

        const newFav = await db
            .insert(favouritesTable)
            .values({
                userId,
                recipeId,
                title,
                image,
                cookTime,
                servings,
            })
            .returning();

        return res.status(201).json({
            success: true,
            message: "Added to favourites!",
            data: newFav[0],
            error: null,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "error while adding to favourites!",
            data: null,
            error: err,
        })
    }
});

app.delete("/api/favourites/:userId/:recipeId", async (req, res) => {

    try {

        const { userId, recipeId } = req.params

        if (!userId || !recipeId) {
            return res.status(400).json({
                success: false,
                message: "required params are missing",
                data: null,
                error: null,
            })
        }

        await db.delete(favouritesTable)
            .where(and(eq(favouritesTable.userId, userId),
                eq(favouritesTable.recipeId, parseInt(recipeId))))


        res.status(200).json({
            success: true,
            message: "removed from favourites",
            data: null,
            error: null,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "error while removing favourites!",
            data: null,
            error: err,
        })
    }

})

app.get('/api/favourites/:userId', async (req, res) => {
    try {

        const { userId } = req.params
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required!",
                data: null,
                error: null,
            })
        }

        const userFavourites = await db
            .select()
            .from(favouritesTable)
            .where(eq(favouritesTable.userId, userId))

        return res.status(200).json({
            success: true,
            message: "All favourites fetched successfully!",
            data: userFavourites,
            error: null
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error occured while fetching all favourites!",
            data: null,
            error: err,
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
