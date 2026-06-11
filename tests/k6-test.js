import http from "k6/http";



export const options = {
    
    scenarios: {
        
        load: {
            
            executor: "constant-arrival-rate",
            rate: __ENV.RPS
                ? Number( __ENV.RPS )
                : 100,
            timeUnit: "1s",
            duration:
                __ENV.DURATION ||
                "1m",
            preAllocatedVUs: 500,
            maxVUs: 1000
            
        }
        
    }
    
};



export default function() {
    
    // const userId =
    //     Math.floor(
    //         Math.random() * 1000
    //     ) + 1;
    const userId =
    ( __ITER % 1000 ) + 1;
    
    const payload =
        JSON.stringify({
            
            queueId: 1,
            userId,
            reqAt: Date.now()
            
        });
    
    http.post(
        
        "http://172.30.32.1:5000/booking/book-one",
        
        payload,
        
        {
            
            headers: {
                
                "Content-Type":
                    "application/json"
                
            }
            
        }
        
    );
    
}