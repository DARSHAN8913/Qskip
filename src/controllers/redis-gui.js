import express from "express";
import redis from "../config/redis.js";
// import { redisClient as redis } from "../config/redis.js";



export const RedisExplorerRouter =
    express.Router();



RedisExplorerRouter.get(
    "/tree",
    getTree
);

RedisExplorerRouter.get(
    "/key",
    getKeyDetails
);

RedisExplorerRouter.delete(
    "/key",
    deleteKey
);



async function getTree( req, res ) {

    try {

        const root = {};

        for await (
            const item of redis.scanIterator()
        ) {

            const keys =
                Array.isArray( item )
                    ? item
                    : item.keys || [ item ];

            for (
                const key of keys
            ) {

                if (
                    typeof key !== "string"
                ) continue;

                const parts =
                    key.split(":");

                let current =
                    root;

                for (
                    const part of parts
                ) {

                    if (
                        !current[part]
                    ) {

                        current[part] = {};

                    }

                    current =
                        current[part];

                }

            }

        }

        return res.json({
            success : true,
            data : root
        });

    } catch ( err ) {

        console.log(
            "getTree err :",
            err
        );

        return res.status(500).json({
            success : false,
            message : err.message
        });

    }

}



async function getKeyDetails(
    req,
    res
) {
    try {

        const key =
            req.query.key;

        if ( !key ) {

            return res.status(400).json({
                success : false,
                message : "key required"
            });

        }

        const exists =
            await redis.exists(
                key
            );

        if ( !exists ) {

            return res.status(404).json({
                success : false,
                message : "key not found"
            });

        }

        const type =
            await redis.type(
                key
            );

        const ttl =
            await redis.ttl(
                key
            );

        let value = null;

        if ( type === "string" ) {

            value =
                await redis.get(
                    key
                );

        } else if (
            type === "hash"
        ) {

            value =
                await redis.hGetAll(
                    key
                );

        } else if (
            type === "list"
        ) {

            value =
                await redis.lRange(
                    key,
                    0,
                    -1
                );

        } else if (
            type === "set"
        ) {

            value =
                await redis.sMembers(
                    key
                );

        } else if (
            type === "zset"
        ) {

            value =
                await redis.zRangeWithScores(
                    key,
                    0,
                    -1
                );

        }

        return res.json({
            success : true,
            data : {
                key,
                type,
                ttl,
                value
            }
        });

    } catch ( err ) {

                    console.log("getKeyDetails err :",err);
            return res.status(500).json({
            success : false,
            message : err.message
        });

    }

}



async function deleteKey(
    req,
    res
) {

    try {

        const key =
            req.query.key;

        if ( !key ) {

            return res.status(400).json({
                success : false,
                message : "key required"
            });

        }

        await redis.del(
            key
        );

        return res.json({
            success : true
        });

    } catch ( err ) {

                    console.log("deleteKey err :",err);
            return res.status(500).json({
            success : false,
            message : err.message
        });

    }

}