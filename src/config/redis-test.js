import redis from "./redis.js";

// let queue1=await redis.hGetAll(`qskip:queues:1`);
// console.log("q1: ",queue1);
redis.hGetAll(`qskip:queues:1`).then((prm)=>{
    console.log("q1 success; ",prm);
}).catch((er)=>{
    console.log("q1 fail: ",er);
    
})