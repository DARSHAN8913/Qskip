import http from "k6/http";

export const options = {
    vus: 10,
    duration: "30s"
};

export default function() {

    http.get(
        "http://172.30.32.1:5000/"
    );

}