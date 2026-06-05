    //perform Controller
    import express from "express";
    import si from "systeminformation";
    import { REDIS_KEYS } from "../src/config/redis-init.js";
    import redis from "../src/config/redis.js";
    


    export const LoadTestRouter =
        express.Router();



    const LOAD_STATE = {

        targetRps: 100,

        sent: 0,

        success: 0,

        errors: 0,

        avgLatency: 0,

        running: false

    };



    LoadTestRouter.get(
        "/metrics",
        getMetrics
    );

    LoadTestRouter.get(
        "/state",
        getState
    );

    LoadTestRouter.post(
        "/rps",
        setRps
    );

    LoadTestRouter.post(
        "/start",
        startLoadTest
    );

    LoadTestRouter.post(
        "/stop",
        stopLoadTest
    );



    // async function getMetrics( req, res ) {

    //     try {

    //         const [
    //             cpu,
    //             mem,
    //             fs
    //         ] = await Promise.all([
    //             si.currentLoad(),
    //             si.mem(),
    //             si.fsStats()
    //         ]);

    //        console.log(
    //                 "IN getMetrics CPU:",
    //                 await si.cpu()
    //             );

    //             console.log(
    //                 "IN getMetrics MEM:",
    //                 await si.mem()
    //             );

    //             console.log(
    //                 "IN getMetrics OSINFO:",
    //                 await si.osInfo()
    //             );

    //             console.log(
    //                 "IN getMetrics CURRENT_LOAD:",
    //                 await si.currentLoad()
    //             );

            

    //             console.log(
    //                 "IN getMetrics FILESYSTEMS:",
    //                 await si.fsSize()
    //             );

    //             console.log(
    //                 "IN getMetrics DISK_LAYOUT:",
    //                 await si.diskLayout()
    //             );

    //             console.log(
    //                 "IN getMetrics NETWORK_STATS:",
    //                 await si.networkStats()
    //             );

    //         return res.json({

    //             success: true,

    //             cpuPercent:
    //                 Number(
    //                     cpu.currentLoad
    //                         .toFixed(2)
    //                 ),

    //             memoryUsedMB:
    //                 Math.round(
    //                     mem.used /
    //                     1024 /
    //                     1024
    //                 ),

    //             memoryTotalMB:
    //                 Math.round(
    //                     mem.total /
    //                     1024 /
    //                     1024
    //                 ),

    //             diskReadMBps:
    //                 Number(
    //                     (
    //                         fs.rx /
    //                         1024 /
    //                         1024
    //                     ).toFixed(2)
    //                 ),

    //             diskWriteMBps:
    //                 Number(
    //                     (
    //                         fs.wx /
    //                         1024 /
    //                         1024
    //                     ).toFixed(2)
    //                 )

    //         });

    //     } catch ( err ) {

    //         console.error(
    //             "ERR In getMetrics:",
    //             err
    //         );

    //         return res.status(500).json({
    //             success: false
    //         });

    //     }

    // }
    async function getMetrics( req, res ) {

        try {

            const [
                currentLoad,
                mem,
                fsSize
            ] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.fsSize()
            ]);

            const processMem =
                process.memoryUsage();

            const confirmed =
                await redis.lLen(
                    REDIS_KEYS
                        .QUEUE_CONFIRMED(1)
                );

            const waiting =
                await redis.lLen(
                    REDIS_KEYS
                        .QUEUE_WAITING(1)
                );

            let redisMemoryMB = 0;

            try {

                const info =
                    await redis.info(
                        "memory"
                    );

                const lines =
                    info.split("\n");

                for (
                    const line
                    of lines
                ) {

                    if (
                        line.startsWith(
                            "used_memory:"
                        )
                    ) {

                        const bytes =
                            Number(
                                line
                                    .split(":")[1]
                                    .trim()
                            );

                        redisMemoryMB =
                            Number(
                                (
                                    bytes /
                                    1024 /
                                    1024
                                ).toFixed(2)
                            );

                        break;

                    }

                }

            } catch {}

            const cDrive =
                fsSize.find(
                    d => d.fs === "C:"
                );

            const dDrive =
                fsSize.find(
                    d => d.fs === "D:"
                );



            return res.json({

                success: true,
                /*
                OLD METRICS
                ----------------

                cpuPercent

                memoryUsedMB

                memoryTotalMB

                diskReadMBps

                diskWriteMBps
                */

                system: {

                    cpuPercent:
                        Number(
                            currentLoad
                                .currentLoad
                                .toFixed(2)
                        ),

                    memoryUsedMB:
                        Math.round(
                            mem.used /
                            1024 /
                            1024
                        ),

                    memoryTotalMB:
                        Math.round(
                            mem.total /
                            1024 /
                            1024
                        ),

                    memoryFreeMB:
                        Math.round(
                            mem.available /
                            1024 /
                            1024
                        ),

                    swapUsedMB:
                        Math.round(
                            mem.swapused /
                            1024 /
                            1024
                        )

                },



                node: {

                    rssMB:
                        Math.round(
                            processMem.rss /
                            1024 /
                            1024
                        ),

                    heapUsedMB:
                        Math.round(
                            processMem.heapUsed /
                            1024 /
                            1024
                        ),

                    heapTotalMB:
                        Math.round(
                            processMem.heapTotal /
                            1024 /
                            1024
                        ),

                    externalMB:
                        Math.round(
                            processMem.external /
                            1024 /
                            1024
                        )

                },



                redis: {

                    memoryMB:
                        redisMemoryMB,

                    confirmed,

                    waiting

                },



                disks: {

                    cDrivePercent:
                        cDrive?.use ?? 0,

                    dDrivePercent:
                        dDrive?.use ?? 0

                },



                loadTest: {

                    targetRps:
                        LOAD_STATE
                            .targetRps,

                    sent:
                        LOAD_STATE
                            .sent,

                    success:
                        LOAD_STATE
                            .success,

                    errors:
                        LOAD_STATE
                            .errors,

                    avgLatency:
                        LOAD_STATE
                            .avgLatency,

                    running:
                        LOAD_STATE
                            .running

                }

            });

        } catch ( err ) {

            console.error(
                "ERR In getMetrics:",
                err
            );

            return res.status(500).json({
                success: false
            });

        }

    }


    async function getState( req, res ) {

        try {

            return res.json({

                success: true,

                ...LOAD_STATE

            });

        } catch ( err ) {

            console.error(
                "ERR In getState:",
                err
            );

            return res.status(500).json({
                success: false
            });

        }

    }



    async function setRps( req, res ) {

        try {

            const rps =
                Number(
                    req.body?.rps
                );

            if (
                Number.isNaN(rps) ||
                rps < 1
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid RPS"
                });

            }

            LOAD_STATE.targetRps =
                rps;

            return res.json({

                success: true,

                targetRps:
                    LOAD_STATE.targetRps

            });

        } catch ( err ) {

            console.error(
                "ERR In setRps:",
                err
            );

            return res.status(500).json({
                success: false
            });

        }

    }



    async function startLoadTest(req,res) {

        try {

            LOAD_STATE.running =
                true;

            return res.json({

                success: true,

                running:
                    LOAD_STATE.running

            });

        } catch ( err ) {

            console.error(
                "ERR In startLoadTest:",
                err
            );

            return res.status(500).json({
                success: false
            });

        }

    }



    async function stopLoadTest(
        req,
        res
    ) {

        try {

            LOAD_STATE.running =
                false;

            return res.json({

                success: true,

                running:
                    LOAD_STATE.running

            });

        } catch ( err ) {

            console.error(
                "ERR In stopLoadTest:",
                err
            );

            return res.status(500).json({
                success: false
            });

        }

    }